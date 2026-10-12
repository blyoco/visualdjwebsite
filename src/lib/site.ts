// Links en gegevens die op meerdere plekken van de site staan.

export type SocialIconName = "instagram" | "beatport" | "mail";

export const socials: { label: string; detail: string; href: string; icon: SocialIconName }[] = [
  { label: "Instagram", detail: "@rodney_balai", href: "https://www.instagram.com/rodney_balai/", icon: "instagram" },
  { label: "Beatport", detail: "Balai", href: "https://www.beatport.com/artist/balai/1224263", icon: "beatport" },
  { label: "Email", detail: "rodneybalai@gmail.com", href: "mailto:rodneybalai@gmail.com", icon: "mail" },
];

export const nav = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

// "Get VisualDJ" gaat voorlopig naar het beta-blok; er is nog geen download of wachtlijst.
export const getHref = "#beta";
