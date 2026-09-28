import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import { bdayAudio } from '../../audio/birthdayAudio';

export const SkyLantern: React.FC = () => {
  const [released, setReleased] = useState(false);

  const handleRelease = () => {
    if (released) return;
    bdayAudio.playChime(659.25);
    setReleased(true);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-lg mx-auto py-6">
      {/* Sky Lantern Container */}
      <div className="relative w-48 h-56 flex items-center justify-center mb-6">
        <motion.div
          animate={
            released
              ? {
                  y: -260,
                  scale: 0.35,
                  opacity: [1, 0.9, 0.4, 0],
                  x: [0, 20, -15, 30],
                }
              : {
                  y: [0, -8, 0],
                  rotate: [-1.5, 1.5, -1.5],
                }
          }
          transition={
            released
              ? { duration: 4.5, ease: 'easeOut' }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative w-32 h-44 rounded-t-3xl rounded-b-xl bg-gradient-to-b from-amber-400/90 via-orange-500/80 to-rose-600/90 shadow-[0_0_50px_rgba(251,191,36,0.8),inset_0_0_20px_rgba(255,255,255,0.6)] flex flex-col items-center justify-between p-3 border border-amber-300/60 select-none cursor-pointer"
          onClick={handleRelease}
        >
          {/* Top Paper Ribs */}
          <div className="w-12 h-1 bg-amber-200/60 rounded-full" />

          {/* Golden Lettering */}
          <div className="text-center">
            <span className="text-[11px] font-black tracking-widest text-amber-950 uppercase">
              RUKMANI
            </span>
            <p className="text-[9px] font-bold text-amber-900">DEAR RUHI</p>
          </div>

          {/* Bottom Inner Flame Glow */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                scale: [1, 1.3, 0.95, 1.2],
                opacity: [0.85, 1, 0.8],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-5 h-5 rounded-full bg-amber-100 shadow-[0_0_20px_rgba(255,255,255,0.9)]"
            />
            <div className="w-16 h-1.5 bg-amber-900/60 rounded-full mt-1" />
          </div>
        </motion.div>
      </div>

      {/* Action / Feedback */}
      {!released ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRelease}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(251,191,36,0.5)] cursor-pointer"
        >
          <Send className="w-4 h-4 text-amber-200" />
          <span>आसमान में उड़ाएं (Release into the Sky)</span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 backdrop-blur-md"
        >
          <div className="flex items-center justify-center gap-2 text-amber-300 font-bold mb-1">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>लालटेन सितारों के पार पहुँच गया! ✨</span>
          </div>
          <p className="text-xs text-amber-200/80">
            आपकी हर मन्नत और भाई की हर दुआ कुबूल हो चुकी है।
          </p>
        </motion.div>
      )}
    </div>
  );
};
