import {
  DbDefTypesByFieldTypes,
  PostgresTypesByDbDefType,
} from "@/dynamic/type-mappings";
import {
  BaseDynamicFormDefinitionT,
  DynamicFormDatabaseDefinitionT,
} from "@/dynamic/types";

export function buildDatabaseDefinitionForForms(
  forms: BaseDynamicFormDefinitionT[],
): DynamicFormDatabaseDefinitionT {
  const dbDef: DynamicFormDatabaseDefinitionT = {};

  for (const form of forms) {
    if (!form.table) continue;

    if (dbDef[form.table.name]) {
      if (!dbDef[form.table.name].hasOwnProperty(form.table.primaryKeyColumn))
        throw Error(
          `Table ${form.table.name} listed with multiple different primary keys`,
        );
    } else {
      dbDef[form.table.name] = { [form.table.primaryKeyColumn]: "primaryKey" };
    }

    const tableDef = dbDef[form.table.name];

    for (const [columnName, formField] of Object.entries(form.formFields)) {
      if (tableDef.hasOwnProperty(columnName)) {
        throw Error(
          `Non-id db column referenced by multiple fields: table=${form.table.name}, column=${columnName}, field label=${formField.label}`,
        );
      }

      tableDef[columnName] = DbDefTypesByFieldTypes[formField.fieldType];
    }

    for (const [columnName, hiddenField] of Object.entries(
      form.hiddenFields ?? {},
    )) {
      if (!tableDef.hasOwnProperty(columnName)) {
        // Hidden fields can't be modified in the form so - in the same way as primary keys - it's ok for them
        // to be listed in multiple places.
        tableDef[columnName] = DbDefTypesByFieldTypes[hiddenField];
      }
    }
  }

  return dbDef;
}

export const buildPostgresInitStatements = (
  dbDef: DynamicFormDatabaseDefinitionT,
  includeDropStatements: boolean,
) =>
  Object.entries(dbDef).map(
    ([table, columns]) =>
      (includeDropStatements ? `\nDROP TABLE ${table};\n` : "") +
      `\nCREATE TABLE ${table} (\n${Object.entries(columns)
        .map(
          ([columnName, type]) =>
            `${columnName} ${PostgresTypesByDbDefType[type!]}`,
        )
        .join(",\n")}\n);`,
  );
