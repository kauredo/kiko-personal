import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  STATS,
  SERVICES,
  FALLBACK_EVENTS,
  FALLBACK_EXPERIENCES,
  FALLBACK_TESTIMONIALS,
  FALLBACK_MEDIA,
  FALLBACK_BIO,
  FALLBACK_SETTINGS,
  type HomeEvent,
  type HomeExperience,
  type HomeTestimonial,
  type HomeMedia,
  type HomeBio,
  type HomeSettings,
} from "@/data/fallbacks";

function formatDate(iso: string, style: "title" | "upper"): string {
  const d = new Date(iso + "T00:00:00");
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = String(d.getDate()).padStart(2, "0");
  const str = `${month} ${day}`;
  return style === "upper" ? str.toUpperCase() : str;
}

export function useHomeData() {
  const rawEvents = useQuery(api.events.list, { type: "upcoming" });
  const rawTestimonials = useQuery(api.testimonials.list, { featured: true });
  const rawExperiences = useQuery(api.resume.listExperiences, {});
  const rawBio = useQuery(api.bio.get);
  const rawSettings = useQuery(api.settings.get);
  const rawMedia = useQuery(api.media.list, { featured: true });

  const events: HomeEvent[] = rawEvents === undefined
    ? FALLBACK_EVENTS
    : rawEvents.slice(0, 5).map((e) => ({
        title: e.title,
        date: e.date,
        dateFormatted: formatDate(e.date, "title"),
        dateShort: formatDate(e.date, "upper"),
        year: e.date.slice(0, 4),
        venue: e.venue ?? "",
        city: e.city ?? "",
        ticketUrl: e.ticketUrl ?? null,
      }));

  const experiences: HomeExperience[] = rawExperiences === undefined
    ? FALLBACK_EXPERIENCES
    : rawExperiences.map((exp) => ({
        title: exp.title,
        organization: exp.organization,
        period: exp.endDate
          ? `${exp.startDate.slice(0, 4)} — ${exp.endDate.slice(0, 4)}`
          : `${exp.startDate.slice(0, 4)} —`,
        startYear: exp.startDate.slice(0, 4),
        description: exp.description ?? "",
      }));

  const testimonials: HomeTestimonial[] = rawTestimonials === undefined
    ? FALLBACK_TESTIMONIALS
    : rawTestimonials.map((t) => ({
        quote: t.quote,
        authorName: t.authorName,
        authorRole: t.authorRole ?? "",
      }));

  const media: HomeMedia[] = rawMedia === undefined
    ? FALLBACK_MEDIA
    : rawMedia.map((m) => ({
        id: m._id,
        type: m.type,
        title: m.title,
        description: m.description ?? null,
        imageUrl: (m as Record<string, unknown>).imageUrl as string | null ?? null,
        thumbnailUrl: (m as Record<string, unknown>).thumbnailUrl as string | null ?? null,
        videoUrl: m.videoUrl ?? null,
        audioUrl: (m as Record<string, unknown>).audioFileUrl as string | null ?? null,
        album: m.album ?? null,
        year: m.year ?? null,
      }));

  const photos = media.filter((m) => m.type === "photo");
  const videos = media.filter((m) => m.type === "video");
  const music = media.filter((m) => m.type === "music");

  const name = rawBio?.name ?? FALLBACK_BIO.name;
  const nameParts = name.split(" ");
  const bio: HomeBio = rawBio === undefined
    ? FALLBACK_BIO
    : {
        name,
        firstName: nameParts[0] ?? "",
        lastName: nameParts.slice(1).join(" "),
        title: rawBio?.title ?? FALLBACK_BIO.title,
        content: rawBio?.content ?? "",
        profilePhotoUrl: (rawBio as Record<string, unknown>)?.profilePhotoUrl as string | null ?? null,
      };

  const settings: HomeSettings = rawSettings === undefined
    ? FALLBACK_SETTINGS
    : {
        heroTagline: rawSettings.heroTagline,
        heroSubtitle: rawSettings.heroSubtitle ?? FALLBACK_SETTINGS.heroSubtitle,
        contactEmail: rawSettings.contactEmail,
        socialLinks: rawSettings.socialLinks,
      };

  return {
    events,
    experiences,
    testimonials,
    media,
    photos,
    videos,
    music,
    bio,
    settings,
    stats: STATS,
    services: SERVICES,
    isLoading: rawEvents === undefined,
  };
}
