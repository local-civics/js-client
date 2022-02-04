/**
 * @jest-environment jsdom
 */

import { request } from "./request";
import { createServer, Registry, Server } from "miragejs";
import { AnyModels, AnyFactories } from "miragejs/-types";

let server: Server<Registry<AnyModels, AnyFactories>>;
beforeAll(() => {
  server = createServer({
    environment: "test",
    routes() {
      this.get("https://api.localcivics.io/hello", () => {
        return "world";
      });
      this.get("https://dev.api.localcivics.io/hello", () => {
        return "dev.world";
      });
    },
  });
});

afterAll(() => {
  server.shutdown();
});

describe("an api request", () => {
  it("can be made without a token", async () => {
    const resp = await request("", "GET", "/hello");
    expect(resp).toBe("world")
  });

  it("can be made with a token", async () => {
    const resp = await request("token", "GET", "/hello");
    expect(resp).toBe("world")
  });

  it("can use arbitrary environments", async () => {
    process.env["APP_ENV"] = "dev";
    const resp = await request("", "GET", "/hello");
    expect(resp).toBe("dev.world")
  });

  it("can use prod environment", async () => {
    process.env["APP_ENV"] = "prod";
    const resp = await request("", "GET", "/hello");
    expect(resp).toBe("world")
  });

  it("raises exceptions", async () => {
    await request("", "GET", "/goodbye").catch(() => {});
  });
});
