import { z } from "zod";
import { DynamicFormDatabaseDefinition } from "@/dynamic/definition-database";
import { DynamicFieldDefinition } from "@/dynamic/definition-field";
import { DynamicFormDefinition } from "@/dynamic/definition-form";
import { FormArrayProps } from "@/array/types";
import { KdnkFormTypes } from "@/form/types";

export type DynamicFormDatabaseDefinitionT = z.infer<
  typeof DynamicFormDatabaseDefinition
>;

export const BaseDynamicFieldDefinition =
  DynamicFieldDefinition.withoutColumnType();
export type BaseDynamicFieldDefinitionT = z.infer<
  typeof BaseDynamicFieldDefinition
>;

export const BaseDynamicFormDefinition = DynamicFormDefinition.withoutDbDef();
export type BaseDynamicFormDefinitionT = z.infer<
  typeof BaseDynamicFormDefinition
>;

export type ArrayPropsType<FormTypes extends KdnkFormTypes<any>> = Pick<
  FormArrayProps<FormTypes>,
  | "existingRecords"
  | "newRecordDefaults"
  | "formGroup"
  | "newRecordInitialCount"
>;
