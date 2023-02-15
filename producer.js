import { Queue } from "bullmq";
import IORedis from "ioredis";

// Init main redis connection
const connection = new IORedis(+process.env.REDIS_PORT, "cache", {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

const queue = new Queue("LOAD", { connection, sharedConnection: true });

setInterval(async () => {
  console.log("generating 5K jobs");
  let jobs = [];

  for (let index = 0; index < 5000; index++) {
    jobs.push({
      name: `some_name_${index}`,
      data: {
        name: "Cecilia",
        age: index,
        country: "Kiribati",
      },
      opts: {
        jobId: index,
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }
  console.log("distributing 5K jobs");
  await queue.addBulk(jobs);
  jobs = [];
}, 100);
