import { z, ZodRawShape } from "zod";
import { ZodSchemasByDbDefType } from "@/dynamic/type-mappings";
import {
  BaseDynamicFieldDefinitionT,
  BaseDynamicFormDefinitionT,
} from "@/dynamic/types";

export function buildZodSchemaForForm<
  FormConfigT extends BaseDynamicFormDefinitionT,
>(formConfig: FormConfigT): ZodRawShape {
  const formFields = Object.keys(formConfig.formFields)
    .map((fieldKey) => ({
      [fieldKey]: buildZodSchemaForField(formConfig.formFields[fieldKey]!),
    }))
    .reduce((previousValue, currentValue) => ({
      ...previousValue,
      ...currentValue,
    }));

  const primaryKeyField = formConfig.table?.primaryKeyColumn
    ? { [formConfig.table.primaryKeyColumn]: "primaryKey" }
    : {};

  const hiddenFields = Object.entries({
    ...(formConfig.hiddenFields ?? {}),
    ...primaryKeyField,
  })

    .map(([column, type]) => ({
      [column]:
        ZodSchemasByDbDefType[
          type as keyof typeof ZodSchemasByDbDefType
        ].optional(),
    }))
    .reduce((previousValue, currentValue) => ({
      ...previousValue,
      ...currentValue,
    }));

  return { ...formFields, ...hiddenFields };
}

function buildZodSchemaForField(fieldConfig: BaseDynamicFieldDefinitionT) {
  let schema;

  switch (fieldConfig.fieldType) {
    case "text":
      schema = z.string();
      if (fieldConfig.config?.minLength)
        schema = schema.min(fieldConfig.config.minLength);
      if (fieldConfig.config?.maxLength)
        schema = schema.max(fieldConfig.config.maxLength);
      if (fieldConfig.config?.matchPattern)
        schema = schema.regex(
          new RegExp(`^${fieldConfig.config.matchPattern}$`),
        );
      if (fieldConfig.config?.containsPattern)
        schema = schema.regex(new RegExp(fieldConfig.config.containsPattern));
      break;
    case "email":
      schema = z.string().email();
      if (fieldConfig.config?.matchPattern)
        schema = schema.regex(
          new RegExp(`^${fieldConfig.config.matchPattern}$`),
        );
      if (fieldConfig.config?.containsPattern)
        schema = schema.regex(new RegExp(fieldConfig.config.containsPattern));
      break;
    case "select":
      schema = z.string();
      break;
    case "number":
      schema = z.number({ coerce: true });
      if (fieldConfig.config?.minValue)
        schema = schema.gte(fieldConfig.config.minValue);
      if (fieldConfig.config?.maxValue)
        schema = schema.lte(fieldConfig.config.maxValue);
      break;
    case "date":
      schema = z.string();
      break;
    case "checkbox":
      schema = z.boolean({ coerce: true });
      break;
    case "booleanRadioGroup":
      schema = z.preprocess(
        (v) => {
          return v === "false" ? false : v;
        },
        z.boolean({ coerce: true }),
      );
      break;
    case "checkboxGroup":
      schema = z.array(z.string());
      break;
    case "radioGroup":
      schema = z.string();
      break;
    case "textArray":
      let itemSchema = z.string();

      if (fieldConfig.config?.itemMinLength)
        itemSchema = itemSchema.min(fieldConfig.config.itemMinLength);
      if (fieldConfig.config?.itemMaxLength)
        itemSchema = itemSchema.max(fieldConfig.config.itemMaxLength);
      if (fieldConfig.config?.itemMatchPattern)
        itemSchema = itemSchema.regex(
          new RegExp(`^${fieldConfig.config.itemMatchPattern}$`),
        );
      if (fieldConfig.config?.itemContainsPattern)
        itemSchema = itemSchema.regex(
          new RegExp(fieldConfig.config.itemContainsPattern),
        );

      schema = z.array(itemSchema);

      if (fieldConfig.config?.maxEntries)
        schema = schema.max(fieldConfig.config.maxEntries);
      break;
    default:
      throw Error(`Invalid Field Type`);
  }

  if (fieldConfig.optional) schema = schema.optional();

  return schema;
}
