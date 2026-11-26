export type GearBuild = {
  focus: string;
  chanceEffects: string[];
  artifact: string;
};

export type Build = {
  id: string;
  label: string;
  priority: number;
  abilityOrder: string[];
  abilityNotes: string;
  talents: string[];
  talentNotes: string;
  gear: GearBuild;
  teamSynergy: string[];
  notes: string;
};

export type Character = {
  id: string;
  name: string;
  aliases: string[];
  class: string;
  rarity: string;
  faction?: string;
  builds: Build[];
};

export type CharacterIndexEntry = {
  id: string;
  name: string;
  aliases: string[];
  class: string;
  rarity: string;
  faction?: string;
};

export type Env = {
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
  DISCORD_TOKEN?: string;
};
