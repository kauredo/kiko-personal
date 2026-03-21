import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Plus, Trash2, KeyRound, Mail, Eye, EyeOff, ImageIcon, RefreshCw, Check, Zap, Disc3, Blend, Layers, Piano, Music, ChevronDown } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

const PLATFORMS = ["Instagram", "YouTube", "Spotify", "LinkedIn", "TikTok", "Twitter/X", "Facebook", "Website"];

const OG_STYLES = [
  { key: "piano", label: "Piano", icon: Piano },
  { key: "guitar", label: "Fretboard", icon: Music },
  { key: "raw-textured", label: "Analog", icon: Disc3 },
  { key: "hybrid", label: "Editorial", icon: Blend },
  { key: "dark-electric", label: "Electric", icon: Zap },
  { key: "parallax", label: "Parallax", icon: Layers },
] as const;

export function SettingsPage() {
  const { token } = useAuth();
  const settings = useQuery(api.settings.get);
  const bio = useQuery(api.bio.get);
  const photos = useQuery(api.media.list, { type: "photo" });
  const upsert = useMutation(api.settings.upsert);
  const changePassword = useMutation(api.auth.changePassword);
  const updateProfilePhoto = useMutation(api.bio.updateProfilePhoto);

  const [heroTagline, setHeroTagline] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [socialLinks, setSocialLinks] = useState<{platform: string; url: string}[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [securityOpen, setSecurityOpen] = useState(false);

  // OG preview
  const [ogKey, setOgKey] = useState(0);
  const [ogStyle, setOgStyle] = useState("dark-electric");
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [settingPhoto, setSettingPhoto] = useState(false);
  const [ogSaving, setOgSaving] = useState(false);

  // Track if initial load has happened to prevent autosave on mount
  const initializedRef = useRef(false);

  useEffect(() => {
    if (settings) {
      setHeroTagline(settings.heroTagline);
      setHeroSubtitle(settings.heroSubtitle ?? "");
      setSiteTitle(settings.siteTitle);
      setMetaDescription(settings.metaDescription ?? "");
      setContactEmail(settings.contactEmail);
      setSocialLinks(settings.socialLinks);
      if (settings.ogStyle) setOgStyle(settings.ogStyle);
      initializedRef.current = true;
    }
  }, [settings]);

  // Autosave OG style on change
  const saveOgStyle = useCallback(async (style: string) => {
    if (!token || !settings || !initializedRef.current) return;
    setOgSaving(true);
    try {
      await upsert({
        token,
        heroTagline: settings.heroTagline,
        heroSubtitle: settings.heroSubtitle || undefined,
        siteTitle: settings.siteTitle,
        metaDescription: settings.metaDescription || undefined,
        contactEmail: settings.contactEmail,
        socialLinks: settings.socialLinks,
        ogStyle: style,
      });
    } finally {
      setOgSaving(false);
    }
  }, [token, settings, upsert]);

  function handleOgStyleChange(style: string) {
    setOgStyle(style);
    saveOgStyle(style);
  }

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
        ogStyle,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setPwMessage(null);

    if (newPassword.length < 8) {
      setPwMessage({ type: "error", text: "New password must be at least 8 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setPwSaving(true);
    try {
      await changePassword({ token, currentPassword, newPassword });
      setPwMessage({ type: "success", text: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPwMessage({ type: "error", text: "Current password is incorrect" });
    } finally {
      setPwSaving(false);
    }
  }

  async function handlePickPhoto(storageId: Id<"_storage">) {
    if (!token) return;
    setSettingPhoto(true);
    try {
      await updateProfilePhoto({ token, photoStorageId: storageId });
      setPhotoPickerOpen(false);
      setTimeout(() => setOgKey((k) => k + 1), 1000);
    } finally {
      setSettingPhoto(false);
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
    "w-full border border-border bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  const currentProfilePhotoId = bio?.profilePhoto;
  const ogBase = import.meta.env.DEV ? "https://kiko-personal.vercel.app" : "";

  return (
    <div className="max-w-3xl">
      <h1
        className="mb-1 text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Settings
      </h1>
      <p className="mb-10 text-sm text-muted-foreground">
        Site configuration and account settings.
      </p>

      {/* ── OG Share Image ─────────────────────────────── */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
            Share Image
          </h2>
          <div className="flex items-center gap-3">
            {ogSaving && (
              <span className="text-[10px] uppercase text-muted-foreground" style={{ letterSpacing: "0.1em" }}>
                Saving...
              </span>
            )}
            <button
              type="button"
              onClick={() => setOgKey((k) => k + 1)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              title="Refresh preview"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        <div
          className="overflow-hidden border border-border"
          style={{ borderRadius: "var(--radius)" }}
        >
          <img
            key={`${ogStyle}-${ogKey}`}
            src={`${ogBase}/api/og?style=${ogStyle}&v=${ogKey}`}
            alt="OG share preview"
            className="w-full"
            style={{ aspectRatio: "1200/630" }}
          />
        </div>

        <div className="mt-4 flex items-start gap-4">
          {/* Style picker */}
          <div className="flex flex-1 gap-1.5">
            {OG_STYLES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleOgStyleChange(key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 border py-2 transition-all",
                  ogStyle === key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
                style={{ borderRadius: "var(--radius)" }}
                title={label}
              >
                <Icon size={13} />
                <span className="text-[9px] font-medium uppercase" style={{ letterSpacing: "0.05em" }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo picker */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setPhotoPickerOpen(!photoPickerOpen)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ImageIcon size={12} />
            Change profile photo
            <ChevronDown size={12} className={cn("transition-transform", photoPickerOpen && "rotate-180")} />
          </button>

          {photoPickerOpen && (
            <div className="mt-2 grid grid-cols-8 gap-1.5 sm:grid-cols-10">
              {photos?.filter((p) => p.imageUrl).map((photo) => {
                const isSelected = photo.imageFile === currentProfilePhotoId;
                return (
                  <button
                    key={photo._id}
                    type="button"
                    disabled={settingPhoto}
                    onClick={() => photo.imageFile && handlePickPhoto(photo.imageFile as Id<"_storage">)}
                    className={cn(
                      "relative aspect-square overflow-hidden border-2 transition-all",
                      isSelected
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50",
                      settingPhoto && "opacity-50",
                    )}
                    style={{ borderRadius: "var(--radius)" }}
                    title={photo.title}
                  >
                    <img
                      src={photo.imageUrl!}
                      alt={photo.title}
                      className="h-full w-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/40">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
              {(!photos || photos.filter((p) => p.imageUrl).length === 0) && (
                <p className="col-span-full py-3 text-center text-xs text-muted-foreground">
                  No photos uploaded yet.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Site Content ────────────────────────────────── */}
      <form onSubmit={handleSubmit}>
        <section className="mb-12">
          <h2 className="mb-5 text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
            Site Content
          </h2>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
                  Hero Tagline
                </label>
                <input
                  type="text"
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  className={inputClasses}
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className={inputClasses}
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
                  Site Title
                </label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className={inputClasses}
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={inputClasses}
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                className={`${inputClasses} resize-none`}
                style={{ borderRadius: "var(--radius)" }}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {metaDescription.length}/160
              </p>
            </div>

            {/* Social links inline */}
            <div className="border-t border-border pt-5">
              <label className="mb-3 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
                Social Links
              </label>
              <div className="space-y-2">
                {socialLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                      className={inputClasses + " max-w-[130px] flex-shrink-0"}
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                      placeholder="https://..."
                      className={inputClasses}
                      style={{ borderRadius: "var(--radius)" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(i)}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSocialLink}
                className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Plus size={13} /> Add link
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 border-2 border-primary bg-transparent px-6 py-2.5 text-xs font-medium uppercase text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
            style={{ borderRadius: "var(--radius)", letterSpacing: "var(--label-tracking)" }}
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </section>
      </form>

      {/* ── Security ───────────────────────────────────── */}
      <section className="border-t border-border pt-8">
        <button
          type="button"
          onClick={() => setSecurityOpen(!securityOpen)}
          className="flex w-full items-center justify-between"
        >
          <h2 className="text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
            Security
          </h2>
          <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", securityOpen && "rotate-180")} />
        </button>

        {securityOpen && (
          <form onSubmit={handlePasswordChange} className="mt-5 max-w-sm space-y-4">
            {pwMessage && (
              <div
                className={`px-3 py-2.5 text-xs ${
                  pwMessage.type === "success"
                    ? "border border-green-500/30 bg-green-500/10 text-green-400"
                    : "border border-destructive/30 bg-destructive/10 text-destructive"
                }`}
                style={{ borderRadius: "var(--radius)" }}
              >
                {pwMessage.text}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className={inputClasses + " pr-10"}
                  style={{ borderRadius: "var(--radius)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className={inputClasses + " pr-10"}
                  style={{ borderRadius: "var(--radius)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClasses}
                style={{ borderRadius: "var(--radius)" }}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-destructive">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={pwSaving || !currentPassword || !newPassword || newPassword !== confirmPassword}
              className="border-2 border-primary bg-transparent px-6 py-2.5 text-xs font-medium uppercase text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
              style={{ borderRadius: "var(--radius)", letterSpacing: "var(--label-tracking)" }}
            >
              {pwSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
