import { SupabaseClient } from "@supabase/supabase-js";
import { KdnkFetchResponse, SupabaseDbTypes } from "@/actions/types";

export type KdnkTableFetchTypes<
  Database extends SupabaseDbTypes,
  TableName extends keyof Database["public"]["Tables"],
  KeyName extends keyof Database["public"]["Tables"][TableName]["Row"],
> = {
  TableName: TableName;
  RowType: Database["public"]["Tables"][TableName]["Row"];
  KeyName: KeyName;
  KeyType: Database["public"]["Tables"][TableName]["Row"][KeyName];
};

export type KdnkViewFetchTypes<
  Database extends SupabaseDbTypes,
  TableName extends keyof Database["public"]["Views"],
  KeyName extends keyof Database["public"]["Views"][TableName]["Row"],
> = {
  TableName: TableName;
  RowType: Database["public"]["Views"][TableName]["Row"];
  KeyName: KeyName;
  KeyType: Database["public"]["Views"][TableName]["Row"][KeyName];
};

export type KdnkDbFetchAllTypes<
  Database extends SupabaseDbTypes,
  TableName extends
    | keyof Database["public"]["Tables"]
    | keyof Database["public"]["Views"],
> = {
  TableName: TableName;
  RowType: TableName extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][TableName]["Row"]
    : TableName extends keyof Database["public"]["Views"]
      ? Database["public"]["Views"][TableName]["Row"]
      : never;
};

export const fetchSingle =
  <
    Database extends SupabaseDbTypes,
    RecordType,
    DbTypes extends
      | KdnkTableFetchTypes<Database, any, any>
      | KdnkViewFetchTypes<Database, any, any>,
  >(
    client: () => Promise<SupabaseClient<Database>>,
    tableName: DbTypes["TableName"],
    keyColumn: DbTypes["KeyName"],
    rowToRecord: (row: DbTypes["RowType"]) => RecordType,
  ) =>
  async (key: DbTypes["KeyType"]): Promise<KdnkFetchResponse<RecordType>> => {
    const sb = await client();

    const { data, error } = await sb
      .from(tableName)
      .select()
      // TODO: Check these casts are safe.
      .eq(keyColumn as string, key!)
      .single();

    if (error) {
      return { error: `[${error.code}] ${error.message} (${error.details})` };
    } else {
      return { data: rowToRecord(data) };
    }
  };

export const fetchMultiple =
  <
    Database extends SupabaseDbTypes,
    RecordType,
    DbTypes extends
      | KdnkTableFetchTypes<Database, any, any>
      | KdnkViewFetchTypes<Database, any, any>,
  >(
    client: () => Promise<SupabaseClient<Database>>,
    tableName: DbTypes["TableName"],
    keyColumn: DbTypes["KeyName"],
    rowToRecord: (row: DbTypes["RowType"]) => RecordType,
  ) =>
  async (key: DbTypes["KeyType"]): Promise<KdnkFetchResponse<RecordType[]>> => {
    const sb = await client();

    const { data, error } = await sb
      .from(tableName)
      .select()
      // TODO: Check these casts are safe.
      .eq(keyColumn as string, key!);

    if (error) {
      return { error: `[${error.code}] ${error.message} (${error.details})` };
    } else if (data) {
      return { data: data.map(rowToRecord) };
    } else {
      return {
        error: `[fetchMultiple] unexpected error (${tableName}: ${key})`,
      };
    }
  };

export const fetchRange =
  <
    Database extends SupabaseDbTypes,
    RecordType,
    DbTypes extends
      | KdnkTableFetchTypes<Database, any, any>
      | KdnkViewFetchTypes<Database, any, any>,
  >(
    client: () => Promise<SupabaseClient<Database>>,
    tableName: DbTypes["TableName"],
    keyColumn: DbTypes["KeyName"],
    rowToRecord: (row: DbTypes["RowType"]) => RecordType,
  ) =>
  async (range: {
    gt_or_eq_to: DbTypes["KeyType"];
    lt_or_eq_to: DbTypes["KeyType"];
  }): Promise<KdnkFetchResponse<RecordType[]>> => {
    const sb = await client();

    const { data, error } = await sb
      .from(tableName)
      .select()
      // TODO: Check these casts are safe.
      .gte(keyColumn as string, range?.gt_or_eq_to)
      .lte(keyColumn as string, range?.lt_or_eq_to);

    if (error) {
      return { error: `[${error.code}] ${error.message} (${error.details})` };
    } else if (data) {
      return { data: data.map(rowToRecord) };
    } else {
      return {
        error: `[fetchMultiple] unexpected error (${tableName}: ${JSON.stringify(range)})`,
      };
    }
  };

export const fetchAll =
  <
    Database extends SupabaseDbTypes,
    RecordType,
    DbTypes extends KdnkDbFetchAllTypes<Database, any>,
  >(
    client: () => Promise<SupabaseClient<Database>>,
    tableName: DbTypes["TableName"],
    rowToRecord: (row: DbTypes["RowType"]) => RecordType,
  ) =>
  async (): Promise<KdnkFetchResponse<RecordType[]>> => {
    const sb = await client();

    const { data, error } = await sb.from(tableName).select();

    if (error) {
      return { error: `[${error.code}] ${error.message} (${error.details})` };
    } else if (data) {
      // @ts-ignore
      return { data: data.map(rowToRecord) };
    } else {
      return { error: `[fetchAll] unexpected error (${tableName})` };
    }
  };
