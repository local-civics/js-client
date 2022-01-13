/**
 * @jest-environment jsdom
 */

import { createServer, Registry, Server } from "miragejs";
import { AnyModels, AnyFactories } from "miragejs/-types";
import { footprint } from "./footprint";
import { identity } from "./identity";

let server: Server<Registry<AnyModels, AnyFactories>>;
beforeAll(() => {
  server = createServer({
    environment: "test",
    routes() {
      this.namespace = "/footprint/v0";
      this.get("/:actorId/badges", () => {
        return [{}];
      });
      this.get("/:actorId/pathways", () => {
        return [{}];
      });
      this.get("/:actorId/passport", () => {
        return {};
      });
    },
  });
});

afterAll(() => {
  server.shutdown();
});

describe("footprint", () => {
  describe("badges", () => {
    it("is ok", async () => {
      const svc = footprint();
      const badges = await svc.badges("my");
      expect(badges).toHaveLength(1);
    });

    it("is ok with fields", async () => {
      const svc = footprint();
      const badges = await svc.badges("my", {}, ["id"]);
      expect(badges).toHaveLength(1);
    });

    it("is not ok", async () => {
      const svc = footprint({ baseURL: "/" });
      await svc.badges("my").catch(() => {});
    });
  });

  describe("badge", () => {
    it("is ok", async () => {
      const svc = footprint();
      const badge = await svc.badge("foo", "foo");
      expect(badge).not.toBeUndefined();
    });

    it("is ok with fields", async () => {
      const svc = footprint();
      const badge = await svc.badge("foo", "foo", ["id"]);
      expect(badge).not.toBeUndefined();
    });
  });

  describe("pathways", () => {
    it("is ok", async () => {
      const svc = footprint();
      const pathways = await svc.pathways("my");
      expect(pathways).toHaveLength(1);
    });

    it("is ok with fields", async () => {
      const svc = footprint();
      const pathways = await svc.pathways("my", {}, ["id"]);
      expect(pathways).toHaveLength(1);
    });
  });

  describe("pathway", () => {
    it("is ok", async () => {
      const svc = footprint();
      const pathway = await svc.pathway("foo", "foo");
      expect(pathway).not.toBeUndefined();
    });

    it("is ok with fields", async () => {
      const svc = footprint();
      const pathway = await svc.pathway("foo", "foo", ["id"]);
      expect(pathway).not.toBeUndefined();
    });
  });

  describe("passport", () => {
    it("is ok", async () => {
      const svc = footprint();
      const passport = await svc.passport("my");
      expect(passport).not.toBeUndefined();
    });

    it("is ok with fields", async () => {
      const svc = footprint();
      const passport = await svc.passport("my", ["id"]);
      expect(passport).not.toBeUndefined();
    });
  });
});
