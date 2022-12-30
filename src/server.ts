import fastify from "fastify";
import multipart from "fastify-multipart";

import { routes } from "./routes";

async function main() {
	const app = fastify({
		logger: true,
		bodyLimit: 1048576 * 100,
	});

	app.register(multipart, {
		addToBody: true,
		sharedSchemaId: "#mySharedSchema",
	});

	app.register(routes);

	await app.listen(3333, "0.0.0.0");

	console.log("Server started 🚀");
}

main();
