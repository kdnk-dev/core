import { KdnkFormTypes } from "@/form/types";

// Syntactic sugar because Louis doesn't like the way the subtype indexing looks.
export type KActionState<Types extends KdnkFormTypes<any>> =
  Types["ActionState"];
export type KFormData<Types extends KdnkFormTypes<any>> = Types["FormData"];
export type KFormProps<Types extends KdnkFormTypes<any>> = Types["FormProps"];
export type KRenderProps<Types extends KdnkFormTypes<any>> =
  Types["RenderProps"];
