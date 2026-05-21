import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';

const HEALS = ['Cold shower', 'Protein shake', 'Stoic silence'];
const SWARMS = ['Twitter argument', 'Doomscroll static', 'Emotional manipulation'];

export function GigachadBossFight(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [bossHp, setBossHp] = useState(200);
  const [swarmDmg, setSwarmDmg] = useState(0);
  const [units, setUnits] = useState(0);

  useEffect(() => {
    trackInterval(() => {
      setUnits((u) => u + 2);
      const dmg = units * 2 + swarmDmg;
      setBossHp((h) => h - dmg);
      setSwarmDmg(0);
    }, 1500);
    if (bossHp <= 0) props.onGameEnd(props.player2.id);
    if (bossHp >= 300) props.onGameEnd(props.player1.id);
    return purge;
  }, [bossHp, units, swarmDmg]);

  const heal = (type: string) => {
    setBossHp((h) => Math.min(300, h + 25));
    props.sendAction({ type: 'heal', payload: { type } });
  };

  const spawn = (effect: string) => {
    setSwarmDmg((d) => d + 15);
    props.sendAction({ type: 'swarm', payload: { effect } });
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          <p className="mb-2 font-black text-neon-green">GIGACHAD BOSS</p>
          <Meter label="Boss HP" value={bossHp} max={300} color={props.player1.color} />
          <div className="flex flex-wrap gap-1">
            {HEALS.map((h) => (
              <NeonButton key={h} variant="green" className="text-[10px]" onClick={() => heal(h)}>
                {h}
              </NeonButton>
            ))}
          </div>
        </div>
      )}
      renderP2={() => (
        <div>
          <p className="mb-2 font-black text-neon-purple">SWARM COMMANDER</p>
          <p className="text-xs">Units: {units}</p>
          <div className="flex flex-wrap gap-1">
            {SWARMS.map((s) => (
              <NeonButton key={s} variant="purple" className="text-[10px]" onClick={() => spawn(s)}>
                {s}
              </NeonButton>
            ))}
          </div>
        </div>
      )}
    />
  );
}
