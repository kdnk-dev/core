"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "ktw-peer ktw-h-4 ktw-w-4 ktw-shrink-0 ktw-rounded-sm ktw-border ktw-border-primary ktw-ring-offset-background focus-visible:ktw-outline-none focus-visible:ktw-ring-2 focus-visible:ktw-ring-ring focus-visible:ktw-ring-offset-2 disabled:ktw-cursor-not-allowed disabled:ktw-opacity-50 data-[state=checked]:ktw-bg-primary data-[state=checked]:ktw-text-primary-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "ktw-flex ktw-items-center ktw-justify-center ktw-text-current",
      )}
    >
      <Check className="ktw-h-4 ktw-w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
