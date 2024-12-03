import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { KdnkActionError, KdnkActionState } from "@kdnk.dev/forms";
import { KdnkDeleteResponse, SupabaseDbTypes } from "@/actions/types";
import { KdnkTableFetchTypes, KdnkViewFetchTypes } from "@/actions/fetch";

export function upsertAction<
  Database extends SupabaseDbTypes,
  FormDataType,
  DatabaseTable extends
    Database["public"]["Tables"][keyof Database["public"]["Tables"]],
>(
  client: () => SupabaseClient<Database>,
  tableName: keyof Database["public"]["Tables"],
  idFieldName: { db: keyof DatabaseTable["Row"]; form: keyof FormDataType },
  formDataToDatabaseRow: (formData: FormDataType) => DatabaseTable["Update"],
  rowToFormData: (row: DatabaseTable["Row"]) => FormDataType,
  onSuccess: (persistedRecord: FormDataType) => void,
  processError?: (error: PostgrestError) => KdnkActionError<FormDataType>,
) {
  return async (
    formData: FormDataType,
  ): Promise<KdnkActionState<FormDataType>> => {
    let resp;

    if (!formData[idFieldName.form]) {
      resp = await client()
        // @ts-ignore
        .from(tableName)
        // @ts-ignore
        .insert(formDataToDatabaseRow(formData))
        .select()
        .single();
    } else {
      const valuesToUpdate = formDataToDatabaseRow(formData);

      resp = await client()
        // @ts-ignore
        .from(tableName)
        // @ts-ignore
        .update(valuesToUpdate)
        .eq(idFieldName.db as string, formData[idFieldName.form]!)
        .select()
        .single();
    }

    if (resp.error) {
      return {
        lastInvocationStatus: "error",
        error: processError
          ? processError(resp.error)
          : { rootError: `${resp.error.code}: ${resp.error.message}` },
      };
    } else if (resp.data) {
      const formData = rowToFormData(resp.data);
      onSuccess(formData);
      return {
        lastInvocationStatus: "success-record-saved",
        persistedRecord: formData,
      };
    } else {
      return {
        lastInvocationStatus: "error",
        error: { rootError: "Unexpected Error" },
      };
    }
  };
}

export const deleteSingle =
  <
    Database extends SupabaseDbTypes,
    DbTypes extends
      | KdnkTableFetchTypes<Database, any, any>
      | KdnkViewFetchTypes<Database, any, any>,
  >(
    client: () => SupabaseClient<Database>,
    tableName: DbTypes["TableName"],
    keyColumn: DbTypes["KeyName"],
    onSuccess: (deletedKey: DbTypes["KeyType"]) => void,
  ) =>
  async (key: DbTypes["KeyType"]): Promise<KdnkDeleteResponse> => {
    const { error } = await client()
      .from(tableName)
      .delete()
      // TODO: Check these casts are safe.
      .eq(keyColumn as string, key!);

    if (error) {
      return { error: `[${error.code}] ${error.message} (${error.details})` };
    } else {
      onSuccess(key);
      return {};
    }
  };
