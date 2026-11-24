/**
 * One-shot script: register slash commands with Discord.
 *
 * Usage:
 *   export DISCORD_TOKEN=...
 *   export DISCORD_APPLICATION_ID=...
 *   export DISCORD_GUILD_ID=...   # optional but recommended (instant)
 *   npm run register
 *
 * Guild registration updates in seconds. Global can take up to ~1 hour.
 */

import { ALL_COMMANDS } from "./commands.js";

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token) {
  throw new Error("DISCORD_TOKEN is required");
}
if (!applicationId) {
  throw new Error("DISCORD_APPLICATION_ID is required");
}

const url = guildId
  ? `https://discord.com/api/v10/applications/${applicationId}/guilds/${guildId}/commands`
  : `https://discord.com/api/v10/applications/${applicationId}/commands`;

console.log(
  guildId
    ? `Registering ${ALL_COMMANDS.length} guild commands for guild ${guildId}…`
    : `Registering ${ALL_COMMANDS.length} GLOBAL commands (may take up to an hour)…`
);

const response = await fetch(url, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bot ${token}`,
  },
  body: JSON.stringify(ALL_COMMANDS),
});

const text = await response.text();
if (!response.ok) {
  console.error("Failed to register commands:", response.status, text);
  process.exit(1);
}

console.log("Registered commands successfully:");
try {
  const parsed = JSON.parse(text) as { name: string }[];
  for (const cmd of parsed) {
    console.log(`  /${cmd.name}`);
  }
} catch {
  console.log(text);
}
