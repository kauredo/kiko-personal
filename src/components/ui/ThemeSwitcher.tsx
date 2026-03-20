import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Zap, Disc3, Blend, Layers, Piano, Guitar } from "lucide-react";
import type { ThemeName } from "@/types/theme";

const themes: { name: ThemeName; icon: typeof Zap; label: string }[] = [
  { name: "dark-electric", icon: Zap, label: "Electric" },
  { name: "raw-textured", icon: Disc3, label: "Analog" },
  { name: "hybrid", icon: Blend, label: "Editorial" },
  { name: "parallax", icon: Layers, label: "Parallax" },
  { name: "piano", icon: Piano, label: "Piano" },
  { name: "guitar", icon: Guitar, label: "Guitar 3D" },
];

export function ThemeSwitcher() {
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
              ? "bg-white/20 text-white scale-110"
              : "text-white/40 hover:text-white/70",
          )}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
