import { useState, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Plus, Trash2, X, Calendar } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

type EventType = "upcoming" | "past";

export function EventsManager() {
  const { token } = useAuth();
  const [tab, setTab] = useState<EventType>("upcoming");
  const items = useQuery(api.events.list, { type: tab });
  const create = useMutation(api.events.create);
  const update = useMutation(api.events.update);
  const remove = useMutation(api.events.remove);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<Id<"events"> | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [eventType, setEventType] = useState<EventType>("upcoming");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTitle(""); setDate(""); setTime(""); setVenue(""); setCity("");
    setDescription(""); setTicketUrl(""); setEventType("upcoming");
    setEditId(null); setShowForm(false);
  }

  function openEdit(item: NonNullable<typeof items>[number]) {
    setTitle(item.title); setDate(item.date); setTime(item.time ?? "");
    setVenue(item.venue ?? ""); setCity(item.city ?? "");
    setDescription(item.description ?? ""); setTicketUrl(item.ticketUrl ?? "");
    setEventType(item.type); setEditId(item._id); setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const data = {
        title, date,
        time: time || undefined, venue: venue || undefined,
        city: city || undefined, description: description || undefined,
        ticketUrl: ticketUrl || undefined, type: eventType,
      };
      if (editId) { await update({ token, id: editId, ...data }); }
      else { await create({ token, ...data }); }
      resetForm();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: Id<"events">) {
    if (!token || !confirm("Delete this event?")) return;
    await remove({ token, id });
  }

  const inputClasses = "w-full rounded border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Events</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        {(["upcoming", "past"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("rounded px-4 py-2 text-sm font-medium capitalize transition-colors", tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editId ? "Edit" : "Add"} Event</h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" required className={inputClasses} />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClasses} />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClasses} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" className={inputClasses} />
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputClasses} />
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} className={`${inputClasses} resize-none`} />
              <input type="url" value={ticketUrl} onChange={(e) => setTicketUrl(e.target.value)} placeholder="Ticket URL" className={inputClasses} />
              <select value={eventType} onChange={(e) => setEventType(e.target.value as EventType)} className={inputClasses}>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
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
        {items?.map((event) => (
          <div key={event._id} className="flex items-center justify-between rounded border border-border/30 bg-card px-4 py-3">
            <div className="flex items-center gap-4">
              <Calendar size={16} className="text-primary/50" />
              <div>
                <p className="font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {event.date}{event.time && ` ${event.time}`} · {event.venue}{event.city && `, ${event.city}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(event)} className="text-sm text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => handleDelete(event._id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items?.length === 0 && <p className="py-12 text-center text-muted-foreground">No {tab} events.</p>}
      </div>
    </div>
  );
}
