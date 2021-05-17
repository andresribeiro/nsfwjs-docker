# nsfwjs-docker

A Docker REST API for NSFW detection with [NSFWJS](https://github.com/infinitered/nsfwjs). You can find it on the Docker Hub [here](https://hub.docker.com/r/andresribeiroo/nsfwjs)

## Installation

```shell
docker run -p 3333:3333 -d --name nsfwjs andresribeiroo/nsfwjs
```

## Usage

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

###

## PS

Maybe I don't know what I'm doing. If anything starts to catch fire, move away

## Author

André Ribeiro, made for my app [Drakkle](https://drakkle.com.br)
