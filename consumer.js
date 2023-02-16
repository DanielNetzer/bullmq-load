import { Worker } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis(6379, "keydb", {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("connected");
});

new Worker(
  "LOAD",
  (job) => {
    console.log(job);
  },
  {
    connection,
  }
);
