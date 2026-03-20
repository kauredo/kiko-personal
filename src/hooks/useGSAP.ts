import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useGSAP(
  callback: () => void,
  deps: unknown[],
  scope?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const ctx = gsap.context(callback, scope?.current ?? undefined);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
