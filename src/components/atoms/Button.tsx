import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-400 text-neutral-50 shadow hover:bg-primary-500 focus-visible:ring-primary-400",
        destructive:
          "bg-error text-neutral-50 shadow-sm hover:bg-error/90 focus-visible:ring-error",
        outline:
          "border border-neutral-300 bg-background shadow-sm hover:bg-neutral-100 focus-visible:ring-primary-400",
        secondary:
          "bg-secondary-300 text-neutral-900 shadow-sm hover:bg-secondary-400 focus-visible:ring-secondary-400",
        ghost:
          "bg-transparent hover:bg-neutral-100 text-foreground focus-visible:ring-primary-400",
        link: "text-primary-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9 p-0",
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
        className={cn(buttonVariants({ variant, size, class: className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
