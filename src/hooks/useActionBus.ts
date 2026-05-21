import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameAction } from '../types/game';

export function useActionBus(localPlayerId: string) {
  const [actions, setActions] = useState<GameAction[]>([]);
  const listeners = useRef<Set<(a: GameAction) => void>>(new Set());

  const sendAction = useCallback(
    (action: Omit<GameAction, 'from'> & { from?: string }) => {
      const full: GameAction = { ...action, from: action.from ?? localPlayerId };
      setActions((prev) => [...prev.slice(-50), full]);
      listeners.current.forEach((fn) => fn(full));
    },
    [localPlayerId],
  );

  const subscribe = useCallback((fn: (a: GameAction) => void) => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  }, []);

  useEffect(() => () => listeners.current.clear(), []);

  return { actions, sendAction, subscribe };
}
