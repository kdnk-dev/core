import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "ktw-inline-flex ktw-items-center ktw-justify-center ktw-gap-2 ktw-whitespace-nowrap ktw-rounded-md ktw-text-sm ktw-font-medium ktw-ring-offset-background ktw-transition-colors focus-visible:ktw-outline-none focus-visible:ktw-ring-2 focus-visible:ktw-ring-ring focus-visible:ktw-ring-offset-2 disabled:ktw-pointer-events-none disabled:ktw-opacity-50 [&_svg]:ktw-pointer-events-none [&_svg]:ktw-size-4 [&_svg]:ktw-shrink-0",
  {
    variants: {
      variant: {
        default:
          "ktw-bg-primary ktw-text-primary-foreground hover:ktw-bg-primary/90",
        destructive:
          "ktw-bg-destructive ktw-text-destructive-foreground hover:ktw-bg-destructive/90",
        outline:
          "ktw-border ktw-border-input ktw-bg-background hover:ktw-bg-accent hover:ktw-text-accent-foreground",
        secondary:
          "ktw-bg-secondary ktw-text-secondary-foreground hover:ktw-bg-secondary/80",
        ghost: "hover:ktw-bg-accent hover:ktw-text-accent-foreground",
        link: "ktw-text-primary ktw-underline-offset-4 hover:ktw-underline",
      },
      size: {
        default: "ktw-h-10 ktw-px-4 ktw-py-2",
        sm: "ktw-h-9 ktw-rounded-md ktw-px-3",
        lg: "ktw-h-11 ktw-rounded-md ktw-px-8",
        icon: "ktw-h-10 ktw-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
