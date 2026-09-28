import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { bdayAudio } from '../../audio/birthdayAudio';

interface WaxSealStampProps {
  onStamped?: () => void;
}

export const WaxSealStamp: React.FC<WaxSealStampProps> = ({ onStamped }) => {
  const [isStamped, setIsStamped] = useState(false);

  const handleStamp = () => {
    if (isStamped) return;
    bdayAudio.playSealBreak();
    setIsStamped(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#dc2626', '#e11d48'],
    });

    if (onStamped) {
      setTimeout(onStamped, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-6">
      {/* Wax Stamp Emblem */}
      <motion.div
        whileHover={!isStamped ? { scale: 1.08, rotate: 3 } : {}}
        whileTap={!isStamped ? { scale: 0.92 } : {}}
        animate={
          isStamped
            ? {
                scale: [1.3, 0.95, 1],
                boxShadow: '0 0 50px rgba(251,191,36,0.8)',
              }
            : {}
        }
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        onClick={handleStamp}
        className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center cursor-pointer select-none relative transition-all duration-500 ${
          isStamped
            ? 'bg-gradient-to-br from-red-600 via-rose-700 to-amber-700 border-4 border-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.7)]'
            : 'bg-gradient-to-br from-red-700 via-rose-800 to-amber-900 border-4 border-amber-500/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)] animate-pulse'
        }`}
      >
        {/* Ring Stamping Detail */}
        <div className="absolute inset-2 rounded-full border border-dashed border-amber-200/40 pointer-events-none" />

        {isStamped ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center p-2"
          >
            <ShieldCheck className="w-10 h-10 text-amber-200 mb-1" />
            <span className="text-[11px] sm:text-xs font-black tracking-widest text-amber-100 uppercase">
              SEALED FOREVER
            </span>
            <span className="text-[10px] font-bold text-amber-300">
              मोहित ❤️ रूही
            </span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center text-center p-2">
            <Heart className="w-8 h-8 text-amber-300 mb-1 fill-amber-300" />
            <span className="text-[11px] sm:text-xs font-bold text-amber-200 tracking-wider">
              टैप करके
            </span>
            <span className="text-xs sm:text-sm font-black text-white">
              मुहर लगाएं
            </span>
          </div>
        )}
      </motion.div>

      {/* Caption */}
      <div className="mt-6 text-center">
        {isStamped ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 backdrop-blur-md"
          >
            <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
              <span>शाही मुहर दर्ज हो चुकी है! 📜✨</span>
            </div>
            <p className="text-xs text-amber-200/80 mt-1">
              "मोहित और रूही का यह रिश्ता अनंत काल तक अमर रहेगा।"
            </p>
          </motion.div>
        ) : (
          <p className="text-xs sm:text-sm text-purple-200/80">
            👆 मुहर पर क्लिक करके इस वादे को अमर करें
          </p>
        )}
      </div>
    </div>
  );
};
