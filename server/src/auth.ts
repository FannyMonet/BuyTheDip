import { preHandlerHookHandler } from "fastify";
import { sign, verify } from "jsonwebtoken";

export const userIdKey = Symbol("id");

export const authHandler: preHandlerHookHandler = (req, res, done) => {
  const token = req.headers.hasOwnProperty("authorization")
    ? req.headers["authorization"]!.slice("Bearer ".length)
    : undefined;
  const verified = token
    ? verify(token as string, process.env.JWT_SECRET as string)
    : undefined;

  if (!verified) {
    return res.status(401).send();
  }
  const id =
    typeof verified === "object" && verified.hasOwnProperty("id")
      ? verified.id
      : undefined;
  (req as any)[userIdKey] = id;
  done();
};

export const generateToken = (jwtSecret: string) => (payload: any) =>
  sign(payload, jwtSecret);
