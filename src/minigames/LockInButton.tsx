import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';
import { pick } from '../utils/random';

const BEATS = ['F', 'J', 'K', 'L', 'Space'];

export function LockInButton(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [focus1, setFocus1] = useState(0);
  const [focus2, setFocus2] = useState(0);
  const [caffeine1, setCaffeine1] = useState(0);
  const [caffeine2, setCaffeine2] = useState(0);
  const [qte, setQte] = useState(false);
  const [seq, setSeq] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    trackInterval(() => {
      setFocus1((f) => Math.min(100, f + 5));
      setFocus2((f) => Math.min(100, f + 5));
    }, 500);
    return purge;
  }, []);

  useEffect(() => {
    if (!qte) return;
    const handler = (e: KeyboardEvent) => {
      const need = seq[idx];
      if (!need) return;
      const hit =
        (need === 'Space' && e.code === 'Space') || e.key.toUpperCase() === need.toUpperCase();
      if (hit) {
        setIdx((i) => i + 1);
        setScore1((s) => s + 1);
        setScore2((s) => s + 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [qte, seq, idx]);

  useEffect(() => {
    if (qte && idx >= seq.length) {
      if (score1 > score2) props.onGameEnd(props.player1.id);
      else props.onGameEnd(props.player2.id);
      setQte(false);
    }
  }, [qte, idx, seq.length]);

  const lockIn = () => {
    if (focus1 >= 80 || focus2 >= 80 || caffeine1 > 3 || caffeine2 > 3) {
      setQte(true);
      setSeq(Array.from({ length: 8 }, () => pick(BEATS)));
      setIdx(0);
    }
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div className={qte ? 'opacity-90' : ''}>
          <Meter label="Focus" value={focus1} max={100} color={props.player1.color} />
          <Meter label="Caffeine" value={caffeine1 * 20} max={100} color="#ffff00" />
          <NeonButton variant="green" className="mr-2" onClick={() => setCaffeine1((c) => c + 1)}>
            Drink
          </NeonButton>
          <NeonButton variant="yellow" onClick={lockIn}>
            LOCK IN
          </NeonButton>
          {qte && (
            <p className="flash-text mt-2 text-center text-xl">
              {seq[idx]} ({idx + 1}/{seq.length})
            </p>
          )}
        </div>
      )}
      renderP2={() => (
        <div>
          <Meter label="Focus" value={focus2} max={100} color={props.player2.color} />
          <Meter label="Caffeine" value={caffeine2 * 20} max={100} color="#ffff00" />
          <NeonButton variant="purple" onClick={() => setCaffeine2((c) => c + 1)}>
            Drink
          </NeonButton>
          <NeonButton variant="yellow" onClick={lockIn}>
            LOCK IN
          </NeonButton>
        </div>
      )}
    />
  );
}
