import type { ReactNode } from 'react';
import type { PlayerState } from '../types/game';

interface SplitViewportProps {
  player1: PlayerState;
  player2: PlayerState;
  children: [ReactNode, ReactNode];
  flash?: boolean;
}

export function SplitViewport({ player1, player2, children, flash }: SplitViewportProps) {
  return (
    <div
      className={`grid h-full min-h-0 grid-rows-2 gap-2 md:grid-cols-2 md:grid-rows-1 ${flash ? 'animate-screen-flash' : ''}`}
    >
      <PlayerPane player={player1} side="left">
        {children[0]}
      </PlayerPane>
      <PlayerPane player={player2} side="right">
        {children[1]}
      </PlayerPane>
    </div>
  );
}

function PlayerPane({
  player,
  side,
  children,
}: {
  player: PlayerState;
  side: 'left' | 'right';
  children: ReactNode;
}) {
  return (
    <section
      className="neo-panel flex min-h-0 flex-col overflow-hidden"
      style={{ borderColor: player.color }}
    >
      <header
        className={`flex shrink-0 items-center justify-between border-b-4 border-black px-3 py-2 ${side === 'left' ? 'bg-neon-green' : 'bg-neon-purple'}`}
      >
        <span className="font-black uppercase tracking-wider text-black">{player.name}</span>
        <span className="text-xs font-bold text-black" style={{ animation: 'pulse-neon 1s ease-in-out infinite' }}>
          P{side === 'left' ? '1' : '2'}
        </span>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-2">{children}</div>
    </section>
  );
}
