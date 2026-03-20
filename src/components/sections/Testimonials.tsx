import { useRef } from "react";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { useGSAP } from "@/hooks/useGSAP";
import { gsap } from "@/lib/gsap";
import { SECTION_IDS } from "@/lib/constants";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Francisco brings an energy to the stage that's impossible to ignore. His guitar work is both technically brilliant and deeply emotional.",
    author: "Maria Santos",
    role: "Producer, Atlantic Records",
  },
  {
    id: "2",
    quote:
      "One of the most versatile musicians I've worked with. He can go from a soulful ballad to a face-melting rock solo in the same set.",
    author: "Joao Silva",
    role: "Band Leader",
  },
  {
    id: "3",
    quote:
      "His work as musical director transformed our production. Every arrangement was thoughtful, dynamic, and perfectly suited to the moment.",
    author: "Ana Costa",
    role: "Theater Director",
  },
  {
    id: "4",
    quote:
      "Francisco doesn't just play music — he channels something raw and real. Every note has purpose and soul behind it.",
    author: "Carlos Mendes",
    role: "Music Journalist",
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const scrollWidth = track.scrollWidth;
      const viewWidth = section.offsetWidth;
      const totalWidth = scrollWidth - viewWidth;

      if (totalWidth <= 0) return;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalWidth * 0.8}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    },
    [],
    sectionRef,
  );

  return (
    <Section
      id={SECTION_IDS.testimonials}
      className="overflow-hidden border-t border-border/30"
      style={{ padding: 0 } as React.CSSProperties}
    >
      <div ref={sectionRef} className="flex min-h-[70vh] flex-col justify-center py-12 md:py-20">
        <div className="mb-12 px-6 md:mb-16 md:px-12 lg:px-24">
          <p
            className="mb-3 text-xs uppercase text-primary/70"
            style={{ letterSpacing: "var(--label-tracking)" }}
          >
            Collaborators &amp; Press
          </p>
          <SplitHeading className="text-3xl md:text-5xl">
            In their words
          </SplitHeading>
        </div>

        <div
          ref={trackRef}
          className="flex items-start gap-6 px-6 md:gap-8 md:px-12 lg:px-24"
        >
          {PLACEHOLDER_TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-[80vw] flex-shrink-0 sm:w-[55vw] md:w-[40vw] lg:w-[30vw]"
            >
              <blockquote
                className="mb-6 leading-relaxed text-foreground"
                style={{ fontSize: "var(--quote-size)" }}
              >
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-primary/40" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
