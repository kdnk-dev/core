"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "ktw-flex ktw-h-10 ktw-w-full ktw-items-center ktw-justify-between ktw-rounded-md ktw-border ktw-border-input ktw-bg-background ktw-px-3 ktw-py-2 ktw-text-sm ktw-ring-offset-background placeholder:ktw-text-muted-foreground focus:ktw-outline-none focus:ktw-ring-2 focus:ktw-ring-ring focus:ktw-ring-offset-2 disabled:ktw-cursor-not-allowed disabled:ktw-opacity-50 [&>span]:ktw-line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="ktw-h-4 ktw-w-4 ktw-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "ktw-flex ktw-cursor-default ktw-items-center ktw-justify-center ktw-py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="ktw-h-4 ktw-w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "ktw-flex ktw-cursor-default ktw-items-center ktw-justify-center ktw-py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="ktw-h-4 ktw-w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "ktw-relative ktw-z-50 ktw-max-h-96 ktw-min-w-[8rem] ktw-overflow-hidden ktw-rounded-md ktw-border ktw-bg-popover ktw-text-popover-foreground ktw-shadow-md data-[state=open]:ktw-animate-in data-[state=closed]:ktw-animate-out data-[state=closed]:ktw-fade-out-0 data-[state=open]:ktw-fade-in-0 data-[state=closed]:ktw-zoom-out-95 data-[state=open]:ktw-zoom-in-95 data-[side=bottom]:ktw-slide-in-from-top-2 data-[side=left]:ktw-slide-in-from-right-2 data-[side=right]:ktw-slide-in-from-left-2 data-[side=top]:ktw-slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:ktw-translate-y-1 data-[side=left]:ktw--translate-x-1 data-[side=right]:ktw-translate-x-1 data-[side=top]:ktw--translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "ktw-p-1",
          position === "popper" &&
            "ktw-h-[var(--radix-select-trigger-height)] ktw-w-full ktw-min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("ktw-py-1.5 ktw-pl-8 ktw-pr-2 ktw-text-sm ktw-font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "ktw-relative ktw-flex ktw-w-full ktw-cursor-default ktw-select-none ktw-items-center ktw-rounded-sm ktw-py-1.5 ktw-pl-8 ktw-pr-2 ktw-text-sm ktw-outline-none focus:ktw-bg-accent focus:ktw-text-accent-foreground data-[disabled]:ktw-pointer-events-none data-[disabled]:ktw-opacity-50",
      className
    )}
    {...props}
  >
    <span className="ktw-absolute ktw-left-2 ktw-flex ktw-h-3.5 ktw-w-3.5 ktw-items-center ktw-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="ktw-h-4 ktw-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("ktw--mx-1 ktw-my-1 ktw-h-px ktw-bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
