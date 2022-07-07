/**
 * @jest-environment jsdom
 */

import { Client, errorMessage, errorCode } from "./client";
import { createServer, Registry, Server } from "miragejs";
import { AnyModels, AnyFactories } from "miragejs/-types";
import { Response } from "miragejs";

let server: Server<Registry<AnyModels, AnyFactories>>;
beforeAll(() => {
  server = createServer({
    environment: "test",
    routes() {
      this.urlPrefix = "https://api.localcivics.io";

      this.get("/:service/v1/hello", () => {
        return new Response(200, {}, "world");
      });

      this.get("/:service/v1/429", () => {
        return new Response(429, {}, "too may requests");
      });

      this.get("/:service/v1/500", () => {
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
    const client = new Client({
      accessToken: "my-access-token",
      gatewayURL: "https://api.localcivics.io",
    });
    expect(client).not.toBeUndefined();
    await client.sphere.get("/hello", {
      query: {
        param1: ["", undefined, null, false, true],
        param2: "",
        param3: 1337,
      },
    });

    await client.study.get("/hello", {
      query: {
        param1: ["", undefined, null, false, true],
        param2: "",
        param3: 1337,
      },
    });

    await client.magnify.get("/hello", {
      query: {
        param1: ["", undefined, null, false, true],
        param2: "",
        param3: 1337,
      },
    });

    await client.relay.get("/hello", {
      query: {
        param1: ["", undefined, null, false, true],
        param2: "",
        param3: 1337,
      },
    });
  });

  it("is not ok (non-fatal)", async () => {
    const client = new Client({
      gatewayURL: "https://api.localcivics.io",
      onReject: (err) => {
        expect(errorMessage(err)).not.toBeUndefined();
        expect(errorCode(err)).toEqual(429);
      },
    });
    expect(client).not.toBeUndefined();
    await client.sphere.get("/429");
    await client.study.get("/429");
    await client.magnify.get("/429");
    await client.relay.get("/429");
  });

  it("is not ok (fatal)", async () => {
    const client = new Client({
      gatewayURL: "https://api.localcivics.io",
    });
    expect(client).not.toBeUndefined();
    await client.sphere.get("/goodbye").catch(() => {});
    await client.sphere.get("/500").catch(() => {});
    await client.study.get("/goodbye").catch(() => {});
    await client.study.get("/500").catch(() => {});
    await client.magnify.get("/goodbye").catch(() => {});
    await client.magnify.get("/500").catch(() => {});
    await client.relay.get("/goodbye").catch(() => {});
    await client.relay.get("/500").catch(() => {});
  });

  it("is not ok (fatal no config)", async () => {
    const client = new Client();
    await client.sphere.get("/goodbye").catch(() => {});
    await client.study.get("/goodbye").catch(() => {});
    await client.magnify.get("/goodbye").catch(() => {});
    await client.relay.get("/goodbye").catch(() => {});

    await client.sphere.post("/goodbye").catch(() => {});
    await client.study.post("/goodbye").catch(() => {});
    await client.magnify.post("/goodbye").catch(() => {});
    await client.relay.post("/goodbye").catch(() => {});

    await client.sphere.put("/goodbye").catch(() => {});
    await client.study.put("/goodbye").catch(() => {});
    await client.magnify.put("/goodbye").catch(() => {});
    await client.relay.put("/goodbye").catch(() => {});

    await client.sphere.patch("/goodbye").catch(() => {});
    await client.study.patch("/goodbye").catch(() => {});
    await client.magnify.patch("/goodbye").catch(() => {});
    await client.relay.patch("/goodbye").catch(() => {});

    await client.sphere.delete("/goodbye").catch(() => {});
    await client.study.delete("/goodbye").catch(() => {});
    await client.magnify.delete("/goodbye").catch(() => {});
    await client.relay.delete("/goodbye").catch(() => {});
  });
});
