import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter, ActionRow, EventBanner } from './shared';
import { pick } from '../utils/random';

const OPTIONS = [
  { id: 'aura', label: 'Unspoken Aura', power: 12 },
  { id: 'stare', label: 'Lock-In Stare', power: 18 },
  { id: 'w', label: 'Infinite W Rizz', power: 25 },
  { id: 'dmg', label: 'Emotional Damage Counter', power: 15 },
];

const EVENTS = [
  'NPC develops trust issues',
  'Sigma rival enters the chat',
  'NPC asks for your zodiac sign',
  'Rizz tax audit incoming',
];

const LINES = ['ayo', 'respectfully', 'no cap', 'its giving main character'];

export function RizzRoyale(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [p1, setP1] = useState(30);
  const [p2, setP2] = useState(30);
  const [event, setEvent] = useState(EVENTS[0]);

  useEffect(() => {
    trackInterval(() => {
      setEvent(pick(EVENTS));
      setP1((v) => Math.max(0, v - 1));
      setP2((v) => Math.max(0, v - 1));
    }, 2000);
    trackInterval(() => {
      if (p1 >= 100) props.onGameEnd(props.player1.id);
      else if (p2 >= 100) props.onGameEnd(props.player2.id);
    }, 400);
    return purge;
  }, [p1, p2]);

  const boost = (who: 'p1' | 'p2', power: number) => {
    const line = pick(LINES);
    props.sendAction({ type: 'rizz', payload: { who, line } });
    if (who === 'p1') setP1((v) => Math.min(100, v + power));
    else setP2((v) => Math.min(100, v + power));
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          <EventBanner text={`NPC: "${event}"`} />
          <Meter label="Rizz Meter" value={p1} max={100} color={props.player1.color} />
          <ActionRow actions={OPTIONS} onPick={(_, p) => boost('p1', p)} />
        </div>
      )}
      renderP2={() => (
        <div>
          <Meter label="Rizz Meter" value={p2} max={100} color={props.player2.color} />
          <ActionRow actions={OPTIONS} onPick={(_, p) => boost('p2', p)} />
        </div>
      )}
    />
  );
}
