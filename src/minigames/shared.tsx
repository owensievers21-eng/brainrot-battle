import type { ReactNode } from 'react';
import type { MiniGameProps } from '../types/game';
import { SplitViewport } from '../components/SplitViewport';
import { NeonButton } from '../components/NeonButton';

export function DualPane({
  props,
  renderP1,
  renderP2,
}: {
  props: MiniGameProps;
  renderP1: (send: MiniGameProps['sendAction']) => ReactNode;
  renderP2: (send: MiniGameProps['sendAction']) => ReactNode;
}) {
  return (
    <SplitViewport player1={props.player1} player2={props.player2}>
      {renderP1(props.sendAction)}
      {renderP2(props.sendAction)}
    </SplitViewport>
  );
}

export function Meter({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs font-bold">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="meter-bar">
        <div className="meter-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function ActionRow({
  actions,
  onPick,
}: {
  actions: { id: string; label: string; power: number }[];
  onPick: (id: string, power: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <NeonButton key={a.id} variant="green" className="text-xs" onClick={() => onPick(a.id, a.power)}>
          {a.label}
        </NeonButton>
      ))}
    </div>
  );
}

export function EventBanner({ text }: { text: string }) {
  return (
    <p className="flash-text mb-2 border-2 border-black bg-neon-yellow px-2 py-1 text-center text-xs text-black">
      {text}
    </p>
  );
}
