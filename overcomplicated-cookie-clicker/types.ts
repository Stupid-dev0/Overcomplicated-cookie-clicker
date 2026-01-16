import { LucideIcon } from 'lucide-react';

export type Tab = 'store' | 'stats' | 'achievements';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseCPS: number;
  iconName: 'MousePointer' | 'User' | 'Wheat' | 'Pickaxe' | 'Factory' | 'Zap' | 'Rocket';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  trigger: (state: GameState) => boolean;
}

export interface GameState {
  cookies: number;
  lifetimeCookies: number;
  inventory: Record<string, number>;
  achievements: string[];
  stats: {
    totalClicks: number;
    startTime: number;
    lastSaveTime: number;
  };
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
}
