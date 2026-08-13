#!/usr/bin/env node
/**
 * Checks the collection in entries.js and reports anything that would embarrass
 * the site: a malformed entry, a surface that gives its own answer away, or
 * media that has gone.
 *
 * Three kinds of check:
 *
 *   structure  required fields present, known area and verdict, media that
 *              matches its kind, sources on the allowlist, alt text on images
 *   editorial  surface must not name one of the entry's own concepts, because
 *              in Class mode surface is the only text a student sees
 *   liveness   YouTube ids resolve at the oEmbed endpoint; image and audio
 *              sources answer a HEAD request
 *
 * Entries with no media are not failures. They are the to-do queue, and they
 * get listed at the end so it is obvious how long the queue is.
 *
 * Usage:
 *   node tools/check-links.mjs             structure, editorial and liveness
 *   node tools/check-links.mjs --offline   skip the network, check the rest
 *
 * Exit codes:
 *   0  everything passed
 *   1  a real problem: bad structure, leaked answer, or dead media
 *   2  inconclusive: could not reach YouTube at all, so liveness is unknown
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OFFLINE = process.argv.includes("--offline");

/* Must match the values offered in app.js. */
const AREAS = ["perception", "attention", "memory", "jdm", "social", "meta"];
const VERDICTS = ["accurate", "overstated", "myth"];
const KINDS = ["youtube", "image", "audio"];

/*
 * Read the allowlist out of app.js rather than keeping a second copy here.
 * Two lists would drift, and the one that drifts is the one that stops
 * protecting anybody.
 */
function loadAllowlist() {
  const src = readFileSync(path.join(ROOT, "app.js"), "utf8");
  const match = /const ALLOWED = (\[[\s\S]*?\]);/.exec(src);
  if (!match) throw new Error("could not find the ALLOWED list in app.js");
  return vm.runInNewContext(match[1]);
}
const ALLOWED = loadAllowlist();

function isAllowed(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return ALLOWED.includes(host) || host.endsWith(".edu");
  } catch { return false; }
}

function mediaKind(m) {
  if (!m) return "none";
  if (m.kind) return m.kind;
  return m.videoId ? "youtube" : "none";
}

/* Mirrors hasMedia() in app.js: what the card can actually render. */
function hasMedia(e) {
  const m = e?.media || {};
  switch (mediaKind(m)) {
    case "youtube": return Boolean(m.videoId);
    case "image":
    case "audio":   return Boolean(m.src) && isAllowed(m.src);
    default:        return false;
  }
}

function loadEntries() {
  const src = readFileSync(path.join(ROOT, "entries.js"), "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: "entries.js" });
  const entries = sandbox.window.ENTRIES;
  if (!Array.isArray(entries)) throw new Error("entries.js did not set window.ENTRIES to an array");
  return entries;
}

/* ---------------------------------------------------------------- checks --- */

function checkStructure(e, i) {
  const problems = [];
  const where = `entry ${i}`;
  const title = e?.source?.title;

  if (!title) problems.push(`${where}: source.title is missing`);
  if (!e?.source?.detail) problems.push(`${where} (${title}): source.detail is missing, so the clip could not be found again if the link died`);
  if (!e?.surface) problems.push(`${where} (${title}): surface is missing`);
  if (!e?.module) problems.push(`${where} (${title}): module is missing, so it will not appear under any course unit`);
  const m = e?.media || {};
  const kind = mediaKind(m);
  if (kind !== "none" && !KINDS.includes(kind)) {
    problems.push(`${where} (${title}): media.kind "${kind}" is not one of ${KINDS.join(", ")}`);
  } else if (kind === "youtube" && typeof m.videoId !== "string") {
    problems.push(`${where} (${title}): media.videoId must be a string, "" if the clip is not sourced yet`);
  } else if (kind === "image" || kind === "audio") {
    if (typeof m.src !== "string") {
      problems.push(`${where} (${title}): media.src must be a string, "" if it is not sourced yet`);
    } else if (m.src && !isAllowed(m.src)) {
      /* An off-allowlist source is a real failure, not a warning. The promise
         is that a visitor is never sent somewhere unvetted. */
      problems.push(`${where} (${title}): media.src is on ${new URL(m.src).hostname}, which is not on the allowlist`);
    }
    /* alt text is part of the quality floor, so a shipped image without it fails. */
    if (kind === "image" && m.src && !m.alt) {
      problems.push(`${where} (${title}): an image needs alt text`);
    }
  }
  if (!Array.isArray(e?.concepts) || e.concepts.length === 0) {
    problems.push(`${where} (${title}): needs at least one concept`);
    return problems;
  }
  e.concepts.forEach((c, j) => {
    const cw = `${where} (${title}), concept ${j + 1}`;
    if (!c.name) problems.push(`${cw}: name is missing`);
    if (!c.explanation) problems.push(`${cw} (${c.name}): explanation is missing`);
    if (!AREAS.includes(c.area)) problems.push(`${cw} (${c.name}): area "${c.area}" is not one of ${AREAS.join(", ")}`);
    if (!VERDICTS.includes(c.verdict)) problems.push(`${cw} (${c.name}): verdict "${c.verdict}" is not one of ${VERDICTS.join(", ")}`);
  });
  return problems;
}

/*
 * Conservative on purpose: it only fires when the whole concept name appears in
 * surface. A looser word-level check would flag ordinary English constantly and
 * would end up being ignored, which is worse than not checking.
 */
function checkSurfaceKeepsTheSecret(e, i) {
  const surface = String(e?.surface || "").toLowerCase();
  if (!surface) return [];
  return (e.concepts || [])
    .filter(c => c.name && surface.includes(String(c.name).toLowerCase()))
    .map(c => `entry ${i} (${e.source?.title}): surface names its own concept "${c.name}". In Class mode surface is the only text a student sees, so this gives the answer away.`);
}

/*
 * A filtering proxy answers 403 for a host it will not reach, which is
 * indistinguishable from YouTube answering 403 for a removed video unless you
 * look. Reporting a healthy clip as dead is the one failure this script must
 * not have, so the network path is proved before any 403 is believed.
 */
function looksIntercepted(res) {
  return res.headers.get("x-deny-reason") !== null;
}

/*
 * robots.txt rather than a known video id: it is stable, it is not something
 * that can be taken down, and a 200 with the expected body is only possible if
 * we genuinely reached YouTube.
 */
async function reachesYouTube() {
  try {
    const res = await fetch("https://www.youtube.com/robots.txt", { headers: { "user-agent": "tuned-in-link-check" } });
    if (looksIntercepted(res)) return { ok: false, reason: `blocked by a proxy (${res.headers.get("x-deny-reason")})` };
    if (res.status !== 200) return { ok: false, reason: `robots.txt answered HTTP ${res.status}` };
    const body = await res.text();
    if (!/user-agent/i.test(body)) return { ok: false, reason: "robots.txt did not look like YouTube's" };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

async function checkVideo(id) {
  const target = `https://www.youtube.com/watch?v=${id}`;
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(target)}&format=json`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": "tuned-in-link-check" } });
      if (looksIntercepted(res)) return { state: "unreachable", reason: `blocked by a proxy (${res.headers.get("x-deny-reason")})` };
      if (res.status === 200) {
        const json = await res.json();
        return { state: "alive", title: json.title, author: json.author_name };
      }
      /* YouTube answers 401 or 403 for private, removed and embed-disabled videos. */
      if (res.status === 401 || res.status === 403) return { state: "dead", reason: "private, removed, or embedding disabled" };
      if (res.status === 404) return { state: "dead", reason: "no such video" };
      if (attempt === 0) continue;
      return { state: "unknown", reason: `unexpected HTTP ${res.status}` };
    } catch (err) {
      if (attempt === 0) continue;
      return { state: "unreachable", reason: err.message };
    }
  }
}

/* Stills and audio are ordinary files, so a HEAD request settles it. */
async function checkUrl(src) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(src, { method: "HEAD", headers: { "user-agent": "tuned-in-link-check" } });
      if (looksIntercepted(res)) return { state: "unreachable", reason: `blocked by a proxy (${res.headers.get("x-deny-reason")})` };
      if (res.ok) return { state: "alive" };
      if (res.status === 401 || res.status === 403 || res.status === 404) {
        return { state: "dead", reason: `HTTP ${res.status}` };
      }
      if (attempt === 0) continue;
      return { state: "unknown", reason: `unexpected HTTP ${res.status}` };
    } catch (err) {
      if (attempt === 0) continue;
      return { state: "unreachable", reason: err.message };
    }
  }
}

/* ------------------------------------------------------------------ main --- */

const entries = loadEntries();
const problems = [];
entries.forEach((e, i) => {
  problems.push(...checkStructure(e, i));
  problems.push(...checkSurfaceKeepsTheSecret(e, i));
});

const sourced = entries.filter(hasMedia);
const awaiting = entries.filter(e => !hasMedia(e));

console.log(`Tuned In — ${entries.length} entries, ${entries.reduce((n, e) => n + (e.concepts?.length || 0), 0)} concepts`);
console.log(`${sourced.length} with media, ${awaiting.length} awaiting it\n`);

const dead = [];
let unreachable = 0;

if (OFFLINE) {
  console.log("Skipping the liveness check (--offline).\n");
} else {
  const reach = await reachesYouTube();
  if (!reach.ok) {
    console.log(`Cannot reach YouTube: ${reach.reason}.`);
    console.log("Liveness is unknown, so no clip is being called dead on this run.");
    if (problems.length) {
      console.log("\nProblems found without needing the network:");
      for (const p of problems) console.log(`  ${p}`);
      process.exit(1);
    }
    process.exit(2);
  }
  console.log("Checking media:");
  for (const e of sourced) {
    const kind = mediaKind(e.media);
    const ref = kind === "youtube" ? e.media.videoId : e.media.src;
    const result = kind === "youtube" ? await checkVideo(ref) : await checkUrl(ref);
    const name = e.source?.title;
    if (result.state === "alive") {
      /* Printing the live title makes rot into a *different* video visible,
         which a bare 200 would hide. */
      const detail = result.title ? ` -> "${result.title}" (${result.author})` : "";
      console.log(`  ok        ${kind.padEnd(7)} ${name}${detail}`);
    } else if (result.state === "dead") {
      console.log(`  DEAD      ${kind.padEnd(7)} ${name}: ${result.reason}`);
      dead.push(`${name} (${ref}): ${result.reason}`);
    } else {
      console.log(`  unknown   ${kind.padEnd(7)} ${name}: ${result.reason}`);
      unreachable++;
    }
  }
  console.log("");
}

if (awaiting.length) {
  console.log("Awaiting verified media:");
  for (const e of awaiting) console.log(`  ${e.source?.title} — ${e.source?.detail}`);
  console.log("");
}

if (problems.length) {
  console.log("Problems:");
  for (const p of problems) console.log(`  ${p}`);
  console.log("");
}

if (!OFFLINE && sourced.length > 0 && unreachable === sourced.length) {
  console.log(`Could not reach YouTube for any of the ${sourced.length} clips, so liveness is unknown.`);
  console.log("Treating this as inconclusive rather than passing or failing.");
  process.exit(2);
}

if (problems.length || dead.length) {
  console.log(`Failed: ${problems.length} problem(s), ${dead.length} dead clip(s).`);
  process.exit(1);
}

console.log("Passed.");
