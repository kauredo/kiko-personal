import { useRef } from "react";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { useGSAP } from "@/hooks/useGSAP";
import { SECTION_IDS, ANIMATION } from "@/lib/constants";
import { gsap } from "@/lib/gsap";

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const texts = sectionRef.current.querySelectorAll(".about-text");
      texts.forEach((t) => {
        gsap.from(t, {
          y: 30,
          opacity: 0,
          duration: ANIMATION.duration.normal,
          ease: ANIMATION.ease.smooth,
          scrollTrigger: { trigger: t, start: "top 85%" },
        });
      });
    },
    [],
    sectionRef,
  );

  return (
    <Section
      id={SECTION_IDS.about}
      className="border-t border-border/30"
      style={{ paddingBlock: "var(--section-gap)" } as React.CSSProperties}
    >
      <div ref={sectionRef} className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-8 md:grid-cols-[1fr_1.5fr] md:gap-16">
          <div>
            <p
              className="mb-4 text-xs uppercase text-primary/70"
              style={{ letterSpacing: "var(--label-tracking)" }}
            >
              About
            </p>
            <SplitHeading
              as="h2"
              className="text-3xl md:text-5xl"
            >
              Rooted in rock. Shaped by soul.
            </SplitHeading>
          </div>

          <div className="flex flex-col justify-end gap-6">
            <p className="about-text leading-relaxed text-foreground md:text-lg">
              Francisco Catarro is a guitarist, pianist, musical director, and
              producer whose playing carries the raw energy of a live stage and
              the precision of years behind the keys.
            </p>
            <p className="about-text leading-relaxed text-muted-foreground">
              From rock clubs to symphony halls, from the studio console to
              center stage — he doesn't just show up, he transforms the room.
              That's why people keep calling him back.
            </p>
          </div>
        </div>

        {/* Image placeholder — full width for visual impact */}
        <div
          className="aspect-[21/9] w-full overflow-hidden bg-card"
          style={{
            borderRadius: "var(--radius)",
            border: "var(--card-border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
            <span
              className="text-xs uppercase"
              style={{ letterSpacing: "var(--label-tracking)" }}
            >
              Featured Photo
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
