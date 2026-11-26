import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import { GUIA_COMMAND, HELP_COMMAND, LIST_COMMAND } from "./commands.js";
import {
  buildEmbed,
  helpEmbed,
  listEmbeds,
  notFoundEmbed,
} from "./embeds.js";
import {
  availableModes,
  findCharacter,
  listCharacters,
  pickBuild,
  suggestCharacters,
} from "./lookup.js";
import type { Env } from "./types.js";

class JsonResponse extends Response {
  constructor(body: unknown, init: ResponseInit = {}) {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json;charset=UTF-8");
    super(JSON.stringify(body), { ...init, headers });
  }
}

function ephemeralFlags() {
  return 1 << 6; // EPHEMERAL
}

function handleBuild(options: { name: string; value: string }[] | undefined) {
  const characterOpt = options?.find((o) => o.name === "character")?.value ?? "";
  const modeOpt = options?.find((o) => o.name === "mode")?.value;

  const character = findCharacter(characterOpt);
  if (!character) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [notFoundEmbed(characterOpt, suggestCharacters(characterOpt))],
        flags: ephemeralFlags(),
      },
    });
  }

  const picked = pickBuild(character, modeOpt);
  if (!picked.ok) {
    if (picked.reason === "unknown_mode") {
      const modes = availableModes(character).join(", ");
      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `No hay modo \`${modeOpt}\` para **${character.name}**. Prueba: ${modes}`,
          flags: ephemeralFlags(),
        },
      });
    }

    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `**${character.name}** todavía no tiene guía.`,
        flags: ephemeralFlags(),
      },
    });
  }

  return new JsonResponse({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [buildEmbed(character, picked.build)],
    },
  });
}

async function handleInteraction(interaction: {
  type: number;
  data?: { name?: string; options?: { name: string; value: string }[] };
}): Promise<Response> {
  if (interaction.type === InteractionType.PING) {
    return new JsonResponse({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const name = interaction.data?.name?.toLowerCase();

    switch (name) {
      case GUIA_COMMAND.name:
        return handleBuild(interaction.data?.options);
      case LIST_COMMAND.name:
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: listEmbeds(listCharacters()).slice(0, 10),
            flags: ephemeralFlags(),
          },
        });
      case HELP_COMMAND.name:
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [helpEmbed()],
            flags: ephemeralFlags(),
          },
        });
      default:
        return new JsonResponse(
          { error: "Unknown command" },
          { status: 400 }
        );
    }
  }

  return new JsonResponse({ error: "Unknown interaction type" }, { status: 400 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "GET") {
      return new Response(
        [
          "Injustice 2 Mobile Build Bot",
          "",
          "This endpoint receives Discord slash-command interactions.",
          "Invite the bot to your server and use /guia, /list, or /help.",
          "",
          "Setup: see README.md",
        ].join("\n"),
        { headers: { "Content-Type": "text/plain;charset=UTF-8" } }
      );
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (!env.DISCORD_PUBLIC_KEY) {
      return new Response("DISCORD_PUBLIC_KEY is not configured", { status: 500 });
    }

    const signature = request.headers.get("X-Signature-Ed25519");
    const timestamp = request.headers.get("X-Signature-Timestamp");
    if (!signature || !timestamp) {
      return new Response("Missing signature headers", { status: 401 });
    }

    const body = await request.clone().arrayBuffer();
    const valid = await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
    if (!valid) {
      return new Response("Bad request signature", { status: 401 });
    }

    const interaction = (await request.json()) as {
      type: number;
      data?: { name?: string; options?: { name: string; value: string }[] };
    };
    return handleInteraction(interaction);
  },
};
