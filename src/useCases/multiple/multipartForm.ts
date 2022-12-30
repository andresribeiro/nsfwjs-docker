import { FastifyRequest, FastifyReply } from "fastify";
import { getPrediction } from "../../getPrediction.js";
import { FromSchema } from "json-schema-to-ts";

export const multipleMultipartFormBodySchema = {
	type: "object",
	properties: {
		contents: {
			type: "array",
			items: {
				$ref: "#mySharedSchema",
			},
		},
	},
	required: ["contents"],
} as const;

type BodyEntry = {
	data: Buffer;
	filename: string;
	encoding: string;
	mimetype: string;
	limit: false;
};

export async function MultipleMultipartForm(
	request: FastifyRequest<{
		Body: FromSchema<typeof multipleMultipartFormBodySchema>;
	}>,
	reply: FastifyReply,
) {
	const images = request.body.contents as BodyEntry[];

	const predictions = await Promise.all(
		images.map(async (image) => getPrediction(image.data)),
	);

	return reply.send({ predictions });
}
