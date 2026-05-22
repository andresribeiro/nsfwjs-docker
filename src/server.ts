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
  const buffer = await image?.arrayBuffer();
  if (!buffer) {
    logger.warn("Empty image buffer");
    return c.json({ error: "invalid image" });
  }
  logger.debug("Classifying image ({size} bytes)", { size: buffer.byteLength });
  const start = performance.now();
  const prediction = await getPrediction(Buffer.from(buffer));
  const elapsed = Math.round(performance.now() - start);
  logger.info("Prediction complete in {elapsed}ms", { elapsed, prediction });
  return c.json({ prediction });
});

Bun.serve({
  port: 3333,
  fetch: server.fetch,
});

logger.info("Server starting on port 3333");
