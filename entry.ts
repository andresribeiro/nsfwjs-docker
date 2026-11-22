import { createRequire } from "node:module";

// Node 22+ removed util.isNullOrUndefined, but @tensorflow/tfjs-node 4.22 still
// calls it from its kernels. Polyfill it before anything imports TensorFlow.
const require = createRequire(import.meta.url);
const util = require("node:util");
util.isNullOrUndefined ??= (v: unknown) => v === null || v === undefined;

await import("./server.ts");
