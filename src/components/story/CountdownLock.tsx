import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Heart } from 'lucide-react';
import { bdayAudio } from '../../audio/birthdayAudio';

interface CountdownLockProps {
  onUnlock: () => void;
}

export const CountdownLock: React.FC<CountdownLockProps> = ({ onUnlock }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(24, 0, 0, 0); // Next 12:00 AM Midnight

      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenGate = () => {
    bdayAudio.playChime(784);
    onUnlock();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto py-6">
      {/* Glowing Star Emblem */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="w-20 h-20 rounded-full border border-purple-400/40 bg-purple-500/10 backdrop-blur-md flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.35)]"
      >
        <Sparkles className="w-10 h-10 text-purple-300" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200 mb-3"
      >
        रात 12:00 बजे का जादुई द्वार
      </motion.h2>

      <p className="text-purple-200/80 text-sm sm:text-base mb-8 max-w-md">
        आज की रात रुक्मणी (रूही) के जन्म की पावन घड़ी का इंतज़ार कर रही है...
      </p>

      {/* Countdown Timer Dials */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 w-full max-w-md">
        {[
          { label: 'घंटे (HOURS)', val: timeLeft.hours },
          { label: 'मिनट (MINS)', val: timeLeft.minutes },
          { label: 'सेकंड (SECS)', val: timeLeft.seconds },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.03 }}
            className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-slate-900/60 border border-purple-500/30 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
          >
            <span className="text-3xl sm:text-5xl font-black text-amber-300 tracking-wider font-mono drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
              {String(item.val).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-purple-300/80 mt-1">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Live Notice / Instant Pass */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center"
      >
        <button
          onClick={handleOpenGate}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
          <span>जादुई द्वार खोलें (Enter The Wonder-Verse)</span>
          <Compass className="w-5 h-5 text-pink-200 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      <div className="flex items-center gap-2 mt-5 text-xs text-purple-300/60">
        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
        <span>तेरे भाई मोहित की तरफ से प्यार से सजाया गया ❤️</span>
      </div>
    </div>
  );
};
