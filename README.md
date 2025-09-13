# gcmcp

Interactive CLI to toggle Gemini CLI (`~/.gemini/settings.json`) `mcpServers` on/off.

- Disabled entries are not deleted, but moved to a sidecar JSON next to the settings file, e.g. `~/.gemini/settings.json.disabled.json`, so you can re‑enable them anytime. This avoids conflicts when using multiple settings files.
- ESM + TypeScript, single‑file bundle via `tsup` (no source map in package).

## Requirements

- Node.js >= 20

## Install

Use via npx (once published):

```bash
npx gcmcp
```

Or run locally from source (see Development below).

## Usage

Interactive toggle UI (default):

```bash
gcmcp                       # launch interactive checklist UI
```

Subcommands:

```bash
gcmcp ls                    # list enabled servers (use --all or --disabled)
gcmcp enable <id>           # move <id> from disabled list to enabled
gcmcp disable <id>          # move <id> from enabled to disabled list
gcmcp diff                  # show current enabled/disabled state
gcmcp diff --compose a,b    # preview changes if only a,b are enabled
```

Options:

- `--dry-run` to show changes without writing files (supported by `toggle/enable/disable`).

## Paths

- Settings: `~/.gemini/settings.json` (override with `GEMINI_SETTINGS_PATH`).
- Disabled list: `<settings path>.disabled.json` (sidecar next to settings; JSON map of id -> definition).

## Development

Install deps and build:

```bash
npm i
npm run build  # TypeScript -> single ESM at dist/index.js
```

Run locally:

```bash
node dist/index.js
node dist/index.js ls --all
node dist/index.js enable <id>
node dist/index.js disable <id>
```

Quality checks:

```bash
npm run typecheck   # TypeScript type checking (no emit)
npm run lint        # ESLint on .ts/.tsx
npm run validate    # typecheck + lint + tests
```

Tests (Vitest):

```bash
npm test
```

## Publishing (npm)

WSL-friendly login options:

```bash
# 1) Device flow (no browser auto-open)
npm login --auth-type=web --browser=none

# 2) Legacy (if your org allows)
# npm login --auth-type=legacy
```

Or create a classic token on npmjs.com and use a per-project `.npmrc`:

```bash
cp .npmrc.example .npmrc
export NPM_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Pre-flight and publish:

```bash
npm run validate
npm version patch   # or minor / major
npm publish --access public
```

Notes:
- `prepack` builds automatically; published files are limited to `dist` and `README.md`.
- Engines require Node >= 20.

## Notes

- The tool never edits server definitions; it only moves entries between enabled (`settings.json.mcpServers`) and disabled (`disabled.json`).
- A single backup is written as `<settings path>.gcmcp.bak` (overwritten each time).
