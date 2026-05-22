import './index.css';

import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import { FanumTaxMatchView } from './components/FanumTaxMatchView';
import { MY_ARCADE_GAMES } from './data/arcadeGames';

export default function App() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  if (activeGameId === null) {
    return (
      <Dashboard
        gamesList={MY_ARCADE_GAMES}
        onLaunchGame={(gameId) => setActiveGameId(gameId)}
        onOpenLobby={() => setActiveGameId('fanum-heist')}
      />
    );
  }

  if (activeGameId === 'fanum-heist') {
    return <FanumTaxMatchView onLeave={() => setActiveGameId(null)} />;
  }

  const placeholder = MY_ARCADE_GAMES.find((g) => g.id === activeGameId);

  return (
    <div className="min-h-screen w-full bg-black text-white p-6 flex flex-col">
      <button
        type="button"
        onClick={() => setActiveGameId(null)}
        className="mb-4 inline-flex w-fit items-center gap-2 rounded-lg border border-indigo-500/50 bg-indigo-600/20 px-4 py-2 text-sm font-bold text-indigo-300 hover:bg-indigo-600/40 hover:text-white"
      >
        ← Leave Match / Back to Arcade
      </button>
      <h1 className="text-3xl font-black tracking-widest text-indigo-500">BRAINROT ARENA</h1>
      <p className="mt-4 text-slate-400">
        <span className="font-bold text-white">{placeholder?.title ?? 'Game'}</span> is coming soon.
        Fanum Tax Heist is live — select it from the arcade hub.
      </p>
    </div>
  );
}
