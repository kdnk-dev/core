import { KdnkFormState } from "@/form/types";

export type FormGroup = {
  update: (form: KdnkFormState) => void;
  remove: (formRef: Object) => void;
};

export type FormGroupActionStatus =
  | {
      status: "none" | "success-record-saved" | "success" | "error";
      mixedStatus?: never;
    }
  | {
      status: "mixed";
      mixedStatus: ("none" | "success-record-saved" | "success" | "error")[];
    };
