import { useMemo, useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Swords,
  Settings,
  Play,
  Users,
  Zap,
  Crown,
  Flame,
  ChevronRight,
  Bell,
  Search,
} from 'lucide-react';
import type { DashboardFeaturedGame, DashboardGame } from '../lib/dashboardGames';
import { getFeaturedGameOfTheDay, miniGamesToDashboardGames } from '../lib/dashboardGames';

export interface BrainrotBattleDashboardProps {
  games?: DashboardGame[];
  gameOfTheDay?: DashboardFeaturedGame;
  user?: {
    name: string;
    avatar: string;
    level: number;
    status: 'online' | 'away' | 'offline';
  };
  onLaunchGame?: (gameId: string) => void;
  onOpenLobby?: () => void;
}

const defaultUser = {
  name: 'xX_ProGamer_Xx',
  avatar: '',
  level: 42,
  status: 'online' as const,
};

const navItems = [
  { id: 'all-games', label: 'All Games', icon: Gamepad2 },
  { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
  { id: '1v1-lobby', label: '1v1 Lobby', icon: Swords },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const statusColors: Record<DashboardGame['status'], string> = {
  '1v1 Live': 'bg-red-500/20 text-red-400 border-red-500/50',
  Solo: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  'Co-op': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  Tournament: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
};

function GameCard({ game, onPlay }: { game: DashboardGame; onPlay: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPlay(game.id)}
      className="group relative w-full rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden text-left transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]"
    >
      <div
        className="aspect-video relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${game.accentFrom}33, ${game.accentTo}55)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Gamepad2 className="h-12 w-12 text-white/30" />
        </div>
        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[game.status]}`}
          >
            {game.status === '1v1 Live' && (
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            )}
            {game.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-white text-lg mb-1 group-hover:text-indigo-400 transition-colors">
          {game.title}
        </h3>
        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{game.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Users className="h-4 w-4" />
            <span>{game.playerCount.toLocaleString()} playing</span>
          </div>
          <span className="text-xs text-slate-600 bg-slate-800 px-2 py-1 rounded">{game.category}</span>
        </div>
      </div>
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-500/30 pointer-events-none transition-all duration-300" />
    </button>
  );
}

function Sidebar({
  activeTab,
  setActiveTab,
  onOpenLobby,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLobby?: () => void;
}) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 z-40 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight">Brainrot</h1>
            <p className="text-xs text-indigo-400 font-medium">Battle Arena</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === '1v1-lobby') onOpenLobby?.();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-white border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : ''}`} />
                  {item.label}
                  {item.id === '1v1-lobby' && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-gradient-to-br from-indigo-600/10 to-violet-600/10 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-xs text-slate-400">Daily Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">7 Days</p>
          <p className="text-xs text-indigo-400 mt-1">Keep it up!</p>
        </div>
      </div>
    </aside>
  );
}

function Header({ user }: { user: BrainrotBattleDashboardProps['user'] }) {
  const u = user ?? defaultUser;
  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{u.name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                <Crown className="h-3 w-3 text-amber-400" />
                Level {u.level}
              </p>
            </div>
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 ${
                  u.status === 'online' ? 'bg-green-500' : u.status === 'away' ? 'bg-amber-500' : 'bg-slate-500'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroSection({
  gameOfTheDay,
  onLaunch,
}: {
  gameOfTheDay: DashboardFeaturedGame;
  onLaunch: (gameId: string) => void;
}) {
  return (
    <section className="relative rounded-2xl overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900/80 to-violet-900/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
      <div className="relative backdrop-blur-sm bg-slate-900/40 border border-slate-700/50 rounded-2xl p-8 md:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30">
              <span className="text-sm">{gameOfTheDay.badge}</span>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Game of the Day
              </span>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 text-balance">
                {gameOfTheDay.title}
              </h2>
              <p className="text-lg text-indigo-400 font-medium">{gameOfTheDay.subtitle}</p>
            </div>
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed">{gameOfTheDay.description}</p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onLaunch(gameOfTheDay.id)}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
              >
                <Play className="h-5 w-5" fill="currentColor" />
                Launch Game
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-all"
              >
                <Trophy className="h-5 w-5" />
                View Leaderboard
              </button>
            </div>
          </div>
          <div className="lg:w-80 xl:w-96">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <Gamepad2 className="h-20 w-20 text-indigo-500/50 mx-auto mb-4" />
                <p className="text-slate-500 text-sm">Featured Art</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}

export default function BrainrotBattleDashboard({
  games: gamesProp,
  gameOfTheDay: gameOfTheDayProp,
  user = defaultUser,
  onLaunchGame,
  onOpenLobby,
}: BrainrotBattleDashboardProps) {
  const [activeTab, setActiveTab] = useState('all-games');

  const games = useMemo(() => gamesProp ?? miniGamesToDashboardGames(), [gamesProp]);
  const gameOfTheDay = useMemo(
    () => gameOfTheDayProp ?? getFeaturedGameOfTheDay(games),
    [gameOfTheDayProp, games],
  );

  const handleLaunch = (gameId: string) => {
    onLaunchGame?.(gameId);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenLobby={onOpenLobby} />
      <div className="ml-64">
        <Header user={user} />
        <main className="p-6 lg:p-8">
          <HeroSection gameOfTheDay={gameOfTheDay} onLaunch={handleLaunch} />
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">All Mini-Games ({games.length})</h2>
                <p className="text-slate-400 mt-1">Click any card to boot a 1v1 match with that title</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} onPlay={handleLaunch} />
              ))}
            </div>
          </section>
          <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Mini-Games Live</p>
                  <p className="text-2xl font-bold text-white">{games.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-violet-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Swords className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">1v1 Lobby</p>
                  <button
                    type="button"
                    onClick={onOpenLobby}
                    className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors"
                  >
                    Enter →
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">First to 3 Rounds</p>
                  <p className="text-2xl font-bold text-white">Wins Match</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
