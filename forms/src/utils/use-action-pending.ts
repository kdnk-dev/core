import { useEffect, useState } from "react";

export const useActionPending = <ActionStateType, FormDataType>(
  actionState: ActionStateType,
  formAction: (payload: FormDataType) => void,
): [boolean, (payload: FormDataType) => void] => {
  const [actionPending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [actionState]);

  const pendingFormAction = (payload: FormDataType) => {
    setPending(true);
    formAction(payload);
  };

  return [actionPending, pendingFormAction];
};
