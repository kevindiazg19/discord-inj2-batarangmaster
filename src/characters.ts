/**
 * Register every character JSON file here when you add one under data/characters/.
 * Also add a matching entry in data/index.json.
 */
import type { Character, CharacterIndexEntry } from "./types.js";
import indexJson from "../data/index.json";
import batman from "../data/characters/batman.json";
import wonderWoman from "../data/characters/wonder-woman.json";

export const CHARACTERS: Character[] = [batman, wonderWoman] as Character[];

export const CHARACTER_INDEX: CharacterIndexEntry[] =
  indexJson as CharacterIndexEntry[];
