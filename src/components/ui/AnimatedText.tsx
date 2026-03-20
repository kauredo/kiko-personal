import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ANIMATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({
  children,
  className,
  delay = 0,
}: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const lines = children.split("\n").filter(Boolean);
    el.innerHTML = lines
      .map(
        (line) =>
          `<span class="block overflow-hidden"><span class="block anim-line" style="transform: translateY(100%); opacity: 0">${line}</span></span>`,
      )
      .join("");

    const lineEls = el.querySelectorAll(".anim-line");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        toggleActions: "play none none none",
      },
      delay,
    });

    tl.to(lineEls, {
      y: 0,
      opacity: 1,
      duration: ANIMATION.duration.normal,
      ease: ANIMATION.ease.smooth,
      stagger: ANIMATION.stagger.normal,
    });

    return () => {
      tl.kill();
      el.textContent = children;
    };
  }, [children, delay, prefersReducedMotion]);

  return (
    <p ref={ref} className={cn("text-lg leading-relaxed", className)}>
      {children}
    </p>
  );
}
