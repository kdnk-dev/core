import { useRef, useState } from "react";
import { KdnkFormState } from "@/form/types";
import { FormGroup, FormGroupActionStatus } from "@/group/types";

export function useFormGroup(): {
  formGroup: FormGroup;
  submitPending: boolean;
  lastActionStatus: FormGroupActionStatus;
  getFormCount: () => number;
  submitAll: () => void;
  validateAll: () => Promise<boolean>;
} {
  const forms = useRef<KdnkFormState[]>([]);
  const [submitPending, setSubmitPending] = useState<boolean>(false);
  const [lastActionStatus, setLastActionStatus] =
    useState<FormGroupActionStatus>({ status: "none" });

  // Today Louis spent way too long trying to do this in a less brittle/ugly way, hopefully Future Louis will have
  // better luck one day.
  const formGroup = {
    update: (form: KdnkFormState) => {
      forms.current = [
        ...forms.current.filter((f) => f.formRef !== form.formRef),
        form,
      ];

      // State is a primitive so will not trigger a re-render if the value has not changed.
      setSubmitPending(
        forms.current
          .map((form) => form.actionPending)
          .some((pending) => pending),
      );

      const updatedStatus: FormGroupActionStatus =
        new Set(forms.current.map((form) => form.lastActionStatus)).size == 1
          ? { status: forms.current[0].lastActionStatus }
          : {
              status: "mixed",
              mixedStatus: forms.current.map(
                (form) => form.lastActionStatus ?? "none",
              ),
            };

      setLastActionStatus((prev) =>
        // Need to check deep equality to avoid triggering an unnecessary & problematic re-render when forms initially
        // register.
        JSON.stringify(updatedStatus) === JSON.stringify(prev)
          ? prev
          : updatedStatus,
      );
    },
    remove: (formRef: Object) => {
      forms.current = [...forms.current.filter((f) => f.formRef !== formRef)];
    },
  };

  const getFormCount = () => forms.current.length;

  const submitAll = async () => {
    if (submitPending) {
      throw Error("Submit already pending");
    }

    if (!(await validateAll())) {
      return { status: "error" };
    }

    forms.current.forEach((form) => form?.submit());
  };

  const validateAll = async () => {
    return (
      await Promise.all(forms.current.map((form) => form.validate()))
    ).every((result) => result);
  };

  return {
    formGroup,
    submitPending,
    lastActionStatus,
    getFormCount,
    submitAll,
    validateAll,
  };
}
