import { useMemo } from 'react';
import BrainrotBattleDashboard from './BrainrotBattleDashboard';
import { getFeaturedGameOfTheDay, miniGamesToDashboardGames } from '../lib/dashboardGames';

/**
 * v0 dashboard shell — maps MINI_GAMES registry into card grid UI.
 *
 * @param {object} props
 * @param {import('../types/game').MiniGameDefinition[]} [props.gamesList]
 * @param {(gameId: string) => void} [props.onLaunchGame]
 * @param {() => void} [props.onOpenLobby]
 */
export default function Dashboard({ gamesList, onLaunchGame, onOpenLobby }) {
  const games = useMemo(
    () => (gamesList?.length ? miniGamesToDashboardGames(gamesList) : miniGamesToDashboardGames()),
    [gamesList],
  );

  const gameOfTheDay = useMemo(() => getFeaturedGameOfTheDay(games), [games]);

  return (
    <BrainrotBattleDashboard
      games={games}
      gameOfTheDay={gameOfTheDay}
      onLaunchGame={onLaunchGame}
      onOpenLobby={onOpenLobby}
    />
  );
}
