import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';

export function MewingCombatArena(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [gauge, setGauge] = useState(0);
  const [turn, setTurn] = useState<'p1' | 'p2'>('p1');
  const [stance1, setStance1] = useState(50);
  const [stance2, setStance2] = useState(50);
  const [combo1, setCombo1] = useState(0);
  const [combo2, setCombo2] = useState(0);

  useEffect(() => {
    trackInterval(() => setGauge((g) => (g + 4) % 100), 80);
    if (stance1 <= 0) props.onGameEnd(props.player2.id);
    if (stance2 <= 0) props.onGameEnd(props.player1.id);
    return purge;
  }, [stance1, stance2]);

  const swing = () => {
    const inZone = gauge > 40 && gauge < 60;
    const crit = gauge > 48 && gauge < 52;
    if (turn === 'p1') {
      if (inZone) {
        setStance2((s) => s - (crit ? 22 : 12));
        setCombo1((c) => c + 1);
        props.sendAction({ type: 'crit', payload: { move: crit ? 'Eye-contact critical' : 'Neck parry' } });
      } else setStance1((s) => s - 8);
      setTurn('p2');
    } else {
      if (inZone) {
        setStance1((s) => s - (crit ? 22 : 12));
        setCombo2((c) => c + 1);
      } else setStance2((s) => s - 8);
      setTurn('p1');
    }
    setGauge(0);
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          <Meter label="Sigma Stance" value={stance1} max={100} color={props.player1.color} />
          <p className="text-xs">Combo: {combo1}</p>
          {turn === 'p1' && (
            <>
              <Meter label="Timing" value={gauge} max={100} color="#ffff00" />
              <NeonButton variant="green" className="w-full" onClick={swing}>
                Mew Strike
              </NeonButton>
            </>
          )}
        </div>
      )}
      renderP2={() => (
        <div>
          <Meter label="Sigma Stance" value={stance2} max={100} color={props.player2.color} />
          <p className="text-xs">Combo: {combo2}</p>
          {turn === 'p2' && (
            <>
              <Meter label="Timing" value={gauge} max={100} color="#ffff00" />
              <NeonButton variant="purple" className="w-full" onClick={swing}>
                Mew Strike
              </NeonButton>
            </>
          )}
        </div>
      )}
    />
  );
}
