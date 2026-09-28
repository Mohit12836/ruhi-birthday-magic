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
        // Starlight Gate: Deep indigo/violet cosmic night
        return 'from-[#0b0618] via-[#1b0b2e] to-[#0e071e]';
      case 2:
        // Cyber Royal Citadel: Deep sapphire & electric violet
        return 'from-[#030718] via-[#081534] to-[#0e0624]';
      case 3:
        // Enchanted Dream Garden: Bioluminescent emerald & mystic teal
        return 'from-[#031510] via-[#082b20] to-[#04111d]';
      case 4:
        // Golden Hall of Eternity: Royal golden amber & obsidian
        return 'from-[#1a0f02] via-[#2c1704] to-[#160824]';
      default:
        return 'from-[#0b0618] via-[#1b0b2e] to-[#0e071e]';
    }
  };

  const getRealmGlowOverlay = (id: 1 | 2 | 3 | 4) => {
    switch (id) {
      case 1:
        return 'radial-gradient(ellipse at 50% 20%, rgba(168, 85, 247, 0.22) 0%, rgba(0, 0, 0, 0) 70%)';
      case 2:
        return 'radial-gradient(ellipse at 50% 20%, rgba(6, 182, 212, 0.22) 0%, rgba(0, 0, 0, 0) 70%)';
      case 3:
        return 'radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.22) 0%, rgba(0, 0, 0, 0) 70%)';
      case 4:
        return 'radial-gradient(ellipse at 50% 20%, rgba(245, 158, 11, 0.25) 0%, rgba(0, 0, 0, 0) 70%)';
      default:
        return 'none';
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${getRealmBackgroundClass(
        realmId
      )} transition-colors duration-1000 relative overflow-x-clip text-slate-100 font-sans`}
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
