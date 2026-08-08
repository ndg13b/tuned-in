#!/usr/bin/env node
/**
 * Checks the collection in entries.js and reports anything that would embarrass
 * the site: a malformed entry, a surface that gives its own answer away, or a
 * clip whose video has gone.
 *
 * Three kinds of check:
 *
 *   structure  required fields are present, area and verdict are known values
 *   editorial  surface must not name one of the entry's own concepts, because
 *              in Class mode surface is the only text a student sees
 *   liveness   every media.videoId still resolves at YouTube's oEmbed endpoint
 *
 * Entries with an empty videoId are not failures. They are the to-do queue, and
 * they get listed at the end so it is obvious how long the queue is.
 *
 * Usage:
 *   node tools/check-links.mjs             structure, editorial and liveness
 *   node tools/check-links.mjs --offline   skip the network, check the rest
 *
 * Exit codes:
 *   0  everything passed
 *   1  a real problem: bad structure, leaked answer, or a dead video
 *   2  inconclusive: could not reach YouTube at all, so liveness is unknown
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OFFLINE = process.argv.includes("--offline");

/* Must match the values documented in CLAUDE.md and offered in app.js. */
const AREAS = ["perception", "attention", "memory", "jdm", "social", "meta"];
const VERDICTS = ["accurate", "overstated", "myth"];

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
  if (typeof e?.media?.videoId !== "string") problems.push(`${where} (${title}): media.videoId must be a string, "" if the clip is not sourced yet`);
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

/* ------------------------------------------------------------------ main --- */

const entries = loadEntries();
const problems = [];
entries.forEach((e, i) => {
  problems.push(...checkStructure(e, i));
  problems.push(...checkSurfaceKeepsTheSecret(e, i));
});

const sourced = entries.filter(e => e?.media?.videoId);
const awaiting = entries.filter(e => !e?.media?.videoId);

console.log(`Tuned In — ${entries.length} entries, ${entries.reduce((n, e) => n + (e.concepts?.length || 0), 0)} concepts`);
console.log(`${sourced.length} with a clip, ${awaiting.length} awaiting one\n`);

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
  console.log("Checking clips against YouTube:");
  for (const e of sourced) {
    const id = e.media.videoId;
    const result = await checkVideo(id);
    const name = e.source?.title;
    if (result.state === "alive") {
      /* Printing the live title makes rot into a *different* video visible,
         which a bare 200 would hide. */
      console.log(`  ok        ${id}  ${name} -> "${result.title}" (${result.author})`);
    } else if (result.state === "dead") {
      console.log(`  DEAD      ${id}  ${name}: ${result.reason}`);
      dead.push(`${name} (${id}): ${result.reason}`);
    } else {
      console.log(`  unknown   ${id}  ${name}: ${result.reason}`);
      unreachable++;
    }
  }
  console.log("");
}

if (awaiting.length) {
  console.log("Awaiting a verified clip:");
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
