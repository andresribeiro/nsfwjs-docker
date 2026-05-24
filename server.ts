import { Hono } from "@hono/hono";
import { getPrediction } from "./get-prediction.ts";
import { logger } from "./logger.ts";

const app = new Hono();

app.post("/classify", async (c) => {
  const buffer = await c.req.arrayBuffer();
  if (!buffer) {
    logger.warn("Empty request body");
    return c.json({ error: "invalid image" });
  }
  logger.debug("Classifying image ({size} bytes)", { size: buffer.byteLength });
  const start = performance.now();
  const prediction = await getPrediction(buffer);
  const elapsed = Math.round(performance.now() - start);
  logger.info("Prediction complete in {elapsed}ms", { elapsed, prediction });
  return c.json({ prediction });
});

Deno.serve(
  {
    port: 3333,
  },
  app.fetch,
);

logger.info("Server starting on port 3333");
