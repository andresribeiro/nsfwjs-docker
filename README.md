# nsfwjs-docker

[![Docker Pulls](https://img.shields.io/docker/pulls/andresribeiroo/nsfwjs.svg)](https://hub.docker.com/r/andresribeiroo/nsfwjs)
[![License](https://img.shields.io/github/license/andresribeiro/nsfwjs-docker)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/andresribeiro/nsfwjs-docker)](https://github.com/anomalyco/nsfwjs-docker)

High-performance, self-hosted NSFW detection API powered by [NSFWJS](https://github.com/infinitered/nsfwjs).

- **Accuracy:** ~93%
- **Latency:** ~100ms per prediction
- **Input:** JPEG, PNG, WebP, AVIF, TIFF, GIF (first frame), raw pixel data
- **Output:** 5-class classification — Neutral, Drawing, Sexy, Hentai, Porn

---

## Installation

```shell
docker run -p 3333:3333 -d --name nsfwjs andresribeiroo/nsfwjs:2.0
```

For production, add `--restart always`:

```shell
docker run -p 3333:3333 -d --restart always --name nsfwjs andresribeiroo/nsfwjs:2.0
```

## API

### `POST /classify`

### Example Response:

```json
{
  "prediction": [
    { "className": "Neutral",  "probability": 0.637 },
    { "className": "Drawing",  "probability": 0.360 },
    { "className": "Hentai",   "probability": 0.002 },
    { "className": "Sexy",     "probability": 0.000 },
    { "className": "Porn",     "probability": 0.000 }
  ]
}
```

| Property     | Value                                                         |
|-------------|---------------------------------------------------------------|
| Content-Type | `application/octet-stream`                                   |
| Body        | Raw image bytes (no multipart, no encoding)                   |
| Response    | `{ "prediction": [{ className: string, probability: number }] }` |

Probabilities sum to 1.0 and are sorted in descending order.

---

## Examples

### Node.js fetch / Browser fetch

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

---

### Build from source

```shell
docker build -t nsfwjs .
docker run -p 3333:3333 nsfwjs
```

### Local development

Requires [Bun](https://bun.sh).

```shell
bun install
bun run dev     # watch mode (restarts on file changes)
bun run start   # production mode
```

The server listens on **port 3333**.

---

## License

MIT
