const express = require('express')
const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')
const fetch = require('node-fetch')
const fileType = require('file-type');
const app = express()

app.use(express.json())

async function main() {
  const model = await nsfw.load('file://model/', { size: 299 })
  tf.enableProdMode()

  app.post('/batch-classify', async (request, response) => {
    let contents = request.body
    if (contents.images === undefined) {
      return { code: 400 }
    }

    const predictions = await Promise.all(
      contents.images.map(async (content) => {
        if (content.url === undefined) {
          return { code: 400 }
        }
        try {
          let response = await fetch(content.url)
          let buffer = await response.buffer()
          let fType = await fileType.fromBuffer(buffer)
          let prediction
          if (fType.mime == "image/gif") {
            prediction = await model.classifyGif(buffer, { topk: 5, fps: 1 })
          } else {
            let image = await tf.node.decodeImage(buffer, 3)
            prediction = await model.classify(image)
            image.dispose()
            image = null
          }

          buffer = null
          response = null
          return { code: 200, prediction: prediction }
        } catch (error) {
          return { code: 400, msg: error.message }
        }
      })
    )

    return response.json({ predictions: predictions, code: 200 })
  })

  app.listen(8080)
}

main()
