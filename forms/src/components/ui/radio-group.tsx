"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("ktw-grid ktw-gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "ktw-aspect-square ktw-h-4 ktw-w-4 ktw-rounded-full ktw-border ktw-border-primary ktw-text-primary ktw-ring-offset-background focus:ktw-outline-none focus-visible:ktw-ring-2 focus-visible:ktw-ring-ring focus-visible:ktw-ring-offset-2 disabled:ktw-cursor-not-allowed disabled:ktw-opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="ktw-flex ktw-items-center ktw-justify-center">
        <Circle className="ktw-h-2.5 ktw-w-2.5 ktw-fill-current ktw-text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
