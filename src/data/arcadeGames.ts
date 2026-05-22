export interface ArcadeGame {
  id: string;
  title: string;
  description: string;
  type: '1v1 Live' | 'Solo' | 'Co-op' | 'Tournament';
  thumbnail: string;
}

export const MY_ARCADE_GAMES: ArcadeGame[] = [
  {
    id: 'fanum-heist',
    title: 'Fanum Tax Heist',
    description: 'Fast-paced 1v1 multiplayer food snatching battle. First to 3 rounds wins!',
    type: '1v1 Live',
    thumbnail: '',
  },
  {
    id: 'skibidi-clicker',
    title: 'Skibidi Clicker',
    description: 'Spam-click the toilet cam to dominate the leaderboard.',
    type: 'Solo',
    thumbnail: '',
  },
  {
    id: 'sigma-dodge',
    title: 'Sigma Dodge',
    description: 'Dodge 4 AM gym demons in this reflex survival lane.',
    type: '1v1 Live',
    thumbnail: '',
  },
  {
    id: 'rizz-royale',
    title: 'Rizz Royale',
    description: 'Dialogue battle to max your rizz meter before the NPC folds.',
    type: '1v1 Live',
    thumbnail: '',
  },
  {
    id: 'ohio-survival',
    title: 'Ohio Survival',
    description: 'Procedural chaos falls from the sky — last brain cell wins.',
    type: 'Co-op',
    thumbnail: '',
  },
  {
    id: 'mewing-arena',
    title: 'Mewing Combat Arena',
    description: 'Timing gauge looksmax duels with posture parries.',
    type: '1v1 Live',
    thumbnail: '',
  },
  {
    id: 'goon-cave',
    title: 'Goon Cave Escape',
    description: 'Puzzle race while brain rot inverts your controls.',
    type: 'Co-op',
    thumbnail: '',
  },
  {
    id: 'tiktok-live',
    title: 'TikTok Live Battle',
    description: 'Tap-match donations while trolls force apology typing.',
    type: 'Tournament',
    thumbnail: '',
  },
  {
    id: 'aura-farm',
    title: 'Aura Farming',
    description: 'Hallway QTEs: hoodie physics and mysterious sitting.',
    type: 'Solo',
    thumbnail: '',
  },
  {
    id: 'yap-olympics',
    title: 'Yap Olympics',
    description: 'Type synonyms fast or get derailed with gibberish.',
    type: '1v1 Live',
    thumbnail: '',
  },
  {
    id: 'lock-in',
    title: 'Lock-In Button',
    description: 'Caffeine up then hit beat-sync anime QTEs.',
    type: '1v1 Live',
    thumbnail: '',
  },
  {
    id: 'prop-hunt',
    title: 'Brainrot Prop Hunt',
    description: 'Hide as a Prime bottle or hunt on the grid.',
    type: 'Co-op',
    thumbnail: '',
  },
  {
    id: 'discord-mod',
    title: 'Discord Mod Arena',
    description: 'Card strategy mod war with cancellation raids.',
    type: 'Tournament',
    thumbnail: '',
  },
  {
    id: 'gigachad-raid',
    title: 'Gigachad Boss Raid',
    description: 'Boss vs swarm commander asymmetric raid.',
    type: '1v1 Live',
    thumbnail: '',
  },
  {
    id: 'caseoh-rampage',
    title: 'CaseOh Food Rampage',
    description: 'Grow avatars by devouring falling food combos.',
    type: 'Solo',
    thumbnail: '',
  },
  {
    id: 'delulu-dating',
    title: 'Delulu Dating Warfare',
    description: 'Connect conspiracy clues before reality collapses.',
    type: '1v1 Live',
    thumbnail: '',
  },
  {
    id: 'subway-debate',
    title: 'Subway Surfers Debate',
    description: 'Debate on top, endless runner on bottom.',
    type: 'Co-op',
    thumbnail: '',
  },
  {
    id: 'bombardino-race',
    title: 'Bombardino Racing',
    description: 'Cursed crocodile lane racing with mutations.',
    type: 'Solo',
    thumbnail: '',
  },
  {
    id: 'brain-cell',
    title: 'Brain Cell Extraction',
    description: 'Escape IQ drain while traps flood your screen.',
    type: '1v1 Live',
    thumbnail: '',
  },
  {
    id: 'npc-breakout',
    title: 'NPC Breakout',
    description: 'Interrogate the NPC without triggering alerts.',
    type: 'Tournament',
    thumbnail: '',
  },
];
