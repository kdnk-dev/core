import { useMemo, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid/non-secure";
import { FormArrayProps } from "@/array/types";
import { KdnkFormTypes } from "@/form/types";
import { KFormData } from "@/utils/type-helpers";

export function FormArray<FormType extends KdnkFormTypes<any>>({
  Form,
  AddNewRecordButton,
  formGroup,
  existingRecords,
  existingRecordInitialState,
  existingRecordsOrderBy,
  newRecordDefaults,
  maxTotalRecords,
  newRecordInitialCount,
  disableAddRecordButton,
}: FormArrayProps<FormType>) {
  const [initialExistingRecords] =
    useState<KFormData<FormType>[]>(existingRecords);
  const [newRecords, setNewRecords] = useState<string[]>(
    [...Array(newRecordInitialCount).keys()].map(() => nanoid()),
  );

  const canAddRecord = useMemo(
    () =>
      initialExistingRecords.length + newRecords.length <
      (maxTotalRecords ?? Number.POSITIVE_INFINITY),
    [initialExistingRecords, newRecords, maxTotalRecords],
  );

  const disableProp = useMemo(() => {
    switch (disableAddRecordButton) {
      case "invisible":
        return { className: canAddRecord ? "ktw-visible" : "ktw-invisible" };
      case "remove":
        return { className: canAddRecord ? "ktw-block" : "ktw-hidden" };
      case "disable":
      default:
        return { disabled: !canAddRecord };
    }
  }, [canAddRecord, disableAddRecordButton]);

  return (
    <div className={"ktw-flex ktw-flex-col ktw-gap-y-4"}>
      {[...initialExistingRecords]
        .sort((a, b) =>
          a[existingRecordsOrderBy] < b[existingRecordsOrderBy]
            ? -1
            : a[existingRecordsOrderBy] > b[existingRecordsOrderBy]
              ? 1
              : 0,
        )
        .map((record: KFormData<FormType>) => (
          <div key={JSON.stringify(record)}>
            <Form
              data={{
                existingRecord: record,
                existingRecordInitialState,
              }}
              formGroup={formGroup}
            />
            <Separator />
          </div>
        ))}

      {newRecords.map((key) => (
        <div key={`${key}`}>
          <Form
            data={{
              newRecordDefaults,
            }}
            formGroup={formGroup}
          />
          <Separator />
        </div>
      ))}

      <Slot
        onClick={() => {
          if (canAddRecord) setNewRecords((prev) => [...prev, nanoid()]);
        }}
        {...disableProp}
      >
        {AddNewRecordButton}
      </Slot>
    </div>
  );
}
