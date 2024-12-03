import { z } from "zod";
import { DynamicFieldDefinition } from "@/dynamic/definition-field";

import { dbTypesEnum } from "@/dynamic/definition-database";
import { DynamicFormDatabaseDefinitionT } from "@/dynamic/types";

const DynamicFormDefinitionShared = {
  formArray: z
    .object({
      orderByColumn: z.string(),
      addRecordButtonText: z.string().min(1),
      addRecordButtonHideMode: z.union([
        z.literal("disable"),
        z.literal("invisible"),
        z.literal("remove"),
        z.undefined()
      ]),
      existingRecordsInitialState: z.union([
        z.literal("edit"),
        z.literal("view-readonly"),
        z.literal("view-editable")
      ]),
      maxNewRecords: z.number().positive().optional(),
      newRecordInitialCount: z.number().nonnegative().optional()
    })
    .refine(
      (value) =>
        !(value.newRecordInitialCount && value.maxNewRecords) ||
        value.newRecordInitialCount <= value.maxNewRecords,
      "newRecordInitialCount must be <= maxNewRecords"
    )
    .optional(),
  hiddenFields: z.record(z.string(), dbTypesEnum).optional(),
  hideIfMode: z.union([z.literal("invisible"), z.literal("remove")]).optional()
};

export const DynamicFormDefinition = {
  withoutDbDef: () =>
    z.object({
      ...DynamicFormDefinitionShared,
      table: z
        .object({ name: z.string(), primaryKeyColumn: z.string() })
        .optional(),
      formFields: z.record(
        z.string(),
        DynamicFieldDefinition.withoutColumnType()
      )
    }),
  forDbTable: (
    dbDef: DynamicFormDatabaseDefinitionT,
    tableName: keyof typeof dbDef
  ) => {
    const columnsEnum = z.enum([
      Object.keys(dbDef[tableName])[0],
      ...Object.keys(dbDef[tableName]).slice(1)
    ]);
    return z.object({
      ...DynamicFormDefinitionShared,
      table: z.object({
        name: z.literal(tableName),
        primaryKeyColumn: columnsEnum
      }),
      formFields: z.record(
        columnsEnum,
        DynamicFieldDefinition.forColumnType(columnsEnum)
      )
    });
  },
  forDbDef: (dbDef: DynamicFormDatabaseDefinitionT) =>
    z.union(
      // @ts-expect-error sadface
      Object.keys(dbDef).map((tableName) =>
        DynamicFormDefinition.forDbTable(dbDef, tableName)
      )
    )
};