import { ZodType } from "zod";
import {
  FunctionComponent,
  startTransition,
  useActionState,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DefaultValues, FieldValues, Path, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { KdnkActionState } from "@/form/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { KdnkFormContext } from "@/form/context";
import { FormProps } from "@/form/types-internal";

export function buildKdnkForm<
  SchemaType extends ZodType<any, any, any>,
  FormDataType extends FieldValues,
>(
  schema: SchemaType,
  submitAction:
    | ((
        formData: FormDataType,
        prevState: KdnkActionState<FormDataType>,
      ) => Promise<KdnkActionState<FormDataType>>)
    | ((formData: FormDataType) => Promise<KdnkActionState<FormDataType>>),
): FunctionComponent<FormProps<FormDataType>> {
  return ({
    data,
    onRecordSaved,
    onActionSucceeded,
    formGroup,
    content,
    handle,
  }: FormProps<FormDataType>) => {
    const formId = useId();

    const formHtmlElement = useRef<HTMLFormElement>(null);

    const form = useForm<FormDataType>({
      resolver: zodResolver(schema),
      defaultValues: (data
        ? (data.existingRecord ?? data.newRecordDefaults)
        : {}) as DefaultValues<FormDataType>,
    });

    useImperativeHandle(handle, () => {
      return {
        validate: () => form.trigger(),
        submit: () => formHtmlElement.current?.requestSubmit(),
      };
    }, [form, formHtmlElement]);

    const [state, formAction, isPending] = useActionState<
      KdnkActionState<FormDataType>,
      FormDataType
    >(
      (prevState: KdnkActionState<FormDataType>, formData: FormDataType) =>
        submitAction(formData, prevState),
      {
        lastInvocationStatus: "none",
        persistedRecord: data ? data.existingRecord : undefined,
      },
    );

    useEffect(() => {
      if (formGroup && formGroup) {
        formGroup.update({
          formRef: form,
          submit: () => formHtmlElement.current?.requestSubmit(),
          validate: () => form.trigger(),
          lastActionStatus: state.lastInvocationStatus,
          actionPending: isPending,
        });

        return () => formGroup.remove(form);
      }
    }, [formId, formHtmlElement, form, state, isPending]);

    const [formMode, setFormMode] = useState(
      data?.existingRecordInitialState ?? "edit",
    );

    useEffect(() => {
      if (state.lastInvocationStatus === "success-record-saved") {
        if (onRecordSaved) onRecordSaved(state.persistedRecord);
        if (onActionSucceeded) onActionSucceeded(form.getValues());
        formHtmlElement.current?.reset();
        form.reset(state.persistedRecord);
        setFormMode("view-editable");
      } else if (state.lastInvocationStatus === "success") {
        if (onActionSucceeded) onActionSucceeded(form.getValues());
      } else if (state.lastInvocationStatus === "error") {
        if (state.error.rootError) {
          form.setError("root", {
            message: state.error.rootError,
          });
        }

        if (state.error.fieldErrors) {
          Object.entries(state.error.fieldErrors).forEach(
            ([fieldName, errorMsg]) => {
              form.setError(fieldName as Path<FormDataType>, {
                message: errorMsg as string,
              });
            },
          );
        }
      } else if (state.lastInvocationStatus !== "none") {
        form.setError("root", {
          message: "Unexpected response from Server Action",
        });
      }
    }, [state]);

    const Content = content;

    return (
      <Form {...form}>
        <KdnkFormContext.Provider
          value={{ isActionPending: isPending, formMode: formMode }}
        >
          <form
            ref={formHtmlElement}
            onSubmit={form.handleSubmit(
              (formData: FormDataType) => {
                // TODO: Only send dirty fields.
                console.log(form.formState.dirtyFields);
                startTransition(() => formAction(formData));
              },
              (error) => console.log(error),
            )}
          >
            <Content
              form={form}
              displayMode={formMode}
              startEdit={() => setFormMode("edit")}
              isActionPending={isPending}
              actionLastInvocationStatus={
                state.lastInvocationStatus === "none"
                  ? "none"
                  : state.lastInvocationStatus === "error"
                    ? "error"
                    : "success"
              }
            />

            {form.formState.errors.root && (
              <div>{form.formState.errors.root.message}</div>
            )}
          </form>
        </KdnkFormContext.Provider>
      </Form>
    );
  };
}
