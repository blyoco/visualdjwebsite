import { Disc3, Mail } from "lucide-react";
import type { SocialIconName } from "@/lib/site";

// Lucide heeft geen merklogo's meer; het Instagram-teken tekenen we zelf in dezelfde lijnstijl.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function SocialIcon({ name, className }: { name: SocialIconName; className?: string }) {
  if (name === "instagram") return <InstagramIcon className={className} />;
  if (name === "beatport") return <Disc3 aria-hidden className={className} />;
  return <Mail aria-hidden className={className} />;
}
