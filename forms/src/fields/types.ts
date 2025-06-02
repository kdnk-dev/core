import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { KdnkFormContextType } from "@/form/types";

export type FieldProps = {
  field: ControllerRenderProps<FieldValues, string>;
  context: KdnkFormContextType;
};
