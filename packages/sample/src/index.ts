import path from "path";
import { MockService } from "@swindler/core";

const service = new MockService({
  port: 9000,
  id: "CSP",
  cwd: path.resolve(__dirname, "..", "mocks"),
});

(async () => {
  await service.load("csp/scenario/*.mock.yaml");
  await service.serve();
})();
