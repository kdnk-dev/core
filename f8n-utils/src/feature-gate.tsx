import React from "react";

export function FeatureGate<ContextType>({
  context,
  predicates,
  children,
}: {
  context: ContextType | null;
  predicates: ((ctx: ContextType) => boolean)[];
  children: React.JSX.Element | React.JSX.Element[];
}): React.JSX.Element {
  const shouldDisplay = context && predicates.some((pred) => pred(context));
  if (shouldDisplay) {
    return <>{children}</>;
  } else {
    return <></>;
  }
}
