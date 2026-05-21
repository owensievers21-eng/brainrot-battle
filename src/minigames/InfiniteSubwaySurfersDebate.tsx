import { useEffect, useRef, useState } from 'react';
import type { MiniGameProps } from '../types/game';
import { useCleanup } from '../hooks/useCleanup';
import { pick } from '../utils/random';

const DEBATES = [
  { q: 'Is mewing a human right?', a: 'Yes' },
  { q: 'Should fanum tax be legal?', a: 'No' },
  { q: 'Ohio: state or dimension?', a: 'Dimension' },
];

const DISTRACTIONS = ['Family Guy clip', 'Mobile game ad', 'TikTok noise'];

function Runner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const x = useRef(100);
  const { purge } = useCleanup();

  useEffect(() => {
    const loop = setInterval(() => {
      x.current = (x.current + 6) % 200;
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (!ctx || !c) return;
      ctx.fillStyle = '#003366';
      ctx.fillRect(0, 0, 200, 80);
      ctx.fillStyle = '#39ff14';
      ctx.fillRect(0, 60, 200, 20);
      ctx.font = '20px serif';
      ctx.fillText('🏃', x.current, 45);
    }, 50);
    return () => {
      clearInterval(loop);
      purge();
    };
  }, []);

  return <canvas ref={canvasRef} width={200} height={80} className="w-full border-2 border-black" />;
}

export function InfiniteSubwaySurfersDebate(props: MiniGameProps) {
  const { trackInterval, purge } = useCleanup();
  const [debate, setDebate] = useState(DEBATES[0]);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [distraction, setDistraction] = useState(DISTRACTIONS[0]);

  useEffect(() => {
    trackInterval(() => {
      setDebate(pick(DEBATES));
      setDistraction(pick(DISTRACTIONS));
    }, 5000);
    if (score1 >= 5) props.onGameEnd(props.player1.id);
    if (score2 >= 5) props.onGameEnd(props.player2.id);
    return purge;
  }, [score1, score2]);

  const answer = (who: 'p1' | 'p2', ans: string) => {
    const correct = ans === debate.a;
    if (who === 'p1' && correct) setScore1((s) => s + 1);
    if (who === 'p2' && correct) setScore2((s) => s + 1);
  };

  return (
    <div className="grid h-full grid-rows-2 gap-2">
      <p className="flash-text col-span-full text-center text-xs">{distraction} OVERLAY ACTIVE</p>
      {[props.player1, props.player2].map((player, pi) => (
        <section key={player.id} className="neo-panel flex min-h-0 flex-col p-2">
          <p className="text-xs font-black" style={{ color: player.color }}>
            {player.name}
          </p>
          <div className="shrink-0 border-2 border-black bg-black/70 p-2 text-xs">
            <p>{debate.q}</p>
            <div className="mt-1 flex gap-1">
              {['Yes', 'No', 'Dimension'].map((a) => (
                <button
                  key={a}
                  type="button"
                  className="neo-btn bg-neon-yellow text-[10px]"
                  onClick={() => answer(pi === 0 ? 'p1' : 'p2', a)}
                >
                  {a}
                </button>
              ))}
            </div>
            <p className="mt-1">Score: {pi === 0 ? score1 : score2}</p>
          </div>
          <div className="mt-1 min-h-0 flex-1">
            <Runner />
          </div>
        </section>
      ))}
    </div>
  );
}
