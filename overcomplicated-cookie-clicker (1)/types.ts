import { LucideIcon } from 'lucide-react';

export type Tab = 'store' | 'stats' | 'achievements' | 'settings';
export type StoreView = 'buildings' | 'quantum_lab';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseCPS: number;
  iconName: 'MousePointer' | 'User' | 'Wheat' | 'Pickaxe' | 'Factory' | 'Zap' | 'Rocket' | 'Brain' | 'Atom' | 'Alien' | 'Flask' | 'Dna';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  trigger: (state: GameState) => boolean;
  multiplierBonus: number;
}

export interface Buff {
  id: string;
  name: string;
  multiplier: number;
  expiresAt: number;
}

export interface GameState {
  cookies: number;
  lifetimeCookies: number;
  inventory: Record<string, number>;
  achievements: string[];
  darkMatter: number;
  researchLevel: number;
  prestige: {
    level: number;
    currency: number;
  };
  stats: {
    totalClicks: number;
    goldenCookiesClicked: number;
    startTime: number;
    lastSaveTime: number;
  };
  settings: {
    particles: boolean;
    audio: boolean;
    newsTicker: boolean;
  };
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
}

export interface GoldenCookieState {
  active: boolean;
  x: number;
  y: number;
  type: 'frenzy' | 'lucky';
  spawnId: number;
}