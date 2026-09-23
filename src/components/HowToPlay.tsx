"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    step: "01",
    title: "Pilih Kategori",
    description: "Pilih topik kuis yang ingin kamu mainkan di halaman utama.",
    status: "Idle",
  },
  {
    step: "02",
    title: "Dengarkan Soal",
    description: "AI akan membacakan pertanyaan secara otomatis.",
    status: "Mic Locked 🔒",
  },
  {
    step: "03",
    title: "Jawab Pakai Suara",
    description: "Ucapkan jawabanmu secara langsung tanpa perlu menyentuh layar.",
    status: "Mic Active 🎙️",
  },
  {
    step: "04",
    title: "Evaluasi AI",
    description: "Sistem akan mengecek ketepatan dan kecepatan jawabanmu.",
    status: "Evaluating ⚡",
  },
  {
    step: "05",
    title: "Perolehan Poin",
    description: "Dapatkan skor dan tingkatkan posisimu di Leaderboard!",
    status: "Score Updated ✨",
  },
];

export default function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer z-[100001]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-[100002] w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 text-[#1A1A1A]"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight font-monaSans">
                  How To Play
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Panduan cara bermain VoxIQ®
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content List Steps */}
            <div className="mt-5 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {STEPS.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-gray-50 border border-gray-100/80"
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-black text-white font-bold flex items-center justify-center text-xs">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm text-[#1A1A1A]">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-200/70 text-gray-700">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full md:w-auto px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-semibold transition-all cursor-pointer shadow-md active:scale-95"
              >
                Paham, Siap Main!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}