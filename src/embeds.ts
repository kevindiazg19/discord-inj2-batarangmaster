import type { Build, Character } from "./types.js";

type EmbedField = { name: string; value: string; inline?: boolean };
type Embed = {
  title: string;
  description?: string;
  color: number;
  fields: EmbedField[];
  footer?: { text: string };
};

const EMBED_COLOR = 0x1a3a6b;

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function field(name: string, value: string, inline = false): EmbedField {
  return { name, value: clamp(value || "—", 1024), inline };
}

export function buildEmbed(character: Character, build: Build): Embed {
  const modes = character.builds.map((b) => b.id).join(", ");

  return {
    title: `${character.name} — ${build.label}`,
    description: clamp(
      `${character.rarity} · ${character.class}\nMode: \`${build.id}\`${
        modes.includes(",") ? ` (also: ${modes})` : ""
      }`,
      4096
    ),
    color: EMBED_COLOR,
    fields: [
      field("Ability order", build.abilityOrder.join(" → ")),
      field("Ability notes", build.abilityNotes),
      field("Talents", build.talents.join(" · ")),
      field("Talent notes", build.talentNotes),
      field("Gear focus", build.gear.focus),
      field(
        "Chance effects",
        build.gear.chanceEffects.map((e) => `• ${e}`).join("\n")
      ),
      field("Artifact", build.gear.artifact),
      field(
        "Team synergy",
        build.teamSynergy.map((t) => `• ${t}`).join("\n")
      ),
      field("Notes", build.notes),
    ],
    footer: {
      text: "Injustice 2 Mobile builds · curated lookup",
    },
  };
}

export function notFoundEmbed(query: string, suggestions: { name: string; id: string }[]): Embed {
  const tip =
    suggestions.length > 0
      ? suggestions.map((s) => `• **${s.name}** (\`/build character:${s.id}\`)`).join("\n")
      : "Try `/list` to see every character with a build.";

  return {
    title: "Character not found",
    description: clamp(`No build matched **${query}**.\n\n${tip}`, 4096),
    color: 0xb33a3a,
    fields: [],
  };
}

export function listEmbed(
  entries: { name: string; id: string; class: string; rarity: string }[]
): Embed {
  const lines = entries.map(
    (e) => `• **${e.name}** — \`${e.id}\` (${e.rarity} ${e.class})`
  );

  return {
    title: "Characters with builds",
    description: clamp(
      lines.length
        ? `${lines.join("\n")}\n\nUse \`/build character:<name>\``
        : "No characters yet. Add JSON under `data/characters/`.",
      4096
    ),
    color: EMBED_COLOR,
    fields: [],
  };
}

export function helpEmbed(): Embed {
  return {
    title: "I2M Build Bot",
    description:
      "Look up curated Injustice 2 Mobile builds.\n\n" +
      "**Commands**\n" +
      "• `/build character:<name>` — default (highest priority) build\n" +
      "• `/build character:<name> mode:<raid|arena|…>` — specific variant\n" +
      "• `/list` — characters that have builds\n" +
      "• `/help` — this message\n\n" +
      "Aliases work too (e.g. `ww`, `bats`).",
    color: EMBED_COLOR,
    fields: [],
  };
}
