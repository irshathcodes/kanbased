import { apiReference } from "@scalar/hono-api-reference";
import authRouter from "./api/auth/auth.index.js";
import createApp from "./lib/create-app.js";
import packageJSON from "../package.json" with { type: "json" };
import storageRouter from "./api/storage/storage.index.js";

const app = createApp();

app.get("/", (c) => {
  return c.html(`
    <html>
      <style>
        * {
        font-family: system-ui, sans-serif;
        body {
          width: fit-content;
          margin: 2rem auto;
        }
      @media (prefers-color-scheme: dark) {
      body {
        background-color: #121212;
        color: #ffffff;
      }
      a {
      color: lightblue;
      }
      h2 {
      margin-top: 4rem;
      }
      }
      }
      </style>
      <head>
        <title>Kanbased API</title>
      </head>
      <body>
        <h1>Api for <a href="https://kanbased.com" target"_blank" rel="noopener noreferrer">Kanbased App</a></h1>
        <h2>Documentation</h2>
        <ul>
          <li><a href="/reference">Scalar Documentation</a></li>
          <li><a href="/doc">OpenAPI Documentation</a></li>
        </ul>
      </body>
    </html>
    `);
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: packageJSON.version,
    title: packageJSON.name,
  },
});

app.get(
  "/reference",
  apiReference({
    theme: "kepler",
    layout: "classic",
    defaultHttpClient: {
      targetKey: "node",
      clientKey: "fetch",
    },
    spec: {
      url: "/doc",
    },
  }),
);

const routes = [storageRouter];

routes.forEach((route) => {
  app.route("/api/v1", route);
});

app.route("/api", authRouter);

export default app;
