import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Trash2, Mail, MailOpen } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

export function MessagesInbox() {
  const { token } = useAuth();
  const items = useQuery(api.contact.list, token ? { token } : "skip");
  const markRead = useMutation(api.contact.markAsRead);
  const remove = useMutation(api.contact.remove);

  async function handleMarkRead(id: Id<"contactSubmissions">) {
    if (!token) return;
    await markRead({ token, id });
  }

  async function handleDelete(id: Id<"contactSubmissions">) {
    if (!token || !confirm("Delete this message?")) return;
    await remove({ token, id });
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-foreground">Messages</h1>

      <div className="space-y-2">
        {items?.map((msg) => (
          <div
            key={msg._id}
            className={cn(
              "rounded border border-border/30 bg-card px-4 py-3",
              !msg.read && "border-l-2 border-l-primary",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className={cn("font-medium", !msg.read ? "text-foreground" : "text-muted-foreground")}>
                    {msg.name}
                  </p>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                    {msg.inquiryType}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{msg.email}</p>
                <p className="mt-2 text-sm text-foreground">{msg.message}</p>
                <p className="mt-2 text-xs text-muted-foreground/50">
                  {new Date(msg._creationTime).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!msg.read && (
                  <button
                    onClick={() => handleMarkRead(msg._id)}
                    className="p-1 text-muted-foreground hover:text-primary"
                    title="Mark as read"
                  >
                    <MailOpen size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="p-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {items?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <Mail size={32} />
            <p>No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
