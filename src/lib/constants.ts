export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  media: "media",
  resume: "resume",
  testimonials: "testimonials",
  events: "events",
  contact: "contact",
} as const;

export const ANIMATION = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
    reveal: 1.2,
  },
  ease: {
    smooth: "power3.out",
    bounce: "back.out(1.4)",
    expo: "expo.out",
    inOut: "power2.inOut",
  },
  stagger: {
    fast: 0.04,
    normal: 0.08,
    slow: 0.12,
  },
} as const;
