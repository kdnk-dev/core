"use client";

import React, {
  Context,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { FeatureGate } from "@/feature-gate";

export function FeatureGateCtxProvider<ContextType>({
  reactContext,
  contextProvider,
  children,
}: PropsWithChildren<{
  reactContext: Context<ContextType | null>;
  contextProvider: (setContextFn: (context: ContextType) => void) => void;
}>) {
  const [context, setContext] = useState<ContextType | null>(null);

  useEffect(() => {
    contextProvider(setContext);
  }, []);

  return (
    <reactContext.Provider value={context}>{children}</reactContext.Provider>
  );
}

export function FeatureGateCtx<ContextType>({
  context,
  predicates,
  children,
}: {
  context: Context<ContextType>;
  predicates: ((ctx: ContextType) => boolean)[];
  children: React.JSX.Element | React.JSX.Element[];
}) {
  const featureGateContext = useContext(context);
  return (
    <FeatureGate context={featureGateContext} predicates={predicates}>
      {children}
    </FeatureGate>
  );
}
