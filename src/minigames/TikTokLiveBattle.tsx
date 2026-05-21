import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';
import { pick } from '../utils/random';

const STREAMS = ['Sigma tips', 'Rizz coaching', 'Mewing live'];
const PATTERN = ['❤️', '💎', '🔥', '🎁'];

export function TikTokLiveBattle(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [eng1, setEng1] = useState(0);
  const [eng2, setEng2] = useState(0);
  const [target, setTarget] = useState(PATTERN[0]);
  const [apology1, setApology1] = useState(false);
  const [apology2, setApology2] = useState(false);

  useEffect(() => {
    trackInterval(() => setTarget(pick(PATTERN)), 1500);
    if (eng1 >= 200) props.onGameEnd(props.player1.id);
    if (eng2 >= 200) props.onGameEnd(props.player2.id);
    return purge;
  }, [eng1, eng2]);

  const tap = (who: 'p1' | 'p2', emoji: string) => {
    const ok = emoji === target;
    if (who === 'p1') setEng1((e) => e + (ok ? 15 : 3));
    else setEng2((e) => e + (ok ? 15 : 3));
  };

  const sabotage = (from: 'p1' | 'p2') => {
    if (from === 'p1') setApology2(true);
    else setApology1(true);
    props.sendAction({ type: 'troll', payload: { from } });
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          {apology1 ? (
            <input
              className="w-full border-4 border-black bg-white p-2 text-black"
              placeholder="Type apology video script..."
              onKeyDown={(e) => e.key === 'Enter' && setApology1(false)}
            />
          ) : (
            <>
              <p className="mb-1 text-xs">{pick(STREAMS)}</p>
              <Meter label="Engagement" value={eng1} max={200} color={props.player1.color} />
              <p className="flash-text mb-2 text-center text-2xl">{target}</p>
              <div className="mb-2 flex gap-1">
                {PATTERN.map((p) => (
                  <NeonButton key={p} variant="green" onClick={() => tap('p1', p)}>
                    {p}
                  </NeonButton>
                ))}
              </div>
              <NeonButton variant="pink" className="text-xs" onClick={() => sabotage('p1')}>
                Launch Troll
              </NeonButton>
            </>
          )}
        </div>
      )}
      renderP2={() => (
        <div>
          {apology2 ? (
            <input
              className="w-full border-4 border-black bg-white p-2 text-black"
              placeholder="Emergency apology..."
              onKeyDown={(e) => e.key === 'Enter' && setApology2(false)}
            />
          ) : (
            <>
              <Meter label="Engagement" value={eng2} max={200} color={props.player2.color} />
              <p className="flash-text mb-2 text-center text-2xl">{target}</p>
              <div className="mb-2 flex gap-1">
                {PATTERN.map((p) => (
                  <NeonButton key={p} variant="purple" onClick={() => tap('p2', p)}>
                    {p}
                  </NeonButton>
                ))}
              </div>
              <NeonButton variant="pink" className="text-xs" onClick={() => sabotage('p2')}>
                Clip Farmer Block
              </NeonButton>
            </>
          )}
        </div>
      )}
    />
  );
}
