import {
  ansiColorFormatter,
  configure,
  getConsoleSink,
  getLogger,
} from "@logtape/logtape";

await configure({
  sinks: { console: getConsoleSink({ formatter: ansiColorFormatter }) },
  loggers: [
    { category: "default", lowestLevel: "debug", sinks: ["console"] },
    {
      category: ["logtape", "meta"],
      lowestLevel: "warning",
      sinks: ["console"],
    },
  ],
});

export const logger = getLogger(["default"]);
