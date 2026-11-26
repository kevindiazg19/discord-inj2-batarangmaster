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
  const meta = [
    character.rarity,
    character.class,
    character.faction,
  ]
    .filter((part) => part && part.trim())
    .join(" · ");

  return {
    title: `${character.name} — ${build.label}`,
    description: clamp(
      `${meta || "Sin clasificación"}\nModo: \`${build.id}\`${
        modes.includes(",") ? ` (también: ${modes})` : ""
      }`,
      4096
    ),
    color: EMBED_COLOR,
    fields: [
      field("Orden de habilidades", build.abilityOrder.join(" → ")),
      field("Notas de habilidades", build.abilityNotes),
      field("Talentos", build.talents.join(" · ")),
      field("Notas de talentos", build.talentNotes),
      field("Enfoque de gear", build.gear.focus),
      field(
        "Chance effects",
        build.gear.chanceEffects.map((e) => `• ${e}`).join("\n")
      ),
      field("Artefacto", build.gear.artifact),
      field(
        "Sinergia de equipo",
        build.teamSynergy.map((t) => `• ${t}`).join("\n")
      ),
      field("Notas", build.notes),
    ],
    footer: {
      text: "Injustice 2 Mobile · guías curadas",
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

type ListEntry = {
  name: string;
  id: string;
  class: string;
  rarity: string;
  faction?: string;
};

/** Split roster into multiple embeds (Discord description limit is 4096). */
export function listEmbeds(entries: ListEntry[]): Embed[] {
  if (!entries.length) {
    return [
      {
        title: "Personajes con guía",
        description: "Aún no hay personajes. Agrega JSON en `data/characters/`.",
        color: EMBED_COLOR,
        fields: [],
      },
    ];
  }

  const lines = entries.map((e) => `• \`${e.id}\` — **${e.name}**`);
  const chunks: string[][] = [];
  let current: string[] = [];
  let size = 0;

  for (const line of lines) {
    const next = size + line.length + 1;
    if (current.length && next > 3800) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(line);
    size += line.length + 1;
  }
  if (current.length) chunks.push(current);

  return chunks.map((chunk, i) => ({
    title:
      chunks.length === 1
        ? `Personajes con guía (${entries.length})`
        : `Personajes con guía (${entries.length}) · ${i + 1}/${chunks.length}`,
    description: clamp(
      `${chunk.join("\n")}\n\nUsa \`/guia character:<id o nombre>\``,
      4096
    ),
    color: EMBED_COLOR,
    fields: [],
  }));
}

/** @deprecated Prefer listEmbeds for large rosters */
export function listEmbed(entries: ListEntry[]): Embed {
  return listEmbeds(entries)[0];
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
