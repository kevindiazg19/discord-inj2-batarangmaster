import { CHARACTER_INDEX, CHARACTERS } from "./characters.js";
import type { Character, CharacterIndexEntry } from "./types.js";

const characters: Character[] = CHARACTERS;
const index: CharacterIndexEntry[] = CHARACTER_INDEX;

const byId = new Map(characters.map((c) => [c.id, c]));

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function listCharacters(): CharacterIndexEntry[] {
  return [...index].sort((a, b) => a.name.localeCompare(b.name));
}

export function getCharacter(id: string): Character | undefined {
  return byId.get(id);
}

/** Resolve a user query against id, name, and aliases. */
export function findCharacter(query: string): Character | undefined {
  const q = normalize(query);
  if (!q) return undefined;

  for (const entry of index) {
    const candidates = [entry.id, entry.name, ...entry.aliases].map(normalize);
    if (candidates.includes(q)) {
      return byId.get(entry.id);
    }
  }

  // Partial contains match (e.g. "wonder" → Wonder Woman)
  const partial = index.filter((entry) => {
    const candidates = [entry.id, entry.name, ...entry.aliases].map(normalize);
    return candidates.some((c) => c.includes(q) || q.includes(c));
  });

  if (partial.length === 1) {
    return byId.get(partial[0].id);
  }

  return undefined;
}

export function suggestCharacters(query: string, limit = 5): CharacterIndexEntry[] {
  const q = normalize(query);
  if (!q) return listCharacters().slice(0, limit);

  const scored = index
    .map((entry) => {
      const candidates = [entry.id, entry.name, ...entry.aliases].map(normalize);
      let score = 0;
      for (const c of candidates) {
        if (c === q) score = Math.max(score, 100);
        else if (c.startsWith(q)) score = Math.max(score, 80);
        else if (c.includes(q)) score = Math.max(score, 50);
        else if (q.includes(c) && c.length >= 3) score = Math.max(score, 40);
      }
      return { entry, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name));

  return scored.slice(0, limit).map((s) => s.entry);
}

export type PickBuildResult =
  | { ok: true; build: NonNullable<Character["builds"][number]> }
  | { ok: false; reason: "empty" | "unknown_mode" };

export function pickBuild(character: Character, mode?: string): PickBuildResult {
  if (!character.builds.length) {
    return { ok: false, reason: "empty" };
  }

  if (mode) {
    const m = normalize(mode);
    const exact = character.builds.find(
      (b) => normalize(b.id) === m || normalize(b.label) === m
    );
    if (!exact) {
      return { ok: false, reason: "unknown_mode" };
    }
    return { ok: true, build: exact };
  }

  const build = [...character.builds].sort((a, b) => a.priority - b.priority)[0];
  return { ok: true, build };
}

export function availableModes(character: Character): string[] {
  return character.builds.map((b) => b.id);
}
