/**
 * @jest-environment jsdom
 */

import { createServer, Registry, Server } from "miragejs";
import { AnyModels, AnyFactories } from "miragejs/-types";
import { calendar } from "./calendar";
import { footprint } from "./footprint";

let server: Server<Registry<AnyModels, AnyFactories>>;
beforeAll(() => {
  server = createServer({
    environment: "test",
    routes() {
      this.namespace = "/calendar/v0";
      this.get("/:calendarId/events", () => {
        return [{}];
      });
      this.post("/:calendarId", () => {
        return null;
      });
      this.delete("/:calendarId/events/:eventId", () => {
        return null;
      });
      this.get("/:calendarId/reflections", () => {
        return [{}];
      });
      this.post("/:calendarId/reflections", () => {
        return null;
      });
      this.put("/:calendarId/events/:eventId/reflection", () => {
        return null;
      });
    },
  });
});

afterAll(() => {
  server.shutdown();
});

describe("calendar", () => {
  describe("events", () => {
    it("is ok", async () => {
      const svc = calendar();
      const events = await svc.events("my");
      expect(events).toHaveLength(1);
    });

    it("is ok with fields", async () => {
      const svc = calendar();
      const events = await svc.events("my", {}, ["id"]);
      expect(events).toHaveLength(1);
    });

    it("is not ok", async () => {
      const svc = calendar({ baseURL: "/" });
      await svc.events("my").catch(() => {});
    });
  });

  describe("event", () => {
    it("is ok", async () => {
      const svc = calendar();
      const event = await svc.event("foo", "foo");
      expect(event).not.toBeUndefined();
    });

    it("is ok with fields", async () => {
      const svc = calendar();
      const event = await svc.event("foo", "foo", ["id"]);
      expect(event).not.toBeUndefined();
    });
  });

  describe("watch", () => {
    it("is ok", async () => {
      const svc = calendar();
      await svc.watch("my", "foo", {});
    });
  });

  describe("unwatch", () => {
    it("is ok", async () => {
      const svc = calendar();
      await svc.unwatch("my", "foo");
    });
  });

  describe("reflection", () => {
    it("is ok", async () => {
      const svc = calendar();
      const reflection = await svc.reflection("my", "foo");
      expect(reflection).not.toBeUndefined();
    });

    it("is ok with fields", async () => {
      const svc = calendar();
      const reflection = await svc.reflection("my", "foo", ["id"]);
      expect(reflection).not.toBeUndefined();
    });
  });

  describe("deliberate", () => {
    it("is ok", async () => {
      const svc = calendar();
      await svc.deliberate("my", "foo", {});
    });
  });

  describe("reconsider", () => {
    it("is ok", async () => {
      const svc = calendar();
      await svc.reconsider("my", "foo", {});
    });
  });
});
