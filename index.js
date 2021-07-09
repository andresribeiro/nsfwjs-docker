const express = require("express");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const nsfw = require("nsfwjs");
const fetch = require('node-fetch');

const app = express();

app.use(express.json());

async function main() {
  const model = await nsfw.load("file://model/", { type: "graph" });
  tf.enableProdMode();

  app.post(
    "/batch-classify",
    async (request, response) => {
      const contents = request.body;
      if (contents.images === undefined) {
        return {code:400};
      }

      const predictions = await Promise.all(
        contents.images.map(async (content) => {
          if (content.url === undefined) {
            return {code:400};
          }
          try {
            const response = await fetch(content.url)
            const buffer = await response.buffer();
            const tfContent = await tf.node.decodeImage(buffer, 3);
            const prediction = await model.classify(tfContent);
            tfContent.dispose();
            return {code:200, prediction: prediction};
          } catch (error) {
            return {code:400, msg: error.message};
          }
        })
      );

      return response.json({ predictions : predictions, code: 200 });
    }
  );

  app.listen(8080);
}

main();
