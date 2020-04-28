import fglob from "fast-glob";
import yaml from "js-yaml";
import http from "http";
import { promises as fs } from "fs";
import { pathToRegexp } from "path-to-regexp";
import { mockFile } from "./schema";

interface IMockServiceOptions {
  id?: string;
  host?: string;
  port?: number;
  cwd?: string;
}

const DEFAULTS: Required<IMockServiceOptions> = {
  id: "",
  host: "localhost",
  port: 9000,
  cwd: process.cwd(),
};

export class MockService {
  #id: string;
  #port: number;
  #host: string;
  #cwd: string;

  #mocks: IMockFile[] = [];
  #server: http.Server;

  constructor(opts: IMockServiceOptions) {
    this.#id = opts.id ?? DEFAULTS.id;
    this.#port = opts.port ?? DEFAULTS.port;
    this.#host = opts.host ?? DEFAULTS.host;
    this.#cwd = opts.cwd ?? DEFAULTS.cwd;
  }

  async load(pattern: string | string[]) {
    const globResults = await fglob(pattern, {
      cwd: this.#cwd,
      absolute: true,
    });

    if (globResults.length === 0) {
      console.warn("There were no mocks found.");
    } else {
      console.log(globResults.length, "mock(s) found.");
    }

    try {
      this.#mocks = await loadMockFiles(globResults);
    } catch (error) {
      throw new Error(error); // TODO: Better errors
    }
  }

  async serve() {
    this.#server = http.createServer((req, res) => {
      const path = req.url ?? "/";
      const method = req.method ?? "GET";

      const mock = this.findMock(method, path);

      if (mock === null) {
        res.statusCode = 404;
        res.write("Swindler: There was no mock found");
      } else {
        const { response, body } = mock;
        const [contentType, content] = createBody(body);

        res.statusCode = response.status;
        // Try and set the content-type here, it will be overwritten later if it
        // was set manually
        res.setHeader("content-type", contentType);

        for (const header in response.headers) {
          res.setHeader(header, response.headers[header]);
        }

        res.write(content);
      }

      res.write("\n"); // Always end with a newline to make curls cleaner.
      res.end();
    });

    return new Promise((resolve) => {
      this.#server.listen(this.#port, () => {
        console.log(
          `Test mocks available for "${this.#id}" at "${this.getHost()}"`
        );
        resolve();
      });
    });
  }

  close() {
    this.#server.close();
  }

  getHost(): string {
    return `http://${this.#host}:${this.#port}`;
  }

  private findMock(method: string, path: string): IMockFile | null {
    const mock = this.#mocks.find(({ request }) => {
      if (request.method === method) {
        return pathToRegexp(request.path).test(path);
      }
    });

    return mock ?? null;
  }
}

async function loadMockFiles(filePaths: string[]): Promise<IMockFile[]> {
  const mockPromises = filePaths.map((filePath) => {
    return fs
      .readFile(filePath)
      .then((buffer) => buffer.toString())
      .then((data) => yaml.safeLoadAll(data))
      .then(transformMockFile)
      .then(async (mock) => {
        if (mockFile.isValid(mock)) {
          return mockFile.normalize(mock);
        } else {
          throw await mockFile.validate(mock);
        }
      });
  });

  return Promise.all(mockPromises) as any;
}

function transformMockFile([opts, body]: any[]) {
  if (body != null) {
    opts.body = body;
  }
  return opts;
}

function createBody(body: unknown): [string, any] {
  if (typeof body === "string") {
    return ["text/plain", body];
  }

  if (typeof body === "object") {
    return ["application/json", JSON.stringify(body, null, 2)];
  }

  return ["application/octet-stream", body];
}
