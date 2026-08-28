import { describe, expect, it } from "vitest";
import { getRedisUrl } from "./redis";

describe("getRedisUrl", () => {
  it("preferisce il nome canonico", () => {
    expect(
      getRedisUrl({ REDIS_URL: "rediss://canonical", redis_REDIS_URL: "rediss://integration" }),
    ).toBe("rediss://canonical");
  });

  it("supporta il prefisso creato dall'integrazione Vercel", () => {
    expect(getRedisUrl({ redis_REDIS_URL: "rediss://integration" })).toBe(
      "rediss://integration",
    );
  });
});

