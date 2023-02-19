import { default as createApp } from "./server";

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret !== undefined) {
  createApp(jwtSecret).then((app) => app.listen({ port }));
}
