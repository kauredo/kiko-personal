import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Home } from "@/pages/Home";
import { AuthProvider } from "@/components/admin/AuthProvider";
import { AdminLayout } from "@/components/admin/shared/AdminLayout";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL ?? "https://placeholder.convex.cloud",
);

// Lazy load admin pages
const AdminLogin = lazy(() =>
  import("@/pages/admin/AdminLogin").then((m) => ({ default: m.AdminLogin })),
);
const Dashboard = lazy(() =>
  import("@/pages/admin/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const BioEditor = lazy(() =>
  import("@/pages/admin/BioEditor").then((m) => ({ default: m.BioEditor })),
);
const MediaManager = lazy(() =>
  import("@/pages/admin/MediaManager").then((m) => ({
    default: m.MediaManager,
  })),
);
const ExperienceManager = lazy(() =>
  import("@/pages/admin/ExperienceManager").then((m) => ({
    default: m.ExperienceManager,
  })),
);
const EventsManager = lazy(() =>
  import("@/pages/admin/EventsManager").then((m) => ({
    default: m.EventsManager,
  })),
);
const TestimonialsManager = lazy(() =>
  import("@/pages/admin/TestimonialsManager").then((m) => ({
    default: m.TestimonialsManager,
  })),
);
const MessagesInbox = lazy(() =>
  import("@/pages/admin/MessagesInbox").then((m) => ({
    default: m.MessagesInbox,
  })),
);
const SettingsPage = lazy(() =>
  import("@/pages/admin/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  })),
);

function AdminLoading() {
  return (
    <div className="flex h-32 items-center justify-center text-muted-foreground">
      Loading...
    </div>
  );
}

export function App() {
  return (
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          {/* Admin */}
          <Route
            path="/admin/*"
            element={
              <AuthProvider>
                <Suspense fallback={<AdminLoading />}>
                  <Routes>
                    <Route path="login" element={<AdminLogin />} />
                    <Route element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="bio" element={<BioEditor />} />
                      <Route
                        path="media/photos"
                        element={<MediaManager type="photo" />}
                      />
                      <Route
                        path="media/videos"
                        element={<MediaManager type="video" />}
                      />
                      <Route
                        path="media/music"
                        element={<MediaManager type="music" />}
                      />
                      <Route
                        path="resume/experience"
                        element={<ExperienceManager />}
                      />
                      <Route
                        path="resume/education"
                        element={<ExperienceManager />}
                      />
                      <Route
                        path="resume/skills"
                        element={<ExperienceManager />}
                      />
                      <Route
                        path="resume/awards"
                        element={<ExperienceManager />}
                      />
                      <Route
                        path="testimonials"
                        element={<TestimonialsManager />}
                      />
                      <Route path="events" element={<EventsManager />} />
                      <Route path="messages" element={<MessagesInbox />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>
                  </Routes>
                </Suspense>
              </AuthProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConvexProvider>
  );
}
