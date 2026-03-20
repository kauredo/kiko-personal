import { useState, useEffect, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";

export function SettingsPage() {
  const { token } = useAuth();
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);

  const [heroTagline, setHeroTagline] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setHeroTagline(settings.heroTagline);
      setHeroSubtitle(settings.heroSubtitle ?? "");
      setSiteTitle(settings.siteTitle);
      setMetaDescription(settings.metaDescription ?? "");
      setContactEmail(settings.contactEmail);
    }
  }, [settings]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await upsert({
        token,
        heroTagline,
        heroSubtitle: heroSubtitle || undefined,
        siteTitle,
        metaDescription: metaDescription || undefined,
        contactEmail,
        socialLinks: settings?.socialLinks ?? [],
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
      <h1 className="mb-8 text-2xl font-bold text-foreground">Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Hero Tagline</label>
          <input type="text" value={heroTagline} onChange={(e) => setHeroTagline(e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Hero Subtitle</label>
          <input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Site Title</label>
          <input type="text" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Meta Description</label>
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={`${inputClasses} resize-none`} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Contact Email</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClasses} />
        </div>

        <button type="submit" disabled={saving} className="rounded bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-accent disabled:opacity-50">
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
