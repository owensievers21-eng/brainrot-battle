import { useEffect, useRef } from 'react';

export function useCleanup() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);
  const raf = useRef<number[]>([]);

  const trackTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  const trackInterval = (fn: () => void, ms: number) => {
    const id = setInterval(fn, ms);
    intervals.current.push(id);
    return id;
  };

  const trackRaf = (fn: (t: number) => void) => {
    let id = 0;
    const loop = (t: number) => {
      fn(t);
      id = requestAnimationFrame(loop);
      raf.current.push(id);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  };

  const purge = () => {
    timers.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
    raf.current.forEach(cancelAnimationFrame);
    timers.current = [];
    intervals.current = [];
    raf.current = [];
  };

  useEffect(() => () => purge(), []);

  return { trackTimeout, trackInterval, trackRaf, purge };
}
