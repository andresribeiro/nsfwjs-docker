import fastify from "fastify";
import multipart from "@fastify/multipart";

import { routes } from "./routes.js";

const fastifyServer = fastify({
	bodyLimit: 1048576 * 100,
});

fastifyServer.register(multipart, {
	addToBody: true,
	sharedSchemaId: "#mySharedSchema",
});

fastifyServer.register(routes);

await fastifyServer.listen({ port: 3333, host: "0.0.0.0" });

console.log("Server started 🚀");

function handleOnSignal(signal: NodeJS.Signals) {
	console.log(`closing due to ${signal} signal`);

	fastifyServer.close().then(() => {
		process.exit();
	});
}

process.on("SIGINT", () => {
	handleOnSignal("SIGINT");
});

process.on("SIGHUP", () => {
	handleOnSignal("SIGHUP");
});
