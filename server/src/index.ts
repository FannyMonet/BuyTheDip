import { default as createApp } from "./server";

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

createApp().then((app) => app.listen({ port }));
