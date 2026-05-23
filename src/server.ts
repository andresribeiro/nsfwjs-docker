import { Hono } from "hono";
import { getPrediction } from "./get-prediction";
import { logger } from "./logger";

const server = new Hono();

server.post("/classify", async (c) => {
	const body = await c.req.parseBody();
	const image = body.image;
	if (typeof image === "string") {
		logger.warn("Received non-file image field");
		return c.json({ error: "invalid image" });
	}
	const bytes = await image?.bytes();
	if (!bytes) {
		logger.warn("Empty image buffer");
		return c.json({ error: "invalid image" });
	}
	logger.debug("Classifying image ({size} bytes)", { size: bytes.byteLength });
	const start = performance.now();
	const prediction = await getPrediction(bytes);
	const elapsed = Math.round(performance.now() - start);
	logger.info("Prediction complete in {elapsed}ms", { elapsed, prediction });
	return c.json({ prediction });
});

Bun.serve({
	port: 3333,
	fetch: server.fetch,
});

logger.info("Server starting on port 3333");
