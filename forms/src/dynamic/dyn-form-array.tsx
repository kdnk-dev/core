import { KdnkFormTypes } from "@/form/types";
import { buildZodSchemaForForm } from "@/dynamic/builders-def-to-zod";
import { ReactNode } from "react";
import { FormArray } from "@/array/form-array";
import { Button } from "@/components/ui/button";
import { kdnkDynamicForm } from "@/dynamic/dyn-form";
import { ArrayPropsType, BaseDynamicFormDefinitionT } from "@/dynamic/types";
import { KActionState, KFormData, KFormProps } from "@/utils/type-helpers";
import { kdnkForm } from "@/form/kdnk-form";

export const kdnkDynamicFormArray = <
  SchemaType extends BaseDynamicFormDefinitionT,
>(
  formDefinition: SchemaType,
) => {
  const { Schema } = kdnkForm(buildZodSchemaForForm(formDefinition));
  type FormTypes = KdnkFormTypes<typeof Schema>;

  return {
    withSubmitAction: (
      action: (
        formData: KFormData<FormTypes>,
      ) => Promise<KActionState<FormTypes>>,
    ): {
      DynamicFormArray: (props: ArrayPropsType<FormTypes>) => ReactNode;
      ArrayPropsType: ArrayPropsType<FormTypes>;
      Schema: typeof Schema;
    } => {
      const { DynamicFormComponent, DynamicFormContents } =
        kdnkDynamicForm(formDefinition).withSubmitAction(action);

      const Form = (props: Omit<KFormProps<FormTypes>, "ref">) => (
        <DynamicFormComponent {...props} content={DynamicFormContents} />
      );

      return {
        DynamicFormArray: (props: ArrayPropsType<FormTypes>) => {
          const formArrayConfig = formDefinition.formArray!;

          return (
            <FormArray
              {...props}
              Form={Form}
              AddNewRecordButton={
                <Button type={"button"}>
                  {formArrayConfig.addRecordButtonText}
                </Button>
              }
              disableAddRecordButton={formArrayConfig.addRecordButtonHideMode}
              maxTotalRecords={formArrayConfig.maxNewRecords}
              newRecordInitialCount={
                props.newRecordInitialCount ??
                formArrayConfig.newRecordInitialCount
              }
              existingRecordInitialState={
                formArrayConfig.existingRecordsInitialState
              }
              existingRecordsOrderBy={formArrayConfig.orderByColumn}
            />
          );
        },
        ArrayPropsType: {} as ArrayPropsType<FormTypes>,
        Schema,
      };
    },
  };
};
