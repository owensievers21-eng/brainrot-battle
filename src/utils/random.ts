export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
