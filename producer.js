import { Queue } from "bullmq";
import IORedis from "ioredis";

// Init main redis connection
const connection = new IORedis(6379, "keydb", {
  enableReadyCheck: true,
  maxRetriesPerRequest: null,
});

await connection.set("key", "value2");
const value2 = await connection.get("key");
console.log(value2);

connection.on("ready", () => {
  console.log("ready");
});

connection.on("error", (e) => {
  console.log(e);
});

const queue = new Queue("LOAD", { connection, sharedConnection: true });

queue.on("error", (e) => {
  console.log(e);
});

setInterval(async () => {
  console.log("generating 5K jobs");
  let jobs = [];

  const test = await connection.get("test");
  console.log(test);

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

  await connection.set("test", "test");
}, 100);

// import { createClient } from "redis";

// const client = createClient({ url: "redis://dragonfly:6379" });

// client.on("error", (err) => console.log("Redis Client Error", err));

// await client.connect();

// await client.set("key", "value");
// const value = await client.get("key");
// console.log(value);
// await client.disconnect();
