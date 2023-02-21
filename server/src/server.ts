import fastifyInstance from "fastify";
import { default as cors } from "@fastify/cors";
import * as bcrypt from "bcryptjs";
import pretty from "pino-pretty";
import pino from "pino";
import { PrismaClient } from "@prisma/client";
import { authHandler, generateToken, userIdKey } from "./auth";

const createApp = async (jwtSecret: string) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://postgres:postgres@${process.env.DB_HOST}:5432/smartrenting`,
      },
    },
  });

  const stream = pretty({
    colorize: true,
  });
  const logger = pino({ level: "info" }, stream);

  const fastify = fastifyInstance({
    logger,
  });

  fastify.register(cors, {
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
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
          const token = generateToken(jwtSecret)({ id: user.id });
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
              const token = generateToken(jwtSecret)({ id });
              return res.status(201).send({ body: { token } });
            },
            () => res.status(502).send()
          );
      }
    }
  );

  fastify.get(
    "/orders",
    {
      preHandler: authHandler,
    },
    (req, res) => {
      return prisma.orders
        .findMany({ include: { Users: { select: { username: true } } } })
        .then(
          (result) => {
            const orders = result.map(
              ({ id, price, expirationDate, Users: { username } }) => ({
                id,
                price,
                expirationDate,
                username,
              })
            );
            return res.status(200).send({ body: { orders } });
          },
          () => res.status(502).send()
        );
    }
  );

  fastify.put<{ Body: { price: number } }>(
    "/orders",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            price: { type: "number" },
          },
          required: ["price"],
        },
      },
      preHandler: authHandler,
    },
    (req, res) => {
      const { price } = req.body;
      const usersId: string = (req as any)[userIdKey];
      const expirationDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      return prisma.orders
        .create({
          data: { price, expirationDate, usersId },
        })
        .then(
          () => res.status(201).send(),
          () => res.status(502).send()
        );
    }
  );

  fastify.post<{ Body: { price: number }; Params: { id: string } }>(
    "/orders/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            price: { type: "number" },
          },
          required: ["price"],
        },
      },
      preHandler: authHandler,
    },
    async (req, res) => {
      const { price } = req.body;
      const { id } = req.params;
      const usersId: string = (req as any)[userIdKey];
      const order = await prisma.orders.findUnique({ where: { id } });
      if (order === null) {
        res.status(404).send();
      } else if (order.usersId !== usersId) {
        res.status(403);
      } else {
        return prisma.orders
          .update({
            where: { id },
            data: { price },
          })
          .then(
            () => res.status(201).send(),
            () => res.status(502).send()
          );
      }
    }
  );
  fastify.delete<{ Params: { id: string } }>(
    "/orders/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
      preHandler: authHandler,
    },
    async (req, res) => {
      const { id } = req.params;
      const usersId: string = (req as any)[userIdKey];
      const order = await prisma.orders.findUnique({ where: { id } });
      if (order === null) {
        res.status(404).send();
      } else if (order.usersId !== usersId) {
        res.status(403);
      } else {
        return prisma.orders
          .delete({
            where: { id },
          })
          .then(
            () => res.status(201).send(),
            () => res.status(502).send()
          );
      }
    }
  );
  return fastify;
};

export default createApp;
