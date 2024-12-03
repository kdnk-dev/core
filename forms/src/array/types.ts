import { FunctionComponent, ReactNode } from "react";
import { KdnkFormTypes } from "@/form/types";
import { DefaultValues } from "react-hook-form";
import { FormGroup, FormGroupActionStatus } from "@/group/types";
import { KFormData, KFormProps } from "@/utils/type-helpers";

export interface FormArrayProps<FormType extends KdnkFormTypes<any>> {
  Form: FunctionComponent<KFormProps<FormType>>;
  AddNewRecordButton: ReactNode;
  formGroup: FormGroup;
  existingRecords: KFormData<FormType>[];
  existingRecordInitialState: "edit" | "view-editable" | "view-readonly";
  existingRecordsOrderBy: keyof KFormData<FormType>;
  newRecordDefaults: DefaultValues<KFormData<FormType>>;
  maxTotalRecords?: number;
  newRecordInitialCount?: number;
  disableAddRecordButton?: "disable" | "invisible" | "remove";
}

export type FormArrayRenderProps = {
  FormArray: () => ReactNode;
  submitAll: () => void;
  isActionPending: boolean;
  actionLastInvocationStatus: FormGroupActionStatus;
};
