import React, { useEffect, useState, useRef } from 'react';
import { generateDreamscapeImage } from '../../services/geminiService';
import { Sparkles, Loader2, Image as ImageIcon, Key, Lock } from 'lucide-react';

interface Props {
  onClose: () => void;
  isUnlocked: boolean; // Determines if user can input custom prompts
}

// Curated prompts for free users to cycle through
const CURATED_PROMPTS = [
  "A bioluminescent forest at night with glowing mushrooms and fireflies",
  "A cyberpunk city street in Tokyo with neon rain",
  "A peaceful zen garden with cherry blossoms falling",
  "A vaporwave sunset over a digital ocean grid",
  "An astronaut floating in a nebula with vibrant colors",
];

const AIDreamscape: React.FC<Props> = ({ onClose, isUnlocked }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(CURATED_PROMPTS[0]);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true); // Always auto-rotate for screensaver nature
  const timerRef = useRef<number | null>(null);
  const promptIndexRef = useRef(0);

  const fetchImage = async (currentPrompt: string) => {
    if (!process.env.API_KEY) {
      setError("API Key missing. Please configure your environment.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await generateDreamscapeImage(currentPrompt);
    
    if (result) {
      setImageUrl(result);
    } else {
      setError("Failed to generate dreamscape.");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch
    if (!imageUrl && !loading && !error && process.env.API_KEY) {
      fetchImage(prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoRotate && process.env.API_KEY) {
      timerRef.current = window.setInterval(() => {
        let nextPrompt = prompt;
        
        if (!isUnlocked) {
          // Cycle through curated prompts for free users
          promptIndexRef.current = (promptIndexRef.current + 1) % CURATED_PROMPTS.length;
          nextPrompt = CURATED_PROMPTS[promptIndexRef.current];
          setPrompt(nextPrompt);
        } else {
          // For premium users, we just re-generate the current prompt (conceptually a new variation)
          // or they could have a list. For now, simple re-gen.
        }
        
        fetchImage(nextPrompt);
      }, 45000); // New image every 45s
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRotate, imageUrl, isUnlocked, prompt]);

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center">
      
      {/* Background Image Layer */}
      {imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 animate-[pulse_10s_ease-in-out_infinite]"
          style={{ backgroundImage: `url(${imageUrl})`, opacity: loading ? 0.5 : 1 }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[0px]"></div>
        </div>
      )}

      {/* Control Overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              {isUnlocked ? "Dream Architect (Pro)" : "AI Dreamscape (Curated)"}
            </h2>
          </div>

          {!process.env.API_KEY && (
             <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg flex items-center space-x-3 text-red-200">
                <Key className="w-5 h-5" />
                <span>Gemini API Key is required.</span>
             </div>
          )}

          {isUnlocked ? (
            /* Premium User Input */
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40 backdrop-blur-md"
              />
              <button 
                onClick={() => fetchImage(prompt)}
                disabled={loading || !process.env.API_KEY}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 rounded-lg font-semibold transition-all flex items-center space-x-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                <span>Generate</span>
              </button>
            </div>
          ) : (
            /* Free User View */
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center space-x-3 text-gray-300">
                <Lock className="w-5 h-5 text-amber-500" />
                <span className="italic">Playing curated dream: "{prompt}"</span>
              </div>
              <div className="text-xs text-amber-500 font-bold uppercase tracking-wide">
                Premium Locked
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
               {/* Auto rotate toggle hidden for simplicity, implied ON */}
               <span className="flex items-center gap-2">
                 <Loader2 className="w-3 h-3 animate-spin" /> Auto-dreaming...
               </span>
            </div>
            <button onClick={onClose} className="hover:text-white transition-colors">
              Exit Screensaver
            </button>
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AIDreamscape;
