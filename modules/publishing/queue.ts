import { Queue } from "bullmq";
import { getRedisConnection } from "@/modules/shared/redis";

let publishingQueue: Queue | undefined;

export function getPublishingQueue() {
  publishingQueue ??= new Queue("socialhub-publishing", {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "exponential", delay: 5_000 },
      removeOnComplete: 1_000,
      removeOnFail: 5_000,
    },
  });
  return publishingQueue;
}

