import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "ktw-flex ktw-h-10 ktw-w-full ktw-rounded-md ktw-border ktw-border-input ktw-bg-background ktw-px-3 ktw-py-2 ktw-text-base ktw-ring-offset-background file:ktw-border-0 file:ktw-bg-transparent file:ktw-text-sm file:ktw-font-medium file:ktw-text-foreground placeholder:ktw-text-muted-foreground focus-visible:ktw-outline-none focus-visible:ktw-ring-2 focus-visible:ktw-ring-ring focus-visible:ktw-ring-offset-2 disabled:ktw-cursor-not-allowed disabled:ktw-opacity-50 md:ktw-text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
