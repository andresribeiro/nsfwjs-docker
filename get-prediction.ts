import * as tf from "@tensorflow/tfjs-node";
import * as nsfwjs from "nsfwjs";
import sharp from "sharp";
import { logger } from "./logger.ts";

tf.enableProdMode();
sharp.cache(false);

logger.info("Loading NSFW model");
const model = await nsfwjs.load("file://model/", { type: "graph" });
logger.info("Model loaded");

export class InvalidImageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "InvalidImageError";
  }
}

export async function getPrediction(imageBuffer: ArrayBuffer) {
  // resolveWithObject is not needed — resize guarantees 224x224 output.
  // Model expects 224x224; sharp resizes faster than TF.js would internally.
  let data: Buffer;
  try {
    data = await sharp(imageBuffer)
      .resize({ width: 224, height: 224, fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer();
  } catch (error) {
    // sharp throws when it cannot decode the bytes: a bad request, not a server fault
    throw new InvalidImageError((error as Error).message, { cause: error });
  }
  const tfImage = tf.tensor3d(new Uint8Array(data), [224, 224, 3], "int32");
  try {
    const prediction = await model.classify(tfImage);
    logger.debug("Prediction: {prediction}", { prediction });
    return prediction;
  } finally {
    // always execute memory disposal, even if model.classify fails
    tfImage.dispose();
  }
}
