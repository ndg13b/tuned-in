# Decisions and rejected alternatives

A record of what was considered and turned down, and why. The point is to stop
good-looking suggestions being re-proposed. Nothing here is permanent — but
reopening one of these should mean answering the objection, not forgetting it.

## Name

Settled on **Tuned In**, tagline *what your mind is doing while you watch*.

The name reads two ways deliberately: tuned in to a broadcast, and tuned in to
the mechanisms behind what you're watching. The second reading is the thesis.

Rejected along the way:

- **Double Take** — the original working title. Vague, heavily used, and
  describes a reaction rather than a subject.
- **Streaming Consciousness** — the author liked it most, and it is the most
  shareable option. Cut for length and spelling. A student copying it off a
  lecture slide from the back of a room will get it wrong.
- **Cue Card, Prime Time, Seen It, Test Pattern, Pop Cognition** — the first
  shortlist. All viable; none preferred.
- **Playback, Reruns, Framed, Blind Spot** — shorter alternatives in the same
  vein. Not chosen.
- **Tuned Out** — proposed as a one-letter pivot after a search showed "tuned
  in" is common in mindfulness and intuition writing. **Declined, and the
  reasoning is worth keeping**: adjacency is not contamination, nearly any
  phrase has been used by someone less rigorous, and people arrive at a site
  through its framing rather than through its naming neighbourhood. Do not
  re-raise the association concern.

## Card structure

- **A 3D flip card with the concept name on the front.** The original design.
  Rejected on two counts. The author wanted the explanation visible by default —
  hiding it is a specific pedagogical mode, not the resting state. And once
  clips were embedded, fixed-height flip faces stopped working; the reveal is
  now a disclosure that expands.
- **One concept per card.** Rejected. Clips routinely demonstrate several
  things, and the second or third is often the better one. Multi-concept also
  gives Class mode its target: "Reveal the 3 concepts" is a findable task in a
  way that an open guess is not.
- **Two verdicts, accurate and myth.** Rejected. `overstated` was needed for
  cases like the mind palace and the popular retelling of Dunning-Kruger.
  Flattening them would make the site less accurate than the shows it corrects.

## Media

- **Linking out instead of embedding.** Rejected — the author judged that seeing
  the clip in place matters more for engagement than page weight does.
- **Loading every player on page load.** Rejected. Click-to-load facade instead:
  twenty-plus iframes would be slow and would contact Google for every card
  before anyone watched anything.
- **Rehosting clips.** Never. Not a performance decision — it costs rights
  holders their view counts and some sources forbid it outright.

## Landing view

Browse-first was the original layout. Changed to **Explore** (one random clip)
so a first-time visitor with no idea where to start has a door rather than a
wall.

## Authoring

- **Editing the data file by hand.** Workable but punctuation-fragile, and the
  author had no strong preference, which usually means the friction will win.
- **An admin interface with a backend.** Rejected — it would mean a server,
  accounts, and an attack surface, for a single author.
- **Chosen:** a form inside the site that validates the host, pulls the video id
  and start time out of a pasted address, and emits a pasteable entry. No
  backend, no hand-written punctuation.

## Hosting

GitHub Pages. Static, free, HTTPS, and the version history is genuinely useful
when a clip gets pulled and you need to see what was there before.

## Still open

- Verify links for the entries showing "No verified clip yet".
- Self-hosted thumbnails, or reword the footer so the privacy claim is accurate.
  Thumbnails currently load from Google's image server, so "no third party is
  contacted before you press play" is not strictly true today.
- Split the single file into `index.html`, `entries.js`, `app.js`, `styles.css`.
- A periodic link-checking script to catch dead embeds early.
