import { useRef } from "react";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { useGSAP } from "@/hooks/useGSAP";
import { SECTION_IDS, ANIMATION } from "@/lib/constants";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  category: string;
}

const PLACEHOLDER_ENTRIES: TimelineEntry[] = [
  {
    id: "1",
    title: "Musical Director",
    organization: "National Tour Production",
    period: "2024 — Present",
    description:
      "Leading a 12-piece band across national venues, arranging and directing live performances.",
    category: "directing",
  },
  {
    id: "2",
    title: "Session Guitarist",
    organization: "Various Studios",
    period: "2021 — Present",
    description:
      "Recording guitar for rock, soul, and pop projects across multiple studios.",
    category: "performance",
  },
  {
    id: "3",
    title: "Producer & Arranger",
    organization: "Independent",
    period: "2020 — Present",
    description:
      "Producing and arranging tracks for emerging artists, blending genres from soul to electronic.",
    category: "producing",
  },
];

export function Resume() {
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!listRef.current) return;

      const entries = listRef.current.querySelectorAll(".resume-entry");
      entries.forEach((entry) => {
        gsap.from(entry, {
          y: 40,
          opacity: 0,
          duration: ANIMATION.duration.normal,
          ease: ANIMATION.ease.smooth,
          scrollTrigger: {
            trigger: entry,
            start: "top 85%",
          },
        });
      });
    },
    [],
    listRef,
  );

  return (
    <Section
      id={SECTION_IDS.resume}
      className="border-t border-border/30"
      style={{ paddingBlock: "var(--section-gap)" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-20">
          <p className="mb-3 text-xs uppercase text-primary/70" style={{ letterSpacing: "var(--label-tracking)" }}>
            Resume
          </p>
          <SplitHeading className="text-3xl md:text-5xl">
            The work so far
          </SplitHeading>
        </div>

        <div ref={listRef} className="space-y-0">
          {PLACEHOLDER_ENTRIES.map((entry, i) => (
            <div
              key={entry.id}
              className={cn(
                "resume-entry group grid gap-4 border-t border-border/40 py-8 md:grid-cols-[140px_1fr_1.5fr] md:gap-8 md:py-10",
                i === PLACEHOLDER_ENTRIES.length - 1 && "border-b border-border/40",
              )}
            >
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground/60">
                {entry.period}
              </p>
              <div>
                <h3 className="text-lg font-medium text-foreground md:text-xl">
                  {entry.title}
                </h3>
                <p className="mt-1 text-sm text-primary">
                  {entry.organization}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
