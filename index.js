const express = require('express')
const multer = require('multer')
const jpeg = require('jpeg-js')

const tf = require('@tensorflow/tfjs-node')
const nsfw = require("nsfwjs");

const app = express()
const upload = multer()

let _model

const convert = async (img) => {
    // Decoded image in UInt8 Byte array
    const image = await jpeg.decode(img, true)

    const numChannels = 3
    const numPixels = image.width * image.height
    const values = new Int32Array(numPixels * numChannels)

    for (let i = 0; i < numPixels; i++)
        for (let c = 0; c < numChannels; ++c)
            values[i * numChannels + c] = image.data[i * 4 + c]

    return tf.tensor3d(values, [image.height, image.width, numChannels], 'int32')
}

app.post('/single/multipart-form', upload.single("content"), async (req, res) => {
    if (!req.file) {
        res.status(400).send("file is missing")
    } else {
        const image = await convert(req.file.buffer)
        const prediction = await _model.classify(image)
        image.dispose()
        res.json({ prediction })
    }
})

app.post("/multiple/multipart-form", upload.array("contents"), async (request, response) => {
        const contents = request.files;
        const predictions = await Promise.all(
            contents.map(async (content) => {
                const tfContent = await convert(req.file.buffer)
                const prediction = await  _model.classify(tfContent)
                tfContent.dispose()
                return prediction
            })
        )
        return response.json({ predictions })
    }
)

const load_model = async () => {
    _model = await nsfw.load()
}

// Keep the model in memory, make sure it's loaded only once
load_model().then(() => app.listen(3333))
