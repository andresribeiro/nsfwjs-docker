# nsfwjs-docker [![Docker Pulls](https://img.shields.io/docker/pulls/andresribeiroo/nsfwjs.svg)](https://hub.docker.com/r/andresribeiroo/nsfwjs)

nsfwjs-docker is a highly optimized Self-Hosted NSFW Detection API that uses [NSFWJS](https://github.com/infinitered/nsfwjs) under the hood. All you need to run it is Docker, and you can find it on the Docker Hub [here](https://hub.docker.com/r/andresribeiroo/nsfwjs).

## Features

- Return predictions for `Neutral`, `Drawing`, `Sexy`, `Hentai` and `Porn`
- Pretty accurate (~93%)
- Supports JPEG, PNG, WebP, AVIF, TIFF, GIF (single frame) and raw pixel data
- ~100ms per prediction

## Installation

```shell
docker run -p 3333:3333 -d --name nsfwjs andresribeiroo/nsfwjs:2.0
```

If you are deploying in production, you will probably want to pass the `--restart always` flag to start the container whenever the server restarts.

## Usage

`POST` the raw image bytes to `/classify` with `Content-Type: application/octet-stream`.

```
{
  "prediction": [
    {
      "className": "Neutral",
      "probability": 0.6371303796768188
    },
    {
      "className": "Drawing",
      "probability": 0.3603636920452118
    },
    {
      "className": "Hentai",
      "probability": 0.0024505197070538998
    },
    {
      "className": "Sexy",
      "probability": 0.00003775714503717609
    },
    {
      "className": "Porn",
      "probability": 0.000017730137187754735
    }
  ]
}
```

## Examples

### Node.js fetch / Browser fetch

```js
const res = await fetch("http://localhost:3333/classify", {
  method: "POST",
  headers: { "Content-Type": "application/octet-stream" },
  body: imageBlobOrBuffer,
});
const data = await res.json();
console.log(data.prediction);
// [{ className: "Neutral", probability: 0.637 }, ...]
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
