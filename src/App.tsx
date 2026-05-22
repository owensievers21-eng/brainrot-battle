import { useCallback, useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import { GameManager } from './components/GameManager';
import { MINI_GAMES } from './minigames';

type AppView = 'dashboard' | 'arena';

export default function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [preferredGameId, setPreferredGameId] = useState<string | null>(null);
  const [arenaSession, setArenaSession] = useState(0);

  const launchGame = useCallback((gameId: string | null) => {
    setPreferredGameId(gameId);
    setArenaSession((n) => n + 1);
    setView('arena');
  }, []);

  if (view === 'dashboard') {
    return (
      <Dashboard
        gamesList={MINI_GAMES}
        onLaunchGame={(gameId) => launchGame(gameId)}
        onOpenLobby={() => launchGame(null)}
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
