import React, { useState } from 'react';
import { ScreensaverType, ScreensaverConfig } from './types';
import Bubbles from './components/screensavers/Bubbles';
import MatrixRain from './components/screensavers/MatrixRain';
import SolarSystem from './components/screensavers/SolarSystem';
import AIDreamscape from './components/screensavers/AIDreamscape';
import ScreensaverCard from './components/ScreensaverCard';
import { Monitor, Info, Search, ShieldCheck, Zap } from 'lucide-react';

// Constants
const SCREENSAVERS: ScreensaverConfig[] = [
  {
    id: ScreensaverType.Bubbles,
    name: "Aero Bubbles",
    description: "The classic transparent bubbles that float aimlessly across your screen.",
    thumbnail: "https://picsum.photos/seed/bubbles/600/400",
    monetizationType: 'FREE',
    tags: ["Retro", "Relaxing"]
  },
  {
    id: ScreensaverType.Matrix,
    name: "System Breach",
    description: "Standard green digital rain.",
    thumbnail: "https://picsum.photos/seed/matrix/600/400",
    monetizationType: 'FREE',
    tags: ["Sci-Fi", "Code"]
  },
  {
    id: ScreensaverType.MatrixGold,
    name: "Matrix Reloaded",
    description: "Premium cyber-gold visual update with increased data density.",
    thumbnail: "https://picsum.photos/seed/matrixgold/600/400?grayscale", // Mock distinct look
    monetizationType: 'ONE_TIME_PURCHASE',
    priceDisplay: '$1.99',
    tags: ["Premium", "Gold", "Custom"]
  },
  {
    id: ScreensaverType.SolarSystem,
    name: "Orbital Mechanics",
    description: "A mesmerizing 3D CSS animation of our solar system in motion.",
    thumbnail: "https://picsum.photos/seed/solar/600/400",
    monetizationType: 'ONE_TIME_PURCHASE',
    priceDisplay: '$1.99',
    tags: ["Space", "3D", "Premium"]
  },
  {
    id: ScreensaverType.AIDreamscape,
    name: "AI Dreamscape",
    description: "Generative art stream. Upgrade to Pro to be the architect of your own dreams.",
    thumbnail: "https://picsum.photos/seed/dream/600/400",
    monetizationType: 'SUBSCRIPTION',
    priceDisplay: '$2.99/mo',
    tags: ["AI", "Generative", "Art"]
  }
];

const App: React.FC = () => {
  const [activeScreensaver, setActiveScreensaver] = useState<ScreensaverType>(ScreensaverType.None);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [targetPurchase, setTargetPurchase] = useState<ScreensaverConfig | null>(null);

  // Persistence Mock: In real app, load from local storage or backend
  const [purchasedIds, setPurchasedIds] = useState<ScreensaverType[]>([
    ScreensaverType.Bubbles, 
    ScreensaverType.Matrix
  ]);
  const [isProMember, setIsProMember] = useState(false);

  const isUnlocked = (config: ScreensaverConfig) => {
    if (config.monetizationType === 'FREE') return true;
    if (config.monetizationType === 'SUBSCRIPTION') return isProMember; // Can view curated if free? No, Card logic handles badge.
    // For AI Dreamscape specifically: It's technically "Available" to all, but "Unlocked" means full features
    if (config.id === ScreensaverType.AIDreamscape) return true; // Always launchable, features restricted inside
    return purchasedIds.includes(config.id);
  };

  const hasFullFeatureAccess = (id: ScreensaverType) => {
    if (id === ScreensaverType.AIDreamscape) return isProMember;
    return purchasedIds.includes(id);
  };

  const handleSelect = (config: ScreensaverConfig) => {
    // Logic for AI Dreamscape: Everyone can open it, but features differ
    if (config.id === ScreensaverType.AIDreamscape) {
      setActiveScreensaver(config.id);
      return;
    }

    // Logic for One-time purchases
    if (!purchasedIds.includes(config.id) && config.monetizationType !== 'FREE') {
      setTargetPurchase(config);
      setShowStoreModal(true);
      return;
    }

    setActiveScreensaver(config.id);
  };

  const handleCloseScreensaver = () => {
    setActiveScreensaver(ScreensaverType.None);
  };

  const handlePurchase = (type: 'PACK' | 'PRO') => {
    if (type === 'PACK') {
      // Unlock "Retro Gold" Pack (Matrix Gold + Solar System)
      setPurchasedIds(prev => [...prev, ScreensaverType.MatrixGold, ScreensaverType.SolarSystem]);
    } else {
      setIsProMember(true);
    }
    setShowStoreModal(false);
    setTargetPurchase(null);
  };

  const renderActiveScreensaver = () => {
    switch (activeScreensaver) {
      case ScreensaverType.Bubbles:
        return <Bubbles onClose={handleCloseScreensaver} />;
      case ScreensaverType.Matrix:
        return <MatrixRain onClose={handleCloseScreensaver} color="#0F0" />;
      case ScreensaverType.MatrixGold:
        return <MatrixRain onClose={handleCloseScreensaver} color="#D4AF37" speedMultiplier={1.5} />;
      case ScreensaverType.SolarSystem:
        return <SolarSystem onClose={handleCloseScreensaver} />;
      case ScreensaverType.AIDreamscape:
        return <AIDreamscape onClose={handleCloseScreensaver} isUnlocked={isProMember} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* Fullscreen Screensaver Overlay */}
      {activeScreensaver !== ScreensaverType.None && renderActiveScreensaver()}

      {/* Main Dashboard UI */}
      <div className={`transition-all duration-500 ${activeScreensaver !== ScreensaverType.None ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* Header */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-lg border-b border-white/5 bg-[#0f172a]/80">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-lg shadow-purple-500/20">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">ScreenZen</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => { setTargetPurchase(null); setShowStoreModal(true); }}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-full hover:brightness-110 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Store</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
            Nostalgia & Dreams.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Premium screensavers for the modern desk. From retro classics to AI-generated masterpieces.
          </p>
          
          {!process.env.API_KEY && (
             <div className="max-w-md mx-auto bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg flex items-start space-x-3 text-amber-200 text-left text-sm mb-8">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Gemini API Key missing. AI features will be limited.</p>
             </div>
          )}
        </section>

        {/* Grid */}
        <main className="container mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SCREENSAVERS.map(config => (
              <ScreensaverCard 
                key={config.id} 
                config={config} 
                onSelect={handleSelect}
                isActive={activeScreensaver === config.id}
                isUnlocked={isUnlocked(config)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Unified Store Modal */}
      {showStoreModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full p-0 relative overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            {/* Left Col: One Time Purchase */}
            <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/5 relative group">
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="text-amber-500" /> Retro Gold Pack
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                Unlock the premium collection forever. Includes new screensavers and customizations.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"/> Unlock Matrix Gold</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"/> Unlock Solar System 3D</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"/> Remove Ads (Future)</li>
              </ul>
              <button 
                onClick={() => handlePurchase('PACK')}
                disabled={purchasedIds.includes(ScreensaverType.MatrixGold)}
                className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchasedIds.includes(ScreensaverType.MatrixGold) ? 'Owned' : 'Buy Pack $1.99'}
              </button>
            </div>

            {/* Right Col: Subscription */}
            <div className="flex-1 p-8 relative bg-gradient-to-br from-purple-900/20 to-slate-900">
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Most Popular</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="text-purple-500" /> Dream Architect
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                Take control of the AI. Generate unlimited, custom dreamscapes tailored to your imagination.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Custom AI Prompts</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Faster Generation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Support API Costs</li>
              </ul>
              <button 
                 onClick={() => handlePurchase('PRO')}
                 disabled={isProMember}
                 className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-bold text-white shadow-lg shadow-purple-900/50 transition-all transform hover:scale-[1.02] disabled:opacity-50"
              >
                {isProMember ? 'Active Member' : 'Subscribe $2.99/mo'}
              </button>
            </div>

            <button 
              onClick={() => setShowStoreModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
