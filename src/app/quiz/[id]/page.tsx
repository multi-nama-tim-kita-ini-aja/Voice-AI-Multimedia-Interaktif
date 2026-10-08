"use client";

import { useEffect, useState, useRef, use, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_QUESTIONS, MultipleChoiceQuestion } from "@/data/quizQuestions";
import { supabase } from "@/lib/supabase";
import { HaloSearchInput } from "@/components/ui/halo-search";
import Image from "next/image";

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
    // Background & Paper Texture
    <div className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat text-zinc-900 flex flex-col justify-between p-4 sm:p-8 [@media(max-height:650px)]:p-3 select-none overflow-x-hidden"
      style={{ backgroundImage: "url('/quiz-bg.png')" }}
      >
         {/* PAPER */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <Image
          src="/paper.png"
          alt=""
          width={1260}
          height={1782}
          className="h-[1390px] w-[1200px] object-fill rotate-[-20deg] drop-shadow-[0_20px_18px_rgba(57,45,25,0.24)] max-md:rotate-0"
        />
      </div>

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
      <header className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center pb-3 [@media(max-height:650px)]:pb-1">
        <button
          onClick={() => router.push("/")}
          className="group inline-flex justify-self-start items-center gap-2 rounded-full border border-rose-900/10 bg-[#fff8ed]/90 py-2 pl-2 pr-4 text-xs font-bold text-rose-950 shadow-[0_4px_0_rgba(119,77,49,0.14),0_8px_16px_rgba(86,60,36,0.1)] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_5px_0_rgba(119,77,49,0.14),0_11px_18px_rgba(86,60,36,0.13)] active:translate-y-0.5 active:shadow-sm cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-200/80 text-sm text-rose-900 transition-transform group-hover:-rotate-12">
            ←
          </span>
          Keluar
        </button>

        <div className="flex items-center gap-2 rounded-full border border-amber-900/10 bg-[#fff8df]/85 px-4 py-2 shadow-[0_4px_12px_rgba(86,60,36,0.1)]">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.16)]" />
          <span className="whitespace-nowrap font-monaSans text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-950 sm:text-xs">
            Arena Quiz
          </span>
          <span aria-hidden="true" className="text-sm leading-none">✦</span>
        </div>
        <button
          type="button"
          onClick={() => sendSpeechToJudge("skip")}
          disabled={isTransitioningRef.current || !gameStarted || isEvaluating}
          className="group inline-flex justify-self-end items-center gap-2 rounded-full border border-amber-900/10 bg-[#fff8df]/75 px-4 py-2 text-[11px] font-bold text-amber-950/65 shadow-[0_3px_0_rgba(119,77,49,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#fff4c8] hover:text-amber-950 hover:shadow-[0_5px_0_rgba(119,77,49,0.16)] active:translate-y-0.5 active:shadow-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Lewati soal</span>
          <span className="sm:hidden">Skip</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">➜</span>
        </button>
      </header>

      {/* 5. ARENA PERTANYAAN (PILIHAN GANDA) */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5 py-3 xl:gap-7 xl:py-10 [@media(max-height:650px)]:gap-2 [@media(max-height:650px)]:py-1">
        <motion.div
          key={currentQuestion?.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex w-full max-w-[540px] flex-col items-center overflow-hidden rounded-[2rem] border border-amber-950/10 bg-[#fffdf5]/60 px-5 py-6 shadow-[0_14px_36px_rgba(71,55,29,0.12)] backdrop-blur-[1px] sm:px-10 sm:py-8 xl:max-w-[620px] [@media(max-height:650px)]:py-3"
        >
          {/* Progress Bar Soal */}
          <div className="absolute inset-x-0 top-0 h-2 overflow-hidden bg-amber-950/10">
            <div
              className="h-full rounded-r-full bg-amber-500 shadow-[0_1px_4px_rgba(180,115,20,0.3)] transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* AI Voice State Indicator */}
          <div className="mt-2 mb-3 flex items-center gap-2 [@media(max-height:650px)]:mt-1 [@media(max-height:650px)]:mb-2">
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
          <h2 className="mb-5 max-w-lg text-center font-monaSans text-xl font-extrabold leading-snug text-stone-900 sm:text-2xl [@media(max-height:650px)]:mb-2">
            {currentQuestion?.question}
          </h2>

          {/* Grid Opsi Pilihan Ganda */}
          <div className="grid w-full grid-cols-1 gap-2.5 [@media(max-height:650px)]:gap-1.5">
            {currentQuestion?.options.map((opt) => {
              const isSelected = selectedAnswer === opt.key;
              const isCorrectTarget = currentQuestion.correctKey === opt.key;

              let cardStyle =
                "border-amber-950/15 bg-[#fffdf8]/75 text-stone-800 shadow-[2px_3px_0_rgba(93,75,44,0.12)] hover:-translate-y-0.5 hover:border-amber-900/30 hover:bg-white hover:shadow-[3px_5px_0_rgba(93,75,44,0.14)]";

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
                  className={`flex min-h-[58px] w-full items-center gap-4 rounded-2xl border-2 px-4 py-3 text-left font-monaSans transition-all duration-200 cursor-pointer select-none [@media(max-height:650px)]:min-h-[44px] [@media(max-height:650px)]:py-2 ${cardStyle}`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${isSelected || (selectedAnswer && isCorrectTarget)
                        ? "bg-white/20 text-white"
                        : "border border-amber-950/10 bg-amber-100/70 text-amber-950"
                      }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-sm font-semibold leading-snug sm:text-base">
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

        <aside
          aria-label="Ringkasan kuis"
          className="mx-auto grid w-full max-w-[250px] grid-cols-1 gap-7 lg:absolute lg:right-[-1rem] lg:top-1/2 lg:mx-0 lg:w-56 lg:-translate-y-1/2 [@media(max-height:650px)]:scale-[0.82]"
        >
          <article className="relative -rotate-2 bg-[#ffe89a] px-5 pb-5 pt-6 shadow-[4px_14px_24px_rgba(85,65,20,0.3)]">
            <span aria-hidden="true" className="absolute left-1/2 top-0 h-3 w-16 -translate-x-1/2 -translate-y-1 rotate-1 bg-white/60 shadow-sm" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-950/55">
              Timer
            </p>
            <div className={`mt-2 font-mono text-4xl font-black tracking-tight ${timeLeft <= 5 ? "text-red-600" : "text-amber-950"}`}>
              00:{String(timeLeft).padStart(2, "0")}
            </div>
            <p className="mt-1 text-xs font-medium text-amber-950/60">
              {isTimerRunning ? "Waktu menjawab" : "Bersiap menjawab"}
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-amber-950/10">
              <div
                className={`h-full rounded-full transition-[width] duration-[1000ms] ease-linear ${timeLeft <= 5 ? "bg-red-500" : "bg-amber-700"}`}
                style={{ width: `${Math.max(0, (timeLeft / initialTime) * 100)}%` }}
              />
            </div>
          </article>

          <article className="relative rotate-2 bg-[#f8cbd1] px-5 pb-5 pt-6 shadow-[4px_14px_24px_rgba(85,45,50,0.28)]">
            <span aria-hidden="true" className="absolute left-1/2 top-0 h-3 w-16 -translate-x-1/2 -translate-y-1 -rotate-2 bg-white/60 shadow-sm" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-950/55">
              Total skor
            </p>
            <div className="mt-2 font-monaSans text-4xl font-black tracking-tight text-rose-950">
              {totalScore}
            </div>
            <p className="mt-1 text-xs font-medium text-rose-950/60">
              poin terkumpul
            </p>
            <div aria-hidden="true" className="absolute bottom-4 right-5 text-2xl text-rose-950/25">
              +
            </div>
          </article>

          <article className="relative -rotate-1 bg-[#cce8d2] px-5 pb-5 pt-6 shadow-[4px_14px_24px_rgba(35,75,45,0.28)]">
            <span aria-hidden="true" className="absolute left-1/2 top-0 h-3 w-16 -translate-x-1/2 -translate-y-1 rotate-2 bg-white/60 shadow-sm" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-950/55">
              Soal &amp; level
            </p>
            <div className="mt-2 font-monaSans text-3xl font-black tracking-tight text-emerald-950">
              {currentIndex + 1}
              <span className="ml-1 text-base font-semibold text-emerald-950/45">
                / {questions.length}
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-emerald-950/65">
              {categoryId} <span className="px-1">·</span> Level {level}
            </p>
            <div className="mt-4 flex gap-1">
              {questions.map((question, index) => (
                <span
                  key={question.id}
                  className={`h-1.5 flex-1 rounded-full ${index <= currentIndex ? "bg-emerald-800/70" : "bg-emerald-950/10"}`}
                />
              ))}
            </div>
          </article>
        </aside>
      </main>

      {/* 6. FOOTER VOICE CONTROLS */}
      <footer className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-2 pb-1 [@media(max-height:650px)]:gap-1">
        <button
          type="button"
          onClick={toggleMic}
          disabled={!gameStarted}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-[#fff8e9] transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 [@media(max-height:650px)]:h-11 [@media(max-height:650px)]:w-11 ${isMicEnabled
              ? "bg-emerald-700 text-white shadow-[0_5px_0_#854d0e,0_10px_20px_rgba(76,54,27,0.24)] hover:-translate-y-0.5 hover:bg-emerald-600"
              : "bg-rose-500 text-white shadow-[0_5px_0_#9f3542,0_10px_20px_rgba(76,54,27,0.2)] hover:-translate-y-0.5 hover:bg-rose-600"
            }`}
          title={isMicEnabled ? "Matikan Mikrofon" : "Aktifkan Mikrofon"}
        >
          {isMicEnabled && !isAiSpeaking && (
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-300 opacity-25" />
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
        <div className="flex min-h-9 max-w-full items-center justify-center rounded-full border border-amber-950/10 bg-[#fff9e9]/85 px-4 py-2 text-center shadow-[0_3px_8px_rgba(86,60,36,0.1)] [@media(max-height:650px)]:min-h-7 [@media(max-height:650px)]:px-3 [@media(max-height:650px)]:py-1">
          <span className="text-[11px] font-semibold leading-snug text-amber-950/75 font-monaSans sm:text-xs">
            {transcript ? (
              <span className="text-amber-950 italic">
                &ldquo;{transcript}&rdquo;
              </span>
            ) : isAiSpeaking ? (
              "🔊 Dengerin dulu, soalnya lagi dibacain!"
            ) : isMicEnabled ? (
              '🎤 Sebut pilihan A, B, C, D atau bilang "Lanjut"'
            ) : (
              "🔇 Mic istirahat — pencet tombol untuk aktifkan"
            )}
          </span>
        </div>

      </footer>
    </div>
  );
}
