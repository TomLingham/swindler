import * as yup from "yup";

declare const as: unique symbol;
type ValidType<T> = T & { [as]: T };

export function createValidator<T>(schema: yup.ObjectSchema) {
  const opts: yup.ValidateOptions = {
    strict: true,
    abortEarly: false,
  };

  function isValid(value: unknown): value is ValidType<T> {
    return schema.isValidSync(value, opts);
  }

  async function validate(value: any): Promise<string[]> {
    try {
      await schema.validate(value, opts);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return error.errors;
      }
      throw error;
    }

    return [];
  }

  async function normalize(value: ValidType<T>): Promise<T> {
    return schema.validate(value) as Promise<any>;
  }

  return { isValid, validate, normalize };
}
