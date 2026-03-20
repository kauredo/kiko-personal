import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Image,
  Video,
  Music,
  Calendar,
  Mail,
  Quote,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | undefined;
  icon: typeof Image;
}) {
  return (
    <div className="rounded-lg border border-border/30 bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {value ?? "—"}
          </p>
        </div>
        <Icon size={24} className="text-primary/50" />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { token } = useAuth();
  const stats = useQuery(api.dashboard.getStats, token ? { token } : "skip");

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Photos" value={stats?.photos} icon={Image} />
        <StatCard label="Videos" value={stats?.videos} icon={Video} />
        <StatCard label="Music" value={stats?.music} icon={Music} />
        <StatCard
          label="Upcoming Events"
          value={stats?.upcomingEvents}
          icon={Calendar}
        />
        <StatCard
          label="Unread Messages"
          value={stats?.unreadMessages}
          icon={Mail}
        />
        <StatCard
          label="Testimonials"
          value={stats?.testimonials}
          icon={Quote}
        />
      </div>
    </div>
  );
}
