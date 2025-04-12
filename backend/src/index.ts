import { serve } from "@hono/node-server";
import app from "./app.js";
import { env } from './env.js'

const port = Number(env.BE_PORT);

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`Server is running on port ${port}`);
  },
);

process.on("SIGINT", () => {
  // process reload ongoing
  // close connections, clear cache, etc
  // by default, you have 1600ms
  process.exit(0);
})