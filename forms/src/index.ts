import "./index.css";

export { KdnkFormContext } from "@/form/context";

export { kdnkForm } from "@/form/kdnk-form";
export type {
  KdnkFormTypes,
  KdnkFormHandle,
  KdnkActionState,
  KdnkActionError,
  KdnkFormState,
  KdnkFormContextType,
} from "@/form/types";
export type {
  KActionState,
  KFormData,
  KFormProps,
  KRenderProps,
} from "@/utils/type-helpers";

export { kdnkDynamicForm, buildDynamicFormContents } from "@/dynamic/dyn-form";
export { kdnkDynamicFormArray } from "@/dynamic/dyn-form-array";
export {
  BaseDynamicFormDefinition,
  BaseDynamicFieldDefinition,
} from "@/dynamic/types";
export type {
  BaseDynamicFormDefinitionT,
  BaseDynamicFieldDefinitionT,
  DynamicFormDatabaseDefinitionT,
} from "@/dynamic/types";

export { useFormGroup } from "@/group/use-form-group";
export type { FormGroupActionStatus, FormGroup } from "@/group/types";

export { FormArray } from "@/array/form-array";
export type { FormArrayRenderProps } from "@/array/types";

export { KdSubmitButton } from "@/controls/submit-button";

export { KdFormField } from "@/fields/form-field";
export {
  KdInputField,
  KdTextArray,
  KdSelectField,
  KdRadioGroup,
  KdBooleanRadioGroup,
  KdCheckBox,
  KdCheckBoxGroup,
} from "@/fields/input-fields";

export {
  kdSimpleSubmitAction,
  kdDummySubmitAction,
} from "@/utils/submit-action-helpers";

export {
  KdEditableViewModeOnly,
  KdReadOnlyViewModeOnly,
  KdEditModeOnly,
  KdViewModeOnly,
} from "@/fields/visibility-helpers";
