"use client";

import { useEffect, useState, useRef, use, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_QUESTIONS, MultipleChoiceQuestion } from "@/data/quizQuestions";
import { supabase } from "@/lib/supabase";
import { HaloSearchInput } from "@/components/ui/halo-search";

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizArenaPage({ params }: QuizPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);

  const categoryId = resolvedParams.id;
  const level = searchParams.get("level") || "1";

  // Data Soal
  const questions: MultipleChoiceQuestion[] =
    QUIZ_QUESTIONS[categoryId]?.[level] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];

  const initialTime = level === "3" ? 15 : level === "2" ? 20 : 25;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // States Alur User & Game
  const [username, setUsername] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Voice & Interaction States
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<
    "A" | "B" | "C" | "D" | null
  >(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Score & Leaderboard
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs untuk menjaga stabilitas instance speech & state
  const recognitionRef = useRef<any>(null);
  const isTransitioningRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestionRef = useRef<MultipleChoiceQuestion | null>(null);

  // Selalu sinkronkan ref pertanyaan aktif
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // 1. Text-to-Speech (TTS) Suara AI yang Bersih dari Canceled Error
  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (onEnd) onEnd();
        return;
      }

      // Bersihkan antrean suara lama
      window.speechSynthesis.cancel();

      // Pastikan status tidak tersangkut di pause
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Ambil voice Indonesia jika tersedia
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) => v.lang.includes("id") || v.lang.includes("ID"),
      );
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onstart = () => {
        setIsAiSpeaking(true);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {}
        }
      };

      utterance.onend = () => {
        setIsAiSpeaking(false);
        if (
          recognitionRef.current &&
          isMicEnabled &&
          !isTransitioningRef.current
        ) {
          try {
            recognitionRef.current.start();
          } catch {}
        }
        if (onEnd) onEnd();
      };

      utterance.onerror = (e: any) => {
        // Abaikan jika error hanya karena 'canceled' atau 'interrupted'
        if (e.error === "canceled" || e.error === "interrupted") {
          setIsAiSpeaking(false);
          return;
        }
        console.warn("SpeechSynthesis warning:", e.error || e);
        setIsAiSpeaking(false);
        if (onEnd) onEnd();
      };

      // Beri jeda 80ms agar pemanggilan cancel() sebelumnya tuntas diproses browser
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn("Gagal menjalankan speak:", err);
        }
      }, 80);
    },
    [isMicEnabled],
  );

  // Pastikan daftar suara browser siap
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // 2. Navigasi Next Soal
  const goToNextQuestion = useCallback(() => {
    isTransitioningRef.current = false;
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setAiFeedback(null);
    setTranscript("");

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(initialTime);
    } else {
      setIsFinished(true);
      speakText("Kuis selesai! Kerja yang luar biasa!");
    }
  }, [currentIndex, questions.length, initialTime, speakText]);

  // 3. Kirim Transkrip Suara ke /api/judge
  const sendSpeechToJudge = useCallback(
    async (spokenText: string) => {
      const activeQ = currentQuestionRef.current;
      if (isTransitioningRef.current || !activeQ || isEvaluating) return;

      setIsEvaluating(true);
      console.log("📤 Mengirim ke /api/judge:", spokenText);

      try {
        const res = await fetch("/api/judge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: activeQ.question,
            options: activeQ.options,
            correctKey: activeQ.correctKey,
            userSpeech: spokenText,
          }),
        });

        const result = await res.json();
        console.log("📥 Respons /api/judge:", result);
        setIsEvaluating(false);

        // Aksi SKIP
        if (result.action === "SKIP") {
          isTransitioningRef.current = true;
          setAiFeedback(result.feedbackSpeech || "Pertanyaan dilewati!");
          speakText(result.feedbackSpeech || "Pertanyaan dilewati!", () => {
            goToNextQuestion();
          });
          return;
        }

        // Aksi ANSWER
        if (result.action === "ANSWER" && result.selectedKey) {
          isTransitioningRef.current = true;
          const key = result.selectedKey as "A" | "B" | "C" | "D";
          setSelectedAnswer(key);
          setIsAnswerCorrect(result.isCorrect);
          setAiFeedback(result.feedbackSpeech);

          if (result.isCorrect) {
            setTotalScore((prev) => prev + activeQ.points);
          }

          speakText(result.feedbackSpeech, () => {
            setTimeout(goToNextQuestion, 800);
          });
          return;
        }

        // Aksi UNCLEAR
        if (result.action === "UNCLEAR" && result.feedbackSpeech) {
          setAiFeedback(result.feedbackSpeech);
        }
      } catch (err) {
        console.error("Gagal request AI judge:", err);
        setIsEvaluating(false);
      }
    },
    [isEvaluating, speakText, goToNextQuestion],
  );

  // 4. Inisialisasi Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn(
        "Browser ini tidak mendukung Web Speech API. Gunakan Chrome/Edge.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "id-ID";

    recognition.onstart = () => {
      console.log("🎤 [MIC ON] Mendengarkan suara pemain...");
    };

    recognition.onerror = (event: any) => {
      console.warn("Mic status:", event.error);
      if (event.error === "no-speech") return;
    };

    recognition.onresult = (event: any) => {
      if (
        isTransitioningRef.current ||
        !gameStarted ||
        isEvaluating ||
        isAiSpeaking
      )
        return;

      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }

      const cleanText = fullTranscript.trim();
      if (!cleanText) return;

      console.log("🗣️ Suara tertangkap:", cleanText);
      setTranscript(cleanText);

      // Debounce jeda hening 700ms lalu kirim ke AI
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      silenceTimerRef.current = setTimeout(() => {
        sendSpeechToJudge(cleanText);
      }, 700);
    };

    recognition.onend = () => {
      // Re-trigger bila kuis masih berjalan dan mic dalam kondisi aktif
      if (isMicEnabled && gameStarted && !isFinished && !isAiSpeaking) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognitionRef.current = recognition;

    if (gameStarted && isMicEnabled && !isFinished && !isAiSpeaking) {
      try {
        recognition.start();
      } catch {}
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [
    gameStarted,
    isFinished,
    isMicEnabled,
    isAiSpeaking,
    isEvaluating,
    sendSpeechToJudge,
  ]);

  // 5. Cek Cache Username LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("voxiq_username");
    if (savedUser && savedUser.trim()) {
      setUsername(savedUser);
      setShowNameModal(false);
      setCountdown(3);
    } else {
      setShowNameModal(true);
    }
  }, []);

  const unlockAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Bicara teks kosong 0 detik agar browser mengizinkan audio seterusnya
      const emptyUtterance = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(emptyUtterance);
    }
  };

  const handleConfirmName = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setNameError(true);
      return;
    }
    unlockAudio();
    localStorage.setItem("voxiq_username", trimmed);
    setNameError(false);
    setShowNameModal(false);
    setCountdown(3);
  };

  // 6. Countdown 3 -> 2 -> 1 -> GO!
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 950);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      const timer = setTimeout(() => {
        setCountdown(null);
        setGameStarted(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 7. Bacakan Pertanyaan saat Nomor Berubah & Game Aktif
  useEffect(() => {
    if (!gameStarted || isFinished || !currentQuestion) return;

    console.log("Trigger pembacaan soal nomor:", currentIndex + 1);
    speakText(currentQuestion.question);
  }, [currentIndex, gameStarted, isFinished, speakText]);

  // 8. Timer Mundur Durasi Soal
  useEffect(() => {
    if (!gameStarted || isFinished || isTransitioningRef.current) return;

    if (timeLeft <= 0) {
      isTransitioningRef.current = true;
      setAiFeedback("Waktu habis!");
      speakText("Waktu habis! Kita lanjut ke soal berikutnya.", () => {
        goToNextQuestion();
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStarted, isFinished, goToNextQuestion, speakText]);

  // Toggle Mic Button
  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (isMicEnabled) {
      recognitionRef.current.abort();
      setIsMicEnabled(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch {}
      setIsMicEnabled(true);
    }
  };

  // Simpan Skor ke Supabase
  const handleSaveToLeaderboard = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    await supabase.from("leaderboard").insert([
      {
        username: username.trim(),
        category: categoryId,
        score: totalScore,
      },
    ]);

    setIsSubmitting(false);
    router.push("/");
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f0f11] text-white">
        <p className="text-lg">Soal belum tersedia untuk level ini.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-white text-black rounded-lg font-semibold cursor-pointer"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc] text-zinc-900 flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden">
      {/* 1. MODAL INPUT USERNAME (ALIAS) */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            key="name-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none"
          >
            <motion.div
              key="name-modal-box"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: 150, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[420px] rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)] flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center text-xl font-bold mb-3 shadow-inner">
                🎙️
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 font-monaSans tracking-tight">
                Who&apos;s on the Mic?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 mb-6">
                Drop your stage name to claim your spot on the leaderboard.
              </p>

              <div className="w-full text-left">
                <HaloSearchInput
                  aria-label="Player Username"
                  autoComplete="off"
                  blobTranslucent={false}
                  isLoading={false}
                  placeholder="Ketik username kamu..."
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (nameError) setNameError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmName();
                    }
                  }}
                  onClear={() => setUsername("")}
                  className="w-full text-sm"
                />
              </div>

              {nameError && (
                <p className="text-red-500 text-xs font-semibold mt-2 animate-bounce">
                  Username tidak boleh kosong!
                </p>
              )}

              <div className="w-full flex items-center gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 py-3 rounded-xl border border-black/10 text-xs font-bold text-zinc-600 hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Nevermind
                </button>

                <button
                  type="button"
                  onClick={handleConfirmName}
                  className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Let&apos;s Roll</span>
                  <span>➔</span>
                </button>
              </div>

              <p className="text-[11px] text-zinc-400 mt-3 font-medium">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border text-zinc-600 font-mono text-[10px]">
                  Enter
                </kbd>{" "}
                to jump in
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. OVERLAY COUNTDOWN 3 -> 2 -> 1 -> GO! */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            key="countdown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100002] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md select-none"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.3, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <span className="text-8xl sm:text-9xl font-black font-monaSans text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">
                {countdown === 0 ? "GO!" : countdown}
              </span>
              <p className="mt-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/60">
                Sebutkan Huruf Pilihan atau Bilang &quot;Lanjut&quot;!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. TAMPILAN RESULT DI AKHIR */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-center select-none"
            >
              <div className="w-16 h-16 bg-amber-500/15 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🏆
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-900 font-monaSans">
                Quiz Selesai!
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Luar biasa,{" "}
                <strong className="text-zinc-900">{username}</strong>!
              </p>

              <div className="text-5xl font-black text-zinc-900 my-6 font-monaSans">
                {totalScore}
                <span className="text-sm text-zinc-400 font-normal ml-1">
                  pts
                </span>
              </div>

              <button
                type="button"
                onClick={handleSaveToLeaderboard}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting
                  ? "Menyimpan ke Leaderboard..."
                  : "Kirim Skor ke Leaderboard ➔"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. HEADER TOP BAR */}
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between pb-4 border-b border-black/[0.08]">
        <button
          onClick={() => router.push("/")}
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer"
        >
          ✕ Keluar
        </button>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-black/[0.05] text-xs font-bold font-monaSans uppercase tracking-wider">
            {categoryId} • Lvl {level}
          </span>
          <span className="text-xs font-semibold text-zinc-500">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono text-xs font-bold transition-colors ${
            timeLeft <= 5
              ? "bg-red-100 text-red-600 animate-pulse"
              : "bg-zinc-100 text-zinc-800"
          }`}
        >
          <span>⏱</span>
          <span>{timeLeft}s</span>
        </div>
      </header>

      {/* 5. ARENA PERTANYAAN (PILIHAN GANDA) */}
      <main className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center items-center py-6">
        <motion.div
          key={currentQuestion?.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-white rounded-3xl border border-black/[0.06] p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex flex-col items-center relative"
        >
          {/* Progress Bar Soal */}
          <div className="absolute top-0 left-0 h-1.5 w-full bg-zinc-100 rounded-t-3xl overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* AI Voice State Indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`w-2 h-2 rounded-full ${
                isAiSpeaking
                  ? "bg-indigo-500 animate-ping"
                  : isEvaluating
                    ? "bg-amber-500 animate-pulse"
                    : "bg-emerald-500"
              }`}
            />
            <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 font-monaSans">
              {isAiSpeaking
                ? "AI Sedang Membaca Soal..."
                : isEvaluating
                  ? "Juri AI Sedang Menilai Jawabanmu..."
                  : "Giliranmu Menjawab (Bicara Sekarang)"}
            </span>
          </div>

          {/* Teks Pertanyaan */}
          <h2 className="text-lg sm:text-2xl font-bold font-monaSans text-zinc-900 leading-snug text-center mb-6">
            {currentQuestion?.question}
          </h2>

          {/* Grid Opsi Pilihan Ganda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {currentQuestion?.options.map((opt) => {
              const isSelected = selectedAnswer === opt.key;
              const isCorrectTarget = currentQuestion.correctKey === opt.key;

              let cardStyle =
                "bg-zinc-50 border-black/5 hover:border-black/20 text-zinc-800";

              if (isSelected) {
                if (isAnswerCorrect) {
                  cardStyle =
                    "bg-green-500 text-white border-green-600 shadow-md scale-[1.01]";
                } else {
                  cardStyle = "bg-red-500 text-white border-red-600 shadow-md";
                }
              } else if (selectedAnswer && isCorrectTarget) {
                cardStyle = "bg-green-500 text-white border-green-600";
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => sendSpeechToJudge(opt.key)}
                  disabled={isTransitioningRef.current || isEvaluating}
                  className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer font-monaSans select-none ${cardStyle}`}
                >
                  <span
                    className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected || (selectedAnswer && isCorrectTarget)
                        ? "bg-white/20 text-white"
                        : "bg-white border border-black/10 text-zinc-700 shadow-sm"
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback AI Banner */}
          <AnimatePresence>
            {aiFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-5 px-4 py-2.5 rounded-xl text-xs font-bold font-monaSans flex items-center gap-2 ${
                  isAnswerCorrect
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-amber-100 text-amber-900 border border-amber-200"
                }`}
              >
                <span>{isAnswerCorrect ? "🎉" : "💡"}</span>
                <span>{aiFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* 6. FOOTER VOICE CONTROLS */}
      <footer className="w-full max-w-md mx-auto flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={toggleMic}
          disabled={!gameStarted}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all cursor-pointer shadow-md active:scale-95 ${
            isMicEnabled
              ? "bg-[#1c1c1e] text-white hover:bg-black shadow-black/20"
              : "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
          }`}
          title={isMicEnabled ? "Matikan Mikrofon" : "Aktifkan Mikrofon"}
        >
          {isMicEnabled && !isAiSpeaking && (
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-30" />
          )}

          {isMicEnabled ? (
            <svg
              className="w-5 h-5 fill-current relative z-10"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 fill-current relative z-10"
              viewBox="0 0 24 24"
            >
              <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.14 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
            </svg>
          )}
        </button>

        {/* Subtitle Transkrip Suara Pemain */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold text-zinc-500 font-monaSans">
            {transcript ? (
              <span className="text-zinc-800 italic">
                &ldquo;{transcript}&rdquo;
              </span>
            ) : isAiSpeaking ? (
              "🔊 AI sedang membacakan soal..."
            ) : isMicEnabled ? (
              '🎤 Bicara pilihan (A/B/C/D) atau ucapkan "Lanjut"'
            ) : (
              "🔇 Mic dinonaktifkan (klik mic untuk menyalakan)"
            )}
          </span>
        </div>

        {/* Tombol Skip Cadangan */}
        <button
          type="button"
          onClick={() => sendSpeechToJudge("skip")}
          disabled={isTransitioningRef.current || !gameStarted || isEvaluating}
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 py-1 px-3 transition-colors cursor-pointer disabled:opacity-30"
        >
          Lewati Soal (Next) ➔
        </button>
      </footer>
    </div>
  );
}
