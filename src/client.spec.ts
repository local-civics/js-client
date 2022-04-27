/**
 * @jest-environment jsdom
 */

import { errorMessage, errorCode, init } from "./client";
import { createServer, Registry, Server } from "miragejs";
import { AnyModels, AnyFactories } from "miragejs/-types";
import { Response } from "miragejs";

let server: Server<Registry<AnyModels, AnyFactories>>;
beforeAll(() => {
  server = createServer({
    environment: "test",
    routes() {
      this.get("/identity/v1/hello", () => {
        return new Response(200, {}, "world");
      });

      this.get("/identity/v1/429", () => {
        return new Response(429, {}, "too may requests");
      });

      this.get("/identity/v1/500", () => {
        return new Response(500);
      });
    },
  });
});

afterAll(() => {
  server.shutdown();
});

describe("client", () => {
  it("is ok", async () => {
    const client = init("my-access-token");
    expect(client).not.toBeUndefined();
    const ctx = { referrer: "https://www.localcivics.io" };
    await client.do(ctx, "GET", "identity", "/hello", {
      query: {
        param1: ["", undefined, null, false, true],
        param2: "",
        param3: 1337,
      },
    });
  });

  it("is not ok (non-fatal)", async () => {
    const client = init("", {
      onReject: (err) => {
        expect(errorMessage(err)).not.toBeUndefined();
        expect(errorCode(err)).toEqual(429);
      },
    });
    expect(client).not.toBeUndefined();
    const ctx = { referrer: "" };
    await client.do(ctx, "GET", "identity", "/429");
  });

  it("is not ok (fatal)", async () => {
    const client = init();
    expect(client).not.toBeUndefined();
    const ctx = { referrer: "" };
    await client.do(ctx, "GET", "identity", "/goodbye").catch(() => {});

    expect(client).not.toBeUndefined();
    await client.do(ctx, "GET", "identity", "/500").catch(() => {});
  });
});
