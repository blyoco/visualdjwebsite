@AGENTS.md

# Website voor VisualDJ

Website voor VisualDJ, de automatische VJ-app van de gebruiker. De app zelf staat in `C:\Users\rodney\Documents\visuals` (GitHub `blyoco/visualsdj`, alleen lezen); haal de informatie over de app daar vandaan (README.md, docs/handleiding).

## Stand van zaken

- **Live:** https://visualdj.pages.dev (Cloudflare Pages-project `visualdj`). Elke push naar `main` op GitHub (`blyoco/visualdjwebsite`) gaat vanzelf live. Build-commando `npm run build`, uitvoermap `out`.
- **Domein:** www.visualdj.music is als custom domain toegevoegd in Cloudflare. Bij de domeinpartij moet een CNAME `www` → `visualdj.pages.dev` staan (dat doet de gebruiker zelf). Het kale visualdj.music volgt pas als het domeinslot eraf is (support loopt).

**Op de site (flitsend, met 3D op scroll):** van boven naar beneden: hero met een 3D-tunnelvlucht (`tunnel-scene.tsx`; op telefoons gewoon een video), de drie modi die op scroll in een cirkel over elkaar vegen (`modes.tsx`), stapelende feature-kaarten met video, How it works met een kantelend app-venster, een 3D-carrousel van clips (`gallery.tsx`), About, Beta, FAQ, en als afsluiter de zwerm die het logo vormt (`swarm-scene.tsx`). Over de hele pagina twee DNA-helixen van lichtpuntjes (`helix-scene.tsx`, naar vorm 60 "DNA" in de app) die tegengesteld draaien op de scroll en in het midden kruisen. Geluid: de knop in de menubalk speelt de loop naadloos (Web Audio, `sound.tsx`); `--beat` op `<html>` en `getBeat()` laten alles op de tel pulseren. Soepel scrollen met Lenis. Video's spelen alleen in beeld (`lazy-video.tsx`). De 3D en het soepele scrollen werken ook bij "minder beweging": de pc van de gebruiker staat zo ingesteld (Windows-animaties uit) en hij wil het zien.

**Beeld en geluid:**
- De clips in `public/video/` (standard, story, follow, dance, world; elk `.mp4` 720p, `-sm.mp4` 360p, `.jpg`) zijn gerenderd met de app zelf: `VisualDJ.exe --data=<testmap> --render=<wav>|0|45|1920x1080|0|<out.mp4>|q=3|logo=00|mode=<0..4>|fps=30` (0 Standard, 1 Story, 2 Follow, 3 Dans, 4 World). Gebruik een kopie van `visuals/tools/devdata` als testmap: zonder blokken blijven Standard en Dans zwart. Dans in 1080p werd zwart; in 1280x720 lukt hij.
- De app zet bij elke start ADE-beeld (geel) aan; dat gaat niet uit via de opdrachtregel. Daarom wordt de kleurtoon achteraf gedraaid met ffmpeg (`hue=h=..:s=1.4`): standard 215 (paars), story 245 (magenta), follow -30 (oranje), dance 110 (groen), world 130 (cyaan). Webversie: 15 s vanaf 4 s (zonder de fade van de render), 720p op 2200k, 360p op 650k.
- De loop `public/audio/loop-techno-1.m4a` komt uit `looptechno1.wav` (eigen track van de gebruiker, 128 BPM, 24 maten, 45,000 s), op −14 LUFS, AAC 160k. De bronbestanden (wav/mp3) staan niet in git. Er komen meer tracks.
- `node scripts/shots.mjs` (en `--phone`) maakt met de dev-server aan schermafbeeldingen op 13 scrollplekken in `shots/`. Het browservenster van de app en een Chrome-tab op de achtergrond tekenen geen video en geen frames; gebruik dit script.

**Nog open:**
- Meer tracks van de gebruiker: per track nieuwe clips renderen kan.
- "Get VisualDJ" leidt nog nergens heen (de knop in het beta-blok doet niets); de prijs is "beta".
- Let Techno Unite (social proof) komt later; de gebruiker levert het aan.
- De gebruiker houdt het bestaande logo; `assets/logo-concepten.html` bevat 5 afgewezen concepten.

## Afspraken

- Praat altijd Nederlands met de gebruiker.
- De site is alleen in het Engels. Geen vertalingen.
- Eigen ontwerp, niet hetzelfde als balai.music; zwart mag. De gebruiker bepaalt kleuren, lettertypes, indeling en animaties: vraag eerst.
- Kom nooit aan het account bij de domeinpartij (register.music); geef daar alleen uitleg.

## Techniek

Zelfde basis als `websitebalai`: Next.js 16 (App Router, TypeScript, code in `src/`), Tailwind CSS 4, Motion, Three.js via React Three Fiber (de 3D-scènes laden met `next/dynamic`, `ssr: false`), Lenis, shadcn/ui (21st.dev-onderdelen via `npx shadcn@latest add "<link>"`), statische export (`output: "export"`). `npm run dev` draait op poort 3200.
