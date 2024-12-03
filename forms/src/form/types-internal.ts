import { DefaultValues, FieldValues, UseFormReturn } from "react-hook-form";
import { KdnkFormHandle } from "@/form/types";
import { FunctionComponent, Ref } from "react";
import { FormGroup } from "@/group/types";

export interface FormProps<FormDataType extends FieldValues> {
  data?:
    | {
        existingRecord: FormDataType;
        existingRecordInitialState: "view-readonly" | "view-editable" | "edit";
        newRecordDefaults?: never;
      }
    | {
        existingRecord?: never;
        existingRecordInitialState?: never;
        newRecordDefaults: DefaultValues<FormDataType>;
      };
  onRecordSaved?: (savedFormData: FormDataType) => void;
  onActionSucceeded?: (submittedFormData: FormDataType) => void;
  formGroup?: FormGroup;
  handle?: Ref<KdnkFormHandle>;
  content: FunctionComponent<RenderProps<FormDataType>>;
}

export interface RenderProps<FormDataType extends FieldValues> {
  form: UseFormReturn<FormDataType>;
  displayMode: "view-readonly" | "view-editable" | "edit";
  startEdit: () => void;
  isActionPending: boolean;
  actionLastInvocationStatus: "none" | "success" | "error";
}

export interface FormPropsWithContext<
  FormDataType extends FieldValues,
  ContextType,
> extends Omit<FormProps<FormDataType>, "content"> {
  context: ContextType;
  content: FunctionComponent<RenderPropsWithContext<FormDataType, ContextType>>;
}

export interface RenderPropsWithContext<
  FormDataType extends FieldValues,
  ContextType,
> extends RenderProps<FormDataType> {
  context: ContextType;
}
