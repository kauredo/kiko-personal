import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

type MobileMenuProps = {
  links: { label: string; id: string }[];
  scrollTo: (id: string) => void;
  color?: string;
  bgColor?: string;
  headingFont?: string;
};

export function MobileMenu({
  links,
  scrollTo,
  color = "white",
  bgColor = "black",
  headingFont = "'Syne', system-ui, sans-serif",
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  function handleClick(id: string) {
    scrollTo(id);
    close();
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="z-50 md:hidden"
        style={{ color }}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-start justify-center gap-6 px-8 pt-20 md:hidden"
            style={{ background: bgColor, color }}
          >
            {links.map((link, i) => (
              <motion.button
                key={link.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                onClick={() => handleClick(link.id)}
                className="text-4xl font-normal"
                style={{ fontFamily: headingFont, fontStyle: "italic", color }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
