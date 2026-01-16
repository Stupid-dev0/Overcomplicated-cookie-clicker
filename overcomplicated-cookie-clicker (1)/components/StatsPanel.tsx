import React from 'react';
import { formatNumber, formatTime, calculateMultiplier, calculatePrestigeGain } from '../utils';
import { GameState, Buff } from '../types';
import { Clock, MousePointer, Award, Star, Zap } from 'lucide-react';

interface StatsPanelProps {
  state: GameState;
  cps: number;
  activeBuffs: Buff[];
  onPrestige: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ state, cps, activeBuffs, onPrestige }) => {
  const potentialChips = calculatePrestigeGain(state.lifetimeCookies) - state.prestige.level;
  const multiplier = calculateMultiplier(state, activeBuffs);

  return (
    <div className="space-y-6 p-2">
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-amber-500" />
          Production Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
           <div className="bg-white p-3 rounded-lg shadow-sm">
             <div className="text-slate-400 text-xs">Cookies per Second</div>
             <div className="font-mono font-bold text-lg text-slate-800">{formatNumber(cps)}</div>
           </div>
           <div className="bg-white p-3 rounded-lg shadow-sm">
             <div className="text-slate-400 text-xs">Global Multiplier</div>
             <div className="font-mono font-bold text-lg text-blue-600">x{(multiplier * 100).toFixed(0)}%</div>
           </div>
           <div className="bg-white p-3 rounded-lg shadow-sm">
             <div className="text-slate-400 text-xs">Cookies Baked (This Run)</div>
             <div className="font-mono font-bold text-lg text-amber-600">{formatNumber(state.cookies)}</div>
           </div>
           <div className="bg-white p-3 rounded-lg shadow-sm">
             <div className="text-slate-400 text-xs">Cookies Baked (All Time)</div>
             <div className="font-mono font-bold text-lg text-amber-700">{formatNumber(state.lifetimeCookies)}</div>
           </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-purple-500" />
          General Stats
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex justify-between border-b border-slate-100 pb-2">
             <span className="flex items-center"><MousePointer className="w-3 h-3 mr-2" /> Hand-made Cookies</span>
             <span className="font-mono">{formatNumber(state.stats.totalClicks)}</span>
          </li>
          <li className="flex justify-between border-b border-slate-100 pb-2">
             <span className="flex items-center"><Star className="w-3 h-3 mr-2" /> Golden Cookies</span>
             <span className="font-mono">{state.stats.goldenCookiesClicked}</span>
          </li>
          <li className="flex justify-between border-b border-slate-100 pb-2">
             <span className="flex items-center"><Clock className="w-3 h-3 mr-2" /> Time Played</span>
             <span className="font-mono">{formatTime((Date.now() - state.stats.startTime) / 1000)}</span>
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
        <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 mb-2">Ascension</h3>
        <p className="text-indigo-200 text-xs mb-4">Reset your progress to earn Heavenly Chips and boost your production permanently.</p>
        
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-xs text-indigo-300 uppercase tracking-wider">Current Chips</div>
            <div className="text-2xl font-bold font-mono text-amber-400">{state.prestige.level}</div>
          </div>
          <div className="text-right">
             <div className="text-xs text-indigo-300 uppercase tracking-wider">Chips on Reset</div>
             <div className="text-2xl font-bold font-mono text-green-400">+{potentialChips > 0 ? formatNumber(potentialChips) : 0}</div>
          </div>
        </div>

        <button 
          onClick={onPrestige}
          disabled={potentialChips <= 0}
          className={`
            w-full py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all
            ${potentialChips > 0 
               ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-lg hover:shadow-amber-500/50' 
               : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
          `}
        >
          Ascend Now
        </button>
      </div>
    </div>
  );
};

export default StatsPanel;