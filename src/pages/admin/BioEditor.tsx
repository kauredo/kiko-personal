import { useState, useEffect, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Zap, Disc3, Blend, Layers, Piano, Music } from "lucide-react";
import type { ThemeAbout } from "@/data/fallbacks";

type ThemeName = keyof ThemeAbout;

const THEMES: { key: ThemeName; label: string; icon: typeof Zap }[] = [
  { key: "dark_electric", label: "Electric", icon: Zap },
  { key: "raw_textured", label: "Analog", icon: Disc3 },
  { key: "hybrid", label: "Editorial", icon: Blend },
  { key: "parallax", label: "Parallax", icon: Layers },
  { key: "piano", label: "Piano", icon: Piano },
  { key: "guitar", label: "Fretboard", icon: Music },
];

export function BioEditor() {
  const { token } = useAuth();
  const bio = useQuery(api.bio.get);
  const upsert = useMutation(api.bio.upsert);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [themeAbout, setThemeAbout] = useState<ThemeAbout>({});
  const [activeTheme, setActiveTheme] = useState<ThemeName>("dark_electric");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (bio) {
      setName(bio.name);
      setTitle(bio.title);
      setContent(bio.content);
      if (bio.themeAbout) {
        setThemeAbout(bio.themeAbout as ThemeAbout);
      }
    }
  }, [bio]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await upsert({
        token,
        name,
        title,
        content,
        socialLinks: bio?.socialLinks ?? [],
        themeAbout,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const inputClasses =
    "w-full rounded border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-foreground">Bio Editor</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
            placeholder="e.g. Musician & Producer"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Bio Content (HTML)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* Theme About Text */}
        <div>
          <label className="mb-3 block text-sm font-medium text-foreground">
            About Text (per theme)
          </label>
          <p className="mb-3 text-xs text-muted-foreground">
            Each homepage theme displays its own about text. Use blank lines to separate paragraphs.
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {THEMES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTheme(key)}
                className={cn(
                  "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTheme === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={themeAbout[activeTheme] ?? ""}
            onChange={(e) =>
              setThemeAbout((prev) => ({ ...prev, [activeTheme]: e.target.value }))
            }
            rows={6}
            className={`${inputClasses} resize-none`}
            placeholder={`About text for ${THEMES.find((t) => t.key === activeTheme)?.label} theme...`}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
