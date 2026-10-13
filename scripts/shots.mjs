// Schermafbeeldingen van de site op verschillende scrollplekken, in Chrome zonder venster (met WebGL en video).
// Zo zie je de 3D-tunnel, de modi, de carrousel en de helix zoals een bezoeker ze ziet.
//
// Gebruik:  npm run dev   (in een ander venster)
//           node scripts/shots.mjs                     (laptop, 1440×900)
//           node scripts/shots.mjs --phone             (telefoon, 390×844)
//           node scripts/shots.mjs --url=http://localhost:3200
// De beelden komen in shots/ (staat niet in git).

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const args = process.argv.slice(2);
const phone = args.includes("--phone");
const url = args.find((a) => a.startsWith("--url="))?.slice(6) ?? "http://localhost:3200";
const [width, height] = phone ? [390, 844] : [1440, 900];
const outDir = path.join(ROOT, "shots");
fs.mkdirSync(outDir, { recursive: true });

// Waar we een foto maken: een element (en hoe ver erin, 0..1 van zijn scrollbare lengte) of een vaste plek.
const stops = [
  { name: "01-hero", at: "#top", f: 0 },
  { name: "02-tunnel-begin", at: "#top", f: 0.3 },
  { name: "03-tunnel-midden", at: "#top", f: 0.6 },
  { name: "04-tunnel-eind", at: "#top", f: 0.97 },
  { name: "05-modes-standard", at: "#modes", f: 0.05 },
  { name: "06-modes-story", at: "#modes", f: 0.3 },
  { name: "06b-modes-follow", at: "#modes", f: 0.5 },
  { name: "06c-modes-dance", at: "#modes", f: 0.7 },
  { name: "07-modes-world", at: "#modes", f: 0.97 },
  { name: "08-features", at: "#features", f: 0.35 },
  { name: "09-how", at: "#how", f: 0.55 },
  { name: "10-gallery", at: "section[data-gallery]", f: 0.4 },
  { name: "11-about", at: "#about", f: 0.1 },
  { name: "12-beta", at: "#beta", f: 0.1 },
  { name: "13-swarm", at: "section[aria-label=VisualDJ]", f: 0.98 },
];

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "visualdj-shots-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check",
  "--hide-scrollbars", "--mute-audio", `--window-size=${width},${height}`, "--autoplay-policy=no-user-gesture-required",
  "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader",
  "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", "about:blank",
]);
const wsUrl = await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("Chrome startte niet")), 20000);
  chrome.stderr.on("data", (chunk) => {
    const m = String(chunk).match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) { clearTimeout(timer); resolve(m[1]); }
  });
});
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let nextId = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (!msg.id || !pending.has(msg.id)) return;
  const { resolve, reject } = pending.get(msg.id);
  pending.delete(msg.id);
  msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
});
const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const page = (m, p) => send(m, p, sessionId);
const evaluate = async (expression) => {
  const { result, exceptionDetails } = await page("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
  return result.value;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await page("Page.enable");
await page("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: phone });
await page("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
await page("Page.navigate", { url });
while ((await evaluate("document.readyState").catch(() => "")) !== "complete") await wait(100);
await wait(5000);

for (const s of stops) {
  const y = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(s.at)});
    if (!el) return -1;
    const top = el.getBoundingClientRect().top + scrollY;
    const len = Math.max(0, el.offsetHeight - innerHeight);
    return Math.round(top + len * ${s.f});
  })()`);
  if (y < 0) { console.log(`${s.name}: niet gevonden (${s.at})`); continue; }
  // In stapjes scrollen, zodat alles wat op de scroll reageert meekomt
  const from = await evaluate("scrollY");
  for (let i = 1; i <= 12; i++) {
    await evaluate(`window.scrollTo(0, ${Math.round(from + ((y - from) * i) / 12)})`);
    await wait(60);
  }
  await wait(1800);
  const info = await evaluate(`(() => {
    const vids = [...document.querySelectorAll("video")];
    return { y: scrollY, videos: vids.length, playing: vids.filter((v) => !v.paused && v.readyState > 2).length };
  })()`);
  const { data } = await page("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  fs.writeFileSync(path.join(outDir, `${phone ? "phone-" : ""}${s.name}.jpg`), Buffer.from(data, "base64"));
  console.log(`${s.name}: y=${info.y}, video's ${info.playing}/${info.videos} spelen`);
}

ws.close();
chrome.kill();
