# Injustice 2 Mobile Build Bot

Free Discord slash-command bot that returns curated Injustice 2 Mobile builds as embeds. Hosted on **Cloudflare Workers** (no always-on VPS, no paid bot host).

Commands:

- `/guia character:<name>` — guía principal (mayor prioridad)
- `/guia character:<name> mode:<raid|arena|…>` — variante específica
- `/list` — personajes que tienen guía
- `/help` — uso breve

## Cost

| Piece | Cost |
| --- | --- |
| Discord application + bot | Free |
| Cloudflare Workers | Free tier |
| Database / bot SaaS | Not used |

Tradeoff: the bot only answers slash commands (HTTP interactions). It does not read normal chat messages.

## Prerequisites

- Node.js 20+
- A Discord account with permission to add bots to your server
- A free [Cloudflare](https://dash.cloudflare.com) account

## 1. Create the Discord application

1. Open [Discord Developer Portal](https://discord.com/developers/applications) → **New Application**.
2. **General Information** — copy **Application ID** and **Public Key**.
3. **Bot** — Add Bot → reset/copy **Token** (keep it secret).
4. Disable privileged intents; this bot does not need Message Content, Presence, or Members.
5. **OAuth2 → URL Generator**
   - Scopes: `bot`, `applications.commands`
   - Bot permissions: **Send Messages**, **Use Application Commands**
6. Open the generated URL and invite the bot to your server.
7. Enable Developer Mode in Discord (User Settings → App Settings → Advanced), right-click your server name → **Copy Server ID**. You need this for fast command registration.

## 2. Install and configure this project

```bash
npm install
cp .env.example .dev.vars
```

Edit `.dev.vars` (and export the same values in your shell for registration):

```bash
DISCORD_TOKEN=...
DISCORD_PUBLIC_KEY=...
DISCORD_APPLICATION_ID=...
DISCORD_GUILD_ID=...   # your server ID
```

Never commit `.dev.vars` or real tokens.

## 3. Deploy to Cloudflare Workers

```bash
npx wrangler login
npm run deploy
```

Then store production secrets:

```bash
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_APPLICATION_ID
npx wrangler secret put DISCORD_TOKEN
```

Copy the Worker URL from the deploy output (looks like `https://i2m-build-bot.<subdomain>.workers.dev`).

## 4. Point Discord at the Worker

In the Developer Portal → your app → **General Information** → **Interactions Endpoint URL**:

```text
https://i2m-build-bot.<subdomain>.workers.dev
```

Save. Discord sends a `PING`; the Worker must reply with `PONG`. If validation fails, check that `DISCORD_PUBLIC_KEY` is set correctly.

## 5. Register slash commands

```bash
export DISCORD_TOKEN=...
export DISCORD_APPLICATION_ID=...
export DISCORD_GUILD_ID=...   # recommended
npm run register
```

Guild registration is near-instant. Without `DISCORD_GUILD_ID`, commands are global and can take up to an hour.

In Discord, try `/guia character:batman`.

## Local development

```bash
npm run dev
```

For Discord to reach your laptop you need a public HTTPS tunnel (Cloudflare Tunnel, ngrok, etc.) pointed at the local Wrangler port, then temporarily set that URL as the Interactions Endpoint URL.

## Adding a character build

1. Create `data/characters/<id>.json` using Batman/Wonder Woman as templates.
2. Add an entry to `data/index.json` (`id`, `name`, `aliases`, `class`, `rarity`).
3. Import the JSON in [`src/characters.ts`](src/characters.ts) and append it to `CHARACTERS`.
4. Redeploy: `npm run deploy`.

Build fields:

| Field | Meaning |
| --- | --- |
| `builds[].id` | Mode key for `/guia … mode:` (`raid`, `arena`, …) |
| `builds[].priority` | Lower number = default when mode omitted |
| `abilityOrder` | Recommended SP upgrade order |
| `talents` | Preferred talent stats |
| `gear` | Set focus, chance effects, artifact note |
| `teamSynergy` / `notes` | Free-form tips |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local Worker |
| `npm run deploy` | Publish to Cloudflare |
| `npm run register` | Create/update Discord slash commands |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests for lookup |

## Project layout

```text
src/
  index.ts        Worker entry (verify Discord + handle commands)
  commands.ts     Slash command definitions
  register.ts     One-shot Discord API registration
  lookup.ts       Name/alias resolution
  embeds.ts       Discord embeds
  characters.ts   Character registry
data/
  index.json
  characters/     One JSON file per hero
```
