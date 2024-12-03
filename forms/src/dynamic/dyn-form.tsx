import { Fragment, FunctionComponent } from "react";
import { buildZodSchemaForForm } from "@/dynamic/builders-def-to-zod";
import { Form } from "@/components/ui/form";
import { KdnkFormContext } from "@/form/context";
import { KdnkFormTypes } from "@/form/types";
import { FormProps } from "@/form/types-internal";
import { BaseDynamicFormDefinitionT } from "@/dynamic/types";
import { KActionState, KFormData, KRenderProps } from "@/utils/type-helpers";
import { DynamicField } from "@/dynamic/dyn-field";
import { kdnkForm } from "@/form/kdnk-form";

export const kdnkDynamicForm = <SchemaType extends BaseDynamicFormDefinitionT>(
  formDefinition: SchemaType,
) => {
  const { Form: KdnkForm, Schema } = kdnkForm(
    buildZodSchemaForForm(formDefinition),
  );
  type FormTypes = KdnkFormTypes<typeof Schema>;

  return {
    withSubmitAction: (
      action: (
        formData: KFormData<FormTypes>,
      ) => Promise<KActionState<FormTypes>>,
    ): {
      DynamicFormComponent: FunctionComponent<FormProps<KFormData<FormTypes>>>;
      DynamicFormContents: FunctionComponent<
        Omit<KRenderProps<FormTypes>, "content">
      >;
      Schema: typeof Schema;
    } => {
      const DynamicFormComponent = KdnkForm()
        .withSubmitAction(action)
        .asComponent();
      const DynamicFormContents = buildDynamicFormContents(formDefinition);

      return {
        DynamicFormComponent: (props: FormProps<KFormData<FormTypes>>) => {
          const ChildComponent = props.content;
          return (
            <DynamicFormComponent
              {...props}
              content={(renderProps: KRenderProps<FormTypes>) => (
                <Form {...renderProps.form}>
                  <KdnkFormContext.Provider
                    value={{
                      isActionPending: renderProps.isActionPending,
                      formMode: renderProps.displayMode,
                    }}
                  >
                    <ChildComponent {...renderProps} />
                  </KdnkFormContext.Provider>
                </Form>
              )}
            />
          );
        },
        DynamicFormContents,
        Schema,
      };
    },
  };
};

export const buildDynamicFormContents =
  <FormSchemaTypes extends KdnkFormTypes<any>>(
    config: BaseDynamicFormDefinitionT,
  ): FunctionComponent<KRenderProps<FormSchemaTypes>> =>
  ({ form }: KRenderProps<FormSchemaTypes>) => {
    return (
      <>
        {Object.keys(config.formFields).map((fieldKey) => (
          <Fragment key={fieldKey}>
            <DynamicField
              form={form}
              name={fieldKey}
              hideIfMode={config.hideIfMode ?? "invisible"}
              config={
                config.formFields[
                  fieldKey as keyof (typeof config)["formFields"]
                ]!
              }
            />
          </Fragment>
        ))}
      </>
    );
  };
