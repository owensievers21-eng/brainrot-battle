import { useEffect, useRef, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { pick } from '../utils/random';

const TRACKS = ['Lava Venice', 'Pasta Speedway', 'Vatican Drift Circuit'];

function Racer({
  lane,
  color,
  onWin,
  playerId,
}: {
  lane: number;
  color: string;
  onWin: (id: string) => void;
  playerId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const handling = useRef(1);
  const { purge } = useCleanup();

  useEffect(() => {
    const loop = setInterval(() => {
      progress.current += 1.5 * handling.current;
      if (Math.random() > 0.92) handling.current = Math.random() * 2 + 0.3;
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#1a0030';
      ctx.fillRect(0, 0, 240, 120);
      ctx.fillStyle = color;
      ctx.fillRect(20, 20 + lane * 25, 200, 8);
      ctx.font = '24px serif';
      ctx.fillText('🐊', 30 + (progress.current % 180), 35 + lane * 25);
      if (progress.current >= 300) onWin(playerId);
    }, 40);
    return () => {
      clearInterval(loop);
      purge();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={240} height={120} className="w-full border-4 border-black" />
      <button
        type="button"
        className="neo-btn mt-1 w-full bg-neon-yellow text-xs"
        onClick={() => {
          handling.current = Math.random() * 2 + 0.3;
        }}
      >
        Mutate Vehicle
      </button>
    </div>
  );
}

export function BombardinoCrocodiloRacing(props: MiniGameProps) {
  const [track] = useState(pick(TRACKS));
  return (
    <div className="grid h-full grid-rows-2 gap-2 md:grid-cols-2">
      <section className="neo-panel p-2">
        <p className="flash-text text-xs">{track}</p>
        <Racer lane={0} color={props.player1.color} playerId={props.player1.id} onWin={props.onGameEnd} />
      </section>
      <section className="neo-panel p-2">
        <Racer lane={1} color={props.player2.color} playerId={props.player2.id} onWin={props.onGameEnd} />
      </section>
    </div>
  );
}
