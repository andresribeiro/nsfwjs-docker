const express = require("express");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const nsfw = require("nsfwjs");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

async function main() {
  const model = await nsfw.load("file://model/", { type: "graph" });
  tf.enableProdMode();

  app.post(
    "/single/multipart-form",
    upload.single("content"),
    async (request, response) => {
      const content = request.file;

      return content
        ? response.json({ prediction: await getPrediction(model, content) })
        : response.status(422).json({ error: 'No image provided' });
    }
  );

  app.post(
    "/multiple/multipart-form",
    upload.array("contents"),
    async (request, response) => {
      const contents = request.files;

      if (!content || !content.length) {
        return response.status(422).json({ error: 'No images provided' });
      }

      const predictions = await Promise.all(
        contents.map(content => getPrediction(model, content))
      );

      return response.json({ predictions });
    }
  );

  app.listen(3333);
}

async function getPrediction(model, content) {
  const tfContent = await tf.node.decodeImage(content.buffer, 3);
  const prediction = await model.classify(tfContent);
  tfContent.dispose();

  return prediction;
}

main();
