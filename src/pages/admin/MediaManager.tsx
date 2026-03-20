import { useState, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Star, X } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

type MediaType = "photo" | "video" | "music";

export function MediaManager({ type }: { type: MediaType }) {
  const { token } = useAuth();
  const items = useQuery(api.media.list, { type });
  const create = useMutation(api.media.create);
  const update = useMutation(api.media.update);
  const remove = useMutation(api.media.remove);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<Id<"media"> | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [album, setAlbum] = useState("");
  const [year, setYear] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setVideoUrl("");
    setMusicUrl("");
    setAlbum("");
    setYear("");
    setEditId(null);
    setShowForm(false);
  }

  function openEdit(item: NonNullable<typeof items>[number]) {
    setTitle(item.title);
    setDescription(item.description ?? "");
    setCategory(item.category ?? "");
    setVideoUrl(item.videoUrl ?? "");
    setMusicUrl(item.musicUrl ?? "");
    setAlbum(item.album ?? "");
    setYear(item.year?.toString() ?? "");
    setEditId(item._id);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const data = {
        title,
        description: description || undefined,
        category: category || undefined,
        videoUrl: type === "video" ? videoUrl || undefined : undefined,
        musicUrl: type === "music" ? musicUrl || undefined : undefined,
        album: type === "music" ? album || undefined : undefined,
        year: type === "music" && year ? parseInt(year) : undefined,
      };

      if (editId) {
        await update({ token, id: editId, ...data });
      } else {
        await create({ token, type, ...data });
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"media">) {
    if (!token || !confirm("Delete this item?")) return;
    await remove({ token, id });
  }

  async function toggleFeatured(id: Id<"media">, current: boolean) {
    if (!token) return;
    await update({ token, id, featured: !current });
  }

  const typeLabels: Record<MediaType, string> = {
    photo: "Photos",
    video: "Videos",
    music: "Music",
  };

  const inputClasses =
    "w-full rounded border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {typeLabels[type]}
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent"
        >
          <Plus size={16} />
          Add {type === "photo" ? "Photo" : type === "video" ? "Video" : "Track"}
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editId ? "Edit" : "Add"} {type}
              </h2>
              <button
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className={inputClasses}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={3}
                className={`${inputClasses} resize-none`}
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category (e.g. live, studio)"
                className={inputClasses}
              />

              {type === "video" && (
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube or Vimeo URL"
                  className={inputClasses}
                />
              )}

              {type === "music" && (
                <>
                  <input
                    type="url"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    placeholder="Spotify or SoundCloud URL"
                    className={inputClasses}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={album}
                      onChange={(e) => setAlbum(e.target.value)}
                      placeholder="Album"
                      className={inputClasses}
                    />
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Year"
                      className={inputClasses}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent disabled:opacity-50"
                >
                  {saving ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2">
        {items?.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between rounded border border-border/30 bg-card px-4 py-3"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.category ?? "Uncategorized"}
                {item.album && ` · ${item.album}`}
                {item.year && ` (${item.year})`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFeatured(item._id, item.featured)}
                className={cn(
                  "p-1 transition-colors",
                  item.featured
                    ? "text-primary"
                    : "text-muted-foreground/30 hover:text-primary/50",
                )}
                title="Toggle featured"
              >
                <Star size={16} fill={item.featured ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => openEdit(item)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="p-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {items?.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No {typeLabels[type].toLowerCase()} yet. Add your first one!
          </p>
        )}
      </div>
    </div>
  );
}
