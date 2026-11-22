# nsfwjs-docker — agent instructions

## Stack

- **Runtime:** Node.js 26 on `node:26-bookworm-slim`; TypeScript runs natively
  via type stripping (no build step).
- **Framework:** Hono + `@hono/node-server` (entrypoint: `entry.ts`).
- **Lint/Format:** Biome (`npm run check`, `npm run format`) and `tsc --noEmit`
  (`npm run typecheck`).
- **ML:** `@tensorflow/tfjs-node` + `nsfwjs` (graph model from `model/`, loaded
  at startup).
- **Images:** `sharp` (requires `libjemalloc2` — set via `LD_PRELOAD` in
  Dockerfile).
- **Logging:** `@logtape/logtape` with ANSI color formatter; logger exported
  from `logger.ts`.

## API

- `POST /classify` — **`Content-Type: application/octet-stream`** (raw image
  bytes). Returns `{ prediction: [{ className, probability }] }`.
- `GET /status` — health check. Returns `{ ok: true }`.
- Port **3333** (hardcoded in `server.ts`).

## Commands

```sh
npm run dev        # TF_CPP_MIN_LOG_LEVEL=1 node --watch entry.ts
npm run start      # TF_CPP_MIN_LOG_LEVEL=1 node entry.ts
npm run typecheck  # tsc --noEmit
npm run check      # biome lint + format check
npm run format     # biome format --write
npm ci             # install dependencies (Docker builds use this)
```

No tests exist.

## Model & inference

- TF graph model in `model/` loaded via `file://model/`. 5 classes: Neutral,
  Drawing, Sexy, Hentai, Porn.
- Image pipeline: resize 224×224 cover → remove alpha → raw RGB tensor (no JPEG
  encode). ~100ms per prediction.
- `tfImage.dispose()` is always called in a `finally` block — never skip
  cleanup.

## Docker

```sh
docker build -t nsfwjs .
docker run -p 3333:3333 nsfwjs
```

Production: add `--restart always`. ARM builds compile the TensorFlow binding
from source, so they are much slower.

## Conventions

- `entry.ts` polyfills `util.isNullOrUndefined`, which Node 22+ removed but
  `@tensorflow/tfjs-node` 4.22 still calls. It must run before anything imports
  TensorFlow; do not import TensorFlow/nsfwjs in `entry.ts`.
- Node type stripping only runs erasable TypeScript: no enums, namespaces or
  parameter properties. `erasableSyntaxOnly` in `tsconfig.json` enforces this.
  Relative imports include the `.ts` extension (`allowImportingTsExtensions`).
- `package.json` `allowScripts` governs npm lifecycle scripts (required for
  `@tensorflow/tfjs-node`, `core-js`, `sharp`). Approving a new version:
  `npm install-scripts approve <pkg>`.
- `node_modules/` is ignored by git and Docker; dependencies are installed with
  `npm ci`.
- Formatting excludes `model/`, `node_modules/` and `package-lock.json` via
  `biome.json`'s `files.includes`.
