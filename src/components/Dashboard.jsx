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

const ACCENTS = [
  { from: '#39ff14', to: '#00f5ff' },
  { from: '#bf00ff', to: '#ff10f0' },
  { from: '#ffff00', to: '#39ff14' },
  { from: '#ff10f0', to: '#bf00ff' },
  { from: '#00f5ff', to: '#bf00ff' },
  { from: '#39ff14', to: '#ffff00' },
];

const statusColors = {
  '1v1 Live': 'bg-red-500/20 text-red-400 border-red-500/50',
  Solo: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  'Co-op': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  Tournament: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
};

const defaultUser = {
  name: 'xX_ProGamer_Xx',
  avatar: '',
  level: 42,
  status: 'online',
};

const navItems = [
  { id: 'all-games', label: 'All Games', icon: Gamepad2 },
  { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
  { id: '1v1-lobby', label: '1v1 Lobby', icon: Swords },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function pseudoPlayerCount(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return 1200 + (hash % 18000);
}

function GameCard({ game, onPlay }) {
  const accent = game.accent ?? ACCENTS[0];
  const statusClass = statusColors[game.type] ?? statusColors['1v1 Live'];

  return (
    <button
      type="button"
      onClick={() => onPlay(game.id)}
      className="group relative w-full rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden text-left transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]"
    >
      <div
        className="aspect-video relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent.from}33, ${accent.to}55)`,
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
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClass}`}
          >
            {game.type === '1v1 Live' && (
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            )}
            {game.type}
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
        </div>
      </div>
    </button>
  );
}

function Sidebar({ activeTab, setActiveTab, onOpenLobby }) {
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
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === '1v1-lobby') onOpenLobby?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-white border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-indigo-400' : ''}`} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function Header({ user }) {
  const u = user ?? defaultUser;
  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{u.name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                <Crown className="h-3 w-3 text-amber-400" />
                Level {u.level}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold">
              {u.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ featured, onLaunch }) {
  return (
    <section className="relative rounded-2xl overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900/80 to-violet-900/50" />
      <div className="relative backdrop-blur-sm bg-slate-900/40 border border-slate-700/50 rounded-2xl p-8 md:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
              <span className="text-sm">🔥 Hot</span>
              <span className="text-xs font-semibold text-indigo-300 uppercase">Game of the Day</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">{featured.title}</h2>
            <p className="text-lg text-indigo-400 font-medium">Featured 1v1 — jump in now</p>
            <p className="text-slate-300 text-lg max-w-xl">{featured.description}</p>
            <button
              type="button"
              onClick={() => onLaunch(featured.id)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
            >
              <Play className="h-5 w-5" fill="currentColor" />
              Launch Game
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="lg:w-80 aspect-square rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
            <Gamepad2 className="h-20 w-20 text-indigo-500/50" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * v0 Dashboard — maps gamesList prop to the design grid (no hardcoded mocks).
 */
export default function Dashboard({ gamesList = [], onLaunchGame, onOpenLobby }) {
  const [activeTab, setActiveTab] = useState('all-games');

  const cards = useMemo(
    () =>
      gamesList.map((game, index) => ({
        ...game,
        playerCount: pseudoPlayerCount(game.id),
        accent: ACCENTS[index % ACCENTS.length],
      })),
    [gamesList],
  );

  const featured = cards[0] ?? {
    id: 'fanum-heist',
    title: 'Fanum Tax Heist',
    description: 'Fast-paced 1v1 multiplayer food snatching battle.',
  };

  return (
    <div className="min-h-screen w-full bg-slate-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenLobby={onOpenLobby} />
      <div className="ml-64 min-h-screen">
        <Header user={defaultUser} />
        <main className="p-6 lg:p-8">
          <HeroSection featured={featured} onLaunch={(id) => onLaunchGame?.(id)} />
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              Arcade Library ({cards.length} games)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cards.map((game) => (
                <GameCard key={game.id} game={game} onPlay={(id) => onLaunchGame?.(id)} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
