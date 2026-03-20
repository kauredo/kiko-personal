import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  status: "upcoming" | "past";
  ticketUrl?: string;
}

const PLACEHOLDER_EVENTS: Event[] = [
  {
    id: "1",
    title: "Rock Soul Night",
    date: "2026-04-15",
    venue: "Coliseu de Lisboa",
    city: "Lisbon",
    status: "upcoming",
    ticketUrl: "#",
  },
  {
    id: "2",
    title: "Jazz & Soul Session",
    date: "2026-05-02",
    venue: "Hot Clube de Portugal",
    city: "Lisbon",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Summer Festival",
    date: "2026-06-20",
    venue: "Parque das Nacoes",
    city: "Lisbon",
    status: "upcoming",
    ticketUrl: "#",
  },
  {
    id: "4",
    title: "Unplugged Sessions",
    date: "2025-12-10",
    venue: "Musicbox",
    city: "Lisbon",
    status: "past",
  },
];

export function Events() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const filtered = PLACEHOLDER_EVENTS.filter((e) => e.status === tab);

  return (
    <Section
      id={SECTION_IDS.events}
      className="border-t border-border/30"
      style={{ paddingBlock: "var(--section-gap)" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SplitHeading className="text-3xl md:text-5xl">
            Catch me live
          </SplitHeading>

          <div className="flex gap-1 text-xs uppercase" style={{ letterSpacing: "var(--label-tracking)" }}>
            {(["upcoming", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative px-4 py-2 transition-colors",
                  tab === t
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
                {tab === t && (
                  <motion.div
                    layoutId="event-tab"
                    className="absolute inset-x-0 -bottom-px h-px bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.map((event, i) => {
                const d = new Date(event.date);
                const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
                const day = d.getDate();

                return (
                  <div
                    key={event.id}
                    className={cn(
                      "group grid grid-cols-[60px_1fr_auto] items-center gap-4 border-t border-border/40 py-5 transition-colors hover:bg-muted/30 md:grid-cols-[80px_1fr_1fr_auto] md:gap-8 md:py-6",
                      i === filtered.length - 1 && "border-b border-border/40",
                    )}
                  >
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{month}</p>
                      <p className="text-2xl font-medium text-foreground md:text-3xl">{day}</p>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground md:text-lg">
                        {event.title}
                      </h3>
                    </div>
                    <p className="hidden text-sm text-muted-foreground md:block">
                      {event.venue}, {event.city}
                    </p>
                    {event.ticketUrl ? (
                      <a
                        href={event.ticketUrl}
                        className="flex items-center gap-1 text-xs font-medium tracking-[0.1em] uppercase text-primary transition-colors hover:text-accent"
                        data-hoverable
                      >
                        Tickets <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">Free</span>
                    )}
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No {tab} events at the moment.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
