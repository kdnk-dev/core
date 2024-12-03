import { KdnkFormTypes } from "@/form/types";
import { KActionState, KFormData } from "@/utils/type-helpers";

export const kdSimpleSubmitAction =
  <ParentFormT extends KdnkFormTypes<any>>(
    simpleAction: (formData: KFormData<ParentFormT>) => void,
  ) =>
  async (
    formData: KFormData<ParentFormT>,
  ): Promise<KActionState<ParentFormT>> => {
    simpleAction(formData);
    return {
      lastInvocationStatus: "success",
    };
  };

export const kdDummySubmitAction = <ParentFormT extends KdnkFormTypes<any>>(
  respondWith: "success-no-op" | "never-invoked" = "never-invoked",
) =>
  respondWith === "success-no-op"
    ? async (
        _formData: KFormData<ParentFormT>,
      ): Promise<KActionState<ParentFormT>> => ({
        lastInvocationStatus: "success",
      })
    : async (
        _formData: KFormData<ParentFormT>,
      ): Promise<KActionState<ParentFormT>> => ({
        lastInvocationStatus: "error",
        error: { rootError: "Action should never be invoked" },
      });
