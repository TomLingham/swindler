import * as yup from "yup";
import { METHODS } from "http";
import { mapValues } from "../utils";
import { createValidator } from "./helpers";

const requestSchema = yup
  .object({
    method: yup.string().oneOf(METHODS).default("GET"),
    path: yup.string().required(),
  })
  .noUnknown();

const responseSchema = yup
  .object({
    status: yup.number().default(200),
    headers: yup.lazy((obj: any = {}) =>
      // TODO: this needs a little work for non-object values
      yup.object(mapValues(obj, () => yup.string())).default({})
    ),
  })
  .noUnknown();

const mockFileSchema = yup.object({
  request: requestSchema.required(),
  response: responseSchema.required(),
  body: yup.lazy((value) => {
    if (typeof value === "string") return yup.string();
    return yup.object().nullable(false).notRequired();
  }),
}).noUnknown();

export const mockFile = createValidator<IMockFile>(mockFileSchema);
