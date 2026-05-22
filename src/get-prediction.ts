import * as tf from "@tensorflow/tfjs-node";
import * as nsfwjs from "nsfwjs";
import sharp from "sharp";

tf.enableProdMode();
const model = await nsfwjs.load("file://src/model/", { type: "graph" });

export async function getPrediction(imageBuffer: Buffer) {
  const { data, info } = await sharp(imageBuffer)
    .resize({
      // The default NSFWJS model (MobileNet) expects 224x224 images
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
  return prediction;
}
