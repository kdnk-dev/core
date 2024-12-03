import { createContext } from "react";
import { KdnkFormContextType } from "@/form/types";

export const KdnkFormContext = createContext<KdnkFormContextType>(
  {} as KdnkFormContextType,
);
