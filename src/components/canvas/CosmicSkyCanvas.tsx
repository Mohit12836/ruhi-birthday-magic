import React, { useEffect, useRef } from 'react';

interface CosmicSkyCanvasProps {
  realmId: 1 | 2 | 3 | 4;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
}

export const CosmicSkyCanvas: React.FC<CosmicSkyCanvasProps> = ({ realmId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    let particles: Particle[] = [];

    const getRealmColors = (realm: 1 | 2 | 3 | 4): string[] => {
      switch (realm) {
        case 1: // Starlight Gate: Vivid purple, fuchsia, royal blue, rose, gold
          return ['#9333ea', '#c026d3', '#2563eb', '#e11d48', '#d97706'];
        case 2: // Cyber Citadel: Electric cyan, fuchsia, indigo, rose, gold
          return ['#0284c7', '#d946ef', '#4f46e5', '#e11d48', '#f59e0b'];
        case 3: // Enchanted Garden: Emerald, mint, rose pink, warm amber, violet
          return ['#059669', '#10b981', '#db2777', '#d97706', '#7c3aed'];
        case 4: // Hall of Eternity: Rich gold, amber, deep rose, royal purple, cyan
          return ['#d97706', '#b45309', '#e11d48', '#9333ea', '#0284c7'];
        default:
          return ['#9333ea', '#d97706', '#e11d48'];
      }
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 12000), 100);
      const colors = getRealmColors(realmId);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (realmId === 2 ? 0.8 : 0.4),
          vy: realmId === 3 ? -Math.random() * 0.6 - 0.2 : (Math.random() - 0.5) * 0.4,
          size: Math.random() * (realmId === 4 ? 3.5 : 2.5) + 1.2,
          alpha: Math.random() * 0.5 + 0.45,
          alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initParticles();

    const render = () => {
      // Clear transparently so background gradients are vibrant & never pitch black!
      ctx.clearRect(0, 0, width, height);

      // Realm 1 constellation lines between nearby stars
      if (realmId === 1) {
        ctx.lineWidth = 0.75;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              const lineAlpha = (1 - dist / 110) * 0.28;
              ctx.strokeStyle = `rgba(147, 51, 234, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.9) {
          p.alpha = 0.9;
          p.alphaSpeed = -Math.abs(p.alphaSpeed);
        } else if (p.alpha < 0.15) {
          p.alpha = 0.15;
          p.alphaSpeed = Math.abs(p.alphaSpeed);
        }

        // Screen wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (realmId === 2) {
          // Cyber glowing diamonds / tech blips
          ctx.beginPath();
          ctx.rect(p.x, p.y, p.size * 1.5, p.size * 1.5);
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
        } else if (realmId === 3) {
          // Floating fireflies with soft radial glow
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          glow.addColorStop(0, p.color);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (realmId === 4) {
          // Gold sparkle flakes
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#fbbf24';
          ctx.fill();
        } else {
          // Twinkling stars
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [realmId]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
