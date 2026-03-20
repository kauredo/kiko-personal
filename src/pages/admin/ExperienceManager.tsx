import { useState, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, X } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

const CATEGORIES = [
  { value: "performance", label: "Performance" },
  { value: "directing", label: "Directing" },
  { value: "producing", label: "Producing" },
  { value: "teaching", label: "Teaching" },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

export function ExperienceManager() {
  const { token } = useAuth();
  const items = useQuery(api.resume.listExperiences, {});
  const create = useMutation(api.resume.createExperience);
  const update = useMutation(api.resume.updateExperience);
  const remove = useMutation(api.resume.deleteExperience);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<Id<"experiences"> | null>(null);
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("performance");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTitle("");
    setOrganization("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setCategory("performance");
    setEditId(null);
    setShowForm(false);
  }

  function openEdit(item: NonNullable<typeof items>[number]) {
    setTitle(item.title);
    setOrganization(item.organization);
    setStartDate(item.startDate);
    setEndDate(item.endDate ?? "");
    setDescription(item.description ?? "");
    setCategory(item.category);
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
        organization,
        startDate,
        endDate: endDate || undefined,
        description: description || undefined,
        category,
      };

      if (editId) {
        await update({ token, id: editId, ...data });
      } else {
        await create({ token, ...data });
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"experiences">) {
    if (!token || !confirm("Delete this entry?")) return;
    await remove({ token, id });
  }

  const inputClasses =
    "w-full rounded border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Experience</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent"
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editId ? "Edit" : "Add"} Experience
              </h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title / Role" required className={inputClasses} />
              <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Organization" required className={inputClasses} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start (YYYY-MM)" required className={inputClasses} />
                <input type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End (or leave empty)" className={inputClasses} />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputClasses}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} className={`${inputClasses} resize-none`} />
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
          <div key={item._id} className="flex items-center justify-between rounded border border-border/30 bg-card px-4 py-3">
            <div>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.organization} · {item.startDate} — {item.endDate ?? "Present"} · {item.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(item)} className="text-sm text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items?.length === 0 && <p className="py-12 text-center text-muted-foreground">No entries yet.</p>}
      </div>
    </div>
  );
}
