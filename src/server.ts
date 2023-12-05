import app from "./app";
import debug from "debug";
import http from "http";

const DEBUG = debug("dev");
const PORT: number | string = process.env.NODE_ENV === "test" ? 3200 : process.env.PORT || 3200;
const host: string = process.env.HOST || "http://localhost";

process.on("uncaughtException", (error) => {
  DEBUG(`uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  DEBUG(`unhandled rejection at ${promise} reason: ${reason}`);
  process.exit(1);
});

const server = http.createServer(app);

server.listen(PORT, () => {
  DEBUG(
    `server running on  ${host}:${PORT} in ${process.env.NODE_ENV} mode.\npress CTRL-C to stop`
  );
});

