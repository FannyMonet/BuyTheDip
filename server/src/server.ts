import fastifyInstance from "fastify";
import { default as cors } from "@fastify/cors";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import pretty from "pino-pretty";
import pino from "pino";
import { PrismaClient } from "@prisma/client";

const createApp = async () => {
  const prisma = new PrismaClient();

  const stream = pretty({
    colorize: true,
  });
  const logger = pino({ level: "info" }, stream);

  const fastify = fastifyInstance({
    logger,
  });

  fastify.register(cors, {
    origin: "*",
    methods: ["POST", "GET"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  });

  fastify.get("/hello", (req, res) => {
    res.status(200).send("hello");
  });

  fastify.post<{ Body: { username: string; password: string } }>(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            username: { type: "string", minLength: 3, maxLength: 50 },
            password: { type: "string", minLength: 8, maxLength: 50 },
          },
          required: ["username", "password"],
        },
      },
    },
    async (req, res) => {
      const { username, password } = req.body;

      const user = await prisma.users.findUnique({ where: { username } });

      if (user !== null) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
          const token = sign({ id: user.id }, process.env.JWT_SECRET as string);
          return res.status(200).send({ body: { token } });
        }
        return res.status(400).send();
      } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return prisma.users
          .create({
            select: { id: true },
            data: { username, password: hash },
          })
          .then(
            ({ id }) => {
              const token = sign({ id }, process.env.JWT_SECRET as string);
              return res.status(201).send({ body: { token } });
            },
            () => res.status(502).send()
          );
      }
    }
  );
  return fastify;
};

export default createApp;
