import { useTheme } from "@/hooks/useTheme";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { HomeElectric } from "./HomeElectric";
import { HomeAnalog } from "./HomeAnalog";
import { HomeEditorial } from "./HomeEditorial";
import { HomeParallax } from "./HomeParallax";
import { HomePiano } from "./HomePiano";
import { HomeGuitar } from "./HomeGuitar";

export function Home() {
  const { theme } = useTheme();

  return (
    <PageWrapper>
      {theme === "dark-electric" && <HomeElectric />}
      {theme === "raw-textured" && <HomeAnalog />}
      {theme === "hybrid" && <HomeEditorial />}
      {theme === "parallax" && <HomeParallax />}
      {theme === "piano" && <HomePiano />}
      {theme === "guitar" && <HomeGuitar />}
    </PageWrapper>
  );
}
