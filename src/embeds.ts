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
      ? suggestions.map((s) => `• **${s.name}** (\`/guia character:${s.id}\`)`).join("\n")
      : "Prueba `/list` para ver todos los personajes con guía.";

  return {
    title: "Personaje no encontrado",
    description: clamp(`No hay guía para **${query}**.\n\n${tip}`, 4096),
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
    title: "Personajes con guía",
    description: clamp(
      lines.length
        ? `${lines.join("\n")}\n\nUsa \`/guia character:<nombre>\``
        : "Aún no hay personajes. Agrega JSON en `data/characters/`.",
      4096
    ),
    color: EMBED_COLOR,
    fields: [],
  };
}

export function helpEmbed(): Embed {
  return {
    title: "I2M Guía Bot",
    description:
      "Consulta guías/builds curadas de Injustice 2 Mobile.\n\n" +
      "**Comandos**\n" +
      "• `/guia character:<nombre>` — guía principal (mayor prioridad)\n" +
      "• `/guia character:<nombre> mode:<raid|arena|…>` — variante específica\n" +
      "• `/list` — personajes que tienen guía\n" +
      "• `/help` — este mensaje\n\n" +
      "También funcionan alias (ej. `ww`, `bats`).",
    color: EMBED_COLOR,
    fields: [],
  };
}
