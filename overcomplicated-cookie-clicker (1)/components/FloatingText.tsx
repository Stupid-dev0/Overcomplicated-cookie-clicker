import React from 'react';
import { Particle } from '../types';

interface FloatingTextProps {
  particles: Particle[];
}

const FloatingText: React.FC<FloatingTextProps> = ({ particles }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float-up text-2xl font-bold text-white drop-shadow-md select-none"
          style={{ 
            left: p.x, 
            top: p.y,
            textShadow: '0 2px 0 rgba(0,0,0,0.2)' 
          }}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
};

export default FloatingText;