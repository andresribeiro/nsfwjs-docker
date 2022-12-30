import * as tf from "@tensorflow/tfjs-node";
import * as nsfwjs from "nsfwjs";

tf.enableProdMode();

export async function getPrediction(imageBuffer: Buffer) {
	const model = await nsfwjs.load("file://src/model/", { type: "graph" });

	const tfImage = tf.node.decodeImage(imageBuffer, 3);

	const prediction = await model.classify(tfImage);

	tfImage.dispose();

	return prediction;
}
