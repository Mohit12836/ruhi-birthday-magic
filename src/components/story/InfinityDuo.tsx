import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Infinity as InfinityIcon } from 'lucide-react';
import mohitImg from '../../assets/images/mohit_jain.png';
import ruhiImg from '../../assets/images/ruhi_boss.jpg';

export const InfinityDuo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-4 w-full">
      {/* Portraits with Infinity Loop Bridge */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full my-4">
        {/* Brother Portrait (Mohit Jain) */}
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.4)] group">
            <img
              src={mohitImg}
              alt="Mohit Jain"
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-center">
              <span className="text-xs sm:text-sm font-bold text-amber-300">
                मोहित जैन
              </span>
              <p className="text-[10px] text-amber-200/80">बड़ा भाई • रक्षक</p>
            </div>
          </div>
        </motion.div>

        {/* Center Glowing Infinity Loop */}
        <div className="flex flex-col items-center justify-center my-2 sm:my-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="p-3.5 rounded-full bg-white/90 border border-amber-300 backdrop-blur-md shadow-[0_4px_20px_rgba(236,72,153,0.25)]"
          >
            <InfinityIcon className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 drop-shadow-sm" />
          </motion.div>
          <span className="text-[10px] font-mono tracking-widest text-pink-600 font-black mt-1">
            FOREVER
          </span>
        </div>

        {/* Sister Portrait (Rukmani / Ruhi) */}
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-pink-400 shadow-[0_8px_25px_rgba(236,72,153,0.35)] group">
            <img
              src={ruhiImg}
              alt="Rukmani (Ruhi)"
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-center">
              <span className="text-xs sm:text-sm font-bold text-pink-300">
                रुक्मणी (रूही)
              </span>
              <p className="text-[10px] text-pink-200/80">लाडली बहना • जान</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bond Proclamation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-4 rounded-2xl bg-white/95 border border-amber-300/80 backdrop-blur-md text-center max-w-lg mt-2 shadow-md"
      >
        <div className="flex items-center justify-center gap-2 text-amber-800 text-xs sm:text-sm font-extrabold mb-1">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>रूह से जुड़ा भाई-बहन का पवित्र रिश्ता</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
          "हर परिस्थिति में एक दूसरे की ढाल, हर खुशी और गम में एक दूसरे का हाथ थामे...
          मोहित और रूही की यह जोड़ी दुनिया की सबसे प्यारी जोड़ी है।"
        </p>
      </motion.div>
    </div>
  );
};
