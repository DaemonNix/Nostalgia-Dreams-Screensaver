import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Bubble } from '../../types';

const Bubbles: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const requestRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize bubbles
  useEffect(() => {
    const initBubbles = () => {
      const count = 15;
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 100 + 80; // 80px to 180px
        newBubbles.push({
          id: i,
          x: Math.random() * (window.innerWidth - size),
          y: Math.random() * (window.innerHeight - size),
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          size,
          color: `hsla(${Math.random() * 360}, 70%, 60%, 0.3)`
        });
      }
      setBubbles(newBubbles);
    };

    initBubbles();
  }, []);

  // Animation Loop
  const animate = useCallback(() => {
    setBubbles(prevBubbles => {
      return prevBubbles.map(b => {
        let { x, y, vx, vy, size } = b;
        
        x += vx;
        y += vy;

        // Wall collision
        if (x <= 0 || x + size >= window.innerWidth) vx *= -1;
        if (y <= 0 || y + size >= window.innerHeight) vy *= -1;

        // Keep within bounds strictly
        x = Math.max(0, Math.min(x, window.innerWidth - size));
        y = Math.max(0, Math.min(y, window.innerHeight - size));

        return { ...b, x, y, vx, vy };
      });
    });
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <div 
      ref={containerRef}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-black overflow-hidden cursor-none select-none"
    >
      {/* Background wallpaper hint */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://picsum.photos/1920/1080')] bg-cover bg-center pointer-events-none filter blur-sm"></div>

      {bubbles.map(b => (
        <div
          key={b.id}
          style={{
            transform: `translate(${b.x}px, ${b.y}px)`,
            width: b.size,
            height: b.size,
            boxShadow: `
              inset 0 0 20px rgba(255, 255, 255, 0.5),
              inset 10px 10px 30px rgba(255, 255, 255, 0.2),
              inset -10px -10px 30px rgba(0, 0, 0, 0.2),
              0 15px 35px rgba(0, 0, 0, 0.2)
            `,
          }}
          className="absolute rounded-full backdrop-blur-[3px] border border-white/20"
        >
          {/* Reflection highlight */}
          <div className="absolute top-[15%] left-[15%] w-[30%] h-[20%] rounded-full bg-gradient-to-b from-white/80 to-transparent transform -rotate-45 filter blur-[2px]"></div>
          {/* Bottom sheen */}
          <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[10%] rounded-full bg-white/10 transform -rotate-45 filter blur-[4px]"></div>
        </div>
      ))}
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/20 text-sm animate-pulse">
        Click anywhere to exit
      </div>
    </div>
  );
};

export default Bubbles;
