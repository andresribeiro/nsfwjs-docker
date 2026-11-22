import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getPrediction, InvalidImageError } from "./get-prediction.ts";
import { logger } from "./logger.ts";

const app = new Hono();

app.post("/classify", async (c) => {
  const buffer = await c.req.arrayBuffer();
  if (buffer.byteLength === 0) {
    logger.warn("Empty request body");
    return c.json({ error: "invalid image" }, 400);
  }
  logger.debug("Classifying image ({size} bytes)", { size: buffer.byteLength });
  const start = performance.now();
  let prediction: Awaited<ReturnType<typeof getPrediction>>;
  try {
    prediction = await getPrediction(buffer);
  } catch (error) {
    if (!(error instanceof InvalidImageError)) throw error;
    logger.warn("Invalid image: {message}", { message: error.message });
    return c.json({ error: "invalid image" }, 400);
  }
  const elapsed = Math.round(performance.now() - start);
  logger.info("Prediction complete in {elapsed}ms", { elapsed, prediction });
  return c.json({ prediction });
});

serve(
  {
    fetch: app.fetch,
    port: 3333,
  },
  (info) => {
    logger.info("Server listening on port {port}", { port: info.port });
  },
);
