import * as tf from "@tensorflow/tfjs-node";
import * as nsfwjs from "nsfwjs";

tf.enableProdMode();

const model = await nsfwjs.load("file://src/model/", { type: "graph" });

export async function getPrediction(imageBuffer: Buffer) {
	const tfImage = tf.node.decodeImage(imageBuffer, 3);

	const prediction = await model.classify(tfImage);

	tfImage.dispose();

	return prediction;
}
