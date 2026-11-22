import { timingSafeEqual } from "node:crypto";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getPrediction, InvalidImageError } from "./get-prediction.ts";
import { logger } from "./logger.ts";

const apiKey = process.env.API_KEY;

function isValidApiKey(candidate: string): boolean {
  // API_KEY is optional: when unset, every request is allowed.
  if (!apiKey) return true;
  const expected = Buffer.from(apiKey);
  const actual = Buffer.from(candidate);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

const app = new Hono();

app.get("/status", (c) => c.json({ ok: true }));

app.post("/classify", async (c) => {
  if (apiKey) {
    const authorization = c.req.header("authorization");
    const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    const candidate = c.req.header("x-api-key") ?? bearer;
    if (!candidate || !isValidApiKey(candidate)) {
      logger.warn("Unauthorized request");
      return c.json({ error: "unauthorized" }, 401);
    }
  }
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
