/**
 * Generates empty character JSON stubs + data/index.json from the curated roster.
 * Run: node scripts/generate-roster.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const charactersDir = path.join(root, "data", "characters");

/** @type {{ abbr: string, name: string, rarity: string, faction?: string, aliases?: string[] }[]} */
const roster = [
  // Justice League
  { abbr: "jla", name: "Justice League Aquaman", rarity: "gold", faction: "Justice League" },
  { abbr: "jlb", name: "Justice League Batman", rarity: "gold", faction: "Justice League" },
  { abbr: "jlc", name: "Justice League Cyborg", rarity: "gold", faction: "Justice League" },
  { abbr: "jlf", name: "Justice League Flash", rarity: "gold", faction: "Justice League" },
  { abbr: "jlsm", name: "Justice League Superman", rarity: "legendary", faction: "Justice League", aliases: ["jls"] },
  { abbr: "mww", name: "Mythic Wonder Woman", rarity: "gold", faction: "Justice League" },

  // Multiverse
  { abbr: "mvasg", name: "Multiverse Armored Supergirl", rarity: "gold", faction: "Multiverse" },
  { abbr: "mvbw", name: "Multiverse Batwoman", rarity: "gold", faction: "Multiverse" },
  { abbr: "mvbl", name: "Multiverse Black Lightning", rarity: "gold", faction: "Multiverse" },
  { abbr: "mvcc", name: "Multiverse Captain Cold", rarity: "gold", faction: "Multiverse" },
  { abbr: "mvga", name: "Multiverse Green Arrow", rarity: "gold", faction: "Multiverse" },
  { abbr: "mvf", name: "Multiverse Flash", rarity: "gold", faction: "Multiverse" },
  { abbr: "mvsg", name: "Multiverse Supergirl", rarity: "gold", faction: "Multiverse" },
  { abbr: "mvwc", name: "Multiverse White Canary", rarity: "gold", faction: "Multiverse" },

  // Batman Ninja
  { abbr: "bnbm", name: "Batman Ninja Batman", rarity: "gold", faction: "Batman Ninja" },
  { abbr: "bncw", name: "Batman Ninja Catwoman", rarity: "gold", faction: "Batman Ninja" },
  { abbr: "bngg", name: "Batman Ninja Gorilla Grodd", rarity: "legendary", faction: "Batman Ninja" },
  { abbr: "bnhq", name: "Batman Ninja Harley Quinn", rarity: "gold", faction: "Batman Ninja" },
  { abbr: "bnlj", name: "Batman Ninja Lord Joker", rarity: "gold", faction: "Batman Ninja" },
  { abbr: "bnr", name: "Batman Ninja Robin", rarity: "gold", faction: "Batman Ninja" },

  // League of Anarchy
  { abbr: "epi", name: "Entangling Poison Ivy", rarity: "gold", faction: "League of Anarchy" },
  { abbr: "hbhq", name: "Heart Breaker Harley Quinn", rarity: "gold", faction: "League of Anarchy" },
  { abbr: "llj", name: "Last Laugh Joker", rarity: "gold", faction: "League of Anarchy" },

  // Suicide Squad
  { abbr: "ssds", name: "Suicide Squad Deadshot", rarity: "gold", faction: "Suicide Squad" },
  { abbr: "sshq", name: "Suicide Squad Harley Quinn", rarity: "legendary", faction: "Suicide Squad" },
  { abbr: "sse", name: "Suicide Squad Enchantress", rarity: "legendary", faction: "Suicide Squad" },

  // Green Lantern Corps
  { abbr: "egl", name: "Emerald Green Lantern", rarity: "gold", faction: "Green Lantern Corps" },
  { abbr: "jsgl", name: "John Stewart Green Lantern", rarity: "gold", faction: "Green Lantern Corps" },
  { abbr: "svgl", name: "Silver Green Lantern", rarity: "silver", faction: "Green Lantern Corps" },

  // Legendaries (unique only)
  { abbr: "akbm", name: "Arkham Knight Batman", rarity: "legendary", faction: "Legendary" },
  { abbr: "bm", name: "Black Manta", rarity: "legendary", faction: "Legendary" },
  { abbr: "brnc", name: "Brainiac", rarity: "legendary", faction: "Legendary" },
  { abbr: "bwl", name: "Batman Who Laughs", rarity: "legendary", faction: "Legendary" },
  { abbr: "cows", name: "Collector of Worlds Superman", rarity: "legendary", faction: "Legendary" },
  { abbr: "ds", name: "Darkseid", rarity: "legendary", faction: "Legendary", aliases: ["darkside"] },
  { abbr: "dsk", name: "Deathstroke", rarity: "legendary", faction: "Legendary" },
  { abbr: "gaww", name: "Golden Armor Wonder Woman", rarity: "legendary", faction: "Legendary" },
  { abbr: "mm", name: "Martian Manhunter", rarity: "legendary", faction: "Legendary", aliases: ["martian man hunter"] },
  { abbr: "mrf", name: "Mr. Freeze", rarity: "legendary", faction: "Legendary", aliases: ["mr freeze"] },
  { abbr: "rvn", name: "Raven", rarity: "legendary", faction: "Legendary" },
  { abbr: "zat", name: "Zatanna", rarity: "legendary", faction: "Legendary" },

  // Golds
  { abbr: "aga", name: "Ace Green Arrow", rarity: "gold", faction: "Gold" },
  { abbr: "asm", name: "Armored Superman", rarity: "gold", faction: "Gold" },
  { abbr: "aaam", name: "Atlantean Armor Aquaman", rarity: "gold", faction: "Gold" },
  { abbr: "atc", name: "Atrocitus", rarity: "gold", faction: "Gold" },
  { abbr: "btd", name: "Batwoman the Drowned", rarity: "gold", faction: "Gold" },
  { abbr: "ba", name: "Black Adam", rarity: "gold", faction: "Gold" },
  { abbr: "bmr", name: "Blade Master Robin", rarity: "gold", faction: "Gold" },
  { abbr: "bb", name: "Blue Beetle", rarity: "gold", faction: "Gold" },
  { abbr: "cc", name: "Captain Cold", rarity: "gold", faction: "Gold" },
  { abbr: "cth", name: "Cheetah", rarity: "gold", faction: "Gold" },
  { abbr: "cbm", name: "Classic Batman", rarity: "gold", faction: "Gold" },
  { abbr: "csm", name: "Classic Superman", rarity: "gold", faction: "Gold" },
  { abbr: "cww", name: "Classic Wonder Woman", rarity: "gold", faction: "Gold" },
  { abbr: "dsg", name: "Dark Supergirl", rarity: "gold", faction: "Gold", aliases: ["dark super girl"] },
  { abbr: "esf", name: "Energised Starfire", rarity: "gold", faction: "Gold", aliases: ["energized starfire"] },
  { abbr: "eb", name: "Enraged Bane", rarity: "gold", faction: "Gold" },
  { abbr: "fs", name: "Firestorm", rarity: "gold", faction: "Gold" },
  { abbr: "fpi", name: "Flora Poison Ivy", rarity: "gold", faction: "Gold" },
  { abbr: "grid", name: "Grid", rarity: "gold", faction: "Gold" },
  { abbr: "hb", name: "Hellboy", rarity: "gold", faction: "Gold" },
  { abbr: "hsc", name: "Horrific Scarecrow", rarity: "gold", faction: "Gold" },
  { abbr: "kbm", name: "Knightmare Batman", rarity: "gold", faction: "Gold" },
  { abbr: "mtcw", name: "Masterthief Catwoman", rarity: "gold", faction: "Gold", aliases: ["master thief catwoman"] },
  { abbr: "nw", name: "Nightwing", rarity: "gold", faction: "Gold" },
  { abbr: "pbm", name: "Predator Batman", rarity: "gold", faction: "Gold" },
  { abbr: "pst", name: "Primal Swamp Thing", rarity: "gold", faction: "Gold" },
  { abbr: "psg", name: "Powered Supergirl", rarity: "gold", faction: "Gold" },
  { abbr: "pg", name: "Power Girl", rarity: "gold", faction: "Gold" },
  { abbr: "rdn", name: "Raiden", rarity: "gold", faction: "Gold" },
  { abbr: "rh", name: "Red Hood", rarity: "gold", faction: "Gold", aliases: ["redhood"] },
  { abbr: "rf", name: "Reverse Flash", rarity: "gold", faction: "Gold" },
  { abbr: "sb", name: "Silver Banshee", rarity: "gold", faction: "Gold" },
  { abbr: "szm", name: "Shazam", rarity: "gold", faction: "Gold" },
  { abbr: "svbc", name: "Sonic Black Canary", rarity: "gold", faction: "Gold", aliases: ["sonic black canary"] },
  { abbr: "ssdf", name: "Soul Stealer Dr. Fate", rarity: "gold", faction: "Gold" },
  { abbr: "sff", name: "Speed Force Flash", rarity: "gold", faction: "Gold" },
  { abbr: "sz", name: "Sub-Zero", rarity: "gold", faction: "Gold", aliases: ["subzero", "sub zero"] },
  { abbr: "tkgg", name: "Telekinetic Gorilla Grodd", rarity: "gold", faction: "Gold" },
  { abbr: "ubc", name: "Unbreakable Cyborg", rarity: "gold", faction: "Gold" },
  { abbr: "uhq", name: "Unhinged Harley Quinn", rarity: "gold", faction: "Gold" },
  { abbr: "vxn", name: "Vixen", rarity: "gold", faction: "Gold" },
  { abbr: "wqww", name: "Warrior Queen Wonder Woman", rarity: "gold", faction: "Gold" },

  // Silvers (SVBC conflict → silver-black-canary / svbcs)
  { abbr: "aww", name: "Amazon Wonder Woman", rarity: "silver", faction: "Silver" },
  { abbr: "svam", name: "Silver Aquaman", rarity: "silver", faction: "Silver" },
  { abbr: "svb", name: "Silver Bane", rarity: "silver", faction: "Silver" },
  { abbr: "svbm", name: "Silver Batman", rarity: "silver", faction: "Silver" },
  { abbr: "svbcs", name: "Silver Black Canary", rarity: "silver", faction: "Silver", aliases: ["svbc-silver", "silver black canary"] },
  { abbr: "svsm", name: "Silver Superman", rarity: "silver", faction: "Silver" },
  { abbr: "svcw", name: "Silver Catwoman", rarity: "silver", faction: "Silver" },
  { abbr: "svc", name: "Silver Cyborg", rarity: "silver", faction: "Silver" },
  { abbr: "svds", name: "Silver Deadshot", rarity: "silver", faction: "Silver" },
  { abbr: "svdf", name: "Silver Doctor Fate", rarity: "silver", faction: "Silver", aliases: ["doctor fate"] },
  { abbr: "svf", name: "Silver Flash", rarity: "silver", faction: "Silver" },
  { abbr: "svga", name: "Silver Green Arrow", rarity: "silver", faction: "Silver" },
  { abbr: "svgg", name: "Silver Gorilla Grodd", rarity: "silver", faction: "Silver" },
  { abbr: "svhq", name: "Silver Harley Quinn", rarity: "silver", faction: "Silver" },
  { abbr: "svj", name: "Silver Joker", rarity: "silver", faction: "Silver" },
  { abbr: "svr", name: "Silver Robin", rarity: "silver", faction: "Silver" },
  { abbr: "svsc", name: "Silver Scarecrow", rarity: "silver", faction: "Silver" },
  { abbr: "svst", name: "Silver Swamp Thing", rarity: "silver", faction: "Silver" },
  { abbr: "svww", name: "Silver Wonder Woman", rarity: "silver", faction: "Silver" },
];

function emptyCharacter(entry) {
  const aliases = [entry.abbr, ...(entry.aliases ?? [])];
  // Dedupe aliases case-insensitively, keep abbr first
  const seen = new Set();
  const uniqueAliases = [];
  for (const a of aliases) {
    const key = a.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueAliases.push(a);
  }

  return {
    id: entry.abbr.toLowerCase(),
    name: entry.name,
    aliases: uniqueAliases,
    class: "",
    rarity: entry.rarity,
    faction: entry.faction ?? "",
    builds: [
      {
        id: "default",
        label: "Guía principal",
        priority: 1,
        abilityOrder: [],
        abilityNotes: "",
        talents: [],
        talentNotes: "",
        gear: {
          focus: "",
          chanceEffects: [],
          artifact: "",
        },
        teamSynergy: [],
        notes: "Pendiente de completar.",
      },
    ],
  };
}

fs.mkdirSync(charactersDir, { recursive: true });

// Remove old sample files not in roster
for (const file of fs.readdirSync(charactersDir)) {
  if (file.endsWith(".json")) {
    fs.unlinkSync(path.join(charactersDir, file));
  }
}

const index = [];
const ids = new Set();

for (const entry of roster) {
  const id = entry.abbr.toLowerCase();
  if (ids.has(id)) {
    console.error(`Duplicate id: ${id}`);
    process.exit(1);
  }
  ids.add(id);

  const character = emptyCharacter(entry);
  const filePath = path.join(charactersDir, `${id}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(character, null, 2)}\n`);

  index.push({
    id: character.id,
    name: character.name,
    aliases: character.aliases,
    class: character.class,
    rarity: character.rarity,
    faction: character.faction,
  });
}

const characters = roster.map(emptyCharacter);

fs.writeFileSync(
  path.join(root, "data", "index.json"),
  `${JSON.stringify(index, null, 2)}\n`
);

fs.writeFileSync(
  path.join(root, "data", "roster.json"),
  `${JSON.stringify(characters, null, 2)}\n`
);

console.log(
  `Wrote ${index.length} characters to data/characters/, data/index.json, and data/roster.json`
);
