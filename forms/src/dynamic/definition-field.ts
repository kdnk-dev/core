import { z } from "zod";

const DynamicFieldDefinitionShared = {
  forColumnType: (type: any) => ({
    label: z.string().optional(),
    optional: z.boolean({ coerce: true }).default(false).optional(),
    hideIf: z.record(type, z.string()).optional(),
  }),
};

export const DynamicFieldDefinition = {
  withoutColumnType: () => DynamicFieldDefinition.forColumnType(z.string()),
  forColumnType: (type: any) =>
    z.discriminatedUnion("fieldType", [
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("text"),
        config: z
          .object({
            placeholder: z.string().optional(),
            minLength: z.number({ coerce: true }).optional(),
            maxLength: z.number({ coerce: true }).optional(),
            matchPattern: z
              .string()
              .refine(
                (arg) => {
                  try {
                    new RegExp(`^${arg}$`);
                    return true;
                  } catch (e) {
                    return false;
                  }
                },
                { message: "Invalid regular expression for matchPattern" },
              )
              .optional(),
            containsPattern: z
              .string()
              .refine(
                (arg) => {
                  try {
                    new RegExp(arg);
                    return true;
                  } catch (e) {
                    return false;
                  }
                },
                { message: "Invalid regular expression for matchPattern" },
              )
              .optional(),
          })
          .optional(),
      }),
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("email"),
        config: z
          .object({
            placeholder: z.string().optional(),
            matchPattern: z
              .string()
              .refine(
                (arg) => {
                  try {
                    new RegExp(`^${arg}$`);
                    return true;
                  } catch (e) {
                    return false;
                  }
                },
                { message: "Invalid regular expression for matchPattern" },
              )
              .optional(),
            containsPattern: z
              .string()
              .refine(
                (arg) => {
                  try {
                    new RegExp(arg);
                    return true;
                  } catch (e) {
                    return false;
                  }
                },
                { message: "Invalid regular expression for matchPattern" },
              )
              .optional(),
          })
          .optional(),
      }),
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("textArray"),
        config: z
          .object({
            placeholder: z.string().optional(),
            itemMinLength: z.number({ coerce: true }).optional(),
            itemMaxLength: z.number({ coerce: true }).optional(),
            itemMatchPattern: z
              .string()
              .refine(
                (arg) => {
                  try {
                    new RegExp(`^${arg}$`);
                    return true;
                  } catch (e) {
                    return false;
                  }
                },
                { message: "Invalid regular expression for matchPattern" },
              )
              .optional(),
            itemContainsPattern: z
              .string()
              .refine(
                (arg) => {
                  try {
                    new RegExp(arg);
                    return true;
                  } catch (e) {
                    return false;
                  }
                },
                { message: "Invalid regular expression for matchPattern" },
              )
              .optional(),
            maxEntries: z.number({ coerce: true }).optional(),
          })
          .optional(),
      }),
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("number"),
        config: z
          .object({
            placeholder: z.number().optional(),
            minValue: z.number().optional(),
            maxValue: z.number().optional(),
          })
          .optional(),
      }),
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("date"),
      }),
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("checkbox"),
        config: z
          .object({
            itemLabel: z.string().optional(),
          })
          .optional(),
      }),
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("booleanRadioGroup"),
        config: z
          .object({
            yesOptionLabel: z.string().default("Yes").optional(),
            noOptionLabel: z.string().default("No").optional(),
          })
          .default({ yesOptionLabel: "Yes", noOptionLabel: "No" })
          .optional(),
      }),
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("select"),
        config: z.object({
          placeholder: z.string().optional(),
          selectableOptions: z.record(z.string(), z.string()),
        }),
      }),
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("checkboxGroup"),
        config: z.object({
          selectableOptions: z.record(z.string(), z.string()),
        }),
      }),
      z.object({
        ...DynamicFieldDefinitionShared.forColumnType(type),
        fieldType: z.literal("radioGroup"),
        config: z.object({
          selectableOptions: z.record(z.string(), z.string()),
        }),
      }),
    ]),
};
