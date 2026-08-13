# Tuned In

*Pop culture, and the psychology underneath it.*

A teaching collection that pairs pop culture clips with the cognitive psychology
concepts they demonstrate. Built for college students and the people teaching
them, and readable by anyone who is curious.

The premise is that a clip someone already recognises is a better door into a
concept than a definition is. Students arrive having seen Michael Scott drive
into a lake; they arrive believing what *Lie to Me* told them about spotting a
liar. Both are useful, and the second is often more useful than the first.

**Live at <https://ndg13b.github.io/tuned-in/>**

## The three verdicts

Every concept on a card carries one, and the middle one is doing real work.

| Verdict | Shown on a card as | Means |
| --- | --- | --- |
| `accurate` | this is real | The real thing, whether the clip depicts it or causes it in you. |
| `overstated` | real, but exaggerated | Real phenomenon, exaggerated portrayal. Sherlock's mind palace is a genuine technique filmed as though it were instant. |
| `myth` | this is a myth | Behavioural lie detection; the ten percent myth; memory as a recording. |

The label judges the concept named above it, so concept names state a topic or a
claim, never a correction. A bare "myth" under a concept called "short-term
memory is seconds, not a day" read as though that true statement were the myth.

The labels deliberately avoid naming pop culture as the subject, because half
the collection is not a portrayal: the gorilla video and The Dress do not depict
a phenomenon, they cause one in the viewer.

Collapsing these into right and wrong would make the site less accurate than the
shows it corrects, so all three stay. Clips that get it wrong are as valuable as
clips that get it right — correcting a misconception someone holds confidently
tends to stick better than a clean example does.

## Two modes

A switch in the masthead, applying to every view.

- **Reference** — explanations visible with every clip. For browsing, looking
  something up, or sending a student a link.
- **Class** — the clip, a description of what happens, and a discussion prompt.
  Explanations stay hidden behind a button that says how many concepts are
  waiting, so a class has a findable target rather than an open guess.

A few cards are marked **Watch first** and stay closed in both modes. The
awareness tests and the card trick only work on a viewer who does not know what
is coming, so naming the effect above the player would destroy the thing the
clip is there to show.

## Views

- **Explore** — one clip at a time, drawn at random. The landing view, for
  anyone with no idea where to start.
- **Browse all** — search, plus filters by area of study and by verdict.
- **By course unit** — grouped the way a course tends to run, with a copy button
  on each line for dropping into slides or a syllabus.
- **Add a clip** — the authoring workflow. Paste an address, and it checks the
  host against the allowlist, works out whether it is a video, a still or a
  sound file, pulls out the video id and start time, and hands back a finished
  entry to paste into `entries.js`.

Not everything worth teaching is a video, so an entry's media is a YouTube clip,
an image or an audio file. The Dress is a photograph and Yanny/Laurel is a sound
file, and both are among the better demonstrations here. Stills are shown
directly and need alt text; audio is not fetched until you press play.

## What this site will not do

These are constraints on the project, not features that happened to ship.

- **No invented links.** If media has not been found and verified, the entry's
  source stays empty and the card renders "No verified media yet". A fabricated
  link would be worse than an empty one on a site whose promise is that its links
  are safe.
- **No rehosting.** Clips play through the platform's own embed player. Nothing
  here is downloaded, re-edited or mirrored, and some sources forbid it
  outright. Where a clip sits on an official channel the view reaches the rights
  holder; some clips are other people's uploads, which buys coverage that would
  not otherwise exist and costs some link stability.
- **No unvetted destinations.** Every link is checked against an allowlist of
  hosts before an entry ships.
- **No browser storage.** No `localStorage`, no cookies, nothing kept after you
  close the tab.
- **No overstated privacy claims.** Thumbnails come from Google's image servers
  and the typefaces from Google Fonts, so Google is contacted when a page loads.
  The footer says so. What waits for your click is the player itself, which runs
  on `youtube-nocookie.com` — twenty-odd players do not load just because you
  opened the page.

## Working on it

```
entries.js             the collection, as window.ENTRIES — the file edited routinely
app.js                 the taxonomy, the allowlist, and all behaviour
styles.css             all styling
index.html             markup
tools/check-links.mjs  the collection checker
```

No build step and no dependencies. Open `index.html`, or serve the directory
with any static server.

### Checking the collection

```sh
node tools/check-links.mjs             # structure, editorial rules, and live clips
node tools/check-links.mjs --offline   # skip the network half
```

It verifies that entries are structurally sound, that no description gives away
its own concept — which would break Class mode, where that description is all a
student sees — and that every video id still resolves. For each clip it prints
the live video title, so an id that has quietly come to point somewhere else is
visible rather than passing as a bare 200.

It also confirms it can actually reach YouTube before treating a 403 as a dead
video, because a filtering proxy answers 403 too. Exit `1` is a real problem;
exit `2` means liveness could not be determined.

GitHub Actions runs it on every change to the collection and once a week, since
link rot is the main long-term threat here.

## Context for contributors

`CLAUDE.md` holds the editorial rules, the data model and the voice.
`DECISIONS.md` records what was considered and turned down, and why — worth
reading before proposing a change to the naming, the card structure or the
authoring workflow, since several obvious-looking ideas were tried and rejected
for reasons that are not visible from the code.

## Licence

See `LICENSE`. It covers the code in this repository. It does not cover the
linked clips, which remain the property of their rights holders and are embedded
rather than reproduced.
