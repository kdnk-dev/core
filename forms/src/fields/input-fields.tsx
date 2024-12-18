import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { FunctionComponent } from "react";
import { FieldProps } from "@/fields/types";

export const KdInputField =
  (type: string, placeholder?: string): FunctionComponent<FieldProps> =>
  ({ field, context }: FieldProps) => {
    const { value, ...fieldPropsWithoutValue } = field;
    return (
      <Input
        type={type}
        placeholder={placeholder}
        disabled={context.formMode != "edit"}
        defaultValue={value}
        {...fieldPropsWithoutValue}
      />
    );
  };

export const KdSelectField =
  (
    options: Record<string, string>,
    placeholder?: string,
  ): FunctionComponent<FieldProps> =>
  ({ field, context }: FieldProps) => {
    return (
      <Select
        defaultValue={field.value}
        onValueChange={field.onChange}
        disabled={context.formMode != "edit"}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(options).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

export const KdRadioGroup =
  (options: Record<string, string>): FunctionComponent<FieldProps> =>
  ({ field, context }: FieldProps) => {
    return (
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="ktw-flex ktw-flex-col ktw-space-y-1 k ktw-pl-4"
      >
        {Object.entries(options).map(([value, label]) => (
          <FormItem
            key={value}
            className="ktw-flex ktw-items-center ktw-space-x-3 ktw-space-y-0"
          >
            <FormControl>
              <RadioGroupItem
                value={value}
                disabled={context.formMode != "edit"}
              />
            </FormControl>
            <FormLabel>{label}</FormLabel>
          </FormItem>
        ))}
      </RadioGroup>
    );
  };

export const KdBooleanRadioGroup =
  (
    yesOptionLabel?: string,
    noOptionLabel?: string,
  ): FunctionComponent<FieldProps> =>
  ({ field, context }: FieldProps) => {
    return (
      <RadioGroup
        defaultValue={
          field.value === true
            ? "true"
            : field.value === false
              ? "false"
              : field.value
        }
        onValueChange={field.onChange}
        className="ktw-flex ktw-flex-col ktw-space-y-1 k ktw-pl-4"
      >
        <FormItem className="ktw-flex ktw-items-center ktw-space-x-3 ktw-space-y-0">
          <FormControl>
            <RadioGroupItem
              value={"true"}
              disabled={context.formMode != "edit"}
            />
          </FormControl>
          {yesOptionLabel && <FormLabel>{yesOptionLabel}</FormLabel>}
        </FormItem>
        <FormItem className="ktw-flex ktw-items-center ktw-space-x-3 ktw-space-y-0">
          <FormControl>
            <RadioGroupItem
              value={"false"}
              disabled={context.formMode != "edit"}
            />
          </FormControl>
          {noOptionLabel && <FormLabel>{noOptionLabel}</FormLabel>}
        </FormItem>
      </RadioGroup>
    );
  };

export const KdCheckBox =
  (label: string): FunctionComponent<FieldProps> =>
  ({ field, context }: FieldProps) => {
    return (
      <div className="ktw-flex ktw-flex-row ktw-items-start ktw-space-x-3 ktw-space-y-0 ktw-pl-4">
        <Checkbox
          defaultChecked={field.value}
          onCheckedChange={field.onChange}
          disabled={context.formMode != "edit"}
        />
        <FormLabel className="font-normal">{label}</FormLabel>
      </div>
    );
  };

export const KdCheckBoxGroup =
  (options: Record<string, string>): FunctionComponent<FieldProps> =>
  ({ field, context }: FieldProps) => {
    return (
      <div className="ktw-flex ktw-flex-col ktw-gap-y-3 ktw-pl-4">
        {Object.entries(options).map(([value, label]) => (
          <FormItem
            key={value}
            className="ktw-flex ktw-flex-row ktw-items-start ktw-space-x-3 ktw-space-y-0"
          >
            <FormControl>
              <Checkbox
                disabled={context.formMode != "edit"}
                checked={field.value?.includes(value)}
                onCheckedChange={(checked) => {
                  return checked
                    ? field.onChange([...(field.value ?? []), value])
                    : field.onChange(
                        field.value?.filter((v: string) => v !== value),
                      );
                }}
              />
            </FormControl>
            <FormLabel>{label}</FormLabel>
          </FormItem>
        ))}
      </div>
    );
  };

export const KdTextArray =
  (
    newItemPlaceholder?: string,
    maxItems?: number,
  ): FunctionComponent<FieldProps> =>
  ({ field, context }: FieldProps) => {
    return (
      <div className="ktw-flex ktw-flex-col ktw-gap-y-3 ktw-pl-4">
        {(field.value ?? []).map((entry: string, index: number) => (
          <div
            className={"ktw-flex ktw-flex-row ktw-gap-x-2"}
            key={`${field.name}-${index}`}
          >
            <Input
              key={index}
              type={"text"}
              placeholder={newItemPlaceholder}
              disabled={context.formMode != "edit"}
              value={entry}
              onChange={(e) => {
                const newValue = field.value;
                newValue[index] = e.target.value;
                field.onChange(newValue);
              }}
            />
            <Button
              type={"button"}
              variant={"outline"}
              onClick={() => {
                const newValue = field.value;
                newValue.splice(index, 1);
                field.onChange(newValue);
              }}
            >
              <X />
            </Button>
          </div>
        ))}
        <Button
          type={"button"}
          variant={"outline"}
          disabled={
            !!(maxItems && field.value && field.value.length >= maxItems)
          }
          onClick={() => field.onChange([...(field.value ?? []), ""])}
        >
          <Plus />
        </Button>
      </div>
    );
  };
