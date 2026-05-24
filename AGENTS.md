# nsfwjs-docker — agent instructions

## Stack

- **Runtime:** Deno on `denoland/deno:debian`.
- **Framework:** Hono + TypeScript (entrypoint: `entry.ts`).
- **Lint/Format:** `deno lint` / `deno fmt` (Deno built-in). No Biome/ESLint/Prettier.
- **ML:** `@tensorflow/tfjs-node` + `nsfwjs` (graph model from `model/`, loaded at startup).
- **Images:** `sharp` (requires `libjemalloc2` — set via `LD_PRELOAD` in Dockerfile).
- **Logging:** `@logtape/logtape` with ANSI color formatter; logger exported from `logger.ts`.

## API

- `POST /classify` — **`Content-Type: application/octet-stream`** (raw image bytes).
  Returns `{ prediction: [{ className, probability }] }`.
- Port **3333** (hardcoded in `server.ts`).

## Commands

```sh
deno task dev     # TF_CPP_MIN_LOG_LEVEL=1 deno --watch --allow-all entry.ts
deno task start   # TF_CPP_MIN_LOG_LEVEL=1 deno --allow-all entry.ts
deno task lint    # deno lint
deno task format  # deno fmt
deno task check   # deno check --unstable-tsgo entry.ts
```
No test or typecheck scripts exist. `deno ci` installs dependencies in Docker builds.

## Model & inference

- TF graph model in `model/` loaded via `file://model/`. 5 classes: Neutral, Drawing, Sexy, Hentai, Porn.
- Image pipeline: resize 224×224 cover → remove alpha → raw RGB tensor (no JPEG encode). ~100ms per prediction.
- `tfImage.dispose()` is always called in a `finally` block — never skip cleanup.

## Docker

```sh
docker build -t nsfwjs .
docker run -p 3333:3333 nsfwjs
```
Production: add `--restart always`.

## Conventions

- `entry.ts` is a shim that polyfills `util.isNullOrUndefined` via `createRequire`, then imports `server.ts`. Do not import TensorFlow/nsfwjs in `entry.ts`.
- `deno.json` `allowScripts` governs npm lifecycle scripts (required for `@tensorflow/tfjs-node`, `core-js`, `sharp`).
- `nodeModulesDir: "manual"` — `node_modules/` is committed or managed by `deno ci`.
- Lint/format exclusions: `model/**`.
