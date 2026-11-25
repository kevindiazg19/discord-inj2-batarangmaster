/** Slash command definitions registered with Discord's API. */

export const GUIA_COMMAND = {
  name: "guia",
  description: "Muestra la guía/build recomendada de un personaje de Injustice 2 Mobile",
  options: [
    {
      type: 3, // STRING
      name: "character",
      description: "Nombre o alias del personaje (ej. batman, ww)",
      required: true,
    },
    {
      type: 3,
      name: "mode",
      description: "Variante de la guía (ej. raid, arena)",
      required: false,
    },
  ],
} as const;

export const LIST_COMMAND = {
  name: "list",
  description: "Lista los personajes que tienen guía",
} as const;

export const HELP_COMMAND = {
  name: "help",
  description: "Cómo usar el bot de guías de Injustice 2 Mobile",
} as const;

export const ALL_COMMANDS = [GUIA_COMMAND, LIST_COMMAND, HELP_COMMAND];
