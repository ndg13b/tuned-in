const ENTRIES = window.ENTRIES || [];

const AREAS = [
  ["perception","Perception"], ["attention","Attention"], ["memory","Memory"],
  ["jdm","Judgment & decision making"], ["social","Social cognition"], ["meta","Metacognition & myths"]
];

const ALLOWED = ["youtube.com","www.youtube.com","youtu.be","youtube-nocookie.com",
  "www.youtube-nocookie.com","vimeo.com","www.vimeo.com","player.vimeo.com","ted.com","www.ted.com",
  "pbs.org","www.pbs.org","bbc.co.uk","www.bbc.co.uk","npr.org","www.npr.org","archive.org","www.archive.org"];

/* ==========================================================================
   MACHINERY
   ========================================================================== */

const areaLabel = k => (AREAS.find(a => a[0] === k) || [k,k])[1];

/*
 * The verdict judges the portrayal, not the sentence above it. Printing a bare
 * "myth" under a concept named "Short-term memory is seconds, not a day" reads
 * as though that true statement were the myth. These labels say who is being
 * judged.
 */
const VERDICTS = {
  accurate:   { card:"pop culture gets this right", chip:"Gets it right" },
  overstated: { card:"pop culture overstates this", chip:"Overstates it" },
  myth:       { card:"pop culture gets this wrong", chip:"Gets it wrong" }
};
const verdictLabel = (v, where) => (VERDICTS[v] || {})[where] || v;
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let MODE = "reference";
let uid = 0;

function isAllowed(url){
  try{ const h = new URL(url).hostname.toLowerCase();
       return ALLOWED.includes(h) || h.endsWith(".edu"); }catch(e){ return false; }
}
function parseYouTube(url){
  try{
    const u = new URL(url);
    let id = "";
    if(u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if(u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2];
    else id = u.searchParams.get("v") || "";
    let start = 0;
    const t = u.searchParams.get("t") || u.searchParams.get("start") || u.hash.replace("#t=","");
    if(t){
      const m = /^(?:(\d+)m)?(?:(\d+)s?)?$/.exec(t);
      if(m && (m[1] || m[2])) start = (parseInt(m[1]||0,10)*60) + parseInt(m[2]||0,10);
      else start = parseInt(t,10) || 0;
    }
    return {id, start};
  }catch(e){ return {id:"", start:0}; }
}
const mmss = s => s ? Math.floor(s/60) + ":" + String(s%60).padStart(2,"0") : "";

/*
 * Works out what was pasted rather than making the author pick from a menu
 * first. Returns null when the host is allowed but the address is not
 * recognisably a video, a still or a sound, so the form can say so instead of
 * emitting a broken entry.
 */
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;
const AUDIO_EXT = /\.(mp3|ogg|wav|m4a|aac|flac)$/i;

function inferMedia(url, alt, credit){
  if(!url) return {kind:"youtube", videoId:"", start:0};
  const yt = parseYouTube(url);
  if(yt.id) return {kind:"youtube", videoId:yt.id, start:yt.start};
  let pathname = "";
  try{ pathname = new URL(url).pathname; }catch(e){ return null; }
  if(IMAGE_EXT.test(pathname)) return {kind:"image", src:url, alt:alt||"", credit:credit||""};
  if(AUDIO_EXT.test(pathname)) return {kind:"audio", src:url, credit:credit||""};
  return null;
}

/*
 * Not everything worth teaching is a video. The Dress is a photograph and
 * Yanny/Laurel is a sound file, and both are among the best demonstrations
 * here, so media carries a kind.
 *
 * Entries written before kinds existed just have a videoId, which still means
 * YouTube.
 */
function mediaKind(m){
  if(!m) return "none";
  if(m.kind) return m.kind;
  return m.videoId ? "youtube" : "none";
}

function hasMedia(e){
  const m = e.media || {};
  switch(mediaKind(m)){
    case "youtube": return Boolean(m.videoId);
    case "image":
    case "audio":   return Boolean(m.src) && isAllowed(m.src);
    default:        return false;
  }
}

function creditHTML(m){
  return m.credit ? `<p class="credit">${esc(m.credit)}</p>` : "";
}

function stageHTML(e){
  const m = e.media || {};
  switch(mediaKind(m)){

    case "youtube":
      if(!m.videoId) break;
      return `<div class="stage">
        <button class="facade" data-vid="${esc(m.videoId)}" data-start="${m.start||0}"
                aria-label="Play: ${esc(e.source.title)}">
          <img src="https://i.ytimg.com/vi/${esc(m.videoId)}/hqdefault.jpg" alt="" loading="lazy">
          <span class="play">Play${m.start ? " from " + mmss(m.start) : ""}</span>
        </button></div>`;

    /* A still is the content rather than a preview of it, so it is shown
       rather than hidden behind a click. alt text is required, not optional. */
    case "image":
      if(!m.src || !isAllowed(m.src)) break;
      return `<div class="stage stage-image">
        <img src="${esc(m.src)}" alt="${esc(m.alt || "")}" loading="lazy">
      </div>${creditHTML(m)}`;

    /* preload="none" keeps the click-to-load promise: nothing is fetched from
       the audio host until someone presses play. */
    case "audio":
      if(!m.src || !isAllowed(m.src)) break;
      return `<div class="stage stage-audio">
        <audio controls preload="none" src="${esc(m.src)}"></audio>
      </div>${creditHTML(m)}`;
  }

  return `<div class="stage"><div class="noclip">
      <strong>No verified media yet</strong>
      <span>${esc(e.source.title)} &mdash; ${esc(e.source.detail)}. The description below is enough to find it.</span>
    </div></div>`;
}

function conceptsHTML(e){
  return `<ul class="concepts">` + e.concepts.map((c,i) => `
    <li><span class="num ${c.verdict}">${i+1}</span>
      <div>
        <p class="cname">${esc(c.name)}</p>
        <p class="cmeta">${esc(areaLabel(c.area))} &middot; <span class="v ${c.verdict}">${esc(verdictLabel(c.verdict,"card"))}</span></p>
        <p class="cexp">${esc(c.explanation)}</p>
      </div></li>`).join("") + `</ul>`;
}

function cardHTML(e){
  const id = "k" + (uid++);
  const n = e.concepts.length;
  /*
   * Some demonstrations only work on someone who does not know what is coming.
   * Naming inattentional blindness above a counting task destroys the very
   * thing the clip is there to show, so those entries stay closed even in
   * Reference mode. Class mode was already doing this for every card; this
   * makes it permanent where the content requires it.
   */
  const open = MODE === "reference" && !e.watchFirst;
  const label = n === 1 ? "Reveal the concept" : "Reveal the " + n + " concepts";
  return `<article class="card" id="${id}" data-open="${open}">
    ${e.note ? `<p class="advisory"><b>Content note</b> &mdash; ${esc(e.note)}</p>` : ""}
    ${e.watchFirst ? `<p class="watchfirst"><b>Watch first</b> &mdash; this one stops working if you read ahead.</p>` : ""}
    ${stageHTML(e)}
    <div class="body">
      <p class="source"><b>${esc(e.source.title)}</b>${esc(e.source.kind)} &middot; ${esc(e.source.detail)}</p>
      <p class="surface-txt">${esc(e.surface)}</p>
      ${!open && e.prompt ? `<p class="prompt">${esc(e.prompt)}</p>` : ""}
      ${!open ? `<div class="reveal-wrap"><button class="reveal" data-open="${id}">${label}</button></div>` : ""}
      <div class="hidden-panel"><div>
        <p class="divider">${n === 1 ? "What is going on" : n + " concepts at work here"}</p>
        ${conceptsHTML(e)}
      </div></div>
      <div class="foot"><p class="tags">${e.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</p></div>
    </div>
  </article>`;
}

document.addEventListener("click", async ev => {
  const play = ev.target.closest(".facade");
  if(play){
    const s = parseInt(play.dataset.start,10) || 0;
    play.closest(".stage").innerHTML =
      `<iframe src="https://www.youtube-nocookie.com/embed/${play.dataset.vid}?autoplay=1&rel=0${s > 0 ? "&start=" + s : ""}"
        title="Embedded clip" allow="accelerometer;autoplay;encrypted-media;picture-in-picture"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    return;
  }
  const rev = ev.target.closest(".reveal");
  if(rev){
    document.getElementById(rev.dataset.open).dataset.open = "true";
    rev.closest(".reveal-wrap").remove();
    return;
  }
  const cp = ev.target.closest("[data-copy]");
  if(cp){
    try{ await navigator.clipboard.writeText(cp.dataset.copy); cp.textContent = "Copied"; }
    catch(e){ cp.textContent = "Copy failed"; }
    setTimeout(() => { cp.textContent = "Copy"; }, 1400);
  }
});

document.querySelectorAll(".mode button").forEach(b => b.addEventListener("click", () => {
  MODE = b.dataset.mode;
  document.querySelectorAll(".mode button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  document.getElementById("mode-note").textContent = MODE === "reference"
    ? "Explanations shown with every clip."
    : "Clips only. Discuss first, then reveal.";
  render(); drawOne(true);
}));

const tabs = [...document.querySelectorAll(".tab")];
function go(v){
  tabs.forEach(x => x.setAttribute("aria-current", String(x.dataset.view === v)));
  ["explore","browse","syllabus","add"].forEach(k =>
    document.getElementById("view-" + k).hidden = (k !== v));
  window.scrollTo({top:0, behavior:"smooth"});
}
tabs.forEach(t => t.addEventListener("click", () => go(t.dataset.view)));
document.getElementById("to-browse").addEventListener("click", () => go("browse"));

/*
 * Explore is the front door for someone with no idea where to start, and the
 * premise of the site is that a clip you recognise beats a definition. Drawing
 * uniformly would hand most of those visitors a card with nothing to play,
 * which is the worst possible introduction. So Explore draws from entries that
 * have media, and only falls back to the whole collection if none do.
 *
 * Browse still shows everything. The queue is honest and useful there.
 */
let last = null;
function drawOne(keep){
  const playable = ENTRIES.filter(hasMedia);
  const pool = playable.length ? playable : ENTRIES;
  if(!pool.length) return;

  let pick = last;
  if(!keep || !pick || !pool.includes(pick)){
    do { pick = pool[Math.floor(Math.random()*pool.length)]; } while(pool.length > 1 && pick === last);
  }
  last = pick;
  document.getElementById("explore-stage").innerHTML = cardHTML(pick);
}
document.getElementById("next").addEventListener("click", () => drawOne(false));
drawOne(false);

const state = {q:"", areas:new Set(), verdicts:new Set()};
document.getElementById("area-chips").innerHTML = AREAS.map(([k,l]) =>
  `<button class="chip" data-area="${k}" aria-pressed="false">${l}</button>`).join("");
document.getElementById("verdict-chips").innerHTML = ["accurate","overstated","myth"].map(v =>
  `<button class="chip" data-verdict="${v}" aria-pressed="false">${esc(verdictLabel(v,"chip"))}</button>`).join("");
document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
  const key = c.dataset.area ? "areas" : "verdicts";
  const val = c.dataset.area || c.dataset.verdict;
  state[key].has(val) ? state[key].delete(val) : state[key].add(val);
  c.setAttribute("aria-pressed", String(state[key].has(val)));
  render();
}));
document.getElementById("q").addEventListener("input", e => {
  state.q = e.target.value.toLowerCase().trim(); render();
});
document.getElementById("clear").addEventListener("click", () => {
  state.q = ""; state.areas.clear(); state.verdicts.clear();
  document.getElementById("q").value = "";
  document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed","false"));
  render();
});
function matches(e){
  if(state.areas.size && !e.concepts.some(c => state.areas.has(c.area))) return false;
  if(state.verdicts.size && !e.concepts.some(c => state.verdicts.has(c.verdict))) return false;
  if(!state.q) return true;
  const hay = [e.source.title, e.source.kind, e.source.detail, e.surface, e.tags.join(" "), e.module,
    e.concepts.map(c => c.name + " " + c.explanation).join(" ")].join(" ").toLowerCase();
  return hay.includes(state.q);
}
function render(){
  const hits = ENTRIES.filter(matches);
  document.getElementById("grid").innerHTML = hits.map(cardHTML).join("");
  document.getElementById("empty").hidden = hits.length > 0;
  const total = ENTRIES.reduce((n,e) => n + e.concepts.length, 0);
  document.getElementById("count").textContent =
    hits.length + " of " + ENTRIES.length + " clips · " + total + " concepts in the collection";
}
render();

const mods = [...new Set(ENTRIES.map(e => e.module))];
document.getElementById("modlist").innerHTML = mods.map(m => `<option value="${esc(m)}">`).join("");
document.getElementById("modules").innerHTML = mods.map(m => {
  const list = ENTRIES.filter(e => e.module === m);
  return `<section class="module"><h3>${esc(m)}</h3>
    <p class="mcount">${list.length} clip${list.length>1?"s":""} &middot; ${list.reduce((n,e)=>n+e.concepts.length,0)} concepts</p>
    <div class="rows">${list.map(e => `<div class="row">
      <div class="row-main"><strong>${esc(e.source.title)}</strong>
        <span class="clist">${esc(e.source.detail)} &mdash; ${e.concepts.map(c => esc(c.name)).join("; ")}</span></div>
      <div><button class="btn ghost" data-copy="${esc(e.concepts.map(c=>c.name).join("; "))} — ${esc(e.source.title)} (${esc(e.source.detail)})">Copy</button></div>
    </div>`).join("")}</div></section>`;
}).join("");

let cn = 0;
function conceptBlock(){
  cn++;
  const d = document.createElement("fieldset");
  d.className = "cblock";
  d.innerHTML = `<legend>Concept ${cn}</legend>
    <div class="field"><label>Name</label><input class="c-name" placeholder="Anchoring and adjustment"></div>
    <div class="field"><label>Area</label><select class="c-area">${AREAS.map(([k,l])=>`<option value="${k}">${l}</option>`).join("")}</select></div>
    <div class="field full"><label>Verdict</label><select class="c-verdict">
      <option value="accurate">Accurate — shows the real thing</option>
      <option value="overstated">Overstated — right idea, exaggerated</option>
      <option value="myth">Myth — gets it wrong</option></select></div>
    <div class="field full"><label>Explanation</label><textarea class="c-exp"></textarea></div>`;
  document.getElementById("cblocks").appendChild(d);
}
conceptBlock();
document.getElementById("add-concept").addEventListener("click", conceptBlock);

document.getElementById("make").addEventListener("click", () => {
  const g = id => document.getElementById(id).value.trim();
  const msg = document.getElementById("form-msg"), out = document.getElementById("out"),
        copyBtn = document.getElementById("copy-out");
  const raw = g("f-url");

  const concepts = [...document.querySelectorAll(".cblock")].map(b => ({
    name: b.querySelector(".c-name").value.trim(),
    area: b.querySelector(".c-area").value,
    verdict: b.querySelector(".c-verdict").value,
    explanation: b.querySelector(".c-exp").value.trim()
  })).filter(c => c.name && c.explanation);

  const missing = [];
  if(!g("f-title")) missing.push("a source title");
  if(!g("f-surface")) missing.push("what you see happen");
  if(!concepts.length) missing.push("at least one concept with an explanation");
  if(missing.length){
    msg.className = "msg bad"; msg.textContent = "Still needs " + missing.join(", ") + ".";
    out.hidden = copyBtn.hidden = true; return;
  }
  if(raw && !isAllowed(raw)){
    msg.className = "msg bad";
    msg.textContent = "That host is not on the allowlist, so the entry would be rejected. Add it to ALLOWED if you trust it, or leave the field blank for now.";
    out.hidden = copyBtn.hidden = true; return;
  }
  const media = inferMedia(raw, g("f-alt"), g("f-credit"));
  if(!media){
    msg.className = "msg bad";
    msg.textContent = "That host is allowed, but the address does not look like a YouTube video, an image file or an audio file. Link directly to the file, or write the media block by hand.";
    out.hidden = copyBtn.hidden = true; return;
  }
  if(media.kind === "image" && media.src && !media.alt){
    msg.className = "msg bad";
    msg.textContent = "A still needs alt text. Describe what is in the picture for anyone who cannot see it.";
    out.hidden = copyBtn.hidden = true; return;
  }

  const entry = {
    source:{title:g("f-title"), kind:g("f-kind"), detail:g("f-detail")},
    media,
    module:g("f-module") || areaLabel(concepts[0].area),
    surface:g("f-surface"), prompt:g("f-prompt"), concepts,
    tags:g("f-tags").split(",").map(s=>s.trim()).filter(Boolean)
  };
  if(g("f-note")) entry.note = g("f-note");

  out.textContent = JSON.stringify(entry, null, 2) + ",";
  out.hidden = copyBtn.hidden = false;
  msg.className = "msg ok";
  if(media.kind === "youtube" && media.videoId){
    msg.textContent = "Accepted. Video " + media.videoId +
      (media.start ? " starting at " + mmss(media.start) : "") + ". Paste this into the ENTRIES list.";
  }else if(media.src){
    msg.textContent = "Accepted as " + media.kind + ". Paste this into the ENTRIES list.";
  }else{
    msg.textContent = "Built without media. It will show 'No verified media yet' until you add some.";
  }
});
document.getElementById("copy-out").addEventListener("click", async e => {
  try{ await navigator.clipboard.writeText(document.getElementById("out").textContent);
       e.target.textContent = "Copied"; }
  catch(err){ e.target.textContent = "Copy failed"; }
  setTimeout(() => { e.target.textContent = "Copy entry"; }, 1400);
});
