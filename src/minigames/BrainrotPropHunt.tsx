import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane } from './shared';
import { NeonButton } from '../components/NeonButton';
import { pick, randInt } from '../utils/random';

const IDENTITIES = ['Prime bottle', 'Kai Cenat chair', 'Subway clip', 'Talking toilet'];

export function BrainrotPropHunt(props: MiniGameProps) {
  const { trackTimeout } = useCleanup();
  const [hiderSpot] = useState(randInt(0, 24));
  const [identity] = useState(pick(IDENTITIES));
  const [energy, setEnergy] = useState(3);
  const [found, setFound] = useState<number[]>([]);
  const [scramble, setScramble] = useState(false);
  const [time, setTime] = useState(45);

  useEffect(() => {
    const t = setInterval(() => setTime((x) => x - 1), 1000);
    if (time <= 0) props.onGameEnd(props.player2.id);
    if (found.includes(hiderSpot)) props.onGameEnd(props.player1.id);
    return () => clearInterval(t);
  }, [time, found, hiderSpot]);

  const search = (idx: number) => {
    setFound((f) => [...f, idx]);
    props.sendAction({ type: 'search', payload: { idx } });
  };

  const whisper = () => {
    if (energy <= 0) return;
    setEnergy((e) => e - 1);
    setScramble(true);
    trackTimeout(() => setScramble(false), 3000);
    props.sendAction({ type: 'whisper', payload: { phrase: 'skibidi rizz ohio' } });
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          <p className="mb-2 text-xs">Hunter — find the prop!</p>
          <Grid25
            onClick={search}
            label={scramble ? '???' : undefined}
            highlight={found}
          />
        </div>
      )}
      renderP2={() => (
        <div>
          <p className="mb-2 text-xs">
            Hider: {identity} @ tile {scramble ? '??' : hiderSpot}
          </p>
          <NeonButton variant="purple" onClick={whisper}>
            Whisper ({energy})
          </NeonButton>
          <p className="mt-2 text-xs">Survive {time}s</p>
        </div>
      )}
    />
  );
}

function Grid25({
  onClick,
  label,
  highlight,
}: {
  onClick: (i: number) => void;
  label?: string;
  highlight: number[];
}) {
  return (
    <div className="grid grid-cols-5 gap-1">
      {Array.from({ length: 25 }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`border-2 border-black p-2 text-[10px] ${highlight.includes(i) ? 'bg-neon-pink' : 'bg-black/60'}`}
          onClick={() => onClick(i)}
        >
          {label ?? i}
        </button>
      ))}
    </div>
  );
}
