import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';
import { pick } from '../utils/random';

const PROMPTS = [
  'Discuss geopolitics of Ohio',
  'Explain why mewing is fiscal policy',
  'Debate fanum tax ethics',
];

const SYNONYMS: Record<string, string[]> = {
  Discuss: ['Yap about', 'Gaslight regarding', 'Topic-chain'],
  Explain: ['Word-vomit', 'Fake confidence'],
  Debate: ['Derail', 'Gibberish multiplier'],
};

export function YapOlympics(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [yap1, setYap1] = useState(0);
  const [yap2, setYap2] = useState(0);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  useEffect(() => {
    trackInterval(() => setPrompt(pick(PROMPTS)), 4000);
    if (yap1 >= 120) props.onGameEnd(props.player1.id);
    if (yap2 >= 120) props.onGameEnd(props.player2.id);
    return purge;
  }, [yap1, yap2]);

  const typeWord = (who: 'p1' | 'p2', word: string) => {
    if (who === 'p1') {
      setInput1((t) => t + word + ' ');
      setYap1((y) => y + word.length);
    } else {
      setInput2((t) => t + word + ' ');
      setYap2((y) => y + word.length);
    }
  };

  const attack = (from: 'p1' | 'p2') => {
    const gibberish = pick(['skibidi', 'rizz', 'gyatt', 'sigma', 'delulu']);
    if (from === 'p1') setInput2((t) => t + gibberish.repeat(5));
    else setInput1((t) => t + gibberish.repeat(5));
    props.sendAction({ type: 'derail', payload: { from } });
  };

  const word = prompt.split(' ')[0] ?? 'Yap';
  const syns = SYNONYMS[word] ?? ['Yap harder'];

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          <p className="mb-1 border-2 border-black bg-neon-yellow p-2 text-xs text-black">{prompt}</p>
          <Meter label="Yap Score" value={yap1} max={120} color={props.player1.color} />
          <textarea
            className="mb-2 h-16 w-full border-4 border-black bg-white p-1 text-xs text-black"
            value={input1}
            onChange={(e) => {
              setInput1(e.target.value);
              setYap1((y) => y + 2);
            }}
          />
          <div className="flex flex-wrap gap-1">
            {syns.map((s) => (
              <NeonButton key={s} variant="green" className="text-[10px]" onClick={() => typeWord('p1', s)}>
                {s}
              </NeonButton>
            ))}
            <NeonButton variant="pink" className="text-[10px]" onClick={() => attack('p1')}>
              Derail
            </NeonButton>
          </div>
        </div>
      )}
      renderP2={() => (
        <div>
          <Meter label="Yap Score" value={yap2} max={120} color={props.player2.color} />
          <textarea
            className="mb-2 h-16 w-full border-4 border-black bg-white p-1 text-xs text-black"
            value={input2}
            onChange={(e) => {
              setInput2(e.target.value);
              setYap2((y) => y + 2);
            }}
          />
          <NeonButton variant="purple" onClick={() => attack('p2')}>
            Gaslight Multiplier
          </NeonButton>
        </div>
      )}
    />
  );
}
