import { SupabaseDbTypes } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

type TableOrViewName<Database extends SupabaseDbTypes> =
  | keyof Database["public"]["Tables"]
  | keyof Database["public"]["Views"];

type TableOrView<
  Database extends SupabaseDbTypes,
  Name extends TableOrViewName<Database>,
> = Name extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][Name]
  : Name extends keyof Database["public"]["Views"]
    ? Database["public"]["Views"][Name]
    : never;

type ReportMetric<RowType> = {
  column: keyof RowType;
  aggregation: "sum" | "count";
  metricName?: string;
};

export type ReportConstraint<
  Database extends SupabaseDbTypes,
  Table extends TableOrViewName<Database>,
  ColumnName extends keyof TableOrView<Database, Table>["Row"],
  ConstraintType extends "range" | "in-list",
> = {
  column: ColumnName;
  constraint: ConstraintType extends "range"
    ? {
        gt_or_eq: TableOrView<Database, Table>["Row"][ColumnName];
        lt_or_eq: TableOrView<Database, Table>["Row"][ColumnName];
        in_list?: never;
      }
    : {
        gt_or_eq?: never;
        lt_or_eq?: never;
        in_list: TableOrView<Database, Table>["Row"][ColumnName][];
      };
};

export type Report = {
  error?: string;
  // TODO: Proper types for this?
  rows: Record<string, any>[];
};

export const kdnkReport =
  <
    Database extends SupabaseDbTypes,
    Table extends TableOrViewName<Database>,
    ConstraintsType extends ReportConstraint<Database, Table, any, any>,
  >(
    supabase: () => SupabaseClient<Database>,
    tableOrView: Table,
    dimensions: (keyof TableOrView<Database, Table>["Row"])[],
    metrics: ReportMetric<TableOrView<Database, Table>["Row"]>[],
  ) =>
  async (constraints: ConstraintsType): Promise<Report> => {
    const query =
      (dimensions.length > 0 ? dimensions.join(", ") + ", " : "") +
      metrics
        .map((metric) => {
          const columnName = String(metric.column);
          return `${metric.metricName ?? `${metric.aggregation}_${columnName}`}:${columnName}.${metric.aggregation}()`;
        })
        .join(", ");

    let queryBuilder = supabase()
      // @ts-ignore
      .from(tableOrView)
      .select(query);

    if (constraints.constraint.in_list) {
      queryBuilder = queryBuilder.in(
        constraints.column,
        constraints.constraint.in_list,
      );
    } else if (constraints.constraint.gt_or_eq) {
      queryBuilder = queryBuilder
        .gte(constraints.column, constraints.constraint.gt_or_eq)
        .lte(constraints.column, constraints.constraint.lt_or_eq);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      return { rows: [], error: error.message };
    }

    return { rows: data };
  };
