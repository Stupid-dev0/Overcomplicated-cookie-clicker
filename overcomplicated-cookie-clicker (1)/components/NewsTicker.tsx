import React, { useEffect, useState } from 'react';
import { NEWS_HEADLINES } from '../constants';

const NewsTicker: React.FC = () => {
  const [currentHeadline, setCurrentHeadline] = useState(NEWS_HEADLINES[0]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(k => k + 1);
      setCurrentHeadline(NEWS_HEADLINES[Math.floor(Math.random() * NEWS_HEADLINES.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900 text-white overflow-hidden py-2 px-4 border-b border-amber-500/30 relative shadow-inner">
      <div className="flex items-center space-x-4">
        <span className="bg-amber-600 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">News</span>
        <div key={key} className="whitespace-nowrap animate-slide-in-right opacity-0 text-sm font-mono text-amber-100">
           {currentHeadline}
        </div>
      </div>
      <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(20px); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-20px); opacity: 0; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 10s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;