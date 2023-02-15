import { Worker } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis(+process.env.REDIS_PORT, "cache", {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
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
