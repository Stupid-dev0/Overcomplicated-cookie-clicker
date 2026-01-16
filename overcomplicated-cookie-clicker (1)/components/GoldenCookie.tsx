import React from 'react';
import { Sparkles } from 'lucide-react';

interface GoldenCookieProps {
  x: number | string;
  y: number | string;
  onClick: () => void;
}

const GoldenCookie: React.FC<GoldenCookieProps> = ({ x, y, onClick }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute z-50 animate-spin-slow hover:scale-110 transition-transform cursor-pointer"
      style={{ left: x, top: y }}
    >
      <div className="relative w-16 h-16 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
        <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border-2 border-yellow-200 shadow-xl flex items-center justify-center overflow-hidden">
           {/* Pattern */}
           <div className="absolute inset-0 opacity-30" 
                style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '4px 4px' }}>
           </div>
           <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
    </button>
  );
};

export default GoldenCookie;