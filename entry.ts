import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const util = require("node:util");
util.isNullOrUndefined ??= (v: unknown) => v === null || v === undefined;

await import("./server.ts");
