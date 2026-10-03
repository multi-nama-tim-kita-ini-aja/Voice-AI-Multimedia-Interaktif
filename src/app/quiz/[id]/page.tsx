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
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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

  // Refs untuk akses state terbaru tanpa re-create recognition
  const isMicEnabledRef = useRef(isMicEnabled);
  const isAiSpeakingRef = useRef(isAiSpeaking);
  const isEvaluatingRef = useRef(isEvaluating);
  const gameStartedRef = useRef(gameStarted);
  const isFinishedRef = useRef(isFinished);

  // Selalu sinkronkan ref pertanyaan aktif & state refs
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  useEffect(() => {
    isMicEnabledRef.current = isMicEnabled;
  }, [isMicEnabled]);

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);

  useEffect(() => {
    isEvaluatingRef.current = isEvaluating;
  }, [isEvaluating]);

  useEffect(() => {
    gameStartedRef.current = gameStarted;
  }, [gameStarted]);

  useEffect(() => {
    isFinishedRef.current = isFinished;
  }, [isFinished]);

  // Helper: Matikan mic secara paksa (stop recognition)
  const stopMic = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch { }
    }
    // Hapus pending silence timer agar transkrip lama tidak terkirim
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Helper: Nyalakan mic kembali (start recognition)
  const startMic = useCallback(() => {
    if (
      recognitionRef.current &&
      isMicEnabledRef.current &&
      !isTransitioningRef.current &&
      !isFinishedRef.current
    ) {
      try {
        recognitionRef.current.start();
      } catch { }
    }
  }, []);

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
        console.log("🔊 [AI SPEAKING] Mic dimatikan otomatis");
        setIsAiSpeaking(true);
        // MATIKAN mic saat AI mulai bicara agar tidak menangkap suara AI
        stopMic();
      };

      utterance.onend = () => {
        console.log("🔇 [AI SELESAI] Mic dinyalakan kembali");
        setIsAiSpeaking(false);
        // Beri jeda 300ms setelah AI selesai baru nyalakan mic
        // agar sisa echo AI tidak tertangkap
        setTimeout(() => {
          startMic();
        }, 300);
        if (onEnd) onEnd();
      };

      utterance.onerror = (e: any) => {
        // Abaikan jika error hanya karena 'canceled' atau 'interrupted'
        if (e.error === "canceled" || e.error === "interrupted") {
          setIsAiSpeaking(false);
          // Tetap coba nyalakan mic meski ada cancel
          setTimeout(() => {
            startMic();
          }, 300);
          return;
        }
        console.warn("SpeechSynthesis warning:", e.error || e);
        setIsAiSpeaking(false);
        setTimeout(() => {
          startMic();
        }, 300);
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
    [stopMic, startMic],
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
    setIsTimerRunning(false); // ⏸️ Pause timer sampai AI selesai baca soal baru

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(initialTime);
    } else {
      setIsFinished(true);
      speakText("Kuis selesai! Kerja yang luar biasa!");
    }
  }, [currentIndex, questions.length, initialTime, speakText]);

  // ---- LOCAL FAST-PATH: Deteksi jawaban jelas tanpa panggil API ----
  const SKIP_WORDS = ["next", "lanjut", "skip", "lewati", "lewat", "pas", "ga tau", "nggak tau", "gak tau", "tidak tahu", "ga tahu", "nggak tahu"];
  const EXIT_WORDS = ["keluar", "exit", "quit", "berhenti", "stop", "selesai", "pulang", "udahan", "udah aja", "cukup", "menyerah", "nyerah", "cabut", "pergi"];

  const CORRECT_FEEDBACKS = [
    "Mantap! Jawabanmu benar, keren banget!",
    "Wah hebat, itu jawaban yang tepat!",
    "Benar sekali! Kamu memang jago!",
    "Yay, tepat! Lanjutkan semangatnya!",
    "Sip, jawaban kamu benar! Luar biasa!",
  ];

  const WRONG_FEEDBACKS = [
    (correctKey: string, correctText: string) =>
      `Hmm sayang, jawaban yang benar adalah ${correctKey}, ${correctText}.`,
    (correctKey: string, correctText: string) =>
      `Belum tepat ya, yang benar itu ${correctKey}, yaitu ${correctText}.`,
    (correctKey: string, correctText: string) =>
      `Oops, kurang tepat! Jawaban benarnya ${correctKey}, ${correctText}.`,
  ];

  const getRandomItem = <T,>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  // Fungsi cepat untuk mencocokkan ucapan ke opsi A/B/C/D secara lokal
  const tryLocalMatch = useCallback(
    (
      speech: string,
      question: MultipleChoiceQuestion,
    ): {
      action: "ANSWER" | "SKIP" | "EXIT" | null;
      selectedKey: "A" | "B" | "C" | "D" | null;
      isCorrect: boolean;
      feedbackSpeech: string;
    } | null => {
      const lower = speech.toLowerCase().trim();

      // 0. Cek EXIT (keluar dari quiz)
      if (EXIT_WORDS.some((w) => lower.includes(w))) {
        return {
          action: "EXIT",
          selectedKey: null,
          isCorrect: false,
          feedbackSpeech: "Oke, kita akhiri kuisnya di sini. Sampai jumpa lagi!",
        };
      }

      // 1. Cek SKIP
      if (SKIP_WORDS.some((w) => lower.includes(w))) {
        return {
          action: "SKIP",
          selectedKey: null,
          isCorrect: false,
          feedbackSpeech: "Oke, kita lanjut ke soal berikutnya!",
        };
      }

      // 2. Cek jawaban huruf langsung (A, B, C, D)
      //    Cari huruf opsi di awal/akhir ucapan atau sebagai kata tunggal
      const letterMatch = lower.match(/\b([abcd])\b/i);
      if (letterMatch) {
        const key = letterMatch[1].toUpperCase() as "A" | "B" | "C" | "D";
        // Pastikan opsi ini valid
        const optionExists = question.options.some((o) => o.key === key);
        if (optionExists) {
          const isCorrect = key === question.correctKey;
          const correctOpt = question.options.find(
            (o) => o.key === question.correctKey,
          );
          const feedbackSpeech = isCorrect
            ? getRandomItem(CORRECT_FEEDBACKS)
            : getRandomItem(WRONG_FEEDBACKS)(
              question.correctKey,
              correctOpt?.text || "",
            );
          return { action: "ANSWER", selectedKey: key, isCorrect, feedbackSpeech };
        }
      }

      // 3. Cek apakah ucapan cocok dengan teks opsi jawaban
      for (const opt of question.options) {
        const optLower = opt.text.toLowerCase();
        // Cocokkan jika ucapan mengandung teks opsi atau sebaliknya
        if (
          lower.includes(optLower) ||
          optLower.includes(lower) ||
          // Fuzzy: minimal 60% kata cocok
          (lower.split(/\s+/).filter((w) => optLower.includes(w)).length /
            Math.max(lower.split(/\s+/).length, 1) >=
            0.6 &&
            lower.length > 2)
        ) {
          const isCorrect = opt.key === question.correctKey;
          const correctOpt = question.options.find(
            (o) => o.key === question.correctKey,
          );
          const feedbackSpeech = isCorrect
            ? getRandomItem(CORRECT_FEEDBACKS)
            : getRandomItem(WRONG_FEEDBACKS)(
              question.correctKey,
              correctOpt?.text || "",
            );
          return {
            action: "ANSWER",
            selectedKey: opt.key,
            isCorrect,
            feedbackSpeech,
          };
        }
      }

      // Tidak bisa dicocokkan secara lokal
      return null;
    },
    [],
  );

  // 3. Kirim Transkrip Suara ke /api/judge (dengan fast-path lokal)
  const sendSpeechToJudge = useCallback(
    async (spokenText: string) => {
      const activeQ = currentQuestionRef.current;
      if (isTransitioningRef.current || !activeQ || isEvaluating) return;

      console.log("📤 Menerima ucapan:", spokenText);

      // ⚡ FAST PATH: Coba cocokkan secara lokal dulu (instan, 0ms)
      const localResult = tryLocalMatch(spokenText, activeQ);

      if (localResult) {
        console.log("⚡ Fast-path lokal:", localResult);

        // Aksi EXIT (keluar dari quiz)
        if (localResult.action === "EXIT") {
          isTransitioningRef.current = true;
          setIsTimerRunning(false);
          stopMic();
          window.speechSynthesis.cancel();
          speakText(localResult.feedbackSpeech, () => {
            router.push("/");
          });
          return;
        }

        // Aksi SKIP (lokal)
        if (localResult.action === "SKIP") {
          isTransitioningRef.current = true;
          setAiFeedback(localResult.feedbackSpeech);
          speakText(localResult.feedbackSpeech, () => {
            goToNextQuestion();
          });
          return;
        }

        // Aksi ANSWER (lokal)
        if (localResult.action === "ANSWER" && localResult.selectedKey) {
          isTransitioningRef.current = true;
          const key = localResult.selectedKey;
          setSelectedAnswer(key);
          setIsAnswerCorrect(localResult.isCorrect);
          setAiFeedback(localResult.feedbackSpeech);

          if (localResult.isCorrect) {
            setTotalScore((prev) => prev + activeQ.points);
          }

          speakText(localResult.feedbackSpeech, () => {
            setTimeout(goToNextQuestion, 800);
          });
          return;
        }
      }

      // 🐢 SLOW PATH: Ucapan ambigu → kirim ke AI judge
      setIsEvaluating(true);
      console.log("🤖 Ucapan ambigu, mengirim ke /api/judge:", spokenText);

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
    [isEvaluating, speakText, goToNextQuestion, tryLocalMatch],
  );

  // Ref stabil untuk sendSpeechToJudge agar closure recognition tidak stale
  const sendSpeechToJudgeRef = useRef(sendSpeechToJudge);
  useEffect(() => {
    sendSpeechToJudgeRef.current = sendSpeechToJudge;
  }, [sendSpeechToJudge]);

  // 4. Inisialisasi Speech Recognition (SEKALI saja, stabil via refs)
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
      // Gunakan refs agar selalu baca state terbaru
      if (
        isTransitioningRef.current ||
        !gameStartedRef.current ||
        isEvaluatingRef.current ||
        isAiSpeakingRef.current
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

      // Debounce jeda hening 400ms lalu kirim (dipercepat karena ada fast-path lokal)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      silenceTimerRef.current = setTimeout(() => {
        sendSpeechToJudgeRef.current(cleanText);
      }, 400);
    };

    recognition.onend = () => {
      // Re-trigger bila kuis masih berjalan dan mic aktif DAN AI tidak sedang bicara
      if (
        isMicEnabledRef.current &&
        gameStartedRef.current &&
        !isFinishedRef.current &&
        !isAiSpeakingRef.current
      ) {
        try {
          recognition.start();
        } catch { }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya sekali init, state diakses via refs

  // 4b. Start mic saat game dimulai
  useEffect(() => {
    if (gameStarted && isMicEnabled && !isFinished && !isAiSpeaking) {
      startMic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]);

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

  // Ref stabil untuk speakText agar effect pembacaan soal tidak terganggu
  const speakTextRef = useRef(speakText);
  useEffect(() => {
    speakTextRef.current = speakText;
  }, [speakText]);

  // 7. Bacakan Pertanyaan saat Nomor Berubah & Game Aktif
  useEffect(() => {
    if (!gameStarted || isFinished || !currentQuestion) return;

    // ⏸️ Timer pasti mati dulu saat soal baru muncul
    setIsTimerRunning(false);

    console.log("🔊 Trigger pembacaan soal nomor:", currentIndex + 1, "- Soal:", currentQuestion.question);
    // Matikan mic dulu sebelum AI bicara
    stopMic();
    // Gunakan ref agar tidak tergantung pada recreate speakText
    speakTextRef.current(currentQuestion.question, () => {
      // ▶️ AI selesai baca soal → timer MULAI berjalan
      console.log("⏱️ AI selesai baca soal, timer dimulai!");
      setIsTimerRunning(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, gameStarted, isFinished]);

  // 8. Timer Mundur Durasi Soal (HANYA jalan kalau isTimerRunning === true)
  useEffect(() => {
    if (!gameStarted || isFinished || isTransitioningRef.current) return;

    // ⏸️ Timer belum boleh jalan sampai AI selesai baca soal
    if (!isTimerRunning) return;

    if (timeLeft <= 0) {
      isTransitioningRef.current = true;
      setIsTimerRunning(false);
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
  }, [timeLeft, gameStarted, isFinished, isTimerRunning, goToNextQuestion, speakText]);

  // Toggle Mic Button
  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (isMicEnabled) {
      recognitionRef.current.abort();
      setIsMicEnabled(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch { }
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
          className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono text-xs font-bold transition-colors ${timeLeft <= 5
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
              className={`w-2 h-2 rounded-full ${isAiSpeaking
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
                    className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold ${isSelected || (selectedAnswer && isCorrectTarget)
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
                className={`mt-5 px-4 py-2.5 rounded-xl text-xs font-bold font-monaSans flex items-center gap-2 ${isAnswerCorrect
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
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all cursor-pointer shadow-md active:scale-95 ${isMicEnabled
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
