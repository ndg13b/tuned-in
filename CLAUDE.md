# Project context

**Tuned In** — *what your mind is doing while you watch*. Repo `tuned-in`,
served from `index.html`.

The name reads two ways on purpose: tuned in to a broadcast, and tuned in to the
mechanisms behind what you are watching. The second is the thesis. Keep the
voice on that side — curious and unillusioned, never mystical. This site
debunks pop psychology as often as it explains it, so avoid wellness and
intuition register in any copy.

A teaching website that pairs pop culture clips with the cognitive psychology
concepts they demonstrate. Audience: college students and the instructors
teaching them, plus curious general visitors. The point is engagement — a clip
someone already recognises is a better door into a concept than a definition is.

Single author. Static site, no backend, no accounts, no database. Deployed on
GitHub Pages.

## Prime directives

1. **Never invent a video ID, URL, or timestamp.** If a clip has not been found
   and verified, leave `media.videoId` as `""`. The card renders a "No verified
   clip yet" state, which doubles as the to-do queue. A fabricated link is worse
   than an empty one on a site whose whole promise is that links are safe.
2. **Never rehost media.** Clips play through the platform's own embed player so
   the view is counted for the rights holder. Do not download, clip, re-edit, or
   mirror. Some sources restrict this explicitly (Richard Wiseman's Quirkology
   videos, for example, forbid commercial use and re-editing).
3. **Every link is checked against the `ALLOWED` host list before an entry ships.**
   A visitor must never be sent somewhere unvetted. Adding a host to the
   allowlist is a deliberate decision, not a workaround for a failing check.
4. **No `localStorage`, `sessionStorage`, or any browser storage.** State lives
   in JS variables for the session and that is fine.
5. **Do not claim more privacy than the code delivers.** Thumbnails and
   typefaces come from Google, and a still on a card comes from whichever host
   serves it, so those hosts are contacted on page load, before any click.
   Video players and audio wait for the click. The footer says exactly that. If
   the loading behaviour ever changes — self-hosted fonts, a thumbnail-free
   facade — the footer changes with it, in the same commit.

## Voice

Written by one person, an instructor, for students and other instructors. Not
institutional, not brand-y, no exclamation marks.

- **Funny where it's genuinely funny, and nowhere else.** Humour is a way in,
  not a house style. Michael Scott driving into a lake is funny; the eyewitness
  case is not, and forcing lightness onto it would cost the site its credibility
  on the material that matters most.
- **Respect the reader's intelligence.** Explain the mechanism properly rather
  than simplifying it into something students will have to unlearn later.
- **Prefer accuracy to a cleaner story.** The `overstated` verdict exists
  because reality did not fit a two-way split. When the research is messier than
  the pop version, say so — that gap is often the most interesting content on
  the card.
- **Never sneer at people for being fooled.** Everyone is subject to all of
  this, including the author and including the researchers. Cards about myths
  correct the claim, not the person who believed it.

## How the author works

Read from one long design conversation; correct anything here that is wrong.

- Thinks out loud. Phrases like "I am sort of leaning" or "I almost want" are
  live reasoning, not settled specifications. Do not treat every musing as an
  instruction — offer something concrete and let them react to it.
- Comfortable saying they do not know yet, and would rather see a real thing
  than approve a plan in the abstract. Build the option; do not describe it.
- Pushes back with reasons and expects reasons back. Disagreement is useful to
  them. Do not fold the moment they object, and do not argue past the point
  where they have made a fair case.
- Pragmatic about risk. Weighs whether a concern is actually load-bearing rather
  than avoiding anything that could theoretically go wrong.
- Instinctively protective of the end user. The safe-links requirement arrived
  unprompted in the first message, before any discussion of features.

Preferences set in the claude.ai profile do not travel here, so, restated:
expand an acronym in full the first time it appears, and ask clarifying
questions when the answer would change what gets built.

## Already considered and rejected

See `DECISIONS.md` before proposing a change to naming, card structure, or the
authoring workflow. Several obvious-looking ideas were tried and turned down for
reasons that are not visible from the current code.

## Files

- `index.html` — markup only
- `styles.css` — all styling
- `entries.js` — the collection, as `window.ENTRIES`. The only file edited routinely
- `app.js` — the `AREAS` taxonomy, the `ALLOWED` host list, and all behaviour
- `tools/check-links.mjs` — the collection checker, run in CI

## Checks

`node tools/check-links.mjs` validates required fields, known `area` and
`verdict` values, that no `surface` names one of its own concepts, and that
every `media.videoId` still resolves at YouTube. `--offline` skips the network
half. GitHub Actions runs it on content changes and weekly.

It proves it can reach YouTube before believing any 403, because a filtering
proxy answers 403 as well, and reporting a healthy clip as dead would make the
check worse than useless. Exit `1` is a real problem, `2` means liveness could
not be determined.

## Data model

Content lives in `entries.js` as `window.ENTRIES`, a flat array. One entry is one
piece of media, which may demonstrate several concepts.

```js
{
  source:  { title, kind, detail },     // detail = where in it, e.g. "S3E12" or a scene description
  media:   { kind, ... },               // see below; empty means it is still in the queue
  module:  "Memory",                    // course unit, drives the syllabus view
  surface: "...",                       // what a viewer SEES. Must not name any concept.
  prompt:  "...",                       // question to put to a class before revealing
  concepts: [ { name, area, verdict, explanation } ],
  tags:    [],
  note:    "..."                        // optional content advisory, rendered above the player
}
```

`media.kind` is one of three, because not everything worth teaching is a video —
The Dress is a photograph and Yanny/Laurel is a sound file:

```js
{ kind:"youtube", videoId:"", start:0 }              // "" means still in the queue
{ kind:"image",   src:"", alt:"", credit:"" }        // alt is required once src is set
{ kind:"audio",   src:"", credit:"" }
```

`src` must be on the `ALLOWED` host list or the card refuses to render it and the
checker fails. Stills are shown directly, since a still *is* the content rather
than a preview of it; audio uses `preload="none"` so nothing is fetched until
someone presses play. An entry with no usable media renders "No verified media
yet" and stays in the queue.

`area` is one of: `perception`, `attention`, `memory`, `jdm`, `social`, `meta`.

`verdict` is one of three, and the middle one is load-bearing:
- `accurate` — the clip shows the real thing
- `overstated` — real phenomenon, exaggerated portrayal (Sherlock's mind palace;
  the popular retelling of Dunning-Kruger)
- `myth` — pop culture gets it wrong (Lie to Me; the ten percent myth)

Flattening these into right/wrong would make the site less accurate than the
shows it corrects. Keep all three.

## Editorial rules

- **`surface` must never name a concept or hint at the mechanism.** In Class mode
  it is the only text a student sees. If it gives the answer away, the mode is
  broken.
- **Multiple concepts per clip is the norm, not the exception.** Often the second
  or third concept is the interesting one — people who miss the gorilla don't
  just miss it, they insist it wasn't there, which is a separate finding about
  access to our own perception.
- **Clips that get it wrong are as valuable as clips that get it right.**
  Students arrive already believing the film version, so correcting a
  misconception they hold confidently sticks better than a clean example does.
- **The tone currently sits at the lighter end, by the author's decision.** Two
  entries were removed for it: the eyewitness misidentification case, which
  turned on a named assault victim and a wrongful conviction, and the restaged
  Milgram game show. The misinformation effect is now carried by the car crash
  study instead, which teaches the same mechanism without the gravity.
- **Avoid real criminal cases involving identifiable people**, particularly
  assault covered in television documentaries. This is a standing preference,
  not a temporary one.
- **The counterweight still applies.** A collection that is only jokes will not
  be trusted on the material that matters, so heavier material can return
  deliberately later. It should not creep back in unannounced.
- **Anything distressing gets a `note`.** Rendered as a visible advisory above
  the player, before anyone presses play.
- **Every entry must survive its own link dying.** `source.title`,
  `source.detail`, and `surface` together have to be enough to find the clip
  again elsewhere. Link rot is the main long-term threat to this site.

## Two modes

A global switch in the masthead, applying to all views.

- **Reference** (default) — explanations visible with every clip. For browsing,
  looking something up, sending a student a link.
- **Class** — clip, `surface`, and `prompt` only. The reveal button states how
  many concepts are hidden ("Reveal the 3 concepts") so students have a findable
  target rather than an open guess.

## Views

`Explore` is the landing view: one random clip, for visitors with no idea where
to start. It draws only from entries that have media, because handing a first
visitor an unplayable card is the worst possible introduction to a site whose
premise is that a clip beats a definition. `Browse all` still shows everything,
queue included. Then `Browse all` (search plus area and verdict filters), `By course
unit` (grouped by `module`, with copy-to-clipboard lines for slides and
syllabi), and `Add a clip` (a form that validates the host, extracts the YouTube
id and start time from a pasted address, and emits a pasteable entry object —
this is the authoring workflow, so keep it working).

## Embeds

Click-to-load facade: thumbnail plus a play button, with the real iframe injected
only on click. Loading twenty-plus players on the browse page would be slow and
would contact Google for every card before anyone watched anything. Player domain
is `youtube-nocookie.com`.

## Design

Palette derives from The Dress, the site's mascot phenomenon — indigo-blue and
mustard-gold on a cool neutral grey, with a muted rose reserved for the `myth`
verdict and content advisories. Verdict colours are consistent everywhere:
blue = accurate, gold = overstated, rose = myth.

Type: Fraunces for display, Archivo for body, JetBrains Mono for data and labels
(timestamps, tags, areas, controls).

Quality floor, not negotiable: responsive to mobile, visible keyboard focus,
`prefers-reduced-motion` respected.

## Open questions

- Verify real links for the 20 entries still showing "No verified clip yet".
  Paste a candidate address into the `Add a clip` form to extract and validate
  it, then run the checker to confirm the video actually resolves.
