import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Feather, Heart } from 'lucide-react';
import { bdayAudio } from '../../audio/birthdayAudio';

interface LetterTypewriterProps {
  paragraphs: string[];
}

export const LetterTypewriter: React.FC<LetterTypewriterProps> = ({ paragraphs }) => {
  const [revealedCount, setRevealedCount] = useState<number>(1);

  useEffect(() => {
    if (revealedCount < paragraphs.length) {
      const timer = setTimeout(() => {
        setRevealedCount((prev) => prev + 1);
        bdayAudio.playChime(523.25);
      }, 2400); // Gentle slow pacing
      return () => clearTimeout(timer);
    }
  }, [revealedCount, paragraphs.length]);

  return (
    <div className="max-w-xl mx-auto w-full my-4">
      {/* Letter Parchment Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900/80 to-purple-950/60 border border-amber-400/40 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden"
      >
        {/* Subtle Ambient Background Watermark */}
        <div className="absolute top-4 right-4 text-amber-500/10 pointer-events-none select-none">
          <Heart className="w-32 h-32" />
        </div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-amber-400/20 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-amber-200">
                मोहित का आत्मीय संदेश
              </h4>
              <p className="text-[11px] text-amber-300/60">
                From: Mohit Jain • To: Rukmani (Ruhi)
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono">
            दिल से ✍️
          </span>
        </div>

        {/* Typewritten / Revealed Paragraphs */}
        <div className="space-y-4 text-left font-serif leading-relaxed text-slate-200">
          {paragraphs.slice(0, revealedCount).map((para, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className={`text-sm sm:text-base ${
                index === 0
                  ? 'font-bold text-amber-300 text-base sm:text-lg'
                  : index === paragraphs.length - 1
                  ? 'font-bold text-pink-300 pt-2 text-base'
                  : 'text-purple-100/90'
              }`}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Action to show all immediately if user prefers */}
        {revealedCount < paragraphs.length && (
          <div className="mt-5 pt-3 border-t border-amber-400/15 flex justify-end">
            <button
              onClick={() => setRevealedCount(paragraphs.length)}
              className="text-xs text-amber-300/80 hover:text-amber-200 underline cursor-pointer"
            >
              पूरा पत्र अभी पढ़ें ⏩
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
