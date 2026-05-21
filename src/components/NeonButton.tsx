import type { ButtonHTMLAttributes } from 'react';

export function NeonButton({
  children,
  variant = 'green',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'green' | 'purple' | 'pink' | 'yellow';
}) {
  const bg =
    variant === 'green'
      ? 'bg-neon-green'
      : variant === 'purple'
        ? 'bg-neon-purple'
        : variant === 'pink'
          ? 'bg-neon-pink'
          : 'bg-neon-yellow';
  return (
    <button
      type="button"
      className={`neo-btn ${bg} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
