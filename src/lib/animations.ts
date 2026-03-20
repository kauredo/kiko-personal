import { gsap } from "./gsap";
import { ANIMATION } from "./constants";

export function fadeUp(
  element: gsap.TweenTarget,
  trigger?: ScrollTrigger.Vars,
) {
  return gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: ANIMATION.duration.normal,
    ease: ANIMATION.ease.smooth,
    scrollTrigger: trigger,
  });
}

export function staggerFadeUp(
  elements: gsap.TweenTarget,
  trigger?: ScrollTrigger.Vars,
  stagger = ANIMATION.stagger.normal,
) {
  return gsap.from(elements, {
    y: 60,
    opacity: 0,
    duration: ANIMATION.duration.normal,
    ease: ANIMATION.ease.smooth,
    stagger,
    scrollTrigger: trigger,
  });
}

export function clipReveal(
  element: gsap.TweenTarget,
  direction: "left" | "right" | "top" | "bottom" = "left",
  trigger?: ScrollTrigger.Vars,
) {
  const clips: Record<string, [string, string]> = {
    left: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
    right: ["inset(0 0 0 100%)", "inset(0 0 0 0%)"],
    top: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
    bottom: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"],
  };

  const [from, to] = clips[direction];

  return gsap.fromTo(
    element,
    { clipPath: from },
    {
      clipPath: to,
      duration: ANIMATION.duration.reveal,
      ease: ANIMATION.ease.expo,
      scrollTrigger: trigger,
    },
  );
}

export function parallax(
  element: gsap.TweenTarget,
  speed: number,
  trigger?: ScrollTrigger.Vars,
) {
  return gsap.to(element, {
    y: () => speed * 100,
    ease: "none",
    scrollTrigger: {
      scrub: true,
      ...trigger,
    },
  });
}
