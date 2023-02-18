import { default as start } from "./server";

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

start(port);
