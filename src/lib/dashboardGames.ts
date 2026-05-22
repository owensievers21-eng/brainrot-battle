import { MINI_GAMES } from '../minigames';

export type DashboardGameStatus = '1v1 Live' | 'Solo' | 'Co-op' | 'Tournament';

export interface DashboardGame {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: DashboardGameStatus;
  playerCount: number;
  category: string;
  accentFrom: string;
  accentTo: string;
}

export interface DashboardFeaturedGame {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  badge: string;
}

const CATEGORIES = ['Fighting', 'Racing', 'Survival', 'Party', 'MOBA', 'Simulation', 'Strategy', 'Action'] as const;

/** Stable pseudo-random player count from game id (display only). */
function pseudoPlayerCount(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return 1200 + (hash % 18000);
}

const ACCENTS: { from: string; to: string }[] = [
  { from: '#39ff14', to: '#00f5ff' },
  { from: '#bf00ff', to: '#ff10f0' },
  { from: '#ffff00', to: '#39ff14' },
  { from: '#ff10f0', to: '#bf00ff' },
  { from: '#00f5ff', to: '#bf00ff' },
  { from: '#39ff14', to: '#ffff00' },
];

export function miniGamesToDashboardGames(): DashboardGame[] {
  return MINI_GAMES.map((game, index) => ({
    id: game.id,
    title: game.name,
    description: game.tagline,
    thumbnail: '',
    status: '1v1 Live' as DashboardGameStatus,
    playerCount: pseudoPlayerCount(game.id),
    category: CATEGORIES[index % CATEGORIES.length]!,
    accentFrom: ACCENTS[index % ACCENTS.length]!.from,
    accentTo: ACCENTS[index % ACCENTS.length]!.to,
  }));
}

export function getFeaturedGameOfTheDay(games: DashboardGame[]): DashboardFeaturedGame {
  const dayIndex = new Date().getDate() % games.length;
  const featured = games[dayIndex] ?? games[0]!;
  return {
    id: featured.id,
    title: featured.title,
    subtitle: 'Featured 1v1 — jump in now',
    description: featured.description,
    backgroundImage: '',
    badge: '🔥 Hot',
  };
}
