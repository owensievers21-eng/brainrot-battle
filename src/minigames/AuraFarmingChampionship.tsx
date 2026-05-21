import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { pick } from '../utils/random';

const PROMPTS = [
  { key: 'E', label: 'Slow-motion entrance' },
  { key: 'H', label: 'Hoodie physics' },
  { key: 'I', label: 'Ignore perfectly' },
  { key: 'S', label: 'Sit mysteriously' },
];

export function AuraFarmingChampionship(props: MiniGameProps) {
  const { trackTimeout, trackInterval, purge } = useCleanup();
  const [aura1, setAura1] = useState(50);
  const [aura2, setAura2] = useState(50);
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    trackInterval(() => {
      const p = pick(PROMPTS);
      setPrompt(p);
      setActive(true);
      trackTimeout(() => setActive(false), 1200);
    }, 2500);
    if (aura1 >= 100) props.onGameEnd(props.player1.id);
    if (aura2 >= 100) props.onGameEnd(props.player2.id);
    if (aura1 <= -20) props.onGameEnd(props.player2.id);
    if (aura2 <= -20) props.onGameEnd(props.player1.id);
    return purge;
  }, [aura1, aura2]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!active) return;
      if (e.key.toUpperCase() === prompt.key) {
        setAura1((a) => a + 12);
        props.sendAction({ type: 'aura', payload: { who: 'p1' } });
      }
      if (e.key === 'Enter') {
        setAura2((a) => a + 12);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, prompt]);

  useEffect(() => {
    if (!active) return;
    trackTimeout(() => {
      setAura1((a) => a - 15);
      setAura2((a) => a - 15);
    }, 1300);
  }, [active, prompt]);

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          <p className="mb-2 text-xs">School hallway cinematic</p>
          <Meter label="Aura" value={aura1 + 20} max={120} color={props.player1.color} />
          {active && (
            <p className="flash-text border-4 border-black bg-black p-4 text-center text-2xl">
              [{prompt.key}] {prompt.label}
            </p>
          )}
        </div>
      )}
      renderP2={() => (
        <div>
          <Meter label="Aura" value={aura2 + 20} max={120} color={props.player2.color} />
          {active && (
            <p className="text-center text-sm text-neon-cyan">P2: press Enter on prompt</p>
          )}
        </div>
      )}
    />
  );
}
