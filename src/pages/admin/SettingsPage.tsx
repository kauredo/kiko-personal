import { useState, useEffect, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";

const PLATFORMS = ["Instagram", "YouTube", "Spotify", "LinkedIn", "TikTok", "Twitter/X", "Facebook", "Website"];

export function SettingsPage() {
  const { token } = useAuth();
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);

  const [heroTagline, setHeroTagline] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [socialLinks, setSocialLinks] = useState<{platform: string; url: string}[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setHeroTagline(settings.heroTagline);
      setHeroSubtitle(settings.heroSubtitle ?? "");
      setSiteTitle(settings.siteTitle);
      setMetaDescription(settings.metaDescription ?? "");
      setContactEmail(settings.contactEmail);
      setSocialLinks(settings.socialLinks);
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
        socialLinks,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  function addSocialLink() {
    setSocialLinks(prev => [...prev, { platform: "Instagram", url: "" }]);
  }

  function removeSocialLink(index: number) {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  }

  function updateSocialLink(index: number, field: "platform" | "url", value: string) {
    setSocialLinks(prev => prev.map((link, i) => i === index ? { ...link, [field]: value } : link));
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

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Social Links</label>
          <div className="space-y-3">
            {socialLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <select value={link.platform} onChange={(e) => updateSocialLink(i, "platform", e.target.value)} className={inputClasses + " max-w-[160px]"}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="url" value={link.url} onChange={(e) => updateSocialLink(i, "url", e.target.value)} placeholder="https://..." className={inputClasses} />
                <button type="button" onClick={() => removeSocialLink(i)} className="p-1 text-muted-foreground hover:text-destructive flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addSocialLink} className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-primary/80">
            <Plus size={14} /> Add social link
          </button>
        </div>

        <button type="submit" disabled={saving} className="rounded bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-accent disabled:opacity-50">
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
