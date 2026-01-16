import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import { Save, Trophy, Settings, Star, TrendingUp, ShoppingBag, Info, AlertTriangle, FlaskConical, Beaker, Atom, Zap } from 'lucide-react';
import Cookie from './components/Cookie';
import StoreItem from './components/StoreItem';
import FloatingText from './components/FloatingText';
import NewsTicker from './components/NewsTicker';
import GoldenCookie from './components/GoldenCookie';
import StatsPanel from './components/StatsPanel';

import { UPGRADES, ACHIEVEMENTS, SAVE_KEY } from './constants';
import { Upgrade, GameState, Particle, Tab, GoldenCookieState, Buff, StoreView } from './types';
import { calculateCost, calculateBaseCPS, calculateMultiplier, calculatePrestigeGain, formatNumber } from './utils';

const DEFAULT_STATE: GameState = {
  cookies: 0,
  lifetimeCookies: 0,
  inventory: {},
  achievements: [],
  darkMatter: 0,
  researchLevel: 0,
  prestige: { level: 0, currency: 0 },
  stats: { totalClicks: 0, goldenCookiesClicked: 0, startTime: Date.now(), lastSaveTime: Date.now() },
  settings: { particles: true, audio: true, newsTicker: true }
};

type Action = 
  | { type: 'LOAD'; payload: GameState }
  | { type: 'TICK'; payload: { dt: number } }
  | { type: 'CLICK_COOKIE'; payload: { value: number; x: number; y: number } }
  | { type: 'BUY_UPGRADE'; payload: { id: string; cost: number } }
  | { type: 'RESEARCH'; payload: { cost: number; darkMatterGain: number } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'CLICK_GOLDEN' }
  | { type: 'PRESTIGE' }
  | { type: 'RESET' };

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD': return { ...DEFAULT_STATE, ...action.payload };
    case 'TICK': return {
      ...state,
      cookies: state.cookies + action.payload.dt,
      lifetimeCookies: state.lifetimeCookies + action.payload.dt,
      stats: { ...state.stats, lastSaveTime: Date.now() }
    };
    case 'CLICK_COOKIE': return {
      ...state,
      cookies: state.cookies + action.payload.value,
      lifetimeCookies: state.lifetimeCookies + action.payload.value,
      stats: { ...state.stats, totalClicks: state.stats.totalClicks + 1 }
    };
    case 'BUY_UPGRADE': return {
      ...state,
      cookies: state.cookies - action.payload.cost,
      inventory: { ...state.inventory, [action.payload.id]: (state.inventory[action.payload.id] || 0) + 1 }
    };
    case 'RESEARCH': return {
      ...state,
      cookies: state.cookies - action.payload.cost,
      darkMatter: state.darkMatter + action.payload.darkMatterGain,
      researchLevel: state.researchLevel + 1
    };
    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.includes(action.payload)) return state;
      return { ...state, achievements: [...state.achievements, action.payload] };
    case 'CLICK_GOLDEN': return {
      ...state,
      stats: { ...state.stats, goldenCookiesClicked: state.stats.goldenCookiesClicked + 1 }
    };
    case 'PRESTIGE':
      const chipsGained = calculatePrestigeGain(state.lifetimeCookies) - state.prestige.level;
      if (chipsGained <= 0) return state;
      return {
        ...DEFAULT_STATE,
        prestige: { ...DEFAULT_STATE.prestige, level: state.prestige.level + chipsGained },
        stats: { ...DEFAULT_STATE.stats, startTime: Date.now() },
        achievements: state.achievements
      };
    case 'RESET': return DEFAULT_STATE;
    default: return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<Tab>('store');
  const [storeView, setStoreView] = useState<StoreView>('buildings');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [goldenCookie, setGoldenCookie] = useState<GoldenCookieState>({ active: false, x: 0, y: 0, type: 'lucky', spawnId: 0 });
  const [buffs, setBuffs] = useState<Buff[]>([]);
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  const baseCPS = calculateBaseCPS(state.inventory);
  // Dark Matter bonus: +10% per DM
  const darkMatterMult = 1 + (state.darkMatter * 0.1);
  const globalMultiplier = calculateMultiplier(state, buffs) * darkMatterMult;
  const effectiveCPS = baseCPS * globalMultiplier;

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);
  const gcRef = useRef(goldenCookie);
  useEffect(() => { gcRef.current = goldenCookie; }, [goldenCookie]);

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try { dispatch({ type: 'LOAD', payload: JSON.parse(saved) }); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      if (effectiveCPS > 0) dispatch({ type: 'TICK', payload: { dt: effectiveCPS * delta } });
      const now = Date.now();
      setBuffs(prev => prev.filter(b => b.expiresAt > now));
      requestAnimationFrame(loop);
    };
    const reqId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqId);
  }, [effectiveCPS]);

  useEffect(() => {
    const checkAchievements = setInterval(() => {
      ACHIEVEMENTS.forEach(ach => {
        if (!stateRef.current.achievements.includes(ach.id) && ach.trigger(stateRef.current)) {
          dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: ach.id });
          showToast(`Achievement: ${ach.name}`, 'achievement');
        }
      });
    }, 2000);
    return () => clearInterval(checkAchievements);
  }, []);

  useEffect(() => {
    const checkSpawn = setInterval(() => {
      if (!gcRef.current.active && Math.random() < 0.08) {
         setGoldenCookie({ active: true, x: 10 + Math.random() * 80, y: 10 + Math.random() * 80, type: Math.random() > 0.7 ? 'frenzy' : 'lucky', spawnId: Date.now() });
         setTimeout(() => setGoldenCookie(prev => ({ ...prev, active: false })), 13000);
      }
    }, 10000);
    return () => clearInterval(checkSpawn);
  }, []);

  const handleCookieClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    let x, y;
    if ('touches' in e) { x = e.touches[0].clientX; y = e.touches[0].clientY; }
    else { x = (e as React.MouseEvent).clientX; y = (e as React.MouseEvent).clientY; }
    const val = (1 + (baseCPS * 0.05)) * globalMultiplier;
    dispatch({ type: 'CLICK_COOKIE', payload: { value: val, x, y } });
    const id = Date.now() + Math.random();
    setParticles(p => [...p.slice(-15), { id, x, y, text: `+${formatNumber(val)}` }]);
    setTimeout(() => setParticles(p => p.filter(it => it.id !== id)), 1000);
  }, [baseCPS, globalMultiplier]);

  const handleGoldenClick = () => {
    setGoldenCookie(p => ({ ...p, active: false }));
    dispatch({ type: 'CLICK_GOLDEN' });
    if (goldenCookie.type === 'frenzy') {
      setBuffs(p => [...p, { id: `f-${Date.now()}`, name: 'Frenzy', multiplier: 7, expiresAt: Date.now() + 30000 }]);
      showToast("FRENZY x7!", "golden");
    } else {
      const gain = effectiveCPS * 900 + 5000;
      dispatch({ type: 'CLICK_COOKIE', payload: { value: gain, x: 0, y: 0 } });
      showToast(`LUCKY! +${formatNumber(gain)}`, "golden");
    }
  };

  const showToast = (msg: string, type: string) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const researchCost = 1000000 * Math.pow(2.5, state.researchLevel);
  const handleResearch = () => {
    if (state.cookies >= researchCost) {
      dispatch({ type: 'RESEARCH', payload: { cost: researchCost, darkMatterGain: 1 } });
      showToast("Quantum Condensation Complete!", "achievement");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none flex flex-col">
      {state.settings.newsTicker && <NewsTicker />}

      <div className="flex-grow flex relative overflow-hidden">
        <FloatingText particles={particles} />
        {goldenCookie.active && <GoldenCookie x={goldenCookie.x + '%'} y={goldenCookie.y + '%'} onClick={handleGoldenClick} />}
        {toast && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 animate-bounce ${toast.type === 'golden' ? 'bg-amber-400 text-amber-900' : 'bg-indigo-600 text-white'}`}>
             <Star className="w-5 h-5" /> <span className="font-bold">{toast.message}</span>
          </div>
        )}

        <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col items-center relative z-10 bg-pattern border-r border-slate-800 shadow-2xl">
          <div className="mt-8 text-center">
             <div className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">Research Station Alpha</div>
             <h1 className="text-2xl font-black text-slate-800 drop-shadow-sm">Quantum Bakery</h1>
             <div className="mt-4 bg-white/70 backdrop-blur rounded-2xl px-6 py-4 border border-white shadow-xl">
                <div className="text-4xl font-black text-slate-900 tabular-nums">{formatNumber(Math.floor(state.cookies))}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Current Cookie Yield</div>
             </div>
             <div className="mt-3 flex space-x-2 justify-center">
               <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{formatNumber(effectiveCPS)} CpS</span>
               {state.darkMatter > 0 && <span className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{state.darkMatter} Dark Matter</span>}
             </div>
          </div>
          <div className="flex-grow flex items-center justify-center"><Cookie onClick={handleCookieClick} /></div>
          <div className="mb-8 w-full px-8 text-center text-[10px] text-slate-400 font-mono italic">"We observe the cookie, therefore it exists."</div>
        </div>

        <div className="flex-1 bg-slate-900 flex flex-col relative">
          <div className="flex bg-slate-800 border-b border-slate-700 px-4 pt-4 space-x-2">
            {['store', 'stats', 'achievements', 'settings'].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 rounded-t-lg font-bold text-xs uppercase transition-all ${activeTab === t ? 'bg-slate-900 text-amber-400 border-t border-x border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto p-4 custom-scrollbar bg-slate-900">
            {activeTab === 'store' && (
              <div className="space-y-4">
                <div className="flex p-1 bg-slate-800 rounded-xl mb-4">
                  <button onClick={() => setStoreView('buildings')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${storeView === 'buildings' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Buildings</button>
                  <button onClick={() => setStoreView('quantum_lab')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${storeView === 'quantum_lab' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Quantum Lab</button>
                </div>
                {storeView === 'buildings' ? (
                  UPGRADES.map(u => <StoreItem key={u.id} upgrade={u} count={state.inventory[u.id] || 0} canAfford={state.cookies >= calculateCost(u.baseCost, state.inventory[u.id] || 0)} onBuy={(id) => dispatch({ type: 'BUY_UPGRADE', payload: { id, cost: calculateCost(u.baseCost, state.inventory[u.id] || 0) } })} />)
                ) : (
                  <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50">
                      <FlaskConical className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-black text-purple-100">Dark Matter Condenser</h2>
                    <p className="text-xs text-slate-400 mt-2 mb-6">Condense your massive cookie reserves into unstable Dark Matter. Each gram increases global production by 10%.</p>
                    <button onClick={handleResearch} disabled={state.cookies < researchCost} className={`w-full py-4 rounded-xl font-black text-sm uppercase border-b-4 transition-all ${state.cookies >= researchCost ? 'bg-purple-600 border-purple-800 text-white hover:-translate-y-1 active:border-b-0' : 'bg-slate-700 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'}`}>
                      Condense ({formatNumber(researchCost)} cookies)
                    </button>
                    <div className="mt-4 text-[10px] font-mono text-purple-400">Total Dark Matter: {state.darkMatter}g (x{((1 + state.darkMatter * 0.1) * 100).toFixed(0)}% boost)</div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'stats' && <StatsPanel state={state} cps={effectiveCPS} activeBuffs={buffs} onPrestige={() => dispatch({ type: 'PRESTIGE' })} />}
            {activeTab === 'achievements' && (
               <div className="grid grid-cols-2 gap-2">
                  {ACHIEVEMENTS.map(ach => (
                    <div key={ach.id} className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1 ${state.achievements.includes(ach.id) ? 'bg-slate-800 border-amber-500/50' : 'bg-slate-800/30 border-slate-700 opacity-40'}`}>
                       <Trophy className={`w-6 h-6 ${state.achievements.includes(ach.id) ? 'text-amber-400' : 'text-slate-500'}`} />
                       <div className="font-bold text-[10px] leading-tight">{ach.name}</div>
                       <div className="text-[9px] text-slate-500 leading-tight">{ach.description}</div>
                    </div>
                  ))}
               </div>
            )}
            {activeTab === 'settings' && (
              <div className="p-4 space-y-4">
                <button onClick={() => { dispatch({ type: 'RESET' }); localStorage.removeItem(SAVE_KEY); window.location.reload(); }} className="w-full py-3 bg-red-900/20 text-red-500 border border-red-500/30 rounded-xl text-xs font-bold uppercase hover:bg-red-900/40">Destructive Reset</button>
                <div className="text-center text-[9px] text-slate-600 uppercase tracking-widest font-mono">v4.quantum-condensate</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;