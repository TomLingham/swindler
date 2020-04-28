import { request, response } from "..";

describe("mock schema", () => {
  describe("requestSchema", () => {
    test("normalization", async () => {
      const value = { path: "/" };
      if (request.isValid(value)) {
        const result = await request.normalize(value);
        expect(result).toMatchSnapshot();
      } else {
        fail(await request.validate(value));
      }
    });

    test("'path' is required", () => {
      return expect(request.validate({})).resolves.toMatchSnapshot();
    });

    test("'method' defaults to 'GET'", async () => {
      const value = { path: "/" };
      if (request.isValid(value)) {
        const result = await request.normalize(value);
        expect(result.method).toBe("GET");
      } else {
        fail();
      }
    });
  });

  describe("responseSchema", () => {
    test("normalization", async () => {
      const value = {};
      if (response.isValid(value)) {
        const result = await response.normalize(value);
        expect(result).toMatchSnapshot();
      } else {
        fail(await response.validate(value));
      }
    });

    test("'status' defaults to 200", async () => {
      const value = { headers: {} };
      if (response.isValid(value)) {
        const result = await response.normalize(value);
        expect(result.status).toBe(200);
      } else {
        fail(await response.validate(value));
      }
    });
  });
});
