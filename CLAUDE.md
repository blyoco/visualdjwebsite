@AGENTS.md

# Website voor VisualDJ

Website voor VisualDJ, de automatische VJ-app van de gebruiker (Rodney Balai). De app zelf staat in `..\visuals` (GitHub `blyoco/visualsdj`, alleen lezen); haal de feiten over de app daar vandaan, vooral uit `docs/handleiding/manual.html` (Engelse handleiding) en de README.

## Stand van zaken (14 oktober 2026)

- **Live:** https://www.visualdj.music (en https://visualdj.pages.dev). Cloudflare Pages-project `visualdj`; elke push naar `main` op GitHub (`blyoco/visualdjwebsite`) gaat binnen een paar minuten vanzelf live. Build-commando `npm run build`, uitvoermap `out`.
- **Domein:** visualdj.music staat bij register.music. Daar staat een CNAME `www` → `visualdj.pages.dev` (werkt). Het kale visualdj.music volgt pas als het domeinslot eraf is (support van register.music loopt), net als bij balai.music.
- **Lancering:** de echte lancering (geen demo) in de week van ADE 2026, voor Windows PC en Mac, onder voorbehoud. "Get VisualDJ" leidt nog nergens heen.

### Wat er op de site staat (van boven naar beneden, `src/app/page.tsx`)

1. **Menubalk** (`navbar.tsx`) met daarboven een ADE-gele balk (#ffe600, zwarte letters) over de lancering (`launch.tsx` → `LaunchBar`). Wordmark `public/img/wordmark.webp` (origineel in `assets/`). Geluidsknop.
2. **Hero** (`hero.tsx` + `tunnel-scene.tsx`): 3D-tunnelvlucht op scroll (240vh), zwevende clips, aan het eind een groot scherm met Standard. Op telefoons (< 768px) gewoon een video. Kop "See the music.".
3. **Launch** (`launch.tsx`): ADE-logo (`public/img/ade-logo.webp`, aangeleverd door Rodney, origineel in `assets/`), "Launching at ADE.", PC en Mac, onder voorbehoud.
4. **Vijf modi** (`modes.tsx`): Standard, Story, Follow, Dance, World; het beeld veegt op scroll in een cirkel over elkaar. Teksten uit de handleiding.
5. **Features** (`features.tsx`): drie stapelende kaarten met video. Het tempo komt rechtstreeks uit elke audiobron (mixer via USB, elke ingang, of een track op de laptop zelf); MIDI van een DJM-900NXS2 of DJM-A9 is een extra optie.
6. **Showcase** (`showcase.tsx`): teksten (115 bewegingen) en achtergronden/eigen logo (D-achtergrond, 13 animaties), elk met een grote video.
7. **Test. Live. Render.** (`work-modes.tsx`, anker `#render`): de drie standen van de app, klikbaar.
8. **How it works** (`how-it-works.tsx`): drie stappen en een kantelend app-venster met drie tabbladen (`public/img/app-window.png`, `app-blocks.webp`, `app-render.webp`; de laatste twee zijn schermafbeeldingen van Rodney).
9. **Carrousel** (`gallery.tsx`): 3D-cilinder van clips. Klik = het filmpje groeit naar het midden; bladeren met pijlknoppen, pijltjestoetsen of vegen; wegklikken / Esc = het krimpt terug. Zolang het open is staat de pagina stil (`pauseScroll`).
10. **More** (`more.tsx`): remote, opnemen naast je stream, talen, showbestand, beamer, prestaties.
11. **About** (`about.tsx`): foto en bio (link naar www.balai.music), socials, en het LTU-blok: Let Techno Unite Records is niet van Rodney maar het label waar hij voor werkt; oprichter is DJ Perroz (https://www.instagram.com/djperroz/).
12. **Launch-blok** (`beta.tsx`, anker `#beta`): "Be there at launch", knop doet nog niets.
13. **FAQ** (`faq.tsx`).
14. **Zwerm-logo + footer** (`swarm-logo.tsx`, `swarm-scene.tsx`, `footer.tsx`): het laatste scherm. De zwerm laadt ruim van tevoren, vloeit in zodra het scherm onder de FAQ omhoog komt en is het complete logo op ongeveer 70% van dat laatste stuk, dus al voor je helemaal onderaan bent. Footer-credits: ADE-logo door Fosfor Design (https://fosfordesign.nl/), muziek BALAI – O.N.E (link www.balai.music).

Over de hele pagina (vanaf het einde van de tunnel): **sterrenpixels** (`stars.tsx` + `star-scene.tsx`), grijs-wit, drie diepte-lagen, schuiven mee met de scroll en lichten op op de tel. De **pixelslangen** staan uit (te druk voor de gebruiker); de code staat nog in `snake-scene.tsx`.

### Techniek die belangrijk is

- Een Canvas die als laag over de pagina ligt moet `style={{ pointerEvents: "none" }}` hebben: R3F zet hem anders zelf op "auto" en dan vangt hij alle klikken af.
- **Geluid** (`sound.tsx`): de knop speelt de loop naadloos (Web Audio). `--beat` op `<html>` en `getBeat()` laten alles op de tel pulseren; zonder geluid een zachte puls op 128 BPM.
- **Scrollen** (`smooth-scroll.tsx`): Lenis met `respectReducedMotion: false`. Een klik op een #-link springt bijna naar het onderdeel en glijdt het laatste derde scherm (`HEADER = 96`: ADE-balk + menubalk).
- **"Minder beweging":** de pc van de gebruiker staat zo ingesteld (Windows-animaties uit) en hij wil de effecten zien. De 3D en het soepele scrollen werken daarom ook dan.
- Video's spelen alleen als ze in beeld zijn (`lazy-video.tsx`). De pc van de gebruiker heeft een lichte videokaart (GeForce GT 710).
- **Controleren:** `npm run dev` (poort 3200) en dan `node scripts/shots.mjs` (desktop) of `node scripts/shots.mjs --phone`: schermafbeeldingen op ~20 scrollplekken in `shots/` (Chrome zonder venster, met WebGL en video). Het browservenster van de Claude-app en een Chrome-tab op de achtergrond tekenen geen video en geen frames; gebruik dit script.

### Beeld en geluid

- **Clips** in `public/video/`: `standard`, `story`, `follow`, `dance`, `world`, `texts`, `background`; elk `.mp4` (720p, ~2,2 Mbit/s), `-sm.mp4` (360p) en `.jpg`. Allemaal gerenderd met de app zelf, op Rodney's loop.
- **Renderen:** `scripts/render/render-clips.ps1` (zie de uitleg bovenin dat script) en `scripts/render/webclip.ps1`. Basis is Rodney's eigen show `..\visuals\voorbeeld\Let Techno Unite 2.vdj` (een zip; uitgepakt als `--data`-map). De D-achtergrond is `event/achtergrond/IMG_5527.JPG` ("direct": true, effect Ring Tower).
- De app zet bij elke start ADE-beeld (geel) aan; dat gaat niet uit via de opdrachtregel. Daarom draait `webclip.ps1` de kleurtoon: standard 215 (paars), story 245 (magenta), follow -30 (oranje), dance 110 (groen), world 130 (cyaan). `background` houdt zijn eigen kleuren. Wil de gebruiker de echte paletten, dan is er in de app een optie nodig om ADE-beeld uit te zetten bij het renderen.
- `texts.mp4` is gemonteerd uit vijf tekstmomenten van 4 s uit `text0..5` (SEE THE MUSIC, FEEL THE FREQUENCY, SOUND BECOMES SPACE, NO TIME ONLY SOUND, FOLLOW THE BASS), elk in een eigen kleurtoon, met xfade-overgangen van 0,5 s.
- **Loop:** `public/audio/loop-techno-1.m4a` uit `assets/audio/looptechno1.wav` (BALAI – O.N.E, eigen track, 128 BPM, 24 maten, 45,000 s), op −14 LUFS, AAC 160k. Er komen meer tracks; per track kunnen nieuwe clips worden gerenderd.

## Werken op een andere pc

- Nodig: Git, Node.js 24, Google Chrome op de standaardplek (`C:/Program Files/Google/Chrome/Application/chrome.exe`, voor `scripts/shots.mjs`) en ffmpeg (voor de clips).
- Beginnen: `git clone https://github.com/blyoco/visualdjwebsite.git`, dan `npm install` en `npm run dev` (poort 3200). Pushen naar `main` zet de site live; daarvoor moet je op die pc bij GitHub ingelogd zijn.
- Nieuwe clips renderen kan alleen met de app ernaast: clone `blyoco/visualsdj` naast deze map (als `visuals`) en bouw hem (zie de README daar).

## Nog open

- E-maillijst voor een melding bij de lancering: advies gegeven (een mailingdienst als MailerLite of Brevo, met dubbele opt-in en een korte privacytekst), nog niet gebouwd. De gebruiker maakt zelf het account; daarna een formulier in het blok "Be there at launch".
- Waar "Get VisualDJ" heen moet (download, winkel) bij de lancering.
- In de FAQ "What do I need?": "No installer and no account: VisualDJ is a single file" geldt voor Windows; nagaan of dat voor de Mac ook zo is.
- Het ADE-logo staat er op aangeven van de gebruiker; hij gaat ervan uit dat hij het mag gebruiken (LTU-avond in het ADE-programma).
- `assets/logo-concepten.html` bevat 5 logo-concepten; de gebruiker houdt het bestaande wordmark.

## Afspraken

- Praat altijd Nederlands met de gebruiker, ook in de korte berichtjes tussendoor.
- De site is alleen in het Engels. Geen vertalingen.
- Eigen ontwerp: zwart, de kleur komt uit de visuals; geen ADE-kleuren in het ontwerp, behalve de ADE-balk en het ADE-logo. De gebruiker bepaalt de keuzes; bij twijfel eerst vragen of advies geven.
- Kom nooit aan het account bij de domeinpartij (register.music); geef daar alleen uitleg.
- Geen "Co-Authored-By: Claude" in commits.
- Zet een wijziging na controle (lint, build, schermafbeeldingen) gewoon online en meld wat er live staat.

## Techniek

Next.js 16 (App Router, TypeScript, code in `src/`), Tailwind CSS 4, Motion, Three.js via React Three Fiber (3D-scènes laden met `next/dynamic`, `ssr: false`), Lenis, shadcn/ui (`npx shadcn@latest add "<link>"`), statische export (`output: "export"`). Gedeelde links en clipnamen in `src/lib/site.ts`.
