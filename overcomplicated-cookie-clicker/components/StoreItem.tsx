import React from 'react';
import { MousePointer, User, Wheat, Pickaxe, Factory, Zap, Rocket, Brain, Lock } from 'lucide-react';
import { Upgrade } from '../types';
import { formatNumber, calculateCost } from '../utils';

interface StoreItemProps {
  upgrade: Upgrade;
  count: number;
  canAfford: boolean;
  onBuy: (id: string) => void;
}

const StoreItem: React.FC<StoreItemProps> = ({ upgrade, count, canAfford, onBuy }) => {
  const currentCost = calculateCost(upgrade.baseCost, count);

  const getIcon = (name: string) => {
    switch (name) {
      case 'MousePointer': return <MousePointer className="w-6 h-6" />;
      case 'User': return <User className="w-6 h-6" />;
      case 'Wheat': return <Wheat className="w-6 h-6" />;
      case 'Pickaxe': return <Pickaxe className="w-6 h-6" />;
      case 'Factory': return <Factory className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Rocket': return <Rocket className="w-6 h-6" />;
      default: return <Brain className="w-6 h-6" />;
    }
  };

  return (
    <button
      onClick={() => canAfford && onBuy(upgrade.id)}
      disabled={!canAfford}
      className={`
        w-full flex items-center p-3 mb-2 rounded-xl border-b-4 transition-all duration-200
        group relative overflow-hidden
        ${canAfford 
          ? 'bg-white border-amber-200 hover:bg-amber-50 active:border-b-0 active:translate-y-1 cursor-pointer shadow-sm' 
          : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed grayscale-[0.5]'}
      `}
    >
      {/* Icon Box */}
      <div className={`
        flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4
        ${canAfford ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}
      `}>
        {getIcon(upgrade.iconName)}
      </div>

      {/* Info */}
      <div className="flex-grow text-left">
        <div className="flex justify-between items-baseline">
          <h3 className="font-bold text-gray-800">{upgrade.name}</h3>
          <span className="text-2xl font-black text-gray-100 absolute right-2 -top-1 pointer-events-none group-hover:text-amber-100/50 transition-colors">
            {count}
          </span>
        </div>
        <div className="text-xs text-gray-500 font-medium mb-1 line-clamp-1">{upgrade.description}</div>
        <div className="flex items-center text-sm font-semibold">
          <span className={`${canAfford ? 'text-green-600' : 'text-red-500'}`}>
            🍪 {formatNumber(currentCost)}
          </span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-gray-400">+{upgrade.baseCPS} cps</span>
        </div>
      </div>

      {/* Buy Feedback Overlay (Optional) */}
      {!canAfford && (
        <div className="absolute right-3 top-3">
          <Lock className="w-4 h-4 text-slate-400" />
        </div>
      )}
    </button>
  );
};

export default StoreItem;