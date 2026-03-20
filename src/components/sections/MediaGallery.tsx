import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type MediaFilter = "all" | "photos" | "videos" | "music";

const FILTERS: { value: MediaFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "photos", label: "Photos" },
  { value: "videos", label: "Videos" },
  { value: "music", label: "Music" },
];

const PLACEHOLDER_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  id: String(i),
  type: (["photos", "videos", "music"] as const)[i % 3],
  title: `Media Item ${i + 1}`,
  featured: i < 2,
}));

export function MediaGallery() {
  const [filter, setFilter] = useState<MediaFilter>("all");

  const filtered =
    filter === "all"
      ? PLACEHOLDER_ITEMS
      : PLACEHOLDER_ITEMS.filter((item) => item.type === filter);

  return (
    <Section
      id={SECTION_IDS.media}
      style={{ paddingBlock: "var(--section-gap)" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="mb-3 text-xs uppercase text-primary/70"
              style={{ letterSpacing: "var(--label-tracking)" }}
            >
              Portfolio
            </p>
            <SplitHeading className="text-3xl md:text-5xl">
              See &amp; Hear
            </SplitHeading>
          </div>

          <div className="flex gap-1 border-b border-border/30">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={cn(
                  "relative px-4 py-2 text-xs uppercase transition-colors",
                  filter === value
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                style={{ letterSpacing: "var(--label-tracking)" }}
              >
                {label}
                {filter === value && (
                  <motion.div
                    layoutId="media-filter"
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div
          className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className={cn(
                  "group relative cursor-pointer overflow-hidden bg-muted",
                  item.featured
                    ? "col-span-2 row-span-2 aspect-square"
                    : "aspect-[4/5]",
                )}
                style={{
                  borderRadius: "var(--radius)",
                  border: "var(--card-border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="flex h-full w-full items-center justify-center text-muted-foreground/40 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                  <span
                    className="text-[10px] uppercase"
                    style={{ letterSpacing: "var(--label-tracking)" }}
                  >
                    {item.type}
                  </span>
                </div>
                <div
                  className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 ease-out group-hover:translate-y-0"
                  style={{ background: "var(--background)" }}
                >
                  <p className="text-xs font-medium text-foreground">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
