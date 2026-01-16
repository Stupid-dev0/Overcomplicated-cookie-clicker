import { Upgrade, Achievement } from './types';

export const UPGRADES: Upgrade[] = [
  { id: 'cursor', name: 'Auto-Clicker', description: 'A cursor that clicks for you.', baseCost: 15, baseCPS: 0.1, iconName: 'MousePointer' },
  { id: 'grandma', name: 'Grandma', description: 'Baking cookies with love.', baseCost: 100, baseCPS: 1, iconName: 'User' },
  { id: 'farm', name: 'Cookie Farm', description: 'Grows cookies from seeds.', baseCost: 1100, baseCPS: 8, iconName: 'Wheat' },
  { id: 'mine', name: 'Cookie Mine', description: 'Mining the chocolate chips.', baseCost: 12000, baseCPS: 47, iconName: 'Pickaxe' },
  { id: 'factory', name: '