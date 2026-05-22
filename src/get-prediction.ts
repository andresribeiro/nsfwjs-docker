import * as tf from "@tensorflow/tfjs-node";
import * as nsfwjs from "nsfwjs";
import sharp from "sharp";
import { logger } from "./logger";

tf.enableProdMode();
logger.info("Loading NSFW model");
const model = await nsfwjs.load("file://src/model/", { type: "graph" });
logger.info("Model loaded");

export async function getPrediction(imageBuffer: Buffer) {
  const { data, info } = await sharp(imageBuffer)
    .resize({
      width: 224,
      height: 224,
      fit: "cover",
      withoutEnlargement: true,
    })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const tfImage = tf.tensor3d(
    new Uint8Array(data),
    [info.height, info.width, 3],
    "int32",
  );
  const prediction = await model.classify(tfImage);
  tfImage.dispose();
  logger.debug("Prediction: {prediction}", { prediction });
  return prediction;
}
