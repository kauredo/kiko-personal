import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { Section } from "@/components/layout/Section";
import { HeroScene } from "@/components/three/HeroScene";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLenis } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SECTION_IDS, ANIMATION } from "@/lib/constants";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const nameEl = nameRef.current;
    const roleEl = roleRef.current;
    const ctaEl = ctaRef.current;
    const lineEl = lineRef.current;
    if (!nameEl || !roleEl || !ctaEl || !lineEl) return;

    gsap.set([nameEl, roleEl, ctaEl], { opacity: 0 });
    gsap.set(lineEl, { scaleX: 0 });

    const tl = gsap.timeline({ delay: 0.4 });

    tl.fromTo(
      nameEl,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: ANIMATION.ease.expo },
    )
      .to(lineEl, { scaleX: 1, duration: 0.8, ease: ANIMATION.ease.expo }, "-=0.6")
      .fromTo(
        roleEl,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: ANIMATION.ease.smooth },
        "-=0.4",
      )
      .fromTo(
        ctaEl,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: ANIMATION.ease.smooth },
        "-=0.2",
      );

    gsap.to(containerRef.current, {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: `#${SECTION_IDS.hero}`,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => { tl.kill(); };
  }, [prefersReducedMotion]);

  return (
    <Section
      id={SECTION_IDS.hero}
      fullHeight
      className="flex items-center justify-center"
    >
      <HeroScene />

      <div ref={containerRef} className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl">
          {/* Name — fills width, adapts to theme font/style/weight via CSS */}
          <h1
            ref={nameRef}
            className="mb-2"
            style={{
              fontSize: "clamp(4rem, 13vw, 12rem)",
              lineHeight: 0.92,
              textShadow: "var(--text-shadow-glow)",
              textAlign: "var(--hero-align)" as "left" | "center",
            }}
          >
            <span className="block">Francisco</span>
            <span className="block text-primary">Catarro</span>
          </h1>

          {/* Divider line */}
          <div
            ref={lineRef}
            className="my-5 h-[2px] origin-left bg-primary/50 md:my-6"
            style={{
              maxWidth: "8rem",
              marginInline: "var(--hero-align)" === "center" ? "auto" : undefined,
            }}
          />

          {/* Role + CTA row */}
          <div
            className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
            style={{
              justifyContent:
                "var(--hero-align)" === "center" ? "center" : undefined,
              textAlign: "var(--hero-align)" as "left" | "center",
            }}
          >
            <p
              ref={roleRef}
              className="text-sm text-muted-foreground md:text-base"
              style={{ letterSpacing: "var(--label-tracking)" }}
            >
              GUITAR &middot; KEYS &middot; MUSICAL DIRECTION &middot; PRODUCTION
            </p>

            <div ref={ctaRef}>
              <MagneticButton
                variant="outline"
                onClick={() =>
                  lenis?.scrollTo(`#${SECTION_IDS.contact}`, { offset: -80, duration: 1.5 })
                }
              >
                Work with me
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
