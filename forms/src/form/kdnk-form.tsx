import { z, ZodRawShape } from "zod";
import { FieldValues } from "react-hook-form";
import { KdnkActionState } from "@/form/types";
import {
  FormProps,
  FormPropsWithContext,
  RenderProps,
  RenderPropsWithContext,
} from "@/form/types-internal";
import { FunctionComponent } from "react";
import { buildKdnkForm } from "@/form/form-component";

export const kdnkForm = <Schema extends ZodRawShape>(schema: Schema) => ({
  Form: () => kdnkFormForSchema(schema),
  Schema: z.object(schema),
});

const kdnkFormForSchema = <FormSchemaType extends ZodRawShape>(
  formSchema: FormSchemaType,
) => ({
  withSubmitAction: <FormDataType extends FieldValues>(
    submitAction:
      | ((
          formData: FormDataType,
          prevState: KdnkActionState<FormDataType>,
        ) => Promise<KdnkActionState<FormDataType>>)
      | ((formData: FormDataType) => Promise<KdnkActionState<FormDataType>>),
  ) => {
    const schemaInternal = z.object(formSchema);
    const FormComponentInternal: FunctionComponent<FormProps<FormDataType>> =
      buildKdnkForm(schemaInternal, submitAction);

    return {
      asComponent: () => FormComponentInternal,
      withChildComponent:
        (
          ChildComponent: FunctionComponent<RenderProps<FormDataType>>,
        ): FunctionComponent<Omit<FormProps<FormDataType>, "content">> =>
        (props: Omit<FormProps<FormDataType>, "content">) => (
          <FormComponentInternal {...props} content={ChildComponent} />
        ),
    };
  },

  withContextType: <ContextType = never,>() => ({
    withSubmitAction: <FormDataType extends FieldValues>(
      submitAction:
        | ((
            formData: FormDataType,
            prevState: KdnkActionState<FormDataType>,
          ) => Promise<KdnkActionState<FormDataType>>)
        | ((formData: FormDataType) => Promise<KdnkActionState<FormDataType>>),
    ) => {
      const schemaInternal = z.object(formSchema);

      const FormComponent: FunctionComponent<FormProps<FormDataType>> =
        buildKdnkForm(schemaInternal, submitAction);

      const FormComponentWithContext: FunctionComponent<
        FormPropsWithContext<FormDataType, ContextType>
      > = (
        propsWithContext: FormPropsWithContext<FormDataType, ContextType>,
      ) => {
        const Content = propsWithContext.content;
        return (
          <FormComponent
            {...propsWithContext}
            content={(renderProps: RenderProps<FormDataType>) => (
              <Content {...renderProps} context={propsWithContext.context} />
            )}
          />
        );
      };

      return {
        asComponent: FormComponentWithContext,
        withChildComponent:
          (
            ChildComponent: FunctionComponent<
              RenderPropsWithContext<FormDataType, ContextType>
            >,
          ) =>
          (
            props: Omit<
              FormPropsWithContext<FormDataType, ContextType>,
              "content"
            >,
          ) => <FormComponentWithContext {...props} content={ChildComponent} />,
      };
    },
  }),
});
