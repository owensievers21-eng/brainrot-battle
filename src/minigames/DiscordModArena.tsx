import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';

const CARDS = [
  { id: 'kitten', label: 'Recruit e-kitten', cost: 2, power: 8 },
  { id: 'ban', label: 'Ban user', cost: 3, power: 12 },
  { id: 'ratio', label: 'Ratio opponent', cost: 4, power: 15 },
  { id: 'wall', label: 'Defensive wall', cost: 2, power: 6 },
];

export function DiscordModArena(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [auth1, setAuth1] = useState(20);
  const [auth2, setAuth2] = useState(20);
  const [energy1, setEnergy1] = useState(5);
  const [energy2, setEnergy2] = useState(5);
  const [raid, setRaid] = useState(false);

  useEffect(() => {
    trackInterval(() => {
      setEnergy1((e) => Math.min(10, e + 1));
      setEnergy2((e) => Math.min(10, e + 1));
    }, 2000);
    trackInterval(() => {
      setRaid(true);
      setAuth1((a) => a - 5);
      setAuth2((a) => a - 5);
      setTimeout(() => setRaid(false), 2000);
    }, 12000);
    if (auth1 >= 100) props.onGameEnd(props.player1.id);
    if (auth2 >= 100) props.onGameEnd(props.player2.id);
    if (auth1 <= 0) props.onGameEnd(props.player2.id);
    if (auth2 <= 0) props.onGameEnd(props.player1.id);
    return purge;
  }, [auth1, auth2]);

  const play = (who: 'p1' | 'p2', card: (typeof CARDS)[0]) => {
    if (who === 'p1') {
      if (energy1 < card.cost) return;
      setEnergy1((e) => e - card.cost);
      setAuth1((a) => a + card.power);
      setAuth2((a) => Math.max(0, a - card.power / 2));
    } else {
      if (energy2 < card.cost) return;
      setEnergy2((e) => e - card.cost);
      setAuth2((a) => a + card.power);
      setAuth1((a) => Math.max(0, a - card.power / 2));
    }
    props.sendAction({ type: 'card', payload: { card: card.id } });
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          {raid && <p className="flash-text text-xs">CANCELLATION RAID</p>}
          <Meter label="Mod Authority" value={auth1} max={100} color={props.player1.color} />
          <p className="text-xs">Energy: {energy1}</p>
          <div className="mt-2 flex flex-col gap-1">
            {CARDS.map((c) => (
              <NeonButton key={c.id} variant="green" className="text-[10px]" onClick={() => play('p1', c)}>
                {c.label} ({c.cost})
              </NeonButton>
            ))}
          </div>
        </div>
      )}
      renderP2={() => (
        <div>
          <Meter label="Mod Authority" value={auth2} max={100} color={props.player2.color} />
          <p className="text-xs">Energy: {energy2}</p>
          <div className="mt-2 flex flex-col gap-1">
            {CARDS.map((c) => (
              <NeonButton key={c.id} variant="purple" className="text-[10px]" onClick={() => play('p2', c)}>
                {c.label} ({c.cost})
              </NeonButton>
            ))}
          </div>
        </div>
      )}
    />
  );
}
