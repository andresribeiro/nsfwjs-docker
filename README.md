# nsfwjs-docker

### Features ✨

- ℹ️ Return predictions for `Neutral`, `Drawing`, `Sexy`, `Hentai` and `Porn`
- 🎯 Pretty accurate (~93%)
- 🖼️ Supports different image formats
- ⚡ 250ms to make predictions to a single image

### About 🗞️

A Docker REST API for NSFW detection with [NSFWJS](https://github.com/infinitered/nsfwjs). You can find it on the Docker Hub [here](https://hub.docker.com/r/andresribeiroo/nsfwjs). Created for my social network app, [Rybun](https://rybun.com)

### Installation ⚙️

```shell
docker run -p 3333:3333 -d --name nsfwjs andresribeiroo/nsfwjs:1.6
```

If you are deploying in production, you will probably want to pass the `--restart always` flag to start the container whenever the server restarts

### Usage 🔨

#### One image, multipart/form-data

`POST` request to `/single/multipart-form` sending an image in the `content` field

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

#### Multiple images, multipart/form-data

`POST` request to `/multiple/multipart-form` sending images in the `contents` field

```
{
  "predictions": [
    [
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
    ],
    [
      {
        "className": "Neutral",
        "probability": 0.9498893618583679
      },
      {
        "className": "Drawing",
        "probability": 0.04626458138227463
      },
      {
        "className": "Hentai",
        "probability": 0.00267870188690722
      },
      {
        "className": "Sexy",
        "probability": 0.0008198379655368626
      },
      {
        "className": "Porn",
        "probability": 0.0003475486591923982
      }
    ]
  ]
}
```
