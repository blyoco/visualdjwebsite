@AGENTS.md

# Website voor VisualDJ

Website voor VisualDJ, de automatische VJ-app van de gebruiker. De app zelf staat in `C:\Users\rodney\Documents\visuals` (GitHub `blyoco/visualsdj`, alleen lezen); haal de informatie over de app daar vandaan (README.md, docs/handleiding).

## Stand van zaken

- **Live:** https://visualdj.pages.dev (Cloudflare Pages-project `visualdj`). Elke push naar `main` op GitHub (`blyoco/visualdjwebsite`) gaat vanzelf live. Build-commando `npm run build`, uitvoermap `out`.
- **Domein:** www.visualdj.com is als custom domain toegevoegd in Cloudflare. Bij de domeinpartij moet een CNAME `www` → `visualdj.pages.dev` staan (dat doet de gebruiker zelf). Het kale visualdj.com volgt pas als het domeinslot eraf is (support loopt).

## Afspraken

- Praat altijd Nederlands met de gebruiker.
- De site is alleen in het Engels. Geen vertalingen.
- Eigen ontwerp, niet hetzelfde als balai.music; zwart mag. De gebruiker bepaalt kleuren, lettertypes, indeling en animaties: vraag eerst.
- Kom nooit aan het account bij de domeinpartij (register.music); geef daar alleen uitleg.

## Techniek

Zelfde basis als `websitebalai`: Next.js 16 (App Router, TypeScript, code in `src/`), Tailwind CSS 4, Motion, shadcn/ui (21st.dev-onderdelen via `npx shadcn@latest add "<link>"`), statische export (`output: "export"`). `npm run dev` draait op poort 3200.
