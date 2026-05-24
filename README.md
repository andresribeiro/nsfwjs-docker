# nsfwjs-docker

[![Docker Pulls](https://img.shields.io/docker/pulls/andresribeiroo/nsfwjs.svg)](https://hub.docker.com/r/andresribeiroo/nsfwjs)
[![License](https://img.shields.io/github/license/andresribeiro/nsfwjs-docker)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/andresribeiro/nsfwjs-docker)](https://github.com/anomalyco/nsfwjs-docker)

High-performance, self-hosted NSFW detection API powered by
[NSFWJS](https://github.com/infinitered/nsfwjs).

- **Accuracy:** ~93%;
- **Latency:** ~100ms per prediction;
- **Input:** JPEG, PNG, WebP, AVIF, TIFF, GIF (first frame), raw pixel data;
- **Output:** 5-class classification — Neutral, Drawing, Sexy, Hentai, Porn;
- **Multi-architecture:** Supports both `x64` and `arm64`.
- **Lightweight:** Runs under 350 MB of RAM.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Performance](#performance)
- [Build from source](#build-from-source)
- [Local development](#local-development)
- [License](#license)

## Installation

```shell
docker run -p 3333:3333 -d --name nsfwjs andresribeiroo/nsfwjs:3.0
```

## Usage

`POST` the raw image bytes to `/classify` with
`Content-Type: application/octet-stream`.

### Example Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "prediction": [
    { "className": "Neutral", "probability": 0.637 },
    { "className": "Drawing", "probability": 0.360 },
    { "className": "Hentai", "probability": 0.002 },
    { "className": "Sexy", "probability": 0.000 },
    { "className": "Porn", "probability": 0.000 }
  ]
}
```

The probability of each category ranges from 0 (lowest) to 1 (highest).

## Examples

### Node.js / Browser

```js
const res = await fetch("http://localhost:3333/classify", {
  method: "POST",
  headers: { "Content-Type": "application/octet-stream" },
  body: imageBlobOrBuffer,
});
const { prediction } = await res.json();
```

### Python

```python
import requests

with open("image.jpg", "rb") as f:
    resp = requests.post(
        "http://localhost:3333/classify",
        data=f,
        headers={"Content-Type": "application/octet-stream"},
    )
print(resp.json()["prediction"])
# [{ className: "Neutral", probability: 0.637 }, ...]
```

### httpie

```shell
http POST localhost:3333/classify Content-Type:application/octet-stream @image.jpg
```

### curl

```shell
curl -X POST \
  -H "Content-Type: application/octet-stream" \
  --data-binary @image.jpg \
  http://localhost:3333/classify
```

## Performance

This container is built for speed:

- **SIMD-accelerated image processing** — `sharp` (powered by libvips) handles
  image decoding and resizing to 224×224 before inference, taking advantage of
  SIMD instructions on compatible CPUs.
- **jemalloc allocator** — The Docker image links against `jemalloc`, which
  reduces fragmentation and improves memory usage under concurrent workloads
  compared to the glibc allocator.
- **Model failure safety** — If an error occurs during model inference, the
  underlying TensorFlow tensors are immediately disposed of. This architectural
  fallback completely prevents CPU memory leaks under any failure condition.
- **Raw binary transport** — The API accepts `application/octet-stream` instead
  of multipart form data or base64-encoded JSON. This avoids the overhead of
  multipart parsing and base64 expansion, resulting in faster decoding and lower
  network transfer times.

## Build from source

```shell
docker build -t nsfwjs .
docker run -p 3333:3333 nsfwjs
```

## Local development

Requires [Deno](https://deno.com).

```shell
deno task dev     # watch mode (restarts on file changes)
deno task start   # production mode
```

The server listens on port `3333`.
