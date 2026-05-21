import { useEffect, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { DualPane, Meter } from './shared';
import { NeonButton } from '../components/NeonButton';

const RESOURCES = ['Energy Drink', 'RGB Keyboard', 'Discord Nitro'];

export function GoonCaveEscape(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [rot, setRot] = useState(0);
  const [invert2, setInvert2] = useState(false);
  const [tiles1, setTiles1] = useState([1, 2, 3, 0]);
  const [tiles2, setTiles2] = useState([2, 1, 3, 0]);

  useEffect(() => {
    trackInterval(() => {
      setRot((r) => r + 10);
      if (rot >= 30) {
        setInvert2((v) => !v);
        setRot(0);
      }
    }, 30000);
    if (score1 >= 3) props.onGameEnd(props.player1.id);
    if (score2 >= 3) props.onGameEnd(props.player2.id);
    return purge;
  }, [score1, score2, rot]);

  const slide = (tiles: number[], setTiles: (t: number[]) => void) => {
    const idx = tiles.indexOf(0);
    const moves = [idx - 1, idx + 1, idx - 2, idx + 2].filter((i) => i >= 0 && i < 4);
    const pick = moves[Math.floor(Math.random() * moves.length)];
    if (pick === undefined) return;
    const next = [...tiles];
    [next[idx], next[pick]] = [next[pick]!, next[idx]!];
    setTiles(next);
    if (next.every((v, i) => v === i)) {
      return true;
    }
    return false;
  };

  return (
    <DualPane
      props={props}
      renderP1={() => (
        <div>
          <Meter label="Brain Rot Level" value={rot} max={30} color="#ff10f0" />
          <p className="mb-2 text-xs">Collect: {RESOURCES.join(' • ')}</p>
          <div className="grid grid-cols-2 gap-1">
            {tiles1.map((n, i) => (
              <div key={i} className="border-2 border-black bg-neon-green p-4 text-center font-black text-black">
                {n || ''}
              </div>
            ))}
          </div>
          <NeonButton
            className="mt-2 w-full"
            variant="green"
            onClick={() => {
              if (slide(tiles1, setTiles1)) setScore1((s) => s + 1);
            }}
          >
            Slide Puzzle
          </NeonButton>
          <p className="mt-1 text-xs">Loot: {score1}/3</p>
        </div>
      )}
      renderP2={() => (
        <div className={invert2 ? 'rotate-180' : ''}>
          <div className="grid grid-cols-2 gap-1">
            {tiles2.map((n, i) => (
              <div key={i} className="border-2 border-black bg-neon-purple p-4 text-center font-black text-black">
                {n || ''}
              </div>
            ))}
          </div>
          <NeonButton
            className="mt-2 w-full"
            variant="purple"
            onClick={() => {
              if (slide(tiles2, setTiles2)) setScore2((s) => s + 1);
            }}
          >
            Slide Puzzle
          </NeonButton>
          <p className="mt-1 text-xs">Loot: {score2}/3</p>
        </div>
      )}
    />
  );
}
