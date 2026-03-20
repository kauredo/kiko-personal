import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Send, Check } from "lucide-react";

const INQUIRY_TYPES = [
  { value: "booking", label: "Booking" },
  { value: "collaboration", label: "Collaboration" },
  { value: "lesson", label: "Lesson" },
  { value: "general", label: "General" },
] as const;

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Wire up Convex mutation
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  }

  const inputClasses =
    "w-full border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  return (
    <Section
      id={SECTION_IDS.contact}
      className="bg-card"
      style={{ paddingBlock: "var(--section-gap)" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-xl">
        <SplitHeading className="mb-4 text-center text-3xl md:text-5xl">
          Let's make something
        </SplitHeading>
        <p className="mb-12 text-center text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
          Booking &middot; Collaboration &middot; Lessons &middot; Just say hi
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-16 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <Check size={32} className="text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Message Sent!
              </h3>
              <p className="text-muted-foreground">
                Thanks for reaching out. Francisco will get back to you soon.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="form-field grid gap-6 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className={inputClasses}
                  style={{ borderRadius: "var(--radius)" }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className={inputClasses}
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>

              <div className="form-field">
                <div className="flex flex-wrap gap-3">
                  {INQUIRY_TYPES.map(({ value, label }) => (
                    <label
                      key={value}
                      className={cn(
                        "cursor-pointer border px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors",
                        "border-border text-muted-foreground has-[:checked]:border-primary has-[:checked]:text-primary",
                      )}
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <input
                        type="radio"
                        name="inquiryType"
                        value={value}
                        className="sr-only"
                        defaultChecked={value === "booking"}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  rows={5}
                  className={cn(inputClasses, "resize-none")}
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>

              <div className="form-field flex justify-center">
                <MagneticButton type="submit" disabled={loading}>
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </MagneticButton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
