# nsfwjs-docker [![Docker Pulls](https://img.shields.io/docker/pulls/andresribeiroo/nsfwjs.svg)](https://hub.docker.com/r/andresribeiroo/nsfwjs)

Docker-Powered Self-Hosted NSFW Detection API ([NSFWJS](https://github.com/infinitered/nsfwjs) under the hood). You can find it on the Docker Hub [here](https://hub.docker.com/r/andresribeiroo/nsfwjs).

## Features ✨

- ℹ️ Return predictions for `Neutral`, `Drawing`, `Sexy`, `Hentai` and `Porn`
- 🎯 Pretty accurate (~93%)
- 🖼️ Supports different image formats
- ⚡ 100ms to make predictions to a single image

## Installation ⚙️

```shell
docker run -p 3333:3333 -d --name nsfwjs andresribeiroo/nsfwjs:2.0
```

If you are deploying in production, you will probably want to pass the `--restart always` flag to start the container whenever the server restarts.

## Usage 🔨

`POST` request to `/classify` sending an image in the `image` field.

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
