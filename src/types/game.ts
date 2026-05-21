export interface PlayerState {
  id: string;
  name: string;
  roundWins: number;
  color: string;
}

export interface MiniGameProps {
  player1: PlayerState;
  player2: PlayerState;
  onGameEnd: (winnerId: string) => void;
  sendAction: (action: GameAction) => void;
}

export type GameAction = {
  from?: string;
  type: string;
  payload?: Record<string, unknown>;
};

export type MatchPhase =
  | 'lobby'
  | 'matchmaking'
  | 'round_intro'
  | 'playing'
  | 'round_end'
  | 'match_end';

import type { ComponentType } from 'react';

export interface MiniGameDefinition {
  id: string;
  name: string;
  tagline: string;
  component: ComponentType<MiniGameProps>;
}
