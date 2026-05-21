import type { MiniGameDefinition } from '../types/game';
import { RizzRoyale } from './RizzRoyale';
import { SkibidiToiletDuel } from './SkibidiToiletDuel';
import { SigmaGrindsetSimulator } from './SigmaGrindsetSimulator';
import { NPCBreakout } from './NPCBreakout';
import { GoonCaveEscape } from './GoonCaveEscape';
import { FanumTaxHeist } from './FanumTaxHeist';
import { OhioSurvivalMatch } from './OhioSurvivalMatch';
import { MewingCombatArena } from './MewingCombatArena';
import { TikTokLiveBattle } from './TikTokLiveBattle';
import { BombardinoCrocodiloRacing } from './BombardinoCrocodiloRacing';
import { DeluluDatingWarfare } from './DeluluDatingWarfare';
import { AuraFarmingChampionship } from './AuraFarmingChampionship';
import { BrainrotPropHunt } from './BrainrotPropHunt';
import { YapOlympics } from './YapOlympics';
import { LockInButton } from './LockInButton';
import { InfiniteSubwaySurfersDebate } from './InfiniteSubwaySurfersDebate';
import { DiscordModArena } from './DiscordModArena';
import { GigachadBossFight } from './GigachadBossFight';
import { CaseOhFoodRampage } from './CaseOhFoodRampage';
import { BrainCellExtractionFacility } from './BrainCellExtractionFacility';

export const MINI_GAMES: MiniGameDefinition[] = [
  { id: 'rizz-royale', name: 'Rizz Royale', tagline: 'Dialogue battle vs absurd NPC', component: RizzRoyale },
  { id: 'skibidi-duel', name: 'Skibidi Toilet Duel', tagline: 'Destroy enemy HQ toilet', component: SkibidiToiletDuel },
  { id: 'sigma-grind', name: 'Sigma Grindset Simulator', tagline: '5-min hustle race', component: SigmaGrindsetSimulator },
  { id: 'npc-breakout', name: 'NPC Breakout', tagline: 'Social deduction interrogation', component: NPCBreakout },
  { id: 'goon-cave', name: 'Goon Cave Escape', tagline: 'Puzzle racer vs brain rot', component: GoonCaveEscape },
  { id: 'fanum-tax', name: 'Fanum Tax Heist', tagline: 'Grid food steal frenzy', component: FanumTaxHeist },
  { id: 'ohio-survival', name: 'Ohio Survival Match', tagline: 'Dodge procedural chaos', component: OhioSurvivalMatch },
  { id: 'mewing-combat', name: 'Mewing Combat Arena', tagline: 'Timing gauge looksmax duel', component: MewingCombatArena },
  { id: 'tiktok-live', name: 'TikTok Live Battle', tagline: 'Tap-match engagement war', component: TikTokLiveBattle },
  { id: 'bombardino-race', name: 'Bombardino Crocodilo Racing', tagline: 'Cursed lane mutant race', component: BombardinoCrocodiloRacing },
  { id: 'delulu-dating', name: 'Delulu Dating Warfare', tagline: 'Conspiracy board delusion', component: DeluluDatingWarfare },
  { id: 'aura-farming', name: 'Aura Farming Championship', tagline: 'Hallway QTE aura flex', component: AuraFarmingChampionship },
  { id: 'prop-hunt', name: 'Brainrot Prop Hunt', tagline: 'Grid hide & seek', component: BrainrotPropHunt },
  { id: 'yap-olympics', name: 'Yap Olympics', tagline: 'Typing synonym speed yap', component: YapOlympics },
  { id: 'lock-in', name: 'Lock-In Button', tagline: 'Focus → anime QTE duel', component: LockInButton },
  { id: 'subway-debate', name: 'Infinite Subway Surfers Debate', tagline: 'Debate + runner multitask', component: InfiniteSubwaySurfersDebate },
  { id: 'discord-mod', name: 'Discord Mod Arena', tagline: 'Card strategy mod war', component: DiscordModArena },
  { id: 'gigachad-boss', name: 'Gigachad Boss Fight', tagline: 'Asymmetric boss raid', component: GigachadBossFight },
  { id: 'caseoh-rampage', name: 'CaseOh Food Rampage', tagline: 'Grow & devour arena', component: CaseOhFoodRampage },
  { id: 'brain-cell', name: 'Brain Cell Extraction Facility', tagline: 'IQ drain escape horror', component: BrainCellExtractionFacility },
];

export function pickRandomGame(excludeId: string | null): MiniGameDefinition {
  const pool = excludeId ? MINI_GAMES.filter((g) => g.id !== excludeId) : MINI_GAMES;
  return pool[Math.floor(Math.random() * pool.length)] ?? MINI_GAMES[0]!;
}
