import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, Music, Heart, Utensils } from 'lucide-react';
import { bdayAudio } from '../../audio/birthdayAudio';
import mohitImg from '../../assets/images/mohit_jain.png';

interface InteractiveCakeProps {
  onComplete?: () => void;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({ onComplete }) => {
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);
  const [cakeCut, setCakeCut] = useState<boolean>(false);
  const [fedMohit, setFedMohit] = useState<boolean>(false);
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);

  // Play birthday song
  const handleToggleSong = () => {
    if (isPlayingSong) {
      bdayAudio.stopBackgroundMelody();
      setIsPlayingSong(false);
    } else {
      bdayAudio.startBackgroundMelody();
      setIsPlayingSong(true);
      bdayAudio.playAirHorn();
    }
  };

  // Blow candles (either via button or tapping flames)
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

    bdayAudio.speak('Wish granted by the universe! Happy Birthday Ruhi! Now slice the cake with your hands!');
  };

  // Slice the cake
  const handleSliceCake = () => {
    if (cakeCut) return;
    bdayAudio.playChime(880);
    setCakeCut(true);

    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ec4899', '#f59e0b', '#8b5cf6', '#10b981', '#ffffff'],
    });

    bdayAudio.speak('Yaaay! Cake cut ho gaya! Ab sabse pehla bite Mohit bhaiya ko khilao!');
  };

  // Feed Mohit Bhaiya First!
  const handleFeedMohit = () => {
    if (fedMohit) return;
    bdayAudio.playAirHorn();
    setFedMohit(true);

    // Heart shower and celebratory confetti
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.4 },
      colors: ['#f43f5e', '#ec4899', '#fbbf24', '#a855f7'],
    });

    // Mohit's emotional & happy voice
    bdayAudio.speak(
      'वाह रूही! बहुत स्वादिष्ट केक है! तेरे भाई मोहित की तरफ से तुझे जन्मदिन की बहुत-बहुत शुभकामनाएं मेरी प्यारी बहना! तेरा भाई तुझसे बहुत प्यार करता है!'
    );

    if (onComplete) {
      setTimeout(onComplete, 3500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-3 w-full">
      {/* Top Quick Actions: Play Birthday Song & Instructions */}
      <div className="flex items-center gap-2 mb-2 flex-wrap justify-center">
        <button
          onClick={handleToggleSong}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            isPlayingSong
              ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] animate-pulse'
              : 'bg-white/85 border border-purple-200 text-pink-700 hover:bg-pink-50 shadow-sm'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>{isPlayingSong ? 'गाने की धुन चल रही है 🎵' : 'केक सॉन्ग चालू करें 🎶'}</span>
        </button>

        <span className="text-[11px] font-bold text-purple-950 px-2.5 py-1 rounded-full bg-white/85 border border-purple-200 shadow-sm">
          {!candlesBlown
            ? '1. मोमबत्ती बुझाएं'
            : !cakeCut
            ? '2. हाथ से केक काटें'
            : !fedMohit
            ? '3. तेरे भाई मोहित को खिलाएं ❤️'
            : 'सेलिब्रेशन पूर्ण 🎉'}
        </span>
      </div>

      {/* 3D-styled Glowing Cake Stage */}
      <div className="relative w-64 h-56 sm:w-80 sm:h-64 flex flex-col items-center justify-end my-3 select-none">
        {/* Knife floating above cake ready to slice */}
        {candlesBlown && !cakeCut && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-2 z-30 flex flex-col items-center cursor-pointer"
            onClick={handleSliceCake}
          >
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="p-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(251,191,36,0.8)] flex items-center gap-1.5 border border-white"
            >
              <span>🔪 हाथ से टच करके काटें!</span>
            </motion.div>
          </motion.div>
        )}

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
                    title="हाथ से छूकर या बटन से मोमबत्ती बुझाएं"
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
          animate={cakeCut ? { x: -10, rotate: -2 } : {}}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative w-36 sm:w-44 h-16 rounded-t-2xl bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 shadow-[inset_0_4px_10px_rgba(255,255,255,0.6),0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center border-t-2 border-pink-200 cursor-pointer"
          onClick={() => {
            if (candlesBlown && !cakeCut) handleSliceCake();
          }}
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

          {/* Sliced Cut Gap Indicator */}
          {cakeCut && (
            <div className="absolute inset-y-0 right-0 w-1 bg-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          )}
        </motion.div>

        {/* Cake Bottom Tier */}
        <motion.div
          animate={cakeCut ? { x: 10, rotate: 2 } : {}}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative w-52 sm:w-64 h-24 rounded-t-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 shadow-[inset_0_4px_15px_rgba(255,255,255,0.5),0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center border-t-2 border-purple-200 cursor-pointer"
          onClick={() => {
            if (candlesBlown && !cakeCut) handleSliceCake();
          }}
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

      {/* Interactive Controls per Step */}
      <div className="mt-3 flex flex-col items-center gap-3 w-full">
        {/* Step 1: Blow Candles */}
        {!candlesBlown && (
          <motion.div className="flex flex-col items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBlowCandles}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(251,191,36,0.7)] cursor-pointer"
            >
              <Flame className="w-5 h-5 text-amber-200" />
              <span>बटन से फूँक मारें (Blow Candles)</span>
            </motion.button>
            <p className="text-[11px] text-slate-600 font-medium">
              (या मोमबत्तियों की लौ पर डायरेक्ट टच करके भी बुझा सकती हैं)
            </p>
          </motion.div>
        )}

        {/* Step 2: Slice the Cake with Hand */}
        {candlesBlown && !cakeCut && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 w-full"
          >
            <div className="px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>विश मांगी गई! अब केक काटने का समय है 🎂</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleSliceCake}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white font-extrabold text-sm sm:text-base shadow-[0_8px_30px_rgba(244,114,182,0.4)] cursor-pointer animate-bounce"
            >
              <Utensils className="w-5 h-5 text-amber-200" />
              <span>🍰 हाथ से केक काटें (Slice with Knife)</span>
            </motion.button>
          </motion.div>
        )}

        {/* Step 3: Feed Mohit Bhaiya First! */}
        {cakeCut && !fedMohit && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-white/95 border border-pink-300/80 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-3 max-w-md w-full"
          >
            <div className="flex items-center gap-2 text-pink-700 font-extrabold text-sm">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>सबसे पहला बाइट तेरे भाई मोहित के नाम!</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            </div>

            {/* Mohit Bhaiya Portrait Card */}
            <div className="relative w-28 h-32 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_8px_20px_rgba(251,191,36,0.4)] group">
              <img
                src={mohitImg}
                alt="तेरा भाई मोहित"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-center">
                <span className="text-[10px] font-bold text-amber-300">
                  तेरा भाई मोहित
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-800 max-w-xs leading-relaxed font-medium">
              "रूही, केक कट चुका है! नीचे दिए गए बटन पर टैप करके सबसे पहला बाइट
              अपने भाई मोहित को खिलाओ!"
            </p>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleFeedMohit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(244,63,94,0.4)] cursor-pointer animate-pulse"
            >
              <span>🍰 तेरे भाई मोहित को खिलाएं (Feed First Bite) ❤️</span>
            </motion.button>
          </motion.div>
        )}

        {/* Step 4: After feeding Mohit celebration message */}
        {fedMohit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-3xl bg-white/95 border-2 border-pink-300/90 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-2 max-w-md w-full"
          >
            <div className="flex items-center gap-2 text-amber-600 font-black text-base">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              <span>तेरे भाई मोहित ने पहला बाइट खा लिया! 😋🍰</span>
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            </div>

            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed italic">
              "वाह रूही! बहुत मीठा और स्वादिष्ट केक है! तेरे भाई मोहित की तरफ से तुझे
              जन्मदिन की बहुत-बहुत शुभकामनाएं मेरी प्यारी बहना! तेरा भाई तुझसे बहुत
              प्यार करता है!"
            </p>

            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-pink-700 font-bold">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>भाई-बहन का अटूट प्यार सदा बना रहे ✨</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
