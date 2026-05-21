import { useCallback, useMemo, useState } from 'react';
import type { MatchPhase, PlayerState } from '../types/game';
import { useActionBus } from '../hooks/useActionBus';
import { MINI_GAMES, pickRandomGame } from '../minigames';
import { NeonButton } from './NeonButton';

const ROUNDS_TO_WIN = 3;

const DEFAULT_P1: PlayerState = {
  id: 'p1',
  name: 'Player 1',
  roundWins: 0,
  color: '#39ff14',
};

const DEFAULT_P2: PlayerState = {
  id: 'p2',
  name: 'Player 2',
  roundWins: 0,
  color: '#bf00ff',
};

export function GameManager() {
  const [phase, setPhase] = useState<MatchPhase>('lobby');
  const [player1, setPlayer1] = useState<PlayerState>(DEFAULT_P1);
  const [player2, setPlayer2] = useState<PlayerState>(DEFAULT_P2);
  const [p1Ready, setP1Ready] = useState(false);
  const [p2Ready, setP2Ready] = useState(false);
  const [roundKey, setRoundKey] = useState(0);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const bus = useActionBus('system');

  const currentGame = useMemo(
    () => MINI_GAMES.find((g) => g.id === currentGameId) ?? null,
    [currentGameId],
  );

  const startMatchmaking = () => {
    setPhase('matchmaking');
    setTimeout(() => {
      if (p1Ready && p2Ready) beginRound();
      else setPhase('lobby');
    }, 1200);
  };

  const beginRound = useCallback(() => {
    const game = pickRandomGame(currentGameId);
    setCurrentGameId(game.id);
    setRoundKey((k) => k + 1);
    setPhase('round_intro');
    setTimeout(() => setPhase('playing'), 1800);
  }, [currentGameId]);

  const handleGameEnd = useCallback(
    (winnerId: string) => {
      setLastWinner(winnerId);
      setShake(true);
      setPhase('round_end');
      setTimeout(() => setShake(false), 500);

      const nextP1 = { ...player1 };
      const nextP2 = { ...player2 };
      if (winnerId === player1.id) nextP1.roundWins += 1;
      else nextP2.roundWins += 1;
      setPlayer1(nextP1);
      setPlayer2(nextP2);

      const matchOver =
        nextP1.roundWins >= ROUNDS_TO_WIN || nextP2.roundWins >= ROUNDS_TO_WIN;

      setTimeout(() => {
        if (matchOver) setPhase('match_end');
        else beginRound();
      }, 2200);
    },
    [player1, player2, beginRound],
  );

  const resetMatch = () => {
    setPlayer1({ ...DEFAULT_P1 });
    setPlayer2({ ...DEFAULT_P2 });
    setP1Ready(false);
    setP2Ready(false);
    setCurrentGameId(null);
    setLastWinner(null);
    setPhase('lobby');
  };

  const MiniGameComponent = currentGame?.component;

  return (
    <div
      className={`flex h-full min-h-screen flex-col p-3 md:p-4 ${shake ? 'animate-screen-shake' : ''}`}
    >
      <header className="neo-panel mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2 bg-neon-purple/30 px-4 py-3">
        <div>
          <h1 className="flash-text text-2xl md:text-3xl">BRAINROT ARENA</h1>
          <p className="text-xs font-bold text-neon-cyan">1v1 • FIRST TO {ROUNDS_TO_WIN} ROUNDS</p>
        </div>
        <ScoreHud player1={player1} player2={player2} phase={phase} gameName={currentGame?.name} />
      </header>

      <main className="neo-panel min-h-0 flex-1 overflow-hidden p-2">
        {phase === 'lobby' && (
          <Lobby
            p1Ready={p1Ready}
            p2Ready={p2Ready}
            onP1={() => setP1Ready(true)}
            onP2={() => setP2Ready(true)}
            onStart={startMatchmaking}
          />
        )}

        {phase === 'matchmaking' && (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <p className="flash-text text-4xl">MATCHMAKING...</p>
            <p className="animate-pulse-neon text-sm font-bold">Syncing sigma frequencies</p>
          </div>
        )}

        {(phase === 'round_intro' || phase === 'playing') && currentGame && (
          <div className="flex h-full min-h-0 flex-col">
            {phase === 'round_intro' && (
              <div className="mb-2 shrink-0 border-4 border-black bg-neon-yellow px-4 py-3 text-center">
                <p className="flash-text text-xl">ROUND LOCKED</p>
                <p className="font-black text-black">{currentGame.name}</p>
                <p className="text-xs font-bold text-black/70">{currentGame.tagline}</p>
              </div>
            )}
            {phase === 'playing' && MiniGameComponent && (
              <div key={roundKey} className="min-h-0 flex-1">
                <MiniGameComponent
                  player1={player1}
                  player2={player2}
                  onGameEnd={handleGameEnd}
                  sendAction={(action) => bus.sendAction(action)}
                />
              </div>
            )}
          </div>
        )}

        {phase === 'round_end' && (
          <VictorySplash
            winnerName={
              lastWinner === player1.id ? player1.name : lastWinner === player2.id ? player2.name : '???'
            }
            subtitle="ROUND SECURED"
          />
        )}

        {phase === 'match_end' && (
          <div className="flex h-full flex-col items-center justify-center gap-6 animate-screen-flash">
            <VictorySplash
              winnerName={
                player1.roundWins >= ROUNDS_TO_WIN ? player1.name : player2.name
              }
              subtitle="MATCH CHAMPION"
            />
            <NeonButton variant="green" onClick={resetMatch}>
              Run It Back
            </NeonButton>
          </div>
        )}
      </main>
    </div>
  );
}

function ScoreHud({
  player1,
  player2,
  phase,
  gameName,
}: {
  player1: PlayerState;
  player2: PlayerState;
  phase: MatchPhase;
  gameName?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm font-black">
      <span style={{ color: player1.color }}>
        {player1.name}: {player1.roundWins}
      </span>
      <span className="text-neon-yellow">VS</span>
      <span style={{ color: player2.color }}>
        {player2.name}: {player2.roundWins}
      </span>
      {gameName && phase === 'playing' && (
        <span className="border-2 border-black bg-black px-2 py-0.5 text-neon-green">
          {gameName}
        </span>
      )}
    </div>
  );
}

function Lobby({
  p1Ready,
  p2Ready,
  onP1,
  onP2,
  onStart,
}: {
  p1Ready: boolean;
  p2Ready: boolean;
  onP1: () => void;
  onP2: () => void;
  onStart: () => void;
}) {
  return (
    <div className="grid h-full gap-4 md:grid-cols-2">
      <div className="neo-panel flex flex-col items-center justify-center gap-4 bg-neon-green/20 p-6">
        <h2 className="font-black text-black">PLAYER 1</h2>
        <NeonButton variant="green" disabled={p1Ready} onClick={onP1}>
          {p1Ready ? 'LOCKED IN ✓' : 'CONNECT'}
        </NeonButton>
      </div>
      <div className="neo-panel flex flex-col items-center justify-center gap-4 bg-neon-purple/20 p-6">
        <h2 className="font-black text-black">PLAYER 2</h2>
        <NeonButton variant="purple" disabled={p2Ready} onClick={onP2}>
          {p2Ready ? 'LOCKED IN ✓' : 'CONNECT'}
        </NeonButton>
      </div>
      <div className="md:col-span-2 flex justify-center">
        <NeonButton
          variant="yellow"
          className="text-lg"
          disabled={!p1Ready || !p2Ready}
          onClick={onStart}
        >
          ENTER MATCHMAKING
        </NeonButton>
      </div>
    </div>
  );
}

function VictorySplash({ winnerName, subtitle }: { winnerName: string; subtitle: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <p className="flash-text text-5xl md:text-7xl">{subtitle}</p>
      <p className="border-4 border-black bg-neon-pink px-6 py-3 text-3xl font-black text-black">
        {winnerName} WINS
      </p>
    </div>
  );
}
