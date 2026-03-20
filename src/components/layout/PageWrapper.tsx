import type { ReactNode } from "react";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GrainOverlay } from "@/components/ui/GrainOverlay";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      {children}
    </>
  );
}
