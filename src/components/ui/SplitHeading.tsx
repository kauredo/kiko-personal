import { useRef, useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ANIMATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SplitHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
}

export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  triggerOnScroll = true,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const text = el.textContent || "";
    const words = text.split(" ");
    el.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block overflow-hidden"><span class="inline-block split-word" style="transform: translateY(100%); opacity: 0">${word}</span></span>`,
      )
      .join(
        '<span class="inline-block">&nbsp;</span>',
      );

    const wordEls = el.querySelectorAll(".split-word");

    const trigger: ScrollTrigger.Vars | undefined = triggerOnScroll
      ? { trigger: el, start: "top 80%", toggleActions: "play none none none" }
      : undefined;

    const tl = gsap.timeline({ scrollTrigger: trigger, delay });

    tl.to(wordEls, {
      y: 0,
      opacity: 1,
      duration: ANIMATION.duration.normal,
      ease: ANIMATION.ease.smooth,
      stagger: ANIMATION.stagger.fast,
    });

    return () => {
      tl.kill();
      if (trigger) ScrollTrigger.refresh();
      el.textContent = text;
    };
  }, [children, delay, triggerOnScroll, prefersReducedMotion]);

  return (
    <Tag ref={ref} className={cn("leading-tight", className)}>
      {children}
    </Tag>
  );
}
