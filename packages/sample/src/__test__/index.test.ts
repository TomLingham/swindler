import path from "path";
import http from "http";
import { MockService } from "@swindler/core";

const service = new MockService({
  port: 9000,
  id: "CSP",
  cwd: path.resolve(__dirname, "..", "..", "mocks"),
});

describe("test the tests", () => {
  beforeAll(async () => {
    await service.load("csp/scenario/*.mock.yaml");
    await service.serve();
  });

  afterAll(async () => {
    service.close();
  });

  test("some test", async () => {
    const r = await new Promise((resolve) =>
      http.get(service.getHost() + "/v1/users/mary", (res) => {
        resolve(res.statusCode ?? 5);
      })
    );

    expect(r).toBe(200);
  });
});
