import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "About", id: SECTION_IDS.about },
  { label: "Media", id: SECTION_IDS.media },
  { label: "Resume", id: SECTION_IDS.resume },
  { label: "Events", id: SECTION_IDS.events },
  { label: "Contact", id: SECTION_IDS.contact },
];

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: "top -80",
      onUpdate: (self) => setScrolled(self.progress > 0),
    });
    return () => trigger.kill();
  }, []);

  function scrollTo(id: string) {
    lenis?.scrollTo(`#${id}`, { offset: -80, duration: 1.2 });
    setMobileOpen(false);
  }

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500 md:px-12",
        scrolled
          ? "border-b border-border/30 bg-background/80 backdrop-blur-[var(--nav-blur)]"
          : "bg-transparent",
      )}
    >
      <button
        onClick={() => lenis?.scrollTo(0, { duration: 1.5 })}
        className="text-2xl italic text-foreground transition-colors hover:text-primary"
        style={{ fontFamily: "var(--font-heading)" }}
        data-hoverable
      >
        FC
      </button>

      {/* Desktop nav */}
      <div className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            className="text-sm font-medium tracking-wide uppercase text-muted-foreground transition-colors hover:text-foreground"
            data-hoverable
          >
            {link.label}
          </button>
        ))}
        <ThemeSwitcher />
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="text-foreground md:hidden"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 z-40 flex flex-col items-start justify-center gap-6 bg-background px-6 pt-20 md:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                onClick={() => scrollTo(link.id)}
                className="text-4xl font-normal italic text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <ThemeSwitcher />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
