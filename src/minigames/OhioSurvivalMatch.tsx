import { useEffect, useRef, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { pick } from '../utils/random';

const MODS = ['Floating houses', 'Evil cornfields', 'Giant possums', 'Backwards gravity'];
const OBJECTS = ['🏠', '🌽', '🦝', '💀'];

function OhioCanvas({
  playerId,
  opponentId,
  reverse,
  onHit,
  onSurvive,
}: {
  playerId: string;
  opponentId: string;
  reverse: boolean;
  onHit: () => void;
  onSurvive: (winnerId: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: 120, y: 100 });
  const keys = useRef<Record<string, boolean>>({});
  const objects = useRef<{ x: number; y: number; emoji: string }[]>([]);
  const hp = useRef(100);
  const { trackInterval, purge } = useCleanup();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      keys.current[e.key] = e.type === 'keydown';
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    trackInterval(() => {
      objects.current.push({
        x: Math.random() * 200,
        y: -10,
        emoji: pick(OBJECTS),
      });
    }, 500);
    const loop = setInterval(() => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      const spd = reverse ? -3 : 3;
      if (keys.current['w'] || keys.current['ArrowUp']) pos.current.y -= spd;
      if (keys.current['s'] || keys.current['ArrowDown']) pos.current.y += spd;
      if (keys.current['a'] || keys.current['ArrowLeft']) pos.current.x -= 3;
      if (keys.current['d'] || keys.current['ArrowRight']) pos.current.x += 3;
      pos.current.x = Math.max(10, Math.min(230, pos.current.x));
      pos.current.y = Math.max(10, Math.min(170, pos.current.y));
      objects.current.forEach((o) => (o.y += 4));
      objects.current = objects.current.filter((o) => o.y < 200);
      for (const o of objects.current) {
        if (Math.hypot(o.x - pos.current.x, o.y - pos.current.y) < 18) {
          hp.current -= 12;
          onHit();
        }
      }
      ctx.fillStyle = '#0a0014';
      ctx.fillRect(0, 0, 240, 180);
      ctx.font = '20px serif';
      objects.current.forEach((o) => {
        ctx.fillText(o.emoji, o.x, o.y);
      });
      ctx.fillText('🧍', pos.current.x, pos.current.y);
      if (hp.current <= 0) onSurvive(opponentId);
      if (hp.current >= 200) onSurvive(playerId);
    }, 32);
    return () => {
      purge();
      clearInterval(loop);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, [reverse]);

  return <canvas ref={canvasRef} width={240} height={180} className="w-full border-4 border-black" />;
}

export function OhioSurvivalMatch(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [mod, setMod] = useState(MODS[0]);
  const [reverse, setReverse] = useState(false);
  const [hp1, setHp1] = useState(100);
  const [hp2, setHp2] = useState(100);

  useEffect(() => {
    trackInterval(() => {
      const m = pick(MODS);
      setMod(m);
      setReverse(m === 'Backwards gravity');
    }, 10000);
    return purge;
  }, []);

  return (
    <div className="grid h-full grid-rows-2 gap-2 md:grid-cols-2 md:grid-rows-1">
      <section className="neo-panel p-2">
        <p className="flash-text mb-1 text-xs">{mod}</p>
        <p className="text-xs">HP: {hp1}</p>
        <OhioCanvas
          playerId={props.player1.id}
          opponentId={props.player2.id}
          reverse={reverse}
          onHit={() => setHp1((h) => h - 12)}
          onSurvive={props.onGameEnd}
        />
      </section>
      <section className="neo-panel p-2">
        <p className="text-xs">HP: {hp2}</p>
        <OhioCanvas
          playerId={props.player2.id}
          opponentId={props.player1.id}
          reverse={reverse}
          onHit={() => setHp2((h) => h - 12)}
          onSurvive={props.onGameEnd}
        />
      </section>
    </div>
  );
}
