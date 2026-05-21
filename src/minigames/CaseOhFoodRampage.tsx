import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane } from './shared';
import { NeonButton } from '../components/NeonButton';
import { pick } from '../utils/random';

const FOODS = ['🍔', '🍟', '🥤', '🍕', '🌭'];
const MOVES = ['Burger meteor', 'Fry tornado', 'Soda laser'];

export function CaseOhFoodRampage(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [size1, setSize1] = useState(30);
  const [size2, setSize2] = useState(30);
  const [food, setFood] = useState(FOODS[0]);

  useEffect(() => {
    trackInterval(() => setFood(pick(FOODS)), 1200);
    if (size1 >= 100) props.onGameEnd(props.player1.id);
    if (size2 >= 100) props.onGameEnd(props.player2.id);
    return purge;
  }, [size1, size2]);

  const eat = (who: 'p1' | 'p2') => {
    const gain = 8;
    if (who === 'p1') setSize1((s) => s + gain);
    else setSize2((s) => s + gain);
  };

  const special = (who: 'p1' | 'p2') => {
    const move = pick(MOVES);
    props.sendAction({ type: 'special', payload: { move } });
    if (who === 'p1') setSize1((s) => s + 20);
    else setSize2((s) => s + 20);
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div className="flex flex-col items-center">
          <div
            className="mb-2 flex items-center justify-center border-4 border-black bg-neon-green font-black text-black"
            style={{ width: size1 * 2, height: size1 * 2 }}
          >
            P1
          </div>
          <p className="flash-text mb-2 text-3xl">{food}</p>
          <NeonButton variant="green" onClick={() => eat('p1')}>
            DEVOUR
          </NeonButton>
          <NeonButton variant="yellow" className="mt-1" onClick={() => special('p1')}>
            Special
          </NeonButton>
        </div>
      )}
      renderP2={() => (
        <div className="flex flex-col items-center">
          <div
            className="mb-2 flex items-center justify-center border-4 border-black bg-neon-purple font-black text-black"
            style={{ width: size2 * 2, height: size2 * 2 }}
          >
            P2
          </div>
          <NeonButton variant="purple" onClick={() => eat('p2')}>
            DEVOUR
          </NeonButton>
          <NeonButton variant="yellow" className="mt-1" onClick={() => special('p2')}>
            Special
          </NeonButton>
        </div>
      )}
    />
  );
}
