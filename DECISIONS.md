# Decisions and rejected alternatives

A record of what was considered and turned down, and why. The point is to stop
good-looking suggestions being re-proposed. Nothing here is permanent — but
reopening one of these should mean answering the objection, not forgetting it.

## Name

Settled on **Tuned In**. The tagline it originally shipped with, *what your mind
is doing while you watch*, was later replaced — see the Tagline section below.
The name itself is not reopened.

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

## Tagline

Changed from *what your mind is doing while you watch* to **pop culture, and
the psychology underneath it**. The original was not wrong, but it described a
mood rather than a subject, and it sat close to the intuition-and-wellness
register the project deliberately avoids. The replacement names both halves —
the clip you already recognise, and the mechanism under it — which is the same
two-way reading the name carries.

The name itself is unchanged and is not reopened here.

## Favicon

A brain inside a television set. Considered and rejected: a plain brain, which
is the most overused icon in psychology, is unreadable at 16px, and is the
brain-equals-mind shorthand this site debunks on the ten percent card; and a
split referencing The Dress, rejected by the author as too specific a reference
to carry the whole site.

Drawn as SVG with a PNG fallback, both self-hosted, so the tab icon costs no
third-party request. Two constraints shaped it: the screen is filled light and
outlined dark so it survives on light and dark browser chrome alike, and the
brain is an asymmetric blob rather than two symmetric lobes, because symmetry
about a centre line reads as the letter phi at small sizes. The first attempt
did exactly that and was thrown away.

## Demonstrations that need a naive viewer

Some clips only work on someone who does not know what is coming. Announcing
inattentional blindness above a counting task destroys the very thing the clip
exists to show, and Reference mode — the default — was doing precisely that.

Considered: removing this material entirely and reintroducing it later in a
separately formatted academic section. Rejected for now because it would have
cost three of the eleven working clips, and because the fix is small.

**Chosen:** a `watchFirst: true` flag. Those entries stay closed even in
Reference mode, carry a visible "Watch first" line, and had their `surface` and
`prompt` rewritten — both previously described the reveal outright. The
academic-section idea is still open and is the better long-term home for them.

Note that the McGurk effect is deliberately *not* flagged. Knowing how it works
does not switch it off, which is that card's second concept.

While fixing this, the collapsed panel turned out to hide the answer visually
but leave it in the accessibility tree and in find-in-page, so a screen reader
announced every concept before the clip was watched. Class mode had been
quietly broken for those users since it was built. The panel is now
`visibility:hidden` when closed.

## How the verdict is labelled

The verdict judges the portrayal, not the sentence it sits under. Printing a
bare `myth` beneath a concept named "Short-term memory is seconds, not a day"
read as though that true statement were the myth, which is the opposite of what
the card means.

Cards print **this is real / real, but exaggerated / this is a myth**. The
filter chips keep the short forms. The three underlying values and their colours
are unchanged; only the wording a reader sees moved.

An earlier attempt used "pop culture gets this right", which was abandoned after
one round because it is a category error on half the collection. The gorilla
video, the card trick, The Dress and Yanny/Laurel do not *portray* a phenomenon,
they *cause* one in the viewer, and there is no pop culture doing anything right
or wrong on those cards. The current wording judges the concept named above it
and works for both kinds.

The related fix was in the concept names themselves. Several `myth` concepts
were named for the true mechanism — "Failure of consolidation", "Reconstructive
memory" — which compounded the confusion. Where a rename made the topic clearer
it was made; the rest read correctly now that the label has a subject.

## Writing for the viewer, not the instructor

An editorial pass removed ten explanations that addressed an instructor rather
than the person reading the card: "students arrive believing the film version",
"pairs well with the finding that…", "the part worth teaching", "does more work
than any slide on…". The site is read by students and by curious visitors, and
being talked about in the third person is alienating for both.

References to other works now carry enough context to stand alone. "50 First
Dates makes the same mistake" became "The 2004 film 50 First Dates", since a
reader cannot be assumed to recognise every title by name.

## Not laughing at identifiable people

The Dunning-Kruger entry pointed at talent show auditions — "any first-round
rejection where the contestant is stunned" — which meant sourcing it would have
required linking a real person being laughed at for being bad at something.
That sits badly against the standing rule never to sneer at people for being
fooled.

The entry now points at the chart instead: the curve with a peak labelled Mount
Stupid, and the clips it gets attached to. The target is the misreading of the
research, which is the actual subject, and nobody has to be the punchline.

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

- Media for the 13 entries showing "No verified media yet". Six of them name a
  category rather than a specific moment ("any negotiation segment", "any
  microexpression analysis scene") and cannot be sourced until they are
  rewritten to point at a particular episode or timestamp.
- **Separating pop clips from academic ones.** The collection is deliberately
  weighted toward comedy, but a few entries — the McGurk demonstration, the
  gorilla test — are lecture material rather than something anyone would
  recognise. If more academic clips arrive, they want a way to be filtered
  apart rather than mixed in. Probably a field rather than a tag, since tags
  are free text and this is a two-way split, but nothing is decided.
- **Non-YouTube video.** The allowlist permits Vimeo, TED, PBS, BBC and others,
  but the player only knows how to embed YouTube, so a video on any of those
  hosts would render as "No verified media yet". The authoring form refuses
  such an address rather than emitting a broken entry, so nothing silently
  breaks, but the allowlist is currently advertising more than the site can
  actually play.
