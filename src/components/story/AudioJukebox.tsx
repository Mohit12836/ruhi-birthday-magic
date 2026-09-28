import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  icon: string;
  tag: string;
}

const TRACKS: AudioTrack[] = [
  {
    id: 'bday_remix',
    title: 'Happy Birthday Ruhi (Dance Party Remix)',
    artist: 'Full High-Energy 128 BPM Party Beat',
    src: '/audio/happy_birthday_remix.wav',
    icon: '🎂',
    tag: 'सुपर एनर्जेटिक',
  },
  {
    id: 'ek_hazaron',
    title: 'फूलों का तारों का... एक हज़ारों में मेरी बहना है',
    artist: 'मोहित और रूही का अमर भाई-बहन गीत',
    src: '/audio/ek_hazaron_mein.wav',
    icon: '🌹',
    tag: 'भावुक धुन',
  },
  {
    id: 'airhorn_drop',
    title: 'DJ एयर हॉर्न & पार्टी बेस ड्रॉप',
    artist: 'Triple Air Horn + 808 Sub Drop',
    src: '/audio/party_airhorn_drop.wav',
    icon: '📢',
    tag: 'धमाकेदार',
  },
];

import { bdayAudio } from '../../audio/birthdayAudio';

export const AudioJukebox: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // Auto-duck jukebox volume when voice speaks!
  useEffect(() => {
    const unsubscribe = bdayAudio.onDuckChange((isDucked) => {
      if (audioRef.current) {
        audioRef.current.volume = isDucked ? 0.18 : 1.0;
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayTrack = (index: number) => {
    if (currentTrackIndex === index && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#f43f5e', '#ec4899', '#fbbf24', '#38bdf8'],
      });
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-2 z-30">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        loop
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Jukebox Card Header */}
      <div className="p-3 sm:p-4 rounded-3xl bg-white/95 border border-pink-300/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(236,72,153,0.18)] flex items-center justify-between gap-3">
        {/* Track Info with Spinning Vinyl */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-600 to-amber-400 flex items-center justify-center p-1 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer"
            onClick={handleTogglePlay}
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border border-white/40 text-lg">
              {currentTrack.icon}
            </div>
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-300">
                {currentTrack.tag}
              </span>
              {isPlaying && (
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-pink-500 animate-pulse rounded-full" />
                  <span className="w-1 h-4 bg-amber-500 animate-bounce rounded-full" />
                  <span className="w-1 h-2 bg-purple-500 animate-pulse rounded-full" />
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {currentTrack.title}
            </h4>
            <p className="text-[10px] text-pink-700/80 truncate font-medium">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            className="p-2.5 rounded-full bg-gradient-to-r from-pink-600 to-amber-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          {/* Toggle Tracklist Drawer */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-2 rounded-2xl bg-purple-100 hover:bg-purple-200 border border-purple-300 text-xs font-bold text-purple-900 cursor-pointer transition-all shadow-sm"
          >
            {isOpen ? 'बंद करें' : 'गाने बदलें 🎵'}
          </button>
        </div>
      </div>

      {/* Expanded Tracklist Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-3 rounded-2xl bg-white/95 border border-pink-300/80 backdrop-blur-xl shadow-xl space-y-2 overflow-hidden"
          >
            <div className="text-[11px] font-bold text-pink-700 px-1 flex items-center justify-between">
              <span>🎧 डायरेक्ट चलाएं (Direct Song Clips):</span>
              <span className="text-[10px] text-purple-700/80 font-medium">
                टैप करके तुरंत सुनें
              </span>
            </div>

            {TRACKS.map((t, idx) => {
              const isCurrent = currentTrackIndex === idx;
              return (
                <div
                  key={t.id}
                  onClick={() => handlePlayTrack(idx)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isCurrent && isPlaying
                      ? 'bg-pink-50 border-pink-400 shadow-[0_2px_12px_rgba(236,72,153,0.25)]'
                      : 'bg-slate-50/80 border-purple-100 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">{t.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {t.title}
                      </p>
                      <p className="text-[10px] text-slate-600 truncate">
                        {t.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                      {t.tag}
                    </span>
                    <div className="p-1.5 rounded-full bg-pink-100 text-pink-600">
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-pink-600" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-pink-600" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
