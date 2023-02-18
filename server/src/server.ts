import fastifyInstance from "fastify";
const fastify = fastifyInstance({ logger: true });

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
          username: { type: "string", maxLength: 20 },
          password: { type: "string", maxLength: 50 },
        },
        required: ["username", "password"],
      },
      response: {
        200: { token: { type: "string" } },
      },
    },
  },
  (req, res) => {
    const { username, password } = req.body;
    res
      .status(200)
      .send({ token: "coucou moi meme " + username + " " + password });
  }
);

const start = (port = 8080) => fastify.listen({ port });

export default start;
