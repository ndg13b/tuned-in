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

## File layout

Split into `index.html`, `styles.css`, `entries.js`, `app.js`. The data model
already specified that content lives in `entries.js` as `window.ENTRIES`, so the
single file contradicted its own spec. Everything was moved mechanically rather
than retyped, and the result was checked in a browser against the prototype's
behaviour before the split was committed.

## Thumbnails and the privacy claim

The footer used to say no third party is contacted before you press play. That
was not true: thumbnails load from Google's image servers, and so do the
typefaces.

- **Self-hosted thumbnails.** Rejected. Keeps both the recognition and the
  claim, but sits close to the never-rehost directive, adds weight to the repo,
  and goes stale silently when a clip changes.
- **Drop thumbnails, use a typographic facade.** Rejected, and this is the
  interesting one. It would have made the original sentence strictly true, but
  recognition is the engagement thesis of the entire site — someone scanning the
  grid recognises The Office from its thumbnail, and that is the door in. Buying
  a privacy claim with the site's main mechanism is a bad trade when an honest
  sentence costs nothing.
- **Chosen:** reword the footer. It now names Google's image servers and Google
  Fonts, says the player itself waits for the click, and says nothing is stored
  in the browser. All four claims are true of the code as written.

## Link checking

`tools/check-links.mjs`, run by GitHub Actions on content changes and weekly.
Checks structure, checks that no `surface` names one of its own concepts, and
checks that every video id still resolves.

It confirms it can actually reach YouTube before treating a 403 as a dead video,
because a filtering proxy answers 403 too. That distinction is not academic: the
first version of the script reported all three sourced clips as dead when the
real problem was a blocked host. A checker that cries wolf gets ignored, which
would leave the site with no defence against its main long-term threat.

## Media kinds

`media.kind` is now one of `youtube`, `image` or `audio`. The collection was
YouTube-only, which meant the site's own mascot could not be represented in its
own data model: The Dress is a photograph and Yanny/Laurel is a sound file, and
both were sitting in the queue waiting for a video that does not exist.

Stills render directly rather than behind a click-to-load facade, because a
still is the content rather than a preview of it. Audio uses `preload="none"`,
which keeps the click-to-load promise. Both must be on the allowlist, and images
must carry alt text or the checker fails.

Deliberately **not** decided here: whether to embed any specific image. The
famous Dress photograph is copyrighted, and embedding it is a different question
from embedding a YouTube video, where the platform's own player makes it
sanctioned and counts the view. The plumbing exists; each image is still a
judgement call.

## Tone

The eyewitness misidentification entry and the restaged Milgram game show were
removed at the author's request, to keep the collection lighter for now. The
first turned on a named assault victim and a wrongful conviction.

The misinformation effect was too important to lose with it, so it is now
carried by the Loftus and Palmer car crash study — same mechanism, no crime
victim. The obedience material simply went; conformity is still covered by the
Candid Camera elevator segment.

Worth noting for whoever revisits this: **the obvious lighter substitute is not
lighter.** Elizabeth Loftus's TED talk on memory, the natural clip for the lost
in the mall study, opens with the Steve Titus case — a man wrongly accused of
rape. It would need the same content advisory as the entry it replaced.

## Explore draws only from playable entries

Explore used to draw uniformly across the whole collection. With 20 of 23 cards
lacking media, a first-time visitor had roughly an 87% chance of being greeted
by a card with nothing to play — on the one view built for people with no idea
where to start, on a site whose premise is that a clip beats a definition.

It now draws from entries that have media, falling back to the whole collection
if none do. Browse still shows everything: the queue is honest and useful there,
just not in the shop window.

## Still open

- Media for the 20 entries showing "No verified media yet". Six of them name a
  category rather than a specific moment ("any negotiation segment", "any
  microexpression analysis scene") and cannot be sourced until they are
  rewritten to point at a particular episode or timestamp.
