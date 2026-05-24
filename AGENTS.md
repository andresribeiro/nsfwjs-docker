# nsfwjs-docker — agent instructions

## Stack

- **Runtime:** Deno. Docker image is `denoland/deno:debian-2.2`.
- **Framework:** Hono + TypeScript (entrypoint: `entry.ts`).
- **Formatter/Linter:** Biome (tab indent, double quotes). No ESLint/Prettier.
- **ML:** `@tensorflow/tfjs-node` + `nsfwjs` (graph model loaded from
  `model/` at startup).
- **Image processing:** `sharp` (requires `libjemalloc2` – installed in
  Dockerfile).
- **Logging:** `@logtape/logtape` (ANSI color formatter). Logger configured in
  `logger.ts`, exported as `logger`.

## Commands

```sh
deno task dev        # TF_CPP_MIN_LOG_LEVEL=1 deno --watch --allow-all entry.ts
deno task start      # TF_CPP_MIN_LOG_LEVEL=1 deno --allow-all entry.ts
deno task lint       # deno lint
deno task format     # deno format
deno task check      # deno check --unstable-tsgo entry.ts
```

No test, typecheck, or build scripts exist.

## API

- `POST /classify` — multipart form with `image` (file).
- Returns `{ prediction: [{ className, probability }] }`.
- Port **3333** (hardcoded in `server.ts`).

## Docker

```sh
docker build -t nsfwjs .
docker run -p 3333:3333 nsfwjs
```

Production: add `--restart always`.

## Model

- TF graph model in `model/` (loaded via `file://model/`).
- Classifies 5 classes: Neutral, Drawing, Sexy, Hentai, Porn.
- Image preprocessed: resize to 224×224 cover → remove alpha → raw RGB tensor
  (no JPEG encode).
- ~100ms per prediction.

## Conventions

- `"type": "module"` — ESM imports throughout.
- `tsconfig.json`: `module: "Preserve"`, `moduleResolution: "bundler"`,
  `noEmit: true`, `verbatimModuleSyntax: true`.
- `trustedDependencies` in package.json: `@tensorflow/tfjs-node`, `core-js`,
  `sharp`.
