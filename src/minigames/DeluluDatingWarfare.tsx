import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';

const CLUES = ['Fake text analysis', 'He looked at me once', 'Mercury retrograde', 'Dream #47'];

export function DeluluDatingWarfare(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [links1, setLinks1] = useState<string[]>([]);
  const [links2, setLinks2] = useState<string[]>([]);
  const [reality1, setReality1] = useState(100);
  const [reality2, setReality2] = useState(100);

  useEffect(() => {
    trackInterval(() => {
      setReality1((r) => r - 3);
      setReality2((r) => r - 3);
    }, 2000);
    if (links1.length >= 4) props.onGameEnd(props.player1.id);
    if (links2.length >= 4) props.onGameEnd(props.player2.id);
    if (reality1 <= 0) props.onGameEnd(props.player2.id);
    if (reality2 <= 0) props.onGameEnd(props.player1.id);
    return purge;
  }, [links1, links2, reality1, reality2]);

  const connect = (who: 'p1' | 'p2', clue: string) => {
    if (who === 'p1') setLinks1((l) => (l.includes(clue) ? l : [...l, clue]));
    else setLinks2((l) => (l.includes(clue) ? l : [...l, clue]));
    props.sendAction({ type: 'delulu', payload: { clue } });
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          <Meter label="Reality Meter" value={reality1} max={100} color="#ff10f0" />
          <p className="mb-2 text-xs font-bold">Schizo Evidence Board</p>
          <svg viewBox="0 0 200 120" className="mb-2 w-full border-2 border-black bg-black/50">
            {links1.map((_, i) => (
              <line key={i} x1={20 + i * 40} y1="20" x2={100} y2="80" stroke="#39ff14" strokeWidth="2" />
            ))}
            {CLUES.map((c, i) => (
              <circle key={c} cx={30 + i * 45} cy={30 + (i % 2) * 40} r="8" fill="#bf00ff" />
            ))}
          </svg>
          <div className="flex flex-wrap gap-1">
            {CLUES.map((c) => (
              <NeonButton key={c} variant="green" className="text-[10px]" onClick={() => connect('p1', c)}>
                {c}
              </NeonButton>
            ))}
          </div>
        </div>
      )}
      renderP2={() => (
        <div>
          <Meter label="Reality Meter" value={reality2} max={100} color="#ff10f0" />
          <div className="flex flex-wrap gap-1">
            {CLUES.map((c) => (
              <NeonButton key={c} variant="purple" className="text-[10px]" onClick={() => connect('p2', c)}>
                {c}
              </NeonButton>
            ))}
          </div>
        </div>
      )}
    />
  );
}
