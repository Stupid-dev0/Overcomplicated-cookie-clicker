import { Upgrade, Achievement } from './types';

export const UPGRADES: Upgrade[] = [
  { id: 'cursor', name: 'Auto-Clicker', description: 'Autonomous clicking bots.', baseCost: 15, baseCPS: 0.1, iconName: 'MousePointer' },
  { id: 'grandma', name: 'Grandma', description: 'Baking cookies with love.', baseCost: 100, baseCPS: 1, iconName: 'User' },
  { id: 'farm', name: 'Cookie Farm', description: 'Genetically modified cookie plants.', baseCost: 1100, baseCPS: 8, iconName: 'Wheat' },
  { id: 'mine', name: 'Cookie Mine', description: 'Extracting dough from the crust.', baseCost: 12000, baseCPS: 47, iconName: 'Pickaxe' },
  { id: 'factory', name: 'Factory', description: 'Mass production facilities.', baseCost: 130000, baseCPS: 260, iconName: 'Factory' },
  { id: 'bank', name: 'Cookie Bank', description: 'Financial cookie derivatives.', baseCost: 1400000, baseCPS: 1400, iconName: 'Zap' },
  { id: 'temple', name: 'Cookie Temple', description: 'Worshipping the Almighty Cookie.', baseCost: 20000000, baseCPS: 7800, iconName: 'Rocket' },
  { id: 'wizard', name: 'Wizard Tower', description: 'Summoning cookies from the void.', baseCost: 330000000, baseCPS: 44000, iconName: 'Brain' },
  { id: 'shipment', name: 'Shipment', description: 'Importing cookies from the cookie planet.', baseCost: 5100000000, baseCPS: 260000, iconName: 'Rocket' },
  { id: 'alchemy', name: 'Alchemy Lab', description: 'Turning gold into cookies.', baseCost: 75000000000, baseCPS: 1600000, iconName: 'Atom' },
  { id: 'portal', name: 'Portal', description: 'Opening doors to the cookieverse.', baseCost: 1000000000000, baseCPS: 10000000, iconName: 'Alien' },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'click100', name: 'Clicking Enthusiast', description: '100 clicks.', iconName: 'MousePointer', trigger: (s) => s.stats.totalClicks >= 100, multiplierBonus: 0.01 },
  { id: 'bake1000', name: 'Casual Baker', description: '1,000 cookies.', iconName: 'Wheat', trigger: (s) => s.lifetimeCookies >= 1000, multiplierBonus: 0.01 },
  { id: 'grandma10', name: 'Retirement Home', description: '10 Grandmas.', iconName: 'User', trigger: (s) => (s.inventory['grandma'] || 0) >= 10, multiplierBonus: 0.02 },
  { id: 'millionaire', name: 'Millionaire', description: '1,000,000 cookies.', iconName: 'Zap', trigger: (s) => s.lifetimeCookies >= 1000000, multiplierBonus: 0.05 },
  { id: 'lucky', name: 'Get Lucky', description: '7 Golden Cookies', iconName: 'Star', trigger: (s) => s.stats.goldenCookiesClicked >= 7, multiplierBonus: 0.07 },
  { id: 'scientist', name: 'Quantum Leap', description: 'Condense Dark Matter', iconName: 'Flask', trigger: (s) => s.darkMatter > 0, multiplierBonus: 0.1 },
];

export const NEWS_HEADLINES = [
  "Local grandma found entangled with a chocolate chip in a dual-state position.",
  "Cookies found to contain 5% more 'existential dread' than previously thought.",
  "Global sugar supply replaced by powdered stardust; baking efficiency up by 0.003%.",
  "Cookies are now the legal currency in 14 countries. Central banks in panic.",
  "Philosophers argue: If a cookie is baked but not clicked, does it have flavor?",
  "Dark Matter discovered to taste exactly like high-quality cocoa.",
  "Warning: Portals to the Cookieverse may result in mild to moderate crumbs in living room.",
  "New 'Auto-Clicker' union demands higher electricity rations and digital maintenance."
];

export const SAVE_KEY = 'react-cookie-clicker-save-v5';
export const PRESTIGE_COST_FACTOR = 1000000000;
