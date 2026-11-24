/** Slash command definitions registered with Discord's API. */

export const BUILD_COMMAND = {
  name: "build",
  description: "Show a curated Injustice 2 Mobile build for a character",
  options: [
    {
      type: 3, // STRING
      name: "character",
      description: "Character name or alias (e.g. batman, ww)",
      required: true,
    },
    {
      type: 3,
      name: "mode",
      description: "Build variant id (e.g. raid, arena)",
      required: false,
    },
  ],
} as const;

export const LIST_COMMAND = {
  name: "list",
  description: "List characters that have curated builds",
} as const;

export const HELP_COMMAND = {
  name: "help",
  description: "How to use the Injustice 2 Mobile build bot",
} as const;

export const ALL_COMMANDS = [BUILD_COMMAND, LIST_COMMAND, HELP_COMMAND];
