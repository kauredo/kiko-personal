import { useState, useEffect, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";

export function BioEditor() {
  const { token } = useAuth();
  const bio = useQuery(api.bio.get);
  const upsert = useMutation(api.bio.upsert);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (bio) {
      setName(bio.name);
      setTitle(bio.title);
      setContent(bio.content);
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
