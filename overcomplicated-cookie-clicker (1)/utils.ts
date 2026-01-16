import { UPGRADES, ACHIEVEMENTS } from './constants';
import { GameState, Buff } from './types';

export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
  if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
  if (num < 1000000000000) return (num / 1000000000).toFixed(3) + 'B';
  if (num < 1000000000000000) return (num / 1000000000000).toFixed(3) + 'T';
  return (num / 1000000000000000).toFixed(3) + 'Qa';
};

export const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
};

export const calculateCost = (baseCost: number, count: number): number => {
  return Math.floor(baseCost * Math.pow(1.15, count));
};

export const calculateBaseCPS = (inventory: Record<string, number>): number => {
  return UPGRADES.reduce((total, upgrade) => {
    const count = inventory[upgrade.id] || 0;
    return total + (upgrade.baseCPS * count);
  }, 0);
};

export const calculateMultiplier = (gameState: GameState, activeBuffs: Buff[]): number => {
  let multiplier = 1;

  // 1. Prestige Multiplier (Heavenly Chips)
  // Each chip gives +5% CPS
  multiplier += (gameState.prestige.level * 0.05);

  // 2. Achievement Multiplier
  const achievementBonus = ACHIEVEMENTS
    .filter(a => gameState.achievements.includes(a.id))
    .reduce((sum, a) => sum + a.multiplierBonus, 0);
  
  multiplier += achievementBonus;

  // 3. Temporary Buffs (Multiplicative)
  const buffMultiplier = activeBuffs.reduce((prod, buff) => prod * buff.multiplier, 1);
  
  return multiplier * buffMultiplier;
};

export const calculatePrestigeGain = (lifetimeCookies: number): number => {
  // Simple formula: Cube root of (lifetime / 1 trillion)
  if (lifetimeCookies < 1000000) return 0;
  return Math.floor(Math.cbrt(lifetimeCookies / 1000000));
};