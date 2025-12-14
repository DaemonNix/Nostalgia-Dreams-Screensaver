import React, { useEffect, useState } from 'react';

const SolarSystem: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation start
    setTimeout(() => setMounted(true), 100);
  }, []);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black overflow-hidden flex items-center justify-center cursor-none select-none"
    >
      {/* Starfield Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
      
      {/* Sun Glow */}
      <div className={`transition-all duration-[3s] ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-orange-400 shadow-[0_0_60px_20px_rgba(251,146,60,0.6)] z-10"></div>
      </div>

      {/* Orbit Container */}
      <div className={`relative w-[800px] h-[800px] transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Mercury Orbit */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] border border-white/10 rounded-full animate-[spin_4s_linear_infinite]">
          <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-400 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)]"></div>
        </div>

        {/* Venus Orbit */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-white/10 rounded-full animate-[spin_7s_linear_infinite]">
           <div className="absolute top-0 left-1/2 w-6 h-6 bg-yellow-600 rounded-full shadow-lg"></div>
        </div>

        {/* Earth Orbit */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full animate-[spin_12s_linear_infinite]">
           <div className="absolute top-1/2 -left-4 w-7 h-7 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden">
             {/* Continents (fake) */}
             <div className="absolute top-1 left-1 w-3 h-4 bg-green-500 rounded-full opacity-60"></div>
           </div>
           {/* Moon */}
           <div className="absolute top-1/2 -left-4 w-[60px] h-[60px] animate-[spin_2s_linear_infinite]">
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-200 rounded-full"></div>
           </div>
        </div>

        {/* Mars Orbit */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] border border-white/10 rounded-full animate-[spin_20s_linear_infinite]">
           <div className="absolute bottom-0 right-1/2 w-5 h-5 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
        </div>
        
         {/* Jupiter Orbit (Partial) */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/5 rounded-full animate-[spin_50s_linear_infinite]">
           <div className="absolute top-[15%] right-[15%] w-16 h-16 bg-amber-700/80 rounded-full shadow-2xl backdrop-blur-sm"></div>
        </div>

      </div>

      <div className="absolute bottom-10 text-white/30 text-xs tracking-[0.3em] font-light">
        ORBITAL MECHANICS // PREMIUM PACK
      </div>
    </div>
  );
};

export default SolarSystem;
