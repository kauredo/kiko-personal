import { lazy, Suspense } from "react";
import { useTheme } from "@/hooks/useTheme";
import { PageWrapper } from "@/components/layout/PageWrapper";

const HomeElectric = lazy(() => import("./HomeElectric").then(m => ({ default: m.HomeElectric })));
const HomeAnalog = lazy(() => import("./HomeAnalog").then(m => ({ default: m.HomeAnalog })));
const HomeEditorial = lazy(() => import("./HomeEditorial").then(m => ({ default: m.HomeEditorial })));
const HomeParallax = lazy(() => import("./HomeParallax").then(m => ({ default: m.HomeParallax })));
const HomePiano = lazy(() => import("./HomePiano").then(m => ({ default: m.HomePiano })));
const HomeFretboard = lazy(() => import("./HomeFretboard").then(m => ({ default: m.HomeFretboard })));

const THEMES = {
  "dark-electric": HomeElectric,
  "raw-textured": HomeAnalog,
  hybrid: HomeEditorial,
  parallax: HomeParallax,
  piano: HomePiano,
  guitar: HomeFretboard,
} as const;

export function Home() {
  const { theme } = useTheme();
  const Component = THEMES[theme];

  return (
    <PageWrapper>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Component />
      </Suspense>
    </PageWrapper>
  );
}
