import { useCallback, useState } from 'react';
import type { PlayerState } from '../types/game';
import { useActionBus } from '../hooks/useActionBus';
import { FanumTaxHeist } from '../minigames/FanumTaxHeist';

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

interface FanumTaxMatchViewProps {
  onLeave: () => void;
}

export function FanumTaxMatchView({ onLeave }: FanumTaxMatchViewProps) {
  const [player1, setPlayer1] = useState<PlayerState>(DEFAULT_P1);
  const [player2, setPlayer2] = useState<PlayerState>(DEFAULT_P2);
  const [roundKey, setRoundKey] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'round_end' | 'match_end'>('playing');
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const bus = useActionBus('system');

  const handleGameEnd = useCallback(
    (winnerId: string) => {
      setLastWinner(winnerId);
      setPhase('round_end');

      const nextP1 = { ...player1 };
      const nextP2 = { ...player2 };
      if (winnerId === player1.id) nextP1.roundWins += 1;
      else nextP2.roundWins += 1;
      setPlayer1(nextP1);
      setPlayer2(nextP2);

      const matchOver =
        nextP1.roundWins >= ROUNDS_TO_WIN || nextP2.roundWins >= ROUNDS_TO_WIN;

      setTimeout(() => {
        if (matchOver) {
          setPhase('match_end');
        } else {
          setCurrentRound((r) => r + 1);
          setRoundKey((k) => k + 1);
          setPhase('playing');
        }
      }, 1800);
    },
    [player1, player2],
  );

  const winnerName =
    lastWinner === player1.id
      ? player1.name
      : lastWinner === player2.id
        ? player2.name
        : null;

  return (
    <div className="min-h-screen w-full bg-black text-white p-6 flex flex-col">
      <button
        type="button"
        onClick={onLeave}
        className="mb-4 inline-flex w-fit items-center gap-2 rounded-lg border border-indigo-500/50 bg-indigo-600/20 px-4 py-2 text-sm font-bold text-indigo-300 transition hover:bg-indigo-600/40 hover:text-white"
      >
        ← Leave Match / Back to Arcade
      </button>

      <header className="mb-4 flex flex-col gap-1 border-b border-slate-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-widest text-indigo-500">BRAINROT ARENA</h1>
          <p className="text-sm font-semibold text-slate-400">1v1 • FIRST TO {ROUNDS_TO_WIN} ROUNDS</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-400">Fanum Tax Heist — Round {currentRound}</p>
      </header>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4">
          <p className="text-xs font-bold uppercase text-emerald-400">{player1.name}</p>
          <p className="text-3xl font-black text-white">{player1.roundWins}</p>
          <p className="text-xs text-slate-500">Round wins</p>
        </div>
        <div className="rounded-xl border border-violet-500/40 bg-violet-950/40 p-4">
          <p className="text-xs font-bold uppercase text-violet-400">{player2.name}</p>
          <p className="text-3xl font-black text-white">{player2.roundWins}</p>
          <p className="text-xs text-slate-500">Round wins</p>
        </div>
      </div>

      {phase === 'round_end' && winnerName && (
        <div className="mb-4 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-center font-black text-amber-300">
          {winnerName} wins round {currentRound}!
        </div>
      )}

      {phase === 'match_end' && (
        <div className="mb-4 rounded-lg border border-indigo-500/60 bg-indigo-600/20 px-4 py-4 text-center">
          <p className="text-lg font-black text-indigo-300">MATCH CHAMPION</p>
          <p className="text-2xl font-black text-white">
            {player1.roundWins >= ROUNDS_TO_WIN ? player1.name : player2.name}
          </p>
        </div>
      )}

      <section className="min-h-0 flex-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-bold text-slate-300">Game Arena</span>
          <span>•</span>
          <span>Mash grid — steal food • First stash to 50 wins the round</span>
          <span className="flex gap-1 text-lg">🍔 🌮 🍕 🍟 🥤</span>
        </p>
        {phase !== 'match_end' && (
          <div key={roundKey} className="min-h-[320px]">
            <FanumTaxHeist
              player1={player1}
              player2={player2}
              onGameEnd={handleGameEnd}
              sendAction={(action) => bus.sendAction(action)}
            />
          </div>
        )}
        {phase === 'match_end' && (
          <button
            type="button"
            onClick={onLeave}
            className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-500"
          >
            Back to Arcade
          </button>
        )}
      </section>
    </div>
  );
}
