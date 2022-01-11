/**
 * @jest-environment jsdom
 */

import { useClient } from "./client";

describe("client", () => {
  it("is ok", async () => {
    const client = useClient();
    expect(client).not.toBeUndefined();
  });

  it("is ok with token", async () => {
    const client = useClient("token");
    expect(client).not.toBeUndefined();
  });

  it("is ok with environment", async () => {
    const client = useClient("", "test");
    expect(client).not.toBeUndefined();
  });
});
