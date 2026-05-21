import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';
import { randInt } from '../utils/random';

const TRAPS = [
  'TikTok autoplay room',
  'Infinite YouTube shorts',
  'AI voice Reddit stories',
  'Family Guy clip projector',
];

export function BrainCellExtractionFacility(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [code] = useState(() => randInt(1000, 9999).toString());
  const [guess, setGuess] = useState('');
  const [iq, setIq] = useState(100);
  const [points, setPoints] = useState(10);
  const [trapOverlay, setTrapOverlay] = useState<string | null>(null);

  useEffect(() => {
    trackInterval(() => setIq((i) => i - 2), 1000);
    if (iq <= 0) props.onGameEnd(props.player2.id);
    if (guess === code) props.onGameEnd(props.player1.id);
    return purge;
  }, [iq, guess, code]);

  const trap = (name: string) => {
    if (points < 2) return;
    setPoints((p) => p - 2);
    setTrapOverlay(name);
    setTimeout(() => setTrapOverlay(null), 2500);
    props.sendAction({ type: 'trap', payload: { name } });
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div className="relative">
          {trapOverlay && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 p-4">
              <p className="flash-text text-center text-sm">{trapOverlay}</p>
            </div>
          )}
          <p className="mb-2 text-xs">Escapee — decode key (hint: 4 digits)</p>
          <Meter label="IQ" value={iq} max={100} color={props.player1.color} />
          <input
            className="mb-2 w-full border-4 border-black bg-white p-2 text-black"
            placeholder="Access key..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <p className="text-[10px] opacity-60">Encrypted: {code.split('').map(() => '*').join('')}</p>
        </div>
      )}
      renderP2={() => (
        <div>
          <p className="mb-2 text-xs">Facility Controller</p>
          <p className="mb-2 text-xs">Trap points: {points}</p>
          <div className="flex flex-col gap-1">
            {TRAPS.map((t) => (
              <NeonButton key={t} variant="purple" className="text-[10px]" onClick={() => trap(t)}>
                {t}
              </NeonButton>
            ))}
          </div>
        </div>
      )}
    />
  );
}
