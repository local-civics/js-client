/**
 * @jest-environment jsdom
 */

import { useApi } from "./api";
import { createServer, Registry, Server } from "miragejs";
import { AnyModels, AnyFactories } from "miragejs/-types";

let server: Server<Registry<AnyModels, AnyFactories>>;
beforeAll(() => {
  server = createServer({
    environment: "test",
    routes() {
      this.urlPrefix = "https://api.localcivics.io";
      this.get("/hello", () => {
        return [{}];
      });
    },
  });
});

afterAll(() => {
  server.shutdown();
});

describe("api", () => {
  it("is ok", async () => {
    const { api } = useApi();
    expect(api).not.toBeUndefined();
    await api("GET", "/hello");
  });

  it("is ok with token", async () => {
    const { api, setToken } = useApi();
    expect(api).not.toBeUndefined();
    const storage = window.localStorage;
    await setToken("token", 1);
    expect(storage.getItem("token")).not.toBeUndefined();
  });

  it("is ok with dev environment", async () => {
    process.env["APP_ENV"] = "dev";
    const { api, setToken } = useApi();
    expect(api).not.toBeUndefined();
    const storage = window.localStorage;
    await setToken("token", 1);
    expect(storage.getItem("token")).not.toBeUndefined();
  });

  it("is ok with prod environment", async () => {
    process.env["APP_ENV"] = "prod";
    const { api, setToken } = useApi();
    expect(api).not.toBeUndefined();
    const storage = window.localStorage;
    await setToken("token", 1);
    expect(storage.getItem("token")).not.toBeUndefined();
  });

  it("is expired", async () => {
    const storage = window.localStorage;
    process.env["APP_ENV"] = "prod";
    await (async () => {
      const { api, setToken } = useApi();
      expect(api).not.toBeUndefined();
      const now = new Date();
      now.setDate(0);
      expect(storage.getItem("token")).not.toBeUndefined();
      await setToken("token", 0);
    })();
    const {} = useApi();
  });

  it("is not ok", async () => {
    const { api } = useApi();
    await api("GET", "/goodbye").catch(() => {});
  });
});
