import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { z, ZodType } from "zod";
import { SupabaseDbTypes } from "@/actions/types";
import { buildZodSchemaForForm } from "@/dynamic/builders-def-to-zod";
import { upsertAction } from "@/actions/mutate";
import { BaseDynamicFormDefinitionT } from "@/dynamic/types";
import { KdnkActionError, KdnkFormTypes } from "@/form/types";
import { KActionState, KFormData } from "@/utils/type-helpers";

export const dynamicFormActionWrapper = <DatabaseType extends SupabaseDbTypes>(
  schema: BaseDynamicFormDefinitionT,
) => {
  const Schema = z.object(buildZodSchemaForForm(schema));
  type FormTypes = KdnkFormTypes<typeof Schema>;

  return {
    forAction:
      (
        action: (
          tableName: keyof DatabaseType["public"]["Tables"],
          keyColumn: keyof DatabaseType["public"]["Tables"][typeof tableName]["Row"],
          formData: KFormData<FormTypes>,
        ) => Promise<KActionState<FormTypes>>,
      ) =>
      (formData: KFormData<FormTypes>): Promise<KActionState<FormTypes>> => {
        if (!schema.table)
          throw Error("Invoking dynamic action but no table defined");

        return action(
          schema.table.name,
          schema.table
            .primaryKeyColumn as keyof DatabaseType["public"]["Tables"][typeof schema.table.name]["Row"],
          formData,
        );
      },
  };
};

export const dynamicFormUpsertAction = async <
  DatabaseType extends SupabaseDbTypes,
  FormType extends ZodType<any, any, any>,
  FormDataType extends KdnkFormTypes<FormType>,
>(
  createClient: () => SupabaseClient<DatabaseType>,
  tableName: keyof DatabaseType["public"]["Tables"],
  keyColumn: keyof DatabaseType["public"]["Tables"][typeof tableName]["Row"],
  formData: KFormData<FormDataType>,
  onSuccess: (
    record: DatabaseType["public"]["Tables"][typeof tableName]["Row"],
  ) => void,
  processError?: (
    error: PostgrestError,
  ) => KdnkActionError<
    DatabaseType["public"]["Tables"][keyof DatabaseType["public"]["Tables"]]["Row"]
  >,
) => {
  return await upsertAction(
    createClient,
    tableName,
    { db: keyColumn, form: keyColumn },
    (formData) => formData,
    (row) => row,
    onSuccess,
    processError,
  )(formData);
};
