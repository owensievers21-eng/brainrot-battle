import type { ArcadeGame } from '../data/arcadeGames';

export interface DashboardProps {
  gamesList?: ArcadeGame[];
  onLaunchGame?: (gameId: string) => void;
  onOpenLobby?: () => void;
}

declare function Dashboard(props: DashboardProps): import('react').JSX.Element;
export default Dashboard;
