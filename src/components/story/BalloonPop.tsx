import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, Heart } from 'lucide-react';
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
      particleCount: 65,
      spread: 75,
      origin: { x, y },
      colors: ['#f43f5e', '#ec4899', '#fbbf24', '#38bdf8', '#10b981'],
    });

    const balloonItem = balloons.find((b) => b.id === id);
    if (balloonItem) {
      bdayAudio.speak(`वाह रूही! ${balloonItem.blessing}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-3 w-full">
      {/* Banner */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-purple-950 mb-3 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/80 shadow-sm">
        <Gift className="w-4 h-4 text-amber-500 animate-bounce" />
        <span>गुब्बारे फोड़ें: {poppedIds.length} / {balloons.length} गिफ्ट्स अनलॉक हो चुके हैं</span>
        <Sparkles className="w-4 h-4 text-pink-500" />
      </div>

      <p className="text-xs text-slate-700 font-medium mb-4 text-center">
        "हर गुब्बारे के पीछे तेरे भाई मोहित का एक अनमोल वादा और गिफ्ट है—क्योंकि तेरे भाई का सब कुछ रूही का है!"
      </p>

      {/* Balloon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 w-full justify-items-center mb-6">
        {balloons.map((b, idx) => {
          const isPopped = poppedIds.includes(b.id);
          return (
            <div key={b.id} className="flex flex-col items-center">
              <AnimatePresence>
                {!isPopped ? (
                  <motion.div
                    whileHover={{ scale: 1.12, y: -8 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      y: [0, -12, 0],
                      rotate: [-3, 3, -3],
                    }}
                    transition={{
                      duration: 2.2 + idx * 0.35,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    onClick={(e) => handlePop(b.id, e)}
                    className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-full bg-gradient-to-br ${b.color} shadow-[0_10px_25px_rgba(0,0,0,0.2)] cursor-pointer flex flex-col items-center justify-center border-t-2 border-white/60 select-none`}
                    title="क्लिक करके गिफ्ट अनलॉक करें!"
                  >
                    {/* Balloon Shine */}
                    <div className="absolute top-3 left-4 w-3.5 h-6 bg-white/50 rounded-full blur-[1px] transform -rotate-25" />
                    <span className="text-[11px] font-black text-white drop-shadow-md text-center px-1">
                      {b.label}
                    </span>
                    {/* Balloon Knot and String */}
                    <div className="absolute -bottom-2 w-2.5 h-2.5 bg-pink-800 rounded-sm" />
                    <div className="absolute -bottom-6 w-0.5 h-5 bg-pink-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col items-center justify-center p-2 text-center shadow-[0_4px_15px_rgba(251,191,36,0.3)]"
                  >
                    <Gift className="w-6 h-6 text-amber-500 mb-1 animate-pulse" />
                    <span className="text-[10px] font-black text-amber-900">
                      तोहफा खुला!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Revealed Gifts List */}
      <div className="w-full space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {balloons
          .filter((b) => poppedIds.includes(b.id))
          .map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-purple-200/90 backdrop-blur-xl text-left text-xs sm:text-sm text-slate-800 flex items-start gap-3 shadow-md"
            >
              <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 shrink-0 mt-0.5">
                <Gift className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="leading-relaxed font-semibold text-slate-800">
                  {b.blessing}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-pink-700 font-bold">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>मोहित का सब कुछ रूही का है! 💖</span>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};
