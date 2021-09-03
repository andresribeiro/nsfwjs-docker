const express = require('express')
const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')
const fetch = require('node-fetch')
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
          let tfContent = await tf.node.decodeImage(buffer, 3)
          let prediction = await model.classify(tfContent)
          tfContent.dispose()
          buffer = null
          response = null
          tfContent = null
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
