# Brainrot Arena

High-intensity 1v1 competitive platform with global matchmaking, round randomizer (20 mini-games), and neo-brutalist Gen-Z aesthetic.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## How to play

1. Both players click **Connect** in the lobby.
2. **Enter Matchmaking** — the engine picks a random mini-game each round.
3. First to **3 round wins** takes the match.
4. Each mini-game unmounts fully between rounds (`roundKey` + `useCleanup`) to purge timers.

## Architecture

- `src/components/GameManager.tsx` — match state machine: lobby → matchmaking → round intro → playing → round end → match end
- `src/types/game.ts` — `MiniGameProps`, `PlayerState`, `GameAction`
- `src/minigames/*` — 20 components, each implementing `MiniGameProps`
- `src/minigames/index.ts` — registry + randomizer

## Tech

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
