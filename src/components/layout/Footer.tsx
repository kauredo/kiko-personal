import { Instagram, Youtube, Music, Mail } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Music, href: "#", label: "Spotify" },
  { icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
  return (
    <footer className="px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p
          className="mb-12 max-w-md text-2xl text-foreground/80 md:text-3xl"
          style={{ fontFamily: "var(--font-heading)", lineHeight: 1.2, textTransform: "none", fontStyle: "italic" }}
        >
          Music is the only language that doesn't need translation.
        </p>

        <div className="flex flex-col gap-6 border-t border-border/30 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
            &copy; {new Date().getFullYear()} Francisco Catarro
          </p>
          <div className="flex items-center gap-5">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground transition-colors hover:text-foreground"
                data-hoverable
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
