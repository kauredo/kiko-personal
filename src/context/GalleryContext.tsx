import { createContext, useCallback, useContext, useState } from "react";
import { MediaGallery } from "@/components/ui/MediaGallery";
import type { HomeMedia } from "@/data/fallbacks";

type GalleryState = { items: HomeMedia[]; index: number } | null;

const GalleryContext = createContext<(items: HomeMedia[], index: number) => void>(() => {});

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GalleryState>(null);

  const open = useCallback((items: HomeMedia[], index: number) => {
    setState({ items, index });
  }, []);

  return (
    <GalleryContext value={open}>
      {children}
      {state && (
        <MediaGallery
          items={state.items}
          initialIndex={state.index}
          onClose={() => setState(null)}
        />
      )}
    </GalleryContext>
  );
}

export function useGallery() {
  return useContext(GalleryContext);
}
