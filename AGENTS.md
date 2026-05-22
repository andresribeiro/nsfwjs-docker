# nsfwjs-docker — agent instructions

## Stack

- **Runtime:** Bun (not Node). Docker image is `oven/bun:slim`.
- **Framework:** Hono + TypeScript (entrypoint: `src/server.ts`).
- **Formatter/Linter:** Biome (tab indent, double quotes). No ESLint/Prettier.
- **ML:** `@tensorflow/tfjs-node` + `nsfwjs` (graph model loaded from `src/model/` at startup).
- **Image processing:** `sharp` (requires `libjemalloc2` – installed in Dockerfile).
- **Logging:** `@logtape/logtape` (ANSI color formatter). Logger configured in `src/logger.ts`, exported as `logger`.

## Commands

```sh
bun run dev        # TF_CPP_MIN_LOG_LEVEL=1 bun --watch src/server.ts
bun run start      # TF_CPP_MIN_LOG_LEVEL=1 bun src/server.ts
bun run lint       # bunx biome check .
bun run lint:fix   # bunx biome format --write
```

No test, typecheck, or build scripts exist.

## API

- `POST /classify` — multipart form with `image` (file).
- Returns `{ prediction: [{ className, probability }] }`.
- Port **3333** (hardcoded in `src/server.ts`).

## Docker

```sh
docker build -t nsfwjs .
docker run -p 3333:3333 nsfwjs
```

Production: add `--restart always`.

## Model

- TF graph model in `src/model/` (loaded via `file://src/model/`).
- Classifies 5 classes: Neutral, Drawing, Sexy, Hentai, Porn.
- Image preprocessed: resize to 224×224 cover → remove alpha → raw RGB tensor (no JPEG encode).
- ~250ms per prediction.

## Conventions

- `"type": "module"` — ESM imports throughout.
- `tsconfig.json`: `module: "Preserve"`, `moduleResolution: "bundler"`, `noEmit: true`, `verbatimModuleSyntax: true`.
- `trustedDependencies` in package.json: `@tensorflow/tfjs-node`, `core-js`, `sharp`.
