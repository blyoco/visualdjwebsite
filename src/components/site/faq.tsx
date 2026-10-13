import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "./reveal";

const faq = [
  {
    q: "What is VisualDJ?",
    a: "An automatic VJ for Windows PC – and Mac at launch. It listens to the music, finds the beat and plays visuals all night, mixing in the photos, videos and texts of the DJ who is on and of the event itself. Five kinds of picture: Standard (animations that switch on the beat), Story (one long journey with a living camera), Follow (that journey with a line of fire and a calm camera), Dance (the swarm dancing in moves that land on the bar) and World (full worlds that break open on the beat).",
  },
  {
    q: "What do I need?",
    a: "A Windows 10 or 11 PC or laptop, a sound source and a second screen or projector over HDMI. The sound can be a DJ mixer over USB, any other audio input, or a track you play on the laptop itself. No installer and no account: VisualDJ is a single file you start directly.",
  },
  {
    q: "Can I make videos with it?",
    a: "Yes. RENDER VIDEO turns a track into a video with the show's picture: Reel, Story, Post, YouTube, Shorts or a small 16:9 picture, at 30 or 60 frames a second, with its own media, background and logo. Every clip on this site was made that way.",
  },
  {
    q: "Which languages does it speak?",
    a: "English and Dutch are built in. Choose Other language (online) and the app translates itself once into the language you pick – the window, the manual and the remote on your phone.",
  },
  {
    q: "Does it mess with my mixer or my livestream?",
    a: "No. VisualDJ shares the audio input with other programs, so a stream or recording keeps reading it at the same time. It never changes the volume, the format or the default device. Anything it needs, like mono or one channel pair, it does with its own copy of the sound.",
  },
  {
    q: "How does it find the tempo?",
    a: "Straight from the sound, whatever the source: within about a second and a half after the first kicks the BPM is there, to a tenth of a beat, and it follows a DJ who rides the pitch. As an extra option, a Pioneer DJM-900NXS2 or DJM-A9 can send its own BPM over MIDI on the same USB cable. Above 155 BPM the visuals switch to half time by themselves.",
  },
  {
    q: "What kind of media can I add?",
    a: "Photos (jpg, png, gif, webp, bmp), videos (mp4, webm, mov with H.264) and texts. Pictures are never stretched. Texts come in on the one, with forty ways to move, from scrollers and typewriters to text written by the swarm itself.",
  },
  {
    q: "What if a DJ runs late or stops early?",
    a: "Hit Extend and the current DJ keeps going, or Next to hand over now. The rest of the night stays on its times. Both buttons are also on the remote on your phone.",
  },
  {
    q: "Can I control it from my phone?",
    a: "Yes. Open the address from the settings on a phone in the same network and log in with your code. You see who's on and who's next, and you can play, extend, skip, switch the picture or send a text to the screen.",
  },
  {
    q: "Will it run on my laptop?",
    a: "Yes. Choose Performance for always-smooth visuals, even on a 4K projector, or Quality on a heavy PC. You can cap how much of the CPU VisualDJ may use, so a recording on the same laptop never runs short.",
  },
  {
    q: "How do I get it?",
    a: "VisualDJ launches in the week of ADE 2026 (Amsterdam Dance Event, October), for Windows PC and Mac – subject to change. Keep an eye on this site.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-t border-line py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">FAQ</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Questions, answered.</h2>
          <p className="mt-5 text-lg text-muted">
            Something missing?{" "}
            <a href="mailto:rodneybalai@gmail.com" className="text-foreground underline underline-offset-4 hover:no-underline">
              Send me an email.
            </a>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="border-t border-line">
            {faq.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`} className="border-b border-line">
                <AccordionTrigger className="py-5 text-base font-medium hover:no-underline md:text-lg">{item.q}</AccordionTrigger>
                <AccordionContent className="pb-6 text-base text-pretty text-muted">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
