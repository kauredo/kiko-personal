import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, children, className, fullHeight }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          "relative w-full px-6 md:px-12 lg:px-24",
          fullHeight && "min-h-screen",
          className,
        )}
      >
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";
