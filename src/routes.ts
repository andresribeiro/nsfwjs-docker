import {
	FastifyInstance,
	FastifyPluginOptions,
	FastifyRegisterOptions,
} from "fastify";

import {
	SingleMultipartForm,
	singleMultipartFormBodySchema,
} from "@useCases/single/multipartForm";
import {
	MultipleMultipartForm,
	multipleMultipartFormBodySchema,
} from "@useCases/multiple/multipartForm";

export function routes(
	fastify: FastifyInstance,
	opts: FastifyRegisterOptions<FastifyPluginOptions> | undefined,
	done: (err?: Error | undefined) => void,
) {
	fastify.post(
		"/single/multipart-form",
		{ schema: { body: singleMultipartFormBodySchema } },
		SingleMultipartForm,
	);

	fastify.post(
		"/multiple/multipart-form",
		{ schema: { body: multipleMultipartFormBodySchema } },
		MultipleMultipartForm,
	);

	done();
}
