import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Zap, Disc3, Blend, Layers, Piano, Music } from "lucide-react";
import type { ThemeName } from "@/types/theme";

const themes: { name: ThemeName; icon: typeof Zap; label: string }[] = [
  { name: "piano", icon: Piano, label: "Piano" },
  { name: "guitar", icon: Music, label: "Fretboard" },
  { name: "raw-textured", icon: Disc3, label: "Analog" },
  { name: "hybrid", icon: Blend, label: "Editorial" },
  { name: "dark-electric", icon: Zap, label: "Electric" },
  { name: "parallax", icon: Layers, label: "Parallax" },
];

export function ThemeSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5">
      {themes.map(({ name, icon: Icon, label }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          title={label}
          className={cn(
            "rounded-full p-1.5 transition-all duration-200",
            theme === name
              ? variant === "light"
                ? "bg-white/20 text-white scale-110"
                : "bg-black/10 text-black scale-110"
              : variant === "light"
                ? "text-white/40 hover:text-white/70"
                : "text-black/30 hover:text-black/60",
          )}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
