/**
 * @jest-environment jsdom
 */

import { client } from "./client";
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
    const api = client();
    expect(api).not.toBe(null)
  });
});
