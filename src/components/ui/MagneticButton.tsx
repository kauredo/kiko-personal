import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
  variant?: "primary" | "outline" | "ghost";
}

export function MagneticButton({
  children,
  strength = 0.3,
  variant = "primary",
  className,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useMagneticButton(ref, strength);

  return (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium transition-colors duration-300",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground",
        variant === "outline" &&
          "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        variant === "ghost" &&
          "text-foreground hover:text-primary",
        className,
      )}
      style={{ borderRadius: "var(--radius)" }}
      {...props}
    >
      {children}
    </button>
  );
}
