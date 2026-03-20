import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Image,
  Video,
  Music,
  FileText,
  GraduationCap,
  Award,
  Wrench,
  Quote,
  Calendar,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/bio", label: "Bio", icon: User },
  { to: "/admin/media/photos", label: "Photos", icon: Image },
  { to: "/admin/media/videos", label: "Videos", icon: Video },
  { to: "/admin/media/music", label: "Music", icon: Music },
  { to: "/admin/resume/experience", label: "Experience", icon: FileText },
  { to: "/admin/resume/education", label: "Education", icon: GraduationCap },
  { to: "/admin/resume/skills", label: "Skills", icon: Wrench },
  { to: "/admin/resume/awards", label: "Awards", icon: Award },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-56 flex-shrink-0 flex-col border-r border-border/30 bg-card">
        <div className="border-b border-border/30 px-4 py-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            FC Admin
          </h2>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border/30 p-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
