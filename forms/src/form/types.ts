import { z, ZodType } from "zod";

import {
  FormProps,
  FormPropsWithContext,
  RenderProps,
  RenderPropsWithContext,
} from "@/form/types-internal";

export type KdnkActionState<FormDataType> =
  | {
      lastInvocationStatus: "none";
      persistedRecord?: FormDataType; // Set iff we are editing an existing record.
      error?: never;
    }
  | {
      lastInvocationStatus: "success-record-saved";
      persistedRecord: FormDataType;
      error?: never;
    }
  | {
      lastInvocationStatus: "success";
      persistedRecord?: never;
      error?: never;
    }
  | {
      lastInvocationStatus: "error";
      persistedRecord?: never;
      error: KdnkActionError<FormDataType>;
    };

export type KdnkActionError<FormDataType> = {
  rootError?: string;
  fieldErrors?: { [F in keyof FormDataType]?: string };
};

export type KdnkFormContextType = {
  formMode: "view-readonly" | "view-editable" | "edit";
  isActionPending: boolean;
};

export type KdnkFormState = {
  formRef: Object;
  validate: () => Promise<boolean>;
  submit: () => void;
  lastActionStatus: KdnkActionState<any>["lastInvocationStatus"];
  actionPending: boolean;
};

export type KdnkFormHandle = {
  validate: () => Promise<boolean>;
  submit: () => void;
};

export type KdnkFormTypes<
  SchemaType extends ZodType<any, any, any>,
  ContextType = never,
> = {
  FormData: z.infer<SchemaType>;
  ActionState: KdnkActionState<z.infer<SchemaType>>;
  FormProps: [ContextType] extends [never]
    ? Omit<FormProps<z.infer<SchemaType>>, "content">
    : Omit<FormPropsWithContext<z.infer<SchemaType>, ContextType>, "content">;
  RenderProps: [ContextType] extends [never]
    ? Omit<RenderProps<z.infer<SchemaType>>, "content">
    : Omit<RenderPropsWithContext<z.infer<SchemaType>, ContextType>, "content">;
};
