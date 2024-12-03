import { UseFormReturn } from "react-hook-form";
import { BaseDynamicFieldDefinitionT } from "@/dynamic/types";
import { maybeParseBool } from "@/lib/utils";
import {
  KdBooleanRadioGroup,
  KdCheckBox,
  KdCheckBoxGroup,
  KdInputField,
  KdRadioGroup,
  KdSelectField,
  KdTextArray,
} from "@/fields/input-fields";
import { KdFormField } from "@/fields/form-field";

export function DynamicField({
  form,
  name,
  hideIfMode,
  config,
}: {
  form: UseFormReturn<any>;
  name: string;
  hideIfMode: "invisible" | "remove";
  config: BaseDynamicFieldDefinitionT;
}) {
  const invisible = config.hideIf
    ? Object.keys(config.hideIf)
        .map((conditionField) => {
          const negate = config.hideIf![conditionField]?.at(0) == "!";
          const matchValue = negate
            ? config.hideIf![conditionField].slice(1)
            : config.hideIf![conditionField];

          const actualValue = form.watch(conditionField);

          return Array.isArray(actualValue)
            ? actualValue.includes(matchValue) != negate
            : (maybeParseBool(actualValue) == maybeParseBool(matchValue)) !=
                negate;
        })
        .every((v) => v)
    : false;

  let renderFn;

  switch (config.fieldType) {
    case "select":
      renderFn = KdSelectField(
        config.config.selectableOptions,
        config.config.placeholder,
      );
      break;
    case "text":
      renderFn = KdInputField("text", config.config?.placeholder);
      break;
    case "email":
      renderFn = KdInputField("email", config.config?.placeholder);
      break;
    case "number":
      renderFn = KdInputField(
        "number",
        config.config?.placeholder
          ? String(config.config?.placeholder)
          : undefined,
      );
      break;
    case "date":
      renderFn = KdInputField("date", new Date().toDateString());
      break;
    case "checkbox":
      renderFn = KdCheckBox(config.config?.itemLabel ?? "");
      break;
    case "booleanRadioGroup":
      const labels = config.config ?? {
        yesOptionLabel: "Yes",
        noOptionLabel: "No",
      };
      renderFn = KdBooleanRadioGroup(
        labels.yesOptionLabel,
        labels.noOptionLabel,
      );
      break;
    case "checkboxGroup":
      renderFn = KdCheckBoxGroup(config.config.selectableOptions);
      break;
    case "radioGroup":
      renderFn = KdRadioGroup(config.config.selectableOptions);
      break;
    case "textArray":
      renderFn = KdTextArray(
        config.config?.placeholder,
        config.config?.maxEntries,
      );
      break;
  }

  return (
    <div
      className={
        invisible
          ? hideIfMode === "remove"
            ? "ktw-hidden"
            : "ktw-invisible"
          : hideIfMode === "remove"
            ? "block"
            : "ktw-visible"
      }
    >
      <KdFormField name={name} label={config.label} render={renderFn} />
    </div>
  );
}
