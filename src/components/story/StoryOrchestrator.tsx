import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Crown,
  Compass,
  PartyPopper,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Music,
  Play,
  Pause,
  Zap,
} from 'lucide-react';
import { CHAPTERS, type ChapterData, type QuizOption } from '../../data/chaptersData';
import { bdayAudio, type BGMTrack } from '../../audio/birthdayAudio';

// Subcomponents
import { CountdownLock } from './CountdownLock';
import { InteractiveCake } from './InteractiveCake';
import { BalloonPop } from './BalloonPop';
import { SkyLantern } from './SkyLantern';
import { LetterTypewriter } from './LetterTypewriter';
import { WaxSealStamp } from './WaxSealStamp';
import { AttitudeScanner } from './AttitudeScanner';
import { InfinityDuo } from './InfinityDuo';

// Image imports
import ruhiInnocentImg from '../../assets/images/ruhi_innocent.jpg';
import ruhiBossImg from '../../assets/images/ruhi_boss.jpg';
import mohitImg from '../../assets/images/mohit_jain.png';

interface StoryOrchestratorProps {
  onRealmChange: (realmId: 1 | 2 | 3 | 4) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StoryOrchestrator: React.FC<StoryOrchestratorProps> = ({
  onRealmChange,
  isMuted,
  onToggleMute,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<
    Record<number, QuizOption>
  >({});
  const [activeTrack, setActiveTrack] = useState<BGMTrack>('party_remix');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(bdayAudio.getVoiceEnabled());
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);
  const [isReadingVoice, setIsReadingVoice] = useState<boolean>(false);
  const [partyMode, setPartyMode] = useState<boolean>(true); // Fully Energetic Party Mode ON!

  const currentChapter: ChapterData = CHAPTERS[currentIdx];

  // Auto-speak chapter text on slide change with energetic enthusiasm
  useEffect(() => {
    if (voiceEnabled && !isMuted) {
      setIsReadingVoice(true);
      const energeticIntro =
        currentIdx === 0
          ? 'Happy Birthday Ruhi! Are you ready for the grand wonder-verse?'
          : currentIdx === 5
          ? 'Make way for the Boss Lady! Absolute royalty!'
          : currentIdx === 10
          ? 'Welcome to the Enchanted Garden! Time to cut the cake!'
          : currentIdx === 17
          ? 'The legendary brother-sister duo! Mohit and Ruhi forever!'
          : currentIdx === 20
          ? 'Happy Birthday Ruhi! Supernova Fireworks Celebration!'
          : '';

      const textToRead = `${energeticIntro ? energeticIntro + ' ' : ''}${currentChapter.title}. ${currentChapter.emotionalDialogue}`;
      bdayAudio.speak(textToRead, () => {
        setIsReadingVoice(false);
      });
    } else {
      bdayAudio.stopSpeaking();
      setIsReadingVoice(false);
    }
  }, [currentIdx, voiceEnabled, isMuted]);

  const handleToggleVoice = () => {
    const nextVoice = bdayAudio.toggleVoice();
    setVoiceEnabled(nextVoice);
    if (!nextVoice) {
      bdayAudio.stopSpeaking();
      setIsReadingVoice(false);
    } else {
      bdayAudio.speak(`Happy Birthday Ruhi! ${currentChapter.title}`);
    }
  };

  const handleTogglePlayMusic = () => {
    if (isPlayingMusic) {
      bdayAudio.stopBackgroundMelody();
      setIsPlayingMusic(false);
    } else {
      bdayAudio.startBackgroundMelody();
      setIsPlayingMusic(true);
    }
  };

  const handleChangeTrack = (track: BGMTrack) => {
    setActiveTrack(track);
    bdayAudio.setTrack(track);
    setIsPlayingMusic(true);
    bdayAudio.playAirHorn();
  };

  const handleAirHornBlast = () => {
    bdayAudio.playAirHorn();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff007f', '#00f0ff', '#ffe600', '#7000ff'],
    });
  };

  const handleCrowdCheerBlast = () => {
    bdayAudio.playCrowdCheer();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#ec4899', '#8b5cf6', '#10b981'],
    });
  };

  const handleBassDropBlast = () => {
    bdayAudio.playBassDrop();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#a855f7', '#f43f5e'],
    });
  };

  const handleSingRuhiSong = () => {
    bdayAudio.playAirHorn();
    bdayAudio.speak('Happy Birthday to you, Happy Birthday to you, Happy Birthday dear Ruhi! Happy Birthday to you! May God bless you always!');
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.4 },
      colors: ['#f43f5e', '#ec4899', '#fbbf24', '#38bdf8', '#a855f7'],
    });
  };

  const handleSpeakCurrent = () => {
    setIsReadingVoice(true);
    bdayAudio.speak(
      `${currentChapter.title}. ${currentChapter.emotionalDialogue}`,
      () => setIsReadingVoice(false)
    );
  };

  const handleNext = () => {
    if (currentIdx < CHAPTERS.length - 1) {
      const nextIdx = currentIdx + 1;
      const nextChapter = CHAPTERS[nextIdx];

      // Check if crossing realm border
      if (nextChapter.realmId !== currentChapter.realmId) {
        bdayAudio.playWarp();
        onRealmChange(nextChapter.realmId);
      } else {
        bdayAudio.playStepSound(nextChapter.realmId, nextIdx);
      }

      // Quick celebratory confetti burst on every step in party mode
      if (partyMode) {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#f472b6', '#c084fc', '#38bdf8', '#fbbf24'],
        });
      }

      // If reaching Chapter 21 (Grand Finale)
      if (nextChapter.id === 21) {
        bdayAudio.playCrowdCheer();
        confetti({
          particleCount: 250,
          spread: 140,
          origin: { y: 0.3 },
          colors: ['#fbbf24', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
        });
      }

      setCurrentIdx(nextIdx);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      const prevChapter = CHAPTERS[prevIdx];
      if (prevChapter.realmId !== currentChapter.realmId) {
        onRealmChange(prevChapter.realmId);
      }
      bdayAudio.playStepSound(prevChapter.realmId, prevIdx);
      setCurrentIdx(prevIdx);
    }
  };

  const handleJumpToChapter = (idx: number) => {
    const targetChapter = CHAPTERS[idx];
    if (targetChapter.realmId !== currentChapter.realmId) {
      bdayAudio.playWarp();
      onRealmChange(targetChapter.realmId);
    } else {
      bdayAudio.playStepSound(targetChapter.realmId, idx);
    }
    setCurrentIdx(idx);
  };

  const handleSelectQuizOption = (chapterId: number, option: QuizOption) => {
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [chapterId]: option,
    }));
    bdayAudio.playAirHorn();

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f472b6', '#c084fc', '#fbbf24'],
    });

    if (voiceEnabled && !isMuted) {
      bdayAudio.speak(`Superb Ruhi! ${option.reaction}`);
    }
  };

  const renderChapterBody = () => {
    switch (currentChapter.type) {
      case 'countdown':
        return <CountdownLock onUnlock={handleNext} />;

      case 'quiz':
      case 'superpower_poll': {
        const quiz = currentChapter.quiz;
        const selected = selectedQuizAnswers[currentChapter.id];
        return (
          <div className="max-w-xl mx-auto w-full my-4 flex flex-col items-center">
            {quiz && (
              <div className="w-full space-y-3">
                <p className="text-center font-bold text-amber-200 text-sm sm:text-base mb-4">
                  ❓ {quiz.question}
                </p>

                {quiz.options.map((opt) => {
                  const isChosen = selected?.id === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleSelectQuizOption(currentChapter.id, opt)
                      }
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        isChosen
                          ? 'bg-purple-600/40 border-pink-400 text-white shadow-[0_0_25px_rgba(236,72,153,0.5)]'
                          : 'bg-slate-900/60 border-purple-500/30 text-purple-100 hover:bg-purple-900/30'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-medium">
                        {opt.label}
                      </span>
                      {isChosen && (
                        <Sparkles className="w-5 h-5 text-amber-300 shrink-0 ml-2" />
                      )}
                    </motion.button>
                  );
                })}

                {/* Reaction banner */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-pink-500/25 to-purple-500/25 border border-pink-400/50 text-center shadow-lg"
                    >
                      <p className="text-xs sm:text-sm font-bold text-pink-200">
                        🎉 {selected.reaction}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        );
      }

      case 'photo_reveal': {
        const imgSrc =
          currentChapter.image === 'ruhi_innocent'
            ? ruhiInnocentImg
            : currentChapter.image === 'ruhi_boss'
            ? ruhiBossImg
            : mohitImg;

        const isBoss = currentChapter.image === 'ruhi_boss';

        return (
          <div className="flex flex-col items-center justify-center max-w-md mx-auto my-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`relative rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.6)] ${
                isBoss
                  ? 'border-4 border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.6)] ring-4 ring-pink-500/30'
                  : 'border-2 border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.4)]'
              }`}
            >
              {/* Subtle top crown for Boss Lady */}
              {isBoss && (
                <div className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/80 border border-amber-300 shadow-xl">
                  <Crown className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
              )}

              <img
                src={imgSrc}
                alt={currentChapter.imageAlt || 'Ruhi Photo'}
                className="w-56 h-72 sm:w-64 sm:h-80 object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {currentChapter.imageCaption && (
              <p className="text-xs sm:text-sm text-center text-amber-200 font-semibold mt-3 px-4 py-1.5 rounded-full bg-slate-900/60 border border-amber-400/40 shadow-md">
                {currentChapter.imageCaption}
              </p>
            )}
          </div>
        );
      }

      case 'interactive_scanner':
        return <AttitudeScanner />;

      case 'warp_portal':
        return (
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-6">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.15, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="w-28 h-28 rounded-full border-4 border-dashed border-pink-400 flex items-center justify-center p-3 mb-6 shadow-[0_0_45px_rgba(236,72,153,0.7)]"
            >
              <Compass className="w-14 h-14 text-pink-300 animate-pulse" />
            </motion.div>
            <p className="text-sm sm:text-base text-purple-200 mb-6 font-bold">
              ⚡ अगले आयाम की सुपर ऊर्जा तैयार है... क्या तुम तैयार हो?
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-base shadow-[0_0_35px_rgba(236,72,153,0.7)] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              🚀 अगले आयाम में प्रवेश करें (Enter Next Realm)
            </button>
          </div>
        );

      case 'ambient_garden':
        return (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto my-6">
            <motion.div
              animate={{ y: [0, -12, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl mb-4"
            >
              🌸✨🌿
            </motion.div>
            <p className="text-sm sm:text-base text-emerald-200 leading-relaxed px-4 py-3 rounded-2xl bg-emerald-950/40 border border-emerald-400/40 backdrop-blur-md shadow-lg font-medium">
              यहाँ का हर फूल, हर खुशबू सिर्फ एक ही बात कह रही है: हमारी प्यारी
              रूही का आज जन्मदिन है! इस उपवन की जादुई तितलियाँ तुम्हारे लिए खुशियों
              के हार लेकर आई हैं।
            </p>
          </div>
        );

      case 'cake_ceremony':
        return <InteractiveCake onComplete={handleNext} />;

      case 'balloon_pop':
        return currentChapter.balloons ? (
          <BalloonPop balloons={currentChapter.balloons} />
        ) : null;

      case 'brother_promises':
        return currentChapter.promises ? (
          <div className="max-w-xl mx-auto w-full my-4 space-y-3">
            {currentChapter.promises.map((promise, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-amber-400/40 backdrop-blur-md text-left text-xs sm:text-sm text-amber-100 flex items-start gap-3 shadow-md"
              >
                <div className="p-1 rounded-full bg-amber-500/25 text-amber-300 mt-0.5 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>{promise}</span>
              </motion.div>
            ))}
          </div>
        ) : null;

      case 'sky_lantern':
        return <SkyLantern />;

      case 'infinity_duo':
        return <InfinityDuo />;

      case 'typewriter_letter':
        return currentChapter.letterParagraphs ? (
          <LetterTypewriter paragraphs={currentChapter.letterParagraphs} />
        ) : null;

      case 'wax_seal':
        return <WaxSealStamp onStamped={handleNext} />;

      case 'grand_finale':
        return (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-6xl sm:text-7xl mb-4"
            >
              🎉🎂👑
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] mb-3">
              HAPPY BIRTHDAY RUHI!
            </h2>
            <p className="text-sm sm:text-base text-amber-200 font-medium max-w-md leading-relaxed">
              आज का दिन, आज की रात, और आने वाला हर साल तुम्हारे लिए ढेर सारी
              खुशियाँ, अपार सफलता और अनंत मुस्कान लेकर आए!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  bdayAudio.playAirHorn();
                  bdayAudio.speak('Happy Birthday dear Ruhi! Let us celebrate big time!');
                  confetti({
                    particleCount: 250,
                    spread: 140,
                    origin: { y: 0.5 },
                  });
                }}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-extrabold text-sm sm:text-base shadow-[0_0_35px_rgba(251,191,36,0.7)] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                ✨ फिर से आतिशबाज़ी और एयर हॉर्न बजाएं ✨
              </button>
            </div>
          </div>
        );

      case 'eternal_signoff':
        return (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-4">
            <div className="w-20 h-20 rounded-full border-2 border-pink-400 bg-pink-500/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(236,72,153,0.5)]">
              <Heart className="w-10 h-10 text-pink-400 fill-pink-400 animate-pulse" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-amber-200 mb-2">
              सदा खुश रहो मेरी जान!
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-sm mb-6 font-medium">
              "तुम्हारा भाई मोहित जैन हमेशा तुम्हारे साथ, तुम्हारे पीछे, तुम्हारी
              हर खुशी के लिए खड़ा है।"
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleJumpToChapter(0)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600/40 border border-purple-400/50 text-purple-100 hover:bg-purple-600/60 font-semibold text-xs sm:text-sm cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4 text-purple-300" />
                <span>शुरुआत से दोबारा देखें (Replay)</span>
              </button>

              <button
                onClick={() => {
                  bdayAudio.playAirHorn();
                  bdayAudio.speak('Happy Birthday Rukmani, Mohit bhaiya loves you so much!');
                  alert('🎉 यह जादुई लिंक रूही के साथ शेयर करें: https://ruhi-birthday-magic.vercel.app');
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-amber-500 text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-md hover:scale-105 transition-transform"
              >
                <PartyPopper className="w-4 h-4 text-amber-200" />
                <span>रूही को समर्पित 💖</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between z-10 px-4 sm:px-6 md:px-8 py-4 pb-36 select-none max-w-4xl mx-auto w-full">
      {/* Top Header Bar: Track Selector, Realm Badge, Voice Toggle, Audio Toggle */}
      <header className="w-full flex flex-col items-center gap-2.5 pt-1 pb-1">
        {/* Row 1: Realm Badge & Master Audio/Voice Controls */}
        <div className="w-full flex items-center justify-between gap-2">
          {/* Realm Indicator Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-purple-500/40 backdrop-blur-md shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] sm:text-xs font-bold text-purple-200">
              {currentChapter.realmName}
            </span>
            <span className="text-[10px] text-purple-400/80 hidden sm:inline">
              • {currentChapter.realmTag}
            </span>
          </div>

          {/* Quick Party Mode & Controls */}
          <div className="flex items-center gap-2">
            {/* Party Mode Energy Pill */}
            <button
              onClick={() => {
                setPartyMode(!partyMode);
                bdayAudio.playAirHorn();
              }}
              title="Toggle 100% Party Energy"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                partyMode
                  ? 'bg-gradient-to-r from-pink-600 to-amber-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)] animate-pulse'
                  : 'bg-slate-900/60 text-slate-400 border border-purple-500/20'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
              <span>{partyMode ? '🔥 100% PARTY' : 'पार्टी मोड'}</span>
            </button>

            {/* Voice Narration Toggle */}
            <button
              onClick={handleToggleVoice}
              title={voiceEnabled ? 'Voiceover Enabled' : 'Voiceover Disabled'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all cursor-pointer ${
                voiceEnabled
                  ? 'bg-pink-600/40 border-pink-400 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                  : 'bg-slate-900/60 border-purple-500/30 text-slate-400'
              }`}
            >
              {voiceEnabled ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
                  <span className="hidden sm:inline">आवाज़ चालू</span>
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">आवाज़ बंद</span>
                </>
              )}
            </button>

            {/* Master Mute Toggle */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 rounded-full bg-slate-900/70 border border-purple-500/30 text-purple-200 hover:text-white backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: 🎧 DJ PARTY SOUNDBOARD (Air Horn, Cheer, Bass Drop, Ruhi Song) */}
        <div className="w-full flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-x-auto scrollbar-none">
          {/* Track Switcher Pills */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleChangeTrack('party_remix')}
              title="Energetic Party Remix"
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                activeTrack === 'party_remix'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm ring-1 ring-pink-300'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              🔥 Party Remix
            </button>
            <button
              onClick={() => handleChangeTrack('bday_song')}
              title="Happy Birthday Melody"
              className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeTrack === 'bday_song'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              🎂 Song
            </button>
            <button
              onClick={() => handleChangeTrack('royal')}
              title="Royal Symphony"
              className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeTrack === 'royal'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              👑 Royal
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={handleTogglePlayMusic}
              title={isPlayingMusic ? 'Pause Music' : 'Play Music'}
              className="p-1.5 rounded-full bg-slate-900 border border-purple-500/40 text-purple-200 hover:text-white cursor-pointer"
            >
              {isPlayingMusic ? (
                <Pause className="w-3 h-3 text-pink-300" />
              ) : (
                <Play className="w-3 h-3 text-emerald-300" />
              )}
            </button>
          </div>

          {/* Interactive DJ Sound Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-purple-500/30">
            <button
              onClick={handleAirHornBlast}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-pink-600/30 hover:bg-pink-600 text-pink-200 hover:text-white border border-pink-400/40 text-[10px] sm:text-xs font-black cursor-pointer transition-all active:scale-90"
              title="DJ Air Horn Blast"
            >
              <span>📢 पों-पों!</span>
            </button>

            <button
              onClick={handleCrowdCheerBlast}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-400/40 text-[10px] sm:text-xs font-black cursor-pointer transition-all active:scale-90"
              title="Crowd Cheer & Applause"
            >
              <span>🥳 जयकार!</span>
            </button>

            <button
              onClick={handleBassDropBlast}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-400/40 text-[10px] sm:text-xs font-black cursor-pointer transition-all active:scale-90"
              title="Sub Bass Drop"
            >
              <span>⚡ बेस ड्रॉप!</span>
            </button>

            <button
              onClick={handleSingRuhiSong}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-extrabold text-[10px] sm:text-xs cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-90"
              title="Sing Happy Birthday Ruhi"
            >
              <Music className="w-3 h-3 animate-spin" />
              <span>रूही सॉन्ग 🎤</span>
            </button>
          </div>
        </div>
      </header>

      {/* Progress Line */}
      <div className="w-full bg-purple-950/40 rounded-full h-1.5 my-2.5 overflow-hidden border border-purple-800/30">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIdx + 1) / CHAPTERS.length) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Chapter Content Frame */}
      <main className="flex-1 flex flex-col items-center justify-center my-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Chapter Header Chip */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-400/30 text-purple-200 text-[10px] sm:text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentChapter.badge}</span>
              <span className="text-purple-400/60">•</span>
              <span>
                {currentIdx + 1} / {CHAPTERS.length}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-200 max-w-2xl leading-tight mb-2">
              {currentChapter.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-semibold text-pink-300 mb-3 tracking-wide">
              {currentChapter.subtitle}
            </p>

            {/* Emotional Brother Dialogue Card with Voice Button */}
            <div className="w-full max-w-xl p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-purple-400/30 backdrop-blur-md shadow-md mb-4 relative group">
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-sans italic pr-8">
                "{currentChapter.emotionalDialogue}"
              </p>

              {/* Listen to Voice Narration Button */}
              <button
                onClick={handleSpeakCurrent}
                title="मोहित का यह संदेश आवाज़ में सुनें"
                className={`absolute top-3 right-3 p-1.5 rounded-full transition-all cursor-pointer ${
                  isReadingVoice
                    ? 'bg-pink-600 text-white animate-bounce shadow-[0_0_15px_rgba(236,72,153,0.7)]'
                    : 'bg-slate-800/80 hover:bg-pink-600/50 text-pink-300 hover:text-white'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dynamic Interactive Component for this Chapter */}
            <div className="w-full">{renderChapterBody()}</div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Floating Navigation Dock */}
      <footer className="fixed bottom-4 inset-x-0 mx-auto max-w-lg px-4 z-50 pointer-events-auto">
        <div className="p-2 sm:p-3 rounded-3xl bg-slate-950/85 border border-purple-500/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-purple-200 hover:text-white bg-slate-900/80 hover:bg-purple-900/50 disabled:opacity-30 disabled:cursor-not-allowed border border-purple-500/20 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">पिछला</span>
          </button>

          {/* Chapter Quick Selector / Dot tracker */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[180px] sm:max-w-[240px] px-1 py-0.5 scrollbar-none">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => handleJumpToChapter(idx)}
                title={`Chapter ${ch.id}: ${ch.title}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIdx
                    ? 'w-6 bg-gradient-to-r from-pink-400 to-amber-300 shadow-[0_0_10px_rgba(236,72,153,0.8)]'
                    : 'w-2 bg-purple-700/50 hover:bg-purple-500/70'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIdx === CHAPTERS.length - 1}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 shadow-[0_0_20px_rgba(236,72,153,0.5)] disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>
              {currentIdx === CHAPTERS.length - 1 ? 'पूर्ण 🎉' : 'अगला'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
