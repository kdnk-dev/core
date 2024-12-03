import { z } from "zod";

export const dbTypesEnum = z.enum([
  "text",
  "number",
  "boolean",
  "textArray",
  "numberArray",
  "primaryKey",
  "uuid"
]);

export const DynamicFormDatabaseDefinition = z.record(
  z.string(),
  z.record(z.string(), dbTypesEnum.default("text").optional())
);