import React, { useState, useEffect } from 'react';
import { CosmicSkyCanvas } from './components/canvas/CosmicSkyCanvas';
import { StoryOrchestrator } from './components/story/StoryOrchestrator';
import { bdayAudio } from './audio/birthdayAudio';

export const App: React.FC = () => {
  const [realmId, setRealmId] = useState<1 | 2 | 3 | 4>(1);
  const [isMuted, setIsMuted] = useState<boolean>(bdayAudio.getMuted());
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Initialize audio on first click anywhere (browser autoplay compliance)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (!isMuted) {
          bdayAudio.startBackgroundMelody();
        }
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted, isMuted]);

  const handleToggleMute = () => {
    const muted = bdayAudio.toggleMute();
    setIsMuted(muted);
  };

  const getRealmBackgroundClass = (id: 1 | 2 | 3 | 4) => {
    switch (id) {
      case 1:
        // Starlight Gate: Luminous lilac, pearl aurora & celestial pink
        return 'from-[#fbf7ff] via-[#f5f3ff] to-[#fce7f3]';
      case 2:
        // Cyber Royal Citadel: Rose quartz, champagne & soft cyan tint
        return 'from-[#fff1f2] via-[#faf5ff] to-[#f0fdfa]';
      case 3:
        // Enchanted Dream Garden: Morning dew meadow, peach blossom & petal pink
        return 'from-[#f0fdf4] via-[#fff7ed] to-[#fdf2f8]';
      case 4:
        // Golden Hall of Eternity: Royal ivory, golden champagne & warm honey
        return 'from-[#fffbeb] via-[#fef3c7] to-[#fff1f2]';
      default:
        return 'from-[#fbf7ff] via-[#f5f3ff] to-[#fce7f3]';
    }
  };

  const getRealmGlowOverlay = (id: 1 | 2 | 3 | 4) => {
    switch (id) {
      case 1:
        return 'radial-gradient(ellipse at 50% 20%, rgba(216, 180, 254, 0.5) 0%, rgba(251, 247, 255, 0) 70%)';
      case 2:
        return 'radial-gradient(ellipse at 50% 20%, rgba(244, 114, 182, 0.4) 0%, rgba(255, 241, 242, 0) 70%)';
      case 3:
        return 'radial-gradient(ellipse at 50% 20%, rgba(52, 211, 153, 0.4) 0%, rgba(240, 253, 244, 0) 70%)';
      case 4:
        return 'radial-gradient(ellipse at 50% 20%, rgba(251, 191, 36, 0.45) 0%, rgba(255, 251, 235, 0) 70%)';
      default:
        return 'none';
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${getRealmBackgroundClass(
        realmId
      )} transition-colors duration-1000 relative overflow-x-clip text-slate-800 font-sans`}
    >
      {/* Ambient Radial Nebula Highlight */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{ background: getRealmGlowOverlay(realmId) }}
      />

      {/* Dynamic Realm Canvas (Particles, Stars, Fireflies, Gold Sparkles) */}
      <CosmicSkyCanvas realmId={realmId} />

      {/* 22-Chapter Story Orchestrator */}
      <StoryOrchestrator
        onRealmChange={setRealmId}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    </div>
  );
};

export default App;
