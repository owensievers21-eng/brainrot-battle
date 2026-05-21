import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter, EventBanner } from './shared';
import { NeonButton } from '../components/NeonButton';
import { pick } from '../utils/random';

const QUOTES = [
  'Wake up. Grind. Repeat.',
  'Sleep is for NPCs',
  'Your 4AM alarm is your boss',
];
const DEBUFFS = ['TAXES', 'Ex-girlfriend arc', 'NPC coworker', '4 AM gym demon'];

export function SigmaGrindsetSimulator(props: MiniGameProps) {
  const { trackTimeout, trackInterval, purge } = useCleanup();
  const [time, setTime] = useState(300);
  const [cap1, setCap1] = useState(0);
  const [cap2, setCap2] = useState(0);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [block1, setBlock1] = useState(false);
  const [block2, setBlock2] = useState(false);

  useEffect(() => {
    trackInterval(() => setTime((t) => t - 1), 1000);
    trackInterval(() => setQuote(pick(QUOTES)), 2500);
    trackInterval(() => {
      const d = pick(DEBUFFS);
      if (Math.random() > 0.5) {
        setBlock1(true);
        trackTimeout(() => setBlock1(false), 2000);
      } else {
        setBlock2(true);
        trackTimeout(() => setBlock2(false), 2000);
      }
      props.sendAction({ type: 'debuff', payload: { d } });
    }, 5000);
    return purge;
  }, []);

  useEffect(() => {
    if (time <= 0) {
      if (cap1 > cap2) props.onGameEnd(props.player1.id);
      else if (cap2 > cap1) props.onGameEnd(props.player2.id);
      else props.onGameEnd(Math.random() > 0.5 ? props.player1.id : props.player2.id);
    }
  }, [time, cap1, cap2]);

  const hustle = (who: 'p1' | 'p2') => {
    const gain = Math.floor(Math.random() * 40) + 10;
    if (who === 'p1' && !block1) setCap1((c) => c + gain);
    if (who === 'p2' && !block2) setCap2((c) => c + gain);
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div className={block1 ? 'pointer-events-none opacity-40' : ''}>
          <EventBanner text={quote} />
          <p className="mb-2 font-black text-neon-yellow">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
          <Meter label="Capital" value={cap1} max={5000} color={props.player1.color} />
          <NeonButton variant="green" className="w-full" onClick={() => hustle('p1')}>
            Side Hustle
          </NeonButton>
        </div>
      )}
      renderP2={() => (
        <div className={block2 ? 'pointer-events-none opacity-40' : ''}>
          <Meter label="Capital" value={cap2} max={5000} color={props.player2.color} />
          <NeonButton variant="purple" className="w-full" onClick={() => hustle('p2')}>
            Side Hustle
          </NeonButton>
        </div>
      )}
    />
  );
}
