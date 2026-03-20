import { useState, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Plus, Trash2, X, Star, Quote } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

export function TestimonialsManager() {
  const { token } = useAuth();
  const items = useQuery(api.testimonials.list, {});
  const create = useMutation(api.testimonials.create);
  const update = useMutation(api.testimonials.update);
  const remove = useMutation(api.testimonials.remove);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<Id<"testimonials"> | null>(null);
  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setQuote(""); setAuthorName(""); setAuthorRole("");
    setEditId(null); setShowForm(false);
  }

  function openEdit(item: NonNullable<typeof items>[number]) {
    setQuote(item.quote); setAuthorName(item.authorName);
    setAuthorRole(item.authorRole ?? ""); setEditId(item._id); setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      if (editId) {
        await update({ token, id: editId, quote, authorName, authorRole: authorRole || undefined });
      } else {
        await create({ token, quote, authorName, authorRole: authorRole || undefined });
      }
      resetForm();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: Id<"testimonials">) {
    if (!token || !confirm("Delete this testimonial?")) return;
    await remove({ token, id });
  }

  async function toggleFeatured(id: Id<"testimonials">, current: boolean) {
    if (!token) return;
    await update({ token, id, featured: !current });
  }

  const inputClasses = "w-full rounded border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editId ? "Edit" : "Add"} Testimonial</h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Quote" required rows={4} className={`${inputClasses} resize-none`} />
              <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Author Name" required className={inputClasses} />
              <input type="text" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} placeholder="Author Role (optional)" className={inputClasses} />
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

      <div className="space-y-2">
        {items?.map((item) => (
          <div key={item._id} className="flex items-start gap-4 rounded border border-border/30 bg-card px-4 py-3">
            <Quote size={16} className="mt-1 flex-shrink-0 text-primary/30" />
            <div className="flex-1">
              <p className="text-sm text-foreground">"{item.quote}"</p>
              <p className="mt-1 text-xs text-muted-foreground">
                — {item.authorName}{item.authorRole && `, ${item.authorRole}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleFeatured(item._id, item.featured)} className={cn("p-1 transition-colors", item.featured ? "text-primary" : "text-muted-foreground/30 hover:text-primary/50")} title="Toggle featured">
                <Star size={16} fill={item.featured ? "currentColor" : "none"} />
              </button>
              <button onClick={() => openEdit(item)} className="text-sm text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items?.length === 0 && <p className="py-12 text-center text-muted-foreground">No testimonials yet.</p>}
      </div>
    </div>
  );
}
