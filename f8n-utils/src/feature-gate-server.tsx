import React from "react";
import { FeatureGate } from "@/feature-gate";

export const FeatureGateSrv = async <ContextType,>({
  getContext,
  predicates,
  children,
}: {
  getContext: () => Promise<ContextType>;
  predicates: ((ctx: ContextType) => boolean)[];
  children: React.JSX.Element | React.JSX.Element[];
}): Promise<React.JSX.Element> => {
  const context = await getContext();
  return (
    <FeatureGate context={context} predicates={predicates}>
      {children}
    </FeatureGate>
  );
};
