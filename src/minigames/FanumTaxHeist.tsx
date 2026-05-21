import { useEffect, useRef, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { pick } from '../utils/random';

const FOOD = ['🍕', '🍔', '🍟', '🥤', '🌮'];

export function FanumTaxHeist(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [grid, setGrid] = useState(() => FOOD.map((f) => ({ f, owner: null as string | null })));
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [shake, setShake] = useState(false);
  const [scramble2, setScramble2] = useState(false);
  const target = useRef(50);

  useEffect(() => {
    trackInterval(() => {
      setGrid((g) =>
        g.map((cell) => (Math.random() > 0.7 ? { ...cell, owner: null, f: pick(FOOD) } : cell)),
      );
    }, 2000);
    if (score1 >= target.current) props.onGameEnd(props.player1.id);
    if (score2 >= target.current) props.onGameEnd(props.player2.id);
    return purge;
  }, [score1, score2]);

  const pull = (who: string, idx: number, setScore: (fn: (n: number) => number) => void) => {
    let stolen = false;
    setGrid((g) => {
      const cell = g[idx];
      if (!cell) return g;
      stolen = Boolean(cell.owner && cell.owner !== who);
      if (stolen) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        props.sendAction({ type: 'fanum', payload: { text: 'FANUM TAX' } });
      }
      if (cell.f === '🥤' && who === props.player2.id) setScramble2(true);
      const next = [...g];
      next[idx] = { ...cell, owner: who };
      return next;
    });
    setScore((s) => s + (stolen ? 8 : 4));
  };

  return (
    <div className={shake ? 'animate-screen-shake' : ''}>
      {shake && (
        <p className="flash-text pointer-events-none fixed inset-x-0 top-1/3 z-50 text-center text-6xl">
          FANUM TAX
        </p>
      )}
      <DualPane
        props={props}
        renderP1={() => (
          <div>
            <Meter label="Stash" value={score1} max={target.current} color={props.player1.color} />
            <p className="mb-2 text-xs">Mash grid — key buffs on food</p>
            <Grid grid={grid} onPull={(i) => pull(props.player1.id, i, setScore1)} />
          </div>
        )}
        renderP2={() => (
          <div className={scramble2 ? 'rotate-90' : ''}>
            <Meter label="Stash" value={score2} max={target.current} color={props.player2.color} />
            <Grid grid={grid} onPull={(i) => pull(props.player2.id, i, setScore2)} />
          </div>
        )}
      />
    </div>
  );
}

function Grid({
  grid,
  onPull,
}: {
  grid: { f: string; owner: string | null }[];
  onPull: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1">
      {grid.map((cell, i) => (
        <button
          key={i}
          type="button"
          className={`border-2 border-black p-2 text-lg ${cell.owner === 'p1' ? 'bg-neon-green/40' : cell.owner === 'p2' ? 'bg-neon-purple/40' : 'bg-black/60'}`}
          onClick={() => onPull(i)}
        >
          {cell.f}
        </button>
      ))}
    </div>
  );
}
