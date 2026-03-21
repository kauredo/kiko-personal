import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Star,
  X,
  Image,
  Film,
  Music,
  FileAudio,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Eye,
} from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

type MediaType = "photo" | "video" | "music";
type MediaItem = NonNullable<ReturnType<typeof useQuery<typeof api.media.list>>>[number];

export function MediaManager({ type }: { type: MediaType }) {
  const { token } = useAuth();
  const items = useQuery(api.media.list, { type });
  const create = useMutation(api.media.create);
  const update = useMutation(api.media.update);
  const remove = useMutation(api.media.remove);
  const reorder = useMutation(api.media.reorder);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<Id<"media"> | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [album, setAlbum] = useState("");
  const [year, setYear] = useState("");
  const [saving, setSaving] = useState(false);

  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Existing file preview URLs (for edit mode)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [existingAudioFileUrl, setExistingAudioFileUrl] = useState<string | null>(null);

  // Preview modal
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Close preview on Escape
  const closePreview = useCallback(() => setPreviewItem(null), []);
  useEffect(() => {
    if (!previewItem) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePreview();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewItem, closePreview]);

  // Audio playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  async function uploadFile(file: File): Promise<Id<"_storage">> {
    const uploadUrl = await generateUploadUrl({ token: token! });
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    return storageId;
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setMusicUrl("");
    setAlbum("");
    setYear("");
    setEditId(null);
    setShowForm(false);
    setImageFile(null);
    setAudioFile(null);
    setExistingImageUrl(null);
    setExistingAudioFileUrl(null);
  }

  function openEdit(item: MediaItem) {
    setTitle(item.title);
    setDescription(item.description ?? "");
    setCategory(item.category ?? "");
    setMusicUrl(item.musicUrl ?? "");
    setAlbum(item.album ?? "");
    setYear(item.year?.toString() ?? "");
    setEditId(item._id);
    setImageFile(null);
    setAudioFile(null);
    setExistingImageUrl(item.imageUrl ?? null);
    setExistingAudioFileUrl(item.audioFileUrl ?? null);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      let imageStorageId: Id<"_storage"> | undefined;
      let audioStorageId: Id<"_storage"> | undefined;

      if (imageFile) imageStorageId = await uploadFile(imageFile);
      if (audioFile) audioStorageId = await uploadFile(audioFile);

      const data = {
        title,
        description: description || undefined,
        category: category || undefined,
        videoUrl: undefined,
        musicUrl: type === "music" ? musicUrl || undefined : undefined,
        album: type === "music" ? album || undefined : undefined,
        year: type === "music" && year ? parseInt(year) : undefined,
        imageFile: imageStorageId,
        audioFile: audioStorageId,
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

  async function moveItem(index: number, direction: "up" | "down") {
    if (!token || !items) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const ids = items.map((i) => i._id);
    [ids[index], ids[newIndex]] = [ids[newIndex], ids[index]];
    await reorder({ token, ids });
  }

  function toggleAudio(url: string, id: string) {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audio.onended = () => setPlayingId(null);
      audio.play();
      audioRef.current = audio;
      setPlayingId(id);
    }
  }

  const typeLabels: Record<MediaType, string> = {
    photo: "Photos",
    video: "Videos",
    music: "Music",
  };

  const inputClasses =
    "w-full rounded border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  function renderPreview(item: MediaItem) {
    const previewBtn = "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/thumb:opacity-100";

    if (type === "photo") {
      return item.imageUrl ? (
        <div className="group/thumb relative size-16 cursor-pointer overflow-hidden rounded" onClick={() => setPreviewItem(item)}>
          <img src={item.imageUrl} alt={item.title} className="size-16 object-cover" />
          <div className={previewBtn}><Eye size={18} className="text-white" /></div>
        </div>
      ) : (
        <div className="flex size-16 items-center justify-center rounded bg-muted">
          <Image size={24} className="text-muted-foreground" />
        </div>
      );
    }

    if (type === "video") {
      return item.imageUrl ? (
        <div className="group/thumb relative size-16 cursor-pointer overflow-hidden rounded" onClick={() => setPreviewItem(item)}>
          <video src={item.imageUrl} className="size-16 object-cover" preload="metadata" />
          <div className={previewBtn}><Play size={18} className="text-white" /></div>
        </div>
      ) : (
        <div className="flex size-16 cursor-pointer items-center justify-center rounded bg-muted" onClick={() => setPreviewItem(item)}>
          <Film size={24} className="text-muted-foreground" />
        </div>
      );
    }

    // Music
    return (
      <div className="flex size-16 items-center justify-center rounded bg-muted">
        {item.audioFileUrl ? (
          <button onClick={() => toggleAudio(item.audioFileUrl!, item._id)} className="flex size-full items-center justify-center rounded transition-colors hover:bg-muted/80">
            {playingId === item._id ? <Pause size={24} className="text-primary" /> : <Play size={24} className="text-primary" />}
          </button>
        ) : (
          <Music size={24} className="text-muted-foreground" />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {typeLabels[type]}
        </h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent"
        >
          <Plus size={16} />
          Add {type === "photo" ? "Photo" : type === "video" ? "Video" : "Track"}
        </button>
      </div>

      {/* Featured legend */}
      <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Star size={12} fill="currentColor" className="text-primary" />
        <span>= Featured on homepage. Click the star to toggle.</span>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editId ? "Edit" : "Add"} {type}
              </h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className={inputClasses} />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} className={`${inputClasses} resize-none`} />
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (e.g. live, studio)" className={inputClasses} />

              {type === "photo" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Image</label>
                  {editId && existingImageUrl && !imageFile && (
                    <img src={existingImageUrl} alt="Current" className="h-24 rounded object-cover" />
                  )}
                  {imageFile && (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-24 rounded object-cover" />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-accent" />
                </div>
              )}

              {type === "video" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Video file</label>
                  {editId && existingImageUrl && !imageFile && (
                    <video src={existingImageUrl} className="h-24 rounded" controls />
                  )}
                  {imageFile && (
                    <video src={URL.createObjectURL(imageFile)} className="h-24 rounded" controls />
                  )}
                  <input type="file" accept="video/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-accent" />
                </div>
              )}

              {type === "music" && (
                <>
                  <input type="url" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} placeholder="Spotify or SoundCloud URL" className={inputClasses} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="Album" className={inputClasses} />
                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" className={inputClasses} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Audio file (optional)</label>
                    {editId && existingAudioFileUrl && !audioFile && (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileAudio size={16} className="text-primary" /> Current file attached
                      </p>
                    )}
                    {audioFile && <p className="text-sm text-muted-foreground">Selected: {audioFile.name}</p>}
                    <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-accent" />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={saving} className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent disabled:opacity-50">
                  {saving ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setPreviewItem(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setPreviewItem(null)}>
            <X size={28} />
          </button>
          <div className="max-h-[85vh] max-w-[85vw]" onClick={(e) => e.stopPropagation()}>
            {type === "photo" && previewItem.imageUrl && (
              <img src={previewItem.imageUrl} alt={previewItem.title} className="max-h-[85vh] max-w-[85vw] rounded object-contain" />
            )}
            {type === "video" && previewItem.imageUrl && (
              <video src={previewItem.imageUrl} controls autoPlay className="max-h-[85vh] max-w-[85vw] rounded" />
            )}
            {type === "video" && !previewItem.imageUrl && (
              <div className="flex flex-col items-center gap-4 rounded-lg bg-card p-8">
                <Film size={48} className="text-muted-foreground" />
                <p className="text-foreground">{previewItem.title}</p>
                <p className="text-sm text-muted-foreground">No video file uploaded</p>
              </div>
            )}
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">{previewItem.title}</p>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2">
        {items?.map((item, index) => (
          <div
            key={item._id}
            className="flex items-center gap-3 rounded border border-border/30 bg-card px-3 py-2.5"
          >
            {/* Reorder buttons */}
            <div className="flex flex-col">
              <button
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
                className="p-0.5 text-muted-foreground/40 transition-colors hover:text-foreground disabled:opacity-20 disabled:hover:text-muted-foreground/40"
                title="Move up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => moveItem(index, "down")}
                disabled={index === (items?.length ?? 0) - 1}
                className="p-0.5 text-muted-foreground/40 transition-colors hover:text-foreground disabled:opacity-20 disabled:hover:text-muted-foreground/40"
                title="Move down"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Preview */}
            {renderPreview(item)}

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.category ?? "Uncategorized"}
                {item.album && ` · ${item.album}`}
                {item.year && ` (${item.year})`}
                {type === "video" && item.imageUrl && " · video uploaded"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => toggleFeatured(item._id, item.featured)}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
                  item.featured
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground/40 hover:bg-muted hover:text-muted-foreground",
                )}
                title={item.featured ? "Remove from homepage" : "Show on homepage"}
              >
                <Star size={14} fill={item.featured ? "currentColor" : "none"} />
                <span className="hidden sm:inline">{item.featured ? "Featured" : "Feature"}</span>
              </button>
              <button
                onClick={() => openEdit(item)}
                className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={14} />
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
