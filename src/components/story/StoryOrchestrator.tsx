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
  const [activeTrack, setActiveTrack] = useState<BGMTrack>('bday_song');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(bdayAudio.getVoiceEnabled());
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);
  const [isReadingVoice, setIsReadingVoice] = useState<boolean>(false);

  const currentChapter: ChapterData = CHAPTERS[currentIdx];

  // Auto-speak chapter text on slide change if voice is enabled
  useEffect(() => {
    if (voiceEnabled && !isMuted) {
      setIsReadingVoice(true);
      const textToRead = `${currentChapter.title}. ${currentChapter.emotionalDialogue}`;
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
      bdayAudio.speak(`${currentChapter.title}. ${currentChapter.emotionalDialogue}`);
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
    bdayAudio.playChime(784);
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
        // Play specialized step sound per realm
        bdayAudio.playStepSound(nextChapter.realmId, nextIdx);
      }

      // If reaching Chapter 21 (Grand Finale)
      if (nextChapter.id === 21) {
        confetti({
          particleCount: 180,
          spread: 120,
          origin: { y: 0.4 },
          colors: ['#fbbf24', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
        });
        bdayAudio.speak('Happy Birthday Rukmani! Happy Birthday meri pyari Ruhi!');
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
    bdayAudio.playChime(option.isCorrect ? 880 : 660);

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f472b6', '#c084fc', '#fbbf24'],
    });

    if (voiceEnabled && !isMuted) {
      bdayAudio.speak(option.reaction);
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
                          ? 'bg-purple-600/40 border-pink-400 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
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
                      className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/40 text-center"
                    >
                      <p className="text-xs sm:text-sm font-bold text-pink-200">
                        {selected.reaction}
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
                  ? 'border-4 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.5)]'
                  : 'border-2 border-purple-400/50'
              }`}
            >
              {/* Subtle top crown for Boss Lady */}
              {isBoss && (
                <div className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/70 border border-amber-300/60 shadow-lg">
                  <Crown className="w-5 h-5 text-amber-300" />
                </div>
              )}

              <img
                src={imgSrc}
                alt={currentChapter.imageAlt || 'Ruhi Photo'}
                className="w-56 h-72 sm:w-64 sm:h-80 object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {currentChapter.imageCaption && (
              <p className="text-xs sm:text-sm text-center text-amber-200/90 font-medium mt-3 px-4 py-1.5 rounded-full bg-slate-900/50 border border-amber-400/30">
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
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-28 h-28 rounded-full border-4 border-dashed border-pink-400/60 flex items-center justify-center p-3 mb-6 shadow-[0_0_35px_rgba(236,72,153,0.5)]"
            >
              <Compass className="w-14 h-14 text-pink-300" />
            </motion.div>
            <p className="text-sm sm:text-base text-purple-200 mb-6 font-medium">
              अगले आयाम की जादुई ऊर्जा तैयार है... क्या तुम तैयार हो?
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-base shadow-[0_0_30px_rgba(236,72,153,0.6)] cursor-pointer hover:scale-105 transition-transform"
            >
              🚀 अगले आयाम में प्रवेश करें (Enter Next Realm)
            </button>
          </div>
        );

      case 'ambient_garden':
        return (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto my-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl mb-4"
            >
              🌸✨🌿
            </motion.div>
            <p className="text-sm sm:text-base text-emerald-200 leading-relaxed px-4 py-3 rounded-2xl bg-emerald-950/30 border border-emerald-400/30 backdrop-blur-md">
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
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 border border-amber-400/30 backdrop-blur-md text-left text-xs sm:text-sm text-amber-100 flex items-start gap-3 shadow-sm"
              >
                <div className="p-1 rounded-full bg-amber-500/20 text-amber-300 mt-0.5 shrink-0">
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
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl sm:text-7xl mb-4"
            >
              🎉🎂👑
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)] mb-3">
              HAPPY BIRTHDAY RUHI!
            </h2>
            <p className="text-sm sm:text-base text-amber-200/90 max-w-md leading-relaxed">
              आज का दिन, आज की रात, और आने वाला हर साल तुम्हारे लिए ढेर सारी
              खुशियाँ, अपार सफलता और अनंत मुस्कान लेकर आए!
            </p>
            <button
              onClick={() => {
                bdayAudio.playChime(1046.5);
                bdayAudio.speak('Happy Birthday dear Ruhi! May all your dreams come true!');
                confetti({
                  particleCount: 220,
                  spread: 120,
                  origin: { y: 0.5 },
                });
              }}
              className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(251,191,36,0.6)] cursor-pointer hover:scale-105 transition-transform"
            >
              ✨ फिर से आतिशबाज़ी और गाना बजाएं ✨
            </button>
          </div>
        );

      case 'eternal_signoff':
        return (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-4">
            <div className="w-20 h-20 rounded-full border-2 border-pink-400/50 bg-pink-500/10 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(236,72,153,0.4)]">
              <Heart className="w-10 h-10 text-pink-400 fill-pink-400 animate-pulse" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-amber-200 mb-2">
              सदा खुश रहो मेरी जान!
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-sm mb-6">
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
                  bdayAudio.playChime(880);
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
      <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-1">
        {/* Realm Indicator Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-purple-500/30 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[11px] sm:text-xs font-semibold text-purple-200">
            {currentChapter.realmName}
          </span>
          <span className="text-[10px] text-purple-400/70 hidden sm:inline">
            • {currentChapter.realmTag}
          </span>
        </div>

        {/* Music Track Controls & Voice Narration Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Track Switcher Pills */}
          <div className="flex items-center p-1 rounded-full bg-slate-950/70 border border-purple-500/30 backdrop-blur-md">
            <button
              onClick={() => handleChangeTrack('bday_song')}
              title="Happy Birthday Melody"
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeTrack === 'bday_song'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              🎂 Bday Song
            </button>
            <button
              onClick={() => handleChangeTrack('starlight')}
              title="Starlight Piano"
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeTrack === 'starlight'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              ✨ Piano
            </button>
            <button
              onClick={() => handleChangeTrack('royal')}
              title="Royal Symphony"
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeTrack === 'royal'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              👑 Royal
            </button>
          </div>

          {/* Music Play/Pause */}
          <button
            onClick={handleTogglePlayMusic}
            title={isPlayingMusic ? 'Pause Music' : 'Play Music'}
            className="p-2 rounded-full bg-slate-900/70 border border-purple-500/30 text-purple-200 hover:text-white cursor-pointer transition-all hover:scale-105"
          >
            {isPlayingMusic ? (
              <Pause className="w-3.5 h-3.5 text-pink-300" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-300" />
            )}
          </button>

          {/* Voice Narration Toggle */}
          <button
            onClick={handleToggleVoice}
            title={voiceEnabled ? 'Voiceover Enabled (Click to disable)' : 'Voiceover Disabled (Click to enable)'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all cursor-pointer ${
              voiceEnabled
                ? 'bg-pink-600/30 border-pink-400 text-pink-200 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
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
            className="p-2 rounded-full bg-slate-900/60 border border-purple-500/30 text-purple-200 hover:text-white backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            )}
          </button>
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
            <p className="text-xs sm:text-sm font-medium text-pink-300/80 mb-3 tracking-wide">
              {currentChapter.subtitle}
            </p>

            {/* Emotional Brother Dialogue Card with Voice Button */}
            <div className="w-full max-w-xl p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-purple-400/20 backdrop-blur-md shadow-sm mb-4 relative group">
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-sans italic pr-8">
                "{currentChapter.emotionalDialogue}"
              </p>

              {/* Listen to Voice Narration Button */}
              <button
                onClick={handleSpeakCurrent}
                title="मोहित का यह संदेश आवाज़ में सुनें"
                className={`absolute top-3 right-3 p-1.5 rounded-full transition-all cursor-pointer ${
                  isReadingVoice
                    ? 'bg-pink-600 text-white animate-bounce'
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
                    ? 'w-6 bg-gradient-to-r from-pink-400 to-amber-300'
                    : 'w-2 bg-purple-700/50 hover:bg-purple-500/70'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIdx === CHAPTERS.length - 1}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-[0_0_15px_rgba(236,72,153,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
