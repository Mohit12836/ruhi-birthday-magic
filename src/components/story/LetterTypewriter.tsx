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
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#fffdf5] via-[#fefaf0] to-[#fff5f5] border-2 border-amber-300/80 backdrop-blur-xl shadow-[0_15px_40px_rgba(217,119,6,0.15)] relative overflow-hidden"
      >
        {/* Subtle Ambient Background Watermark */}
        <div className="absolute top-4 right-4 text-pink-300/20 pointer-events-none select-none">
          <Heart className="w-32 h-32" />
        </div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-amber-200 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-700">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-amber-950">
                मोहित का आत्मीय संदेश
              </h4>
              <p className="text-[11px] text-amber-800/80 font-medium">
                From: Mohit Jain • To: Rukmani (Ruhi)
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold font-mono">
            दिल से ✍️
          </span>
        </div>

        {/* Typewritten / Revealed Paragraphs */}
        <div className="space-y-4 text-left font-serif leading-relaxed text-slate-800">
          {paragraphs.slice(0, revealedCount).map((para, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className={`text-sm sm:text-base ${
                index === 0
                  ? 'font-bold text-amber-900 text-base sm:text-lg'
                  : index === paragraphs.length - 1
                  ? 'font-bold text-pink-700 pt-2 text-base'
                  : 'text-slate-800 font-medium'
              }`}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Action to show all immediately if user prefers */}
        {revealedCount < paragraphs.length && (
          <div className="mt-5 pt-3 border-t border-amber-200 flex justify-end">
            <button
              onClick={() => setRevealedCount(paragraphs.length)}
              className="text-xs text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
            >
              पूरा पत्र अभी पढ़ें ⏩
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
