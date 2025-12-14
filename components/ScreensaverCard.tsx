import React from 'react';
import { ScreensaverConfig } from '../types';
import { Play, Star, Sparkles, ShoppingBag } from 'lucide-react';

interface Props {
  config: ScreensaverConfig;
  onSelect: (config: ScreensaverConfig) => void;
  isActive: boolean;
  isUnlocked: boolean;
}

const ScreensaverCard: React.FC<Props> = ({ config, onSelect, isActive, isUnlocked }) => {
  const isPremium = config.monetizationType !== 'FREE';

  return (
    <div 
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 ${isActive ? 'ring-2 ring-purple-500' : ''}`}
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-900 relative">
        <img 
          src={config.thumbnail} 
          alt={config.name} 
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isUnlocked && isPremium ? 'grayscale brightness-50' : 'opacity-80 group-hover:opacity-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Badges */}
        {config.monetizationType === 'ONE_TIME_PURCHASE' && !isUnlocked && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 rounded-full bg-amber-500/90 px-2 py-1 text-xs font-bold text-black shadow-lg">
            <Star className="w-3 h-3 fill-black" />
            <span>PREMIUM</span>
          </div>
        )}
        {config.monetizationType === 'SUBSCRIPTION' && !isUnlocked && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 rounded-full bg-purple-500/90 px-2 py-1 text-xs font-bold text-white shadow-lg">
            <Sparkles className="w-3 h-3 fill-white" />
            <span>PRO</span>
          </div>
        )}
        
        {/* Action Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => onSelect(config)}
            className={`flex items-center space-x-2 rounded-full backdrop-blur-md border px-6 py-3 font-semibold transition-all transform hover:scale-105 active:scale-95 ${
              isPremium && !isUnlocked 
                ? 'bg-amber-500/20 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {isPremium && !isUnlocked ? <ShoppingBag className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isPremium && !isUnlocked ? 'Unlock' : 'Launch'}</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-white">{config.name}</h3>
          {isPremium && !isUnlocked && (
            <span className="text-xs font-mono text-amber-400 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded">
              {config.priceDisplay}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{config.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {config.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-white/5 text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScreensaverCard;
