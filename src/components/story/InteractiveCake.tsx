import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Flame } from 'lucide-react';
import { bdayAudio } from '../../audio/birthdayAudio';

interface InteractiveCakeProps {
  onComplete?: () => void;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({ onComplete }) => {
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);
  const [cakeCut, setCakeCut] = useState<boolean>(false);

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    bdayAudio.playCandleBlow();
    setCandlesBlown(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f472b6', '#c084fc', '#38bdf8'],
    });
  };

  const handleSliceCake = () => {
    if (cakeCut) return;
    bdayAudio.playChime(880);
    setCakeCut(true);

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ec4899', '#f59e0b', '#8b5cf6', '#10b981', '#ffffff'],
    });

    if (onComplete) {
      setTimeout(onComplete, 1200);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-4">
      {/* 3D-styled Glowing Cake Stage */}
      <div className="relative w-64 h-56 sm:w-80 sm:h-64 flex flex-col items-center justify-end my-4 select-none">
        {/* Candle Flames */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-1 z-20">
          {[1, 2, 3].map((candle) => (
            <div key={candle} className="flex flex-col items-center">
              {/* Flame */}
              <AnimatePresence>
                {!candlesBlown ? (
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 0.95, 1.2, 1],
                      opacity: [0.9, 1, 0.85, 1, 0.9],
                      y: [0, -2, 1, -1, 0],
                    }}
                    transition={{
                      duration: 0.6 + candle * 0.15,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="cursor-pointer"
                    onClick={handleBlowCandles}
                    title="Click to blow candle"
                  >
                    <Flame className="w-6 h-6 text-amber-300 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0.8, y: 0 }}
                    animate={{ opacity: 0, y: -20, scale: 0.5 }}
                    transition={{ duration: 1.2 }}
                    className="text-xs text-slate-300 font-mono"
                  >
                    💨
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Candle Body */}
              <div className="w-2.5 h-9 bg-gradient-to-b from-amber-100 via-pink-200 to-purple-400 rounded-t-sm shadow-md border-t border-amber-300" />
            </div>
          ))}
        </div>

        {/* Cake Top Tier */}
        <motion.div
          animate={cakeCut ? { x: -8 } : {}}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative w-36 sm:w-44 h-16 rounded-t-2xl bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 shadow-[inset_0_4px_10px_rgba(255,255,255,0.6),0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center border-t-2 border-pink-200"
        >
          {/* Icing Drips */}
          <div className="absolute -bottom-2 inset-x-0 flex justify-around">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 bg-rose-200 rounded-full shadow-sm"
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm font-black text-rose-900 drop-shadow-sm tracking-wide">
            👑 RUHI 👑
          </span>
        </motion.div>

        {/* Cake Bottom Tier */}
        <motion.div
          animate={cakeCut ? { x: 8 } : {}}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative w-52 sm:w-64 h-24 rounded-t-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 shadow-[inset_0_4px_15px_rgba(255,255,255,0.5),0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center border-t-2 border-purple-200"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/40 backdrop-blur-sm border border-amber-300/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs sm:text-sm font-bold text-amber-200">
              HAPPY BIRTHDAY
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
        </motion.div>

        {/* Cake Stand / Plate */}
        <div className="w-60 sm:w-72 h-4 rounded-full bg-gradient-to-r from-slate-300 via-white to-slate-300 shadow-[0_8px_20px_rgba(0,0,0,0.5)] border border-white/60" />
      </div>

      {/* Interaction Controls & Status */}
      <div className="mt-4 flex flex-col items-center gap-3">
        {!candlesBlown ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBlowCandles}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(251,191,36,0.6)] cursor-pointer"
          >
            <Flame className="w-5 h-5 text-amber-200" />
            <span>मोमबत्ती बुझाएं और विश माँगें (Blow Candles)</span>
          </motion.button>
        ) : !cakeCut ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
              <span>विश मांगी गई! ब्रह्मांड ने स्वीकार कर ली ✨</span>
            </div>

            <button
              onClick={handleSliceCake}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(244,114,182,0.6)] cursor-pointer animate-bounce"
            >
              <span>🍰 अब केक काटें (Slice the Cake)</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-pink-400/40 backdrop-blur-md"
          >
            <p className="text-base sm:text-lg font-bold text-pink-200">
              🎉 पहला टुकड़ा रूही के नाम! बहुत-बहुत मुबारक हो! 💖
            </p>
            <p className="text-xs text-purple-200/80 mt-1">
              मीठा केक और अनंत खुशियों भरा साल तुम्हारे इंतज़ार में है।
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
