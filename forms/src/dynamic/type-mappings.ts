import { z, ZodType } from "zod";

export const DbDefTypesByFieldTypes: Record<
  string,
  "text" | "number" | "boolean" | "textArray" | "numberArray" | "primaryKey"
> = {
  number: "number",
  email: "text",
  text: "text",
  textArray: "textArray",
  date: "text",
  checkbox: "boolean",
  booleanRadioGroup: "boolean",
  select: "text",
  checkboxGroup: "textArray",
  radioGroup: "text",
};

export const PostgresTypesByDbDefType = {
  text: "text",
  number: "integer",
  boolean: "boolean",
  textArray: "text[]",
  numberArray: "integer[]",
  primaryKey: "uuid PRIMARY KEY DEFAULT auth.uid()",
  uuid: "uuid",
};

export const ZodSchemasByDbDefType: Record<string, ZodType> = {
  text: z.string(),
  number: z.coerce.number(),
  boolean: z.coerce.boolean(),
  textArray: z.array(z.string()),
  numberArray: z.array(z.coerce.number()),
  primaryKey: z.string().uuid(),
  uuid: z.string().uuid(),
};