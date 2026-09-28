import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { bdayAudio } from '../../audio/birthdayAudio';

interface BalloonItem {
  id: number;
  color: string;
  label: string;
  blessing: string;
}

interface BalloonPopProps {
  balloons: BalloonItem[];
}

export const BalloonPop: React.FC<BalloonPopProps> = ({ balloons }) => {
  const [poppedIds, setPoppedIds] = useState<number[]>([]);

  const handlePop = (id: number, e: React.MouseEvent) => {
    if (poppedIds.includes(id)) return;

    bdayAudio.playBalloonPop();
    setPoppedIds((prev) => [...prev, id]);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-3 w-full">
      <div className="text-xs sm:text-sm font-semibold text-purple-200/90 mb-4 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30">
        🎈 गुब्बारे पर क्लिक करके फोड़ें: {poppedIds.length} / {balloons.length} खुल चुके हैं
      </div>

      {/* Balloon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 w-full justify-items-center mb-6">
        {balloons.map((b, idx) => {
          const isPopped = poppedIds.includes(b.id);
          return (
            <div key={b.id} className="flex flex-col items-center">
              <AnimatePresence>
                {!isPopped ? (
                  <motion.div
                    whileHover={{ scale: 1.12, y: -6 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [-2, 2, -2],
                    }}
                    transition={{
                      duration: 2.5 + idx * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    onClick={(e) => handlePop(b.id, e)}
                    className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-full bg-gradient-to-br ${b.color} shadow-[0_10px_25px_rgba(0,0,0,0.4)] cursor-pointer flex flex-col items-center justify-center border-t-2 border-white/40`}
                  >
                    {/* Balloon Shine */}
                    <div className="absolute top-3 left-4 w-3 h-5 bg-white/40 rounded-full blur-[1px] transform -rotate-25" />
                    <span className="text-[11px] font-bold text-white drop-shadow-md text-center px-1">
                      {b.label}
                    </span>
                    {/* Balloon Knot and String */}
                    <div className="absolute -bottom-2 w-2 h-2 bg-pink-700 rounded-sm" />
                    <div className="absolute -bottom-6 w-0.5 h-5 bg-white/40" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex flex-col items-center justify-center p-2 text-center"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-300 mb-1" />
                    <span className="text-[10px] font-bold text-emerald-200">
                      आशीर्वाद अनलॉक!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Revealed Blessings List */}
      <div className="w-full space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {balloons
          .filter((b) => poppedIds.includes(b.id))
          .map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-slate-900/60 border border-pink-400/30 backdrop-blur-md text-left text-xs sm:text-sm text-pink-100 flex items-start gap-2.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>{b.blessing}</span>
            </motion.div>
          ))}
      </div>
    </div>
  );
};
