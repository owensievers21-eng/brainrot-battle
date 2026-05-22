import { useMemo, useState } from 'react';
import BrainrotBattleDashboard from './components/BrainrotBattleDashboard';
import { GameManager } from './components/GameManager';
import { getFeaturedGameOfTheDay, miniGamesToDashboardGames } from './lib/dashboardGames';

type AppView = 'dashboard' | 'arena';

export default function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [preferredGameId, setPreferredGameId] = useState<string | null>(null);
  const [arenaSession, setArenaSession] = useState(0);

  const dashboardGames = useMemo(() => miniGamesToDashboardGames(), []);
  const featured = useMemo(() => getFeaturedGameOfTheDay(dashboardGames), [dashboardGames]);

  const openArena = (gameId: string | null) => {
    setPreferredGameId(gameId);
    setArenaSession((n) => n + 1);
    setView('arena');
  };

  if (view === 'dashboard') {
    return (
      <BrainrotBattleDashboard
        games={dashboardGames}
        gameOfTheDay={featured}
        onLaunchGame={(id) => openArena(id)}
        onOpenLobby={() => openArena(null)}
      />
    );
  }

  return (
    <GameManager
      key={`arena-${arenaSession}`}
      preferredGameId={preferredGameId}
      onExitToDashboard={() => {
        setPreferredGameId(null);
        setView('dashboard');
      }}
    />
  );
}
