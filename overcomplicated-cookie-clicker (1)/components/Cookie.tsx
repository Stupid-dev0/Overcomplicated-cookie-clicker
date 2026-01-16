import React, { useRef, useState } from 'react';

interface CookieProps {
  onClick: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
}

const Cookie: React.FC<CookieProps> = ({ onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simple "crunch" sound effect placeholder logic (can be expanded)
  const playCrunch = () => {
    // In a real app, we would load an audio file here.
    // For now, this is purely visual.
  };

  const handleStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Prevent default to avoid double firing on some touch devices if mixed
    // but usually purely React onClick is safer. 
    // We'll use OnMouseDown/OnTouchStart for visual press effect
    setIsPressed(true);
    playCrunch();
    onClick(e);
  };

  const handleEnd = () => {
    setIsPressed(false);
  };

  return (
    <div className="relative group select-none touch-manipulation">
      {/* Glow effect behind */}
      <div className="absolute inset-0 bg-amber-400 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-110"></div>
      
      {/* The Cookie */}
      <div 
        className={`
          relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 
          rounded-full bg-amber-600 
          shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.3),inset_5px_5px_15px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.2)]
          cursor-pointer
          transition-transform duration-75 ease-out
          flex items-center justify-center
          z-10
          ${isPressed ? 'scale-95' : 'scale-100 hover:scale-[1.02]'}
        `}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      >
        {/* Chocolate Chips - Pure CSS Art */}
        <div className="absolute top-[20%] left-[30%] w-8 h-8 bg-amber-800 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] opacity-90"></div>
        <div className="absolute top-[30%] right-[25%] w-10 h-10 bg-amber-800 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] opacity-80"></div>
        <div className="absolute bottom-[25%] left-[25%] w-9 h-9 bg-amber-800 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] opacity-85"></div>
        <div className="absolute bottom-[35%] right-[35%] w-7 h-7 bg-amber-800 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] opacity-90"></div>
        <div className="absolute top-[50%] left-[15%] w-6 h-6 bg-amber-800 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] opacity-80"></div>
        <div className="absolute bottom-[15%] right-[45%] w-8 h-8 bg-amber-800 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] opacity-85"></div>
        <div className="absolute top-[15%] right-[45%] w-5 h-5 bg-amber-800 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] opacity-70"></div>
      </div>
    </div>
  );
};

export default Cookie;