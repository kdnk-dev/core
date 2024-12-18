import React, { FunctionComponent, memo, useContext } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { KdnkFormContext } from "@/form/context";
import { FieldProps } from "@/fields/types";

export const KdFormField = memo(
  ({
    name,
    label,
    render,
  }: {
    name: string;
    label?: React.JSX.Element | string;
    render: FunctionComponent<FieldProps>;
  }) => {
    const kdnkContext = useContext(KdnkFormContext);
    const Field = render;

    return (
      <FormField
        name={name}
        render={({ field }) => (
          <FormItem className="ktw-flex ktw-flex-col">
            {label && (
              <FormLabel className="ktw-py-2 ktw-pl-1 ktw-pb-4">
                {label}
              </FormLabel>
            )}
            <FormControl>
              <Field field={field} context={kdnkContext} />
            </FormControl>
            <FormMessage className="ktw-pl-1 ktw-pt-1">
              {/* nbsp so that we take up line height when there is no error (and don't reflow when an error appears) */}
              &nbsp;
            </FormMessage>
          </FormItem>
        )}
      />
    );
  },
  (props, newProps) => {
    return (
      props.name === newProps.name &&
      props.label === newProps.label &&
      props.render.toString() === newProps.render.toString()
    );
  },
);
