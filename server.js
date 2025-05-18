// import { createServer } from "node:http";

// const server = createServer((request, response) => {
//   response.write("Hello World");

//   return response.end();
// });

// server.listen(3333);

import { fastify } from "fastify";
// import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postegres.js";

const server = fastify();

// const database = new DatabaseMemory();
const database = new DatabasePostgres();

server.post("/videos", async (request, reply) => {
  const { title, description, duration } = request.body;

  await database.create({
    title,
    description,
    duration,
  });

  return reply.status(201).send({
    message: "Video created",
  });
});

server.get("/videos", async (request) => {
  const search = request.query.search;

  const videos = await database.list(search);
  return videos;
});

server.put("/videos/:id", async (request, reply) => {
  const videoId = request.params.id;
  const { title, description, duration } = request.body;
  await database.update(videoId, {
    title,
    description,
    duration,
  });
  return reply.status(201).send({
    message: "Video updated",
  });
});

server.delete("/videos/:id", async (request, reply) => {
  const videoId = request.params.id;
  await database.delete(videoId);
  return reply.status(201).send({
    message: "Video deleted",
  });
});

server
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ?? 3333,
  })
  .then((address) => {
    console.log(`Server running at ${address}`);
  });
