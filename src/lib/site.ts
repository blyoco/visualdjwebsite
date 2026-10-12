// Links en gegevens die op meerdere plekken van de site staan.

export type SocialIconName = "instagram" | "beatport" | "mail";

export const socials: { label: string; detail: string; href: string; icon: SocialIconName }[] = [
  { label: "Instagram", detail: "@rodney_balai", href: "https://www.instagram.com/rodney_balai/", icon: "instagram" },
  { label: "Beatport", detail: "Balai", href: "https://www.beatport.com/artist/balai/1224263", icon: "beatport" },
  { label: "Email", detail: "rodneybalai@gmail.com", href: "mailto:rodneybalai@gmail.com", icon: "mail" },
];

export const nav = [
  { href: "#modes", label: "Modes" },
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

// "Get VisualDJ" gaat voorlopig naar het beta-blok; er is nog geen download of wachtlijst.
export const getHref = "#beta";

// De clips: gerenderd met VisualDJ zelf (RENDER VIDEO) op de loop hieronder.
// Per clip een 720p-versie (src), een kleine voor de 3D-tunnel en carrousel (small) en een stilstaand beeld (poster).
export type ClipName = "standard" | "story" | "follow" | "dance" | "world";
export const clip = (name: ClipName) => ({
  src: `/video/${name}.mp4`,
  small: `/video/${name}-sm.mp4`,
  poster: `/video/${name}.jpg`,
});

// De soundtrack van de site: een eigen loop van Rodney (24 maten op 128 BPM).
export const loop = { src: "/audio/loop-techno-1.m4a", bpm: 128, seconds: 45 };
