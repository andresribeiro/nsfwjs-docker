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

      const tfContent = await tf.node.decodeImage(content.buffer, 3);
      const prediction = await model.classify(tfContent);
      tfContent.dispose();

      return response.json({ prediction });
    }
  );

  app.post(
    "/multiple/multipart-form",
    upload.array("contents"),
    async (request, response) => {
      const contents = request.files;

      const predictions = await Promise.all(
        contents.map(async (content) => {
          const tfContent = await tf.node.decodeImage(content.buffer, 3);
          const prediction = await model.classify(tfContent);
          tfContent.dispose();
          return prediction;
        })
      );

      return response.json({ predictions });
    }
  );

  app.listen(3333);
}

main();
