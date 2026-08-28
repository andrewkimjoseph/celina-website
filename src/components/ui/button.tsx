import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[2px] text-sm font-medium cursor-pointer transition-[transform,box-shadow,background-color,color] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-2 border-foreground bg-primary text-primary-foreground shadow-[var(--shadow-brutal-sm)] hover:bg-primary/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        destructive:
          "border-2 border-foreground bg-destructive text-destructive-foreground shadow-[var(--shadow-brutal-sm)] hover:bg-destructive/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        outline:
          "border-2 border-foreground bg-background shadow-[var(--shadow-brutal-sm)] hover:bg-accent hover:text-accent-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        secondary:
          "border-2 border-foreground bg-secondary text-secondary-foreground shadow-[var(--shadow-brutal-sm)] hover:bg-secondary/80 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[2px] px-3 text-xs",
        lg: "h-10 rounded-[2px] px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
