import { useState } from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Image,
  Video,
  Music,
  FileText,
  Quote,
  Calendar,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/bio", label: "Bio", icon: User },
  { to: "/admin/media/photos", label: "Photos", icon: Image },
  { to: "/admin/media/videos", label: "Videos", icon: Video },
  { to: "/admin/media/music", label: "Music", icon: Music },
  { to: "/admin/resume/experience", label: "Experience", icon: FileText },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ user, logout, onNavClick }: { user: { email: string }; logout: () => void; onNavClick?: () => void }) {
  return (
    <>
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
            onClick={onNavClick}
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
    </>
  );
}

export function AdminLayout() {
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 flex-shrink-0 flex-col border-r border-border/30 bg-card md:flex">
        <SidebarContent user={user} logout={logout} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-card shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <SidebarContent user={user} logout={logout} onNavClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-border/30 px-4 py-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-foreground">FC Admin</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
