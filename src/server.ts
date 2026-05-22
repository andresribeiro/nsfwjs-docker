import { Hono } from "hono";
import { getPrediction } from "./get-prediction";

const server = new Hono();

server.post("/classify", async (c) => {
  const body = await c.req.parseBody();
  const image = body.image;
  if (typeof image === "string") {
    return c.json({ error: "invalid image" });
  }
  const buffer = await image?.arrayBuffer();
  if (!buffer) {
    return c.json({ error: "invalid image" });
  }
  console.time();
  const prediction = await getPrediction(Buffer.from(buffer));
  console.timeEnd();
  return c.json({ prediction });
});

export default {
  port: 3333,
  fetch: server.fetch,
};
