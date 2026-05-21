import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';
import { pick, randInt } from '../utils/random';

const MAPS = ['Mall', 'School'];
const ITEMS = ['Plunger Shotgun', 'Toilet Tsunami', 'Bass-Boost Scream', 'Flush Teleport'];

export function SkibidiToiletDuel(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [map] = useState(pick(MAPS));
  const [hq1, setHq1] = useState(100);
  const [hq2, setHq2] = useState(100);
  const [item, setItem] = useState(ITEMS[0]);

  useEffect(() => {
    trackInterval(() => setItem(pick(ITEMS)), 4000);
    return purge;
  }, []);

  useEffect(() => {
    if (hq1 <= 0) props.onGameEnd(props.player2.id);
    if (hq2 <= 0) props.onGameEnd(props.player1.id);
  }, [hq1, hq2]);

  const attack = (from: 'p1' | 'p2') => {
    const dmg = randInt(8, 22);
    props.sendAction({ type: 'skibidi', payload: { item, from, dmg } });
    if (from === 'p1') setHq2((h) => h - dmg);
    else setHq1((h) => h - dmg);
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div className="text-xs">
          <p className="font-black text-neon-green">CAMERAMAN • {map}</p>
          <p className="mb-2 text-neon-cyan">Loot: {item}</p>
          <Meter label="Enemy HQ Toilet" value={hq2} max={100} color="#ff10f0" />
          <div className="mt-2 grid grid-cols-4 gap-1 font-mono text-[10px]">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-black bg-neon-purple/30 p-2">
                {i % 5 === 0 ? '🚽' : '▪'}
              </div>
            ))}
          </div>
          <NeonButton className="mt-2 w-full" variant="green" onClick={() => attack('p1')}>
            Deploy Item
          </NeonButton>
        </div>
      )}
      renderP2={() => (
        <div className="text-xs">
          <p className="font-black text-neon-pink">SKIBIDI MUTANT</p>
          <Meter label="Enemy HQ Toilet" value={hq1} max={100} color="#39ff14" />
          <NeonButton className="mt-2 w-full" variant="purple" onClick={() => attack('p2')}>
            Mutate & Strike
          </NeonButton>
        </div>
      )}
    />
  );
}
