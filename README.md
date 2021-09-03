# nsfwjs-docker

A Docker REST API for NSFW detection with [NSFWJS](https://github.com/infinitered/nsfwjs). 
Fork to https://github.com/andresribeiro/nsfwjs-docker

## start

```shell
yarn start
```
## build

```shell
docker build . -t nsfwjs
```

## Usage

#### Multiple images

`POST` request to `/batch-classify` sending images url in the `contents` field

```
curl -X POST -H 'Content-Type: application/json'  -d '{"images": [{"url":"https://image/url"}]}' http://0.0.0.0:8080/batch-classify

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

