/* ==========================================================================
   CONTENT — the only part you edit routinely.
   Each entry is one piece of media that may demonstrate several concepts.
     media.videoId  YouTube id, or "" if not sourced yet
     media.start    seconds to begin at, or 0
     surface        what a viewer sees; must not name any concept
     prompt         the question to put to a class before revealing
     concepts[]     one or more: name / area / verdict / explanation
     verdict        "accurate" | "overstated" | "myth"
     note           content advisory, shown above the player
   ========================================================================== */
window.ENTRIES = [

/* ---------- clips sourced and verified ---------- */
{
  source:{title:"Selective attention test", kind:"Web video, Daniel Simons", detail:"The original awareness test, 1999"},
  media:{videoId:"vJG698U2Mvo", start:0}, module:"Attention",
  surface:"You are asked to count how many passes the players in white make. You count carefully. You get the number right.",
  prompt:"Did everyone get the same count? And did anyone see anything else?",
  concepts:[
    {name:"Inattentional blindness", area:"attention", verdict:"accurate",
     explanation:"Roughly half of viewers do not see the gorilla walk into frame, beat its chest and leave. Not blurred, not dim — absent. Committing attention to the counting task leaves it unprocessed at the level awareness requires."},
    {name:"Naive realism about our own perception", area:"meta", verdict:"accurate",
     explanation:"The second finding is the reaction. People who missed it are certain no gorilla was there and often accuse the presenter of swapping videos. We have no felt sense of what we failed to process, so not noticing feels identical to nothing being there."}
  ],
  tags:["classic","funny","attention"]
},
{
  source:{title:"Try the McGurk effect", kind:"Television documentary, BBC Two", detail:"Horizon: Is Seeing Believing?"},
  media:{videoId:"G-lN8vWm3m0", start:0}, module:"Sensation & perception",
  surface:"A man repeats one syllable over and over. Watch his mouth and you clearly hear one sound. Close your eyes and you clearly hear a different one. Open them and it changes straight back.",
  prompt:"Try it with your eyes shut, then open. Which sense is lying, and how would you tell?",
  concepts:[
    {name:"Audiovisual integration in speech", area:"perception", verdict:"accurate",
     explanation:"Speech perception fuses lip movement with sound. The audio never changes; the mouth does, and your ears report the merged result. Hearing is not a separate channel that happens to sit near your eyes."},
    {name:"Cognitive impenetrability", area:"perception", verdict:"accurate",
     explanation:"Knowing exactly how the trick works does not switch it off. Some perceptual processes run below the reach of belief — a much stronger claim than 'illusions are fun', and the best ninety-second demonstration of it available."}
  ],
  tags:["classic","unbreakable","speech"]
},
{
  source:{title:"The Colour Changing Card Trick", kind:"Web video, Richard Wiseman", detail:"Quirkology, filmed in a single take"},
  media:{videoId:"v3iPrBrGSJM", start:0}, module:"Attention",
  surface:"A magician invites you to watch a card closely, then reveals how the trick was done. Then he points out everything else that happened while you were watching the card.",
  prompt:"Before the reveal: how much of that room could you describe from memory?",
  concepts:[
    {name:"Change blindness", area:"attention", verdict:"accurate",
     explanation:"The tablecloth, the backdrop and both performers' clothing change colour mid-shot, in one continuous take, and almost nobody notices. Without attention pointed at an object, a change to it generates no signal at all."},
    {name:"Misdirection as applied attention research", area:"attention", verdict:"accurate",
     explanation:"Stage magic worked this out centuries before psychology did. The instruction to watch the card is the entire method: attention is a budget, and a magician's job is to get you to spend it somewhere convenient."}
  ],
  tags:["classic","funny","magic"]
},

/* ---------- described, awaiting a verified clip ---------- */
{
  source:{title:"The Dress", kind:"Viral photograph, 2015", detail:"The original post and the week that followed"},
  media:{videoId:"", start:0}, module:"Sensation & perception",
  surface:"A photo of a dress splits the internet in half. One group sees blue and black, the other white and gold, and neither can believe the other is being serious.",
  prompt:"Take a show of hands. Then ask the two camps to convince each other.",
  concepts:[
    {name:"Colour constancy", area:"perception", verdict:"accurate",
     explanation:"Your visual system never reports raw wavelength. It silently guesses the light source and subtracts it. Assume shadow and you subtract blue, leaving white and gold; assume warm indoor light and you subtract yellow, leaving blue and black. Same photo, different unconscious assumption."},
    {name:"Naive realism", area:"social", verdict:"accurate",
     explanation:"The argument was more interesting than the illusion. Each side assumed the other was lying, because we treat our own perception as a neutral window rather than one construction among several. That assumption does a lot of work in disagreements far less trivial than this."}
  ],
  tags:["viral","classic","illumination"]
},
{
  source:{title:"Yanny or Laurel", kind:"Viral audio clip, 2018", detail:"The original, plus the pitch-shifted versions"},
  media:{videoId:"", start:0}, module:"Sensation & perception",
  surface:"One short recording. Half the room hears one name, half hears a completely different one, and reading the other word on screen can make yours switch mid-listen.",
  prompt:"Which did you hear first? Now look at the other word and listen again.",
  concepts:[
    {name:"Perceptual ambiguity", area:"perception", verdict:"accurate",
     explanation:"The acoustic energy genuinely supports both readings. Which one you get depends on how much high-frequency information reaches you, which varies with your age and your speakers. There is no fact of the matter to be right about."},
    {name:"Top-down expectation", area:"perception", verdict:"accurate",
     explanation:"Show someone the written word and their hearing often flips to match. Perception uses prior expectation to resolve ambiguity, so what you expect becomes part of what you sense rather than what you conclude afterwards."}
  ],
  tags:["viral","audio","expectation"]
},
{
  source:{title:"Transport for London awareness advert", kind:"Public safety advert", detail:"Count the passes; watch for the bear"},
  media:{videoId:"", start:0}, module:"Attention",
  surface:"Another counting task. This time a person in a bear costume moonwalks through the middle of the shot.",
  prompt:"The tagline is about drivers and cyclists. Does the demonstration actually support it?",
  concepts:[
    {name:"Inattentional blindness in the wild", area:"attention", verdict:"accurate",
     explanation:"The same effect as the gorilla, repurposed as road safety messaging: a driver scanning for cars can genuinely fail to see a cyclist, because looking and seeing come apart. Useful for arguing about how far a lab finding should be pushed into policy."}
  ],
  tags:["road safety","funny","applied"]
},
{
  source:{title:"Sherlock", kind:"Television drama, BBC", detail:"The mind palace sequences"},
  media:{videoId:"", start:0}, module:"Memory",
  surface:"Sherlock closes his eyes, walks through an imagined building, and retrieves an exact fact from the room where he left it.",
  prompt:"Is this a real technique, an invented one, or a real one filmed dishonestly?",
  concepts:[
    {name:"Method of loci", area:"memory", verdict:"overstated",
     explanation:"Real and ancient: bind each item to a place along a familiar route, then walk the route to recall them. Competitive memory athletes genuinely use it. What the show exaggerates is speed and reliability — a usable palace takes weeks of practice."},
    {name:"Elaborative encoding", area:"memory", verdict:"accurate",
     explanation:"Why it works is the part worth teaching. Spatial memory is unusually durable, so turning a flat list into a route through a place you already know gives each item several retrieval paths instead of one. This generalises directly to how students should be studying."}
  ],
  tags:["technique","study skills","television"]
},
{
  source:{title:"'Luke, I am your father'", kind:"Film quote and its afterlife", detail:"Also the Berenstain Bears and the Monopoly man's monocle"},
  media:{videoId:"", start:0}, module:"Memory",
  surface:"Enormous numbers of people vividly remember a line that was never said. The actual line is 'No, I am your father.' The Monopoly man has never worn a monocle. Comment sections will fight you on both.",
  prompt:"Everyone write down the line as you remember it, before anybody speaks.",
  concepts:[
    {name:"Reconstructive memory", area:"memory", verdict:"myth",
     explanation:"Memory is rebuilt each time from gist plus expectation, not stored and replayed. 'Luke' makes the line intelligible out of context, so it gets inserted on the way out."},
    {name:"Schema-driven intrusion", area:"memory", verdict:"accurate",
     explanation:"A monocle fits the top-hat-and-cane schema, so it grows into the memory of an image most people have seen hundreds of times. Whatever fits the pattern gets filled in silently."},
    {name:"Confidence-accuracy dissociation", area:"meta", verdict:"accurate",
     explanation:"Everyone is certain, and certainty is spread evenly across the correct and incorrect answers. The friendliest possible route to a point that matters enormously in the eyewitness card."}
  ],
  tags:["funny","viral","false memory"]
},
{
  source:{title:"Memento", kind:"Film, 2000", detail:"Leonard's tattoos and Polaroids"},
  media:{videoId:"", start:0}, module:"Memory",
  surface:"A man cannot form new memories. He keeps his life in tattoos, photographs and notes, and the film's reversed structure puts you in his position.",
  prompt:"List everything the film gets right before listing what it gets wrong.",
  concepts:[
    {name:"Anterograde amnesia", area:"memory", verdict:"accurate",
     explanation:"Unusually faithful. Memories from before the injury survive, new facts and events do not stick, and the deficit is specific rather than a general loss of intelligence."},
    {name:"Procedural and declarative memory dissociate", area:"memory", verdict:"accurate",
     explanation:"He still improves at things through repetition while being unable to remember practising. Two separate systems, and damage to one leaves the other intact — the single most surprising fact about memory for most students."}
  ],
  tags:["film","accurate","serious"]
},
{
  source:{title:"50 First Dates and Finding Nemo", kind:"Films", detail:"Lucy's overnight reset; Dory's 'short term memory loss'"},
  media:{videoId:"", start:0}, module:"Memory",
  surface:"One character's memory wipes clean every night at midnight. Another forgets a new friend within the same conversation and calls it short-term memory loss.",
  prompt:"Both are wrong, but wrong in different ways. Which is which?",
  concepts:[
    {name:"Short-term memory is seconds, not a day", area:"memory", verdict:"myth",
     explanation:"Short-term memory holds a handful of items for seconds. Neither character's problem is that, and in film the phrase almost always means something else entirely."},
    {name:"Failure of consolidation", area:"memory", verdict:"myth",
     explanation:"Dory's actual problem is the opposite of what she says — she cannot move anything into long-term storage. And real amnesia does not reset on a schedule. Students arrive believing the film version, which is exactly why correcting it sticks."}
  ],
  tags:["funny","film","common error"]
},
{
  source:{title:"Jennifer Thompson and Ronald Cotton", kind:"News documentary", detail:"Covered by 60 Minutes and PBS Frontline"},
  media:{videoId:"", start:0}, module:"Memory",
  note:"Sexual assault and wrongful imprisonment.",
  surface:"A woman identifies her attacker with total certainty. He serves eleven years. DNA later shows she named the wrong man, and that she had seen the right one during the investigation.",
  prompt:"At what point in this process did the memory change, and could anyone have noticed?",
  concepts:[
    {name:"Eyewitness misidentification", area:"memory", verdict:"accurate",
     explanation:"Each retelling and each line-up rewrites the memory slightly, and the rewritten version is what gets retrieved next time. The original is not preserved underneath."},
    {name:"Confidence inflation", area:"memory", verdict:"accurate",
     explanation:"Repetition and feedback raise confidence without raising accuracy, and juries weigh confidence heavily. This is the case that makes the stakes of the Mandela effect card concrete, and it is not funny."}
  ],
  tags:["serious","legal","misinformation effect"]
},
{
  source:{title:"Pawn Stars / Storage Wars", kind:"Reality television", detail:"Effectively any negotiation segment"},
  media:{videoId:"", start:0}, module:"Judgment & decision making",
  surface:"Someone names a number first. Every offer that follows orbits it, including offers from people who say out loud that the first number was nonsense.",
  prompt:"Track the numbers. Where did each one actually come from?",
  concepts:[
    {name:"Anchoring and adjustment", area:"jdm", verdict:"accurate",
     explanation:"A number in play becomes the starting point for estimation, and adjustment away from it is chronically too small. These shows are anchoring laboratories that happen to have camera crews in them."},
    {name:"Expertise does not confer immunity", area:"jdm", verdict:"accurate",
     explanation:"The dealer knows the market, knows the tactic, and still lands closer to the opening number than to his own independent valuation. Pairs well with the finding that estate agents anchor on list price even when told to ignore it."}
  ],
  tags:["negotiation","reality tv","classic"]
},
{
  source:{title:"Post-game punditry", kind:"Live broadcast", detail:"Any panel discussing a fourth-quarter decision"},
  media:{videoId:"", start:0}, module:"Judgment & decision making",
  surface:"A call the same panel described as reasonable before kickoff is, ninety minutes later, obviously indefensible and something anyone could have seen coming.",
  prompt:"Find the pre-game tape. Is the panel contradicting itself, or reasoning normally?",
  concepts:[
    {name:"Hindsight bias", area:"jdm", verdict:"accurate",
     explanation:"Learning an outcome quietly rewrites your memory of how uncertain you were beforehand. The alternatives become hard to reach, so the result feels like it was always the likely one."},
    {name:"Outcome bias", area:"jdm", verdict:"accurate",
     explanation:"A separate error stacked on the first: judging the quality of a decision by how it turned out rather than by what was known when it was made. The distinction matters wherever decisions get audited, from medicine to hiring."}
  ],
  tags:["funny","sport"]
},
{
  source:{title:"21", kind:"Film, 2008", detail:"The classroom scene"},
  media:{videoId:"", start:0}, module:"Judgment & decision making",
  surface:"A professor poses the three-door game show puzzle to a lecture hall. Switching doors doubles your chances, and almost nobody believes it the first time.",
  prompt:"Argue for staying. Then identify exactly which step of that argument fails.",
  concepts:[
    {name:"Conditional probability", area:"jdm", verdict:"accurate",
     explanation:"The host knows where the prize is and will never open that door, so his choice carries information. Your original door keeps its one-in-three; the remaining door inherits everything else. The scene's maths is right."},
    {name:"Resistance to correct answers", area:"meta", verdict:"accurate",
     explanation:"The more interesting half is the audience. Professional mathematicians publicly refused this result for years. An intuition that feels like understanding is very hard to dislodge with a proof — a teaching problem as much as a psychology finding."}
  ],
  tags:["film","probability","classic"]
},
{
  source:{title:"The Office (US)", kind:"Television comedy", detail:"Michael follows the satnav into a lake"},
  media:{videoId:"", start:0}, module:"Judgment & decision making",
  surface:"The navigation system says turn right. Dwight is shouting that there is a lake there. Michael turns right into the lake.",
  prompt:"Written in 2007. What is the 2026 version of this?",
  concepts:[
    {name:"Automation bias", area:"jdm", verdict:"accurate",
     explanation:"When a system is usually right, people stop treating its output as evidence to be weighed and start treating it as an instruction. Direct visual contradiction loses. Thirty seconds that now does more work than any slide on deferring to algorithms."}
  ],
  tags:["funny","the office","technology"]
},
{
  source:{title:"The Office (US)", kind:"Television comedy", detail:"'I declare bankruptcy!'"},
  media:{videoId:"", start:0}, module:"Metacognition & myths",
  surface:"Michael walks into the room and shouts that he declares bankruptcy. Oscar explains that you cannot simply say the word, there is a process. Michael did not say it. He declared it.",
  prompt:"Pick something you are confident you understand. Now explain the mechanism out loud.",
  concepts:[
    {name:"Illusion of explanatory depth", area:"meta", verdict:"accurate",
     explanation:"Knowing a label produces a strong feeling of understanding the thing it names. Ask people to explain how a zip, a flush toilet or a tariff actually works and their confidence collapses mid-sentence. Michael is the comic version of an effect that shows up in surveys on policies people hold firm views about."}
  ],
  tags:["funny","the office","overconfidence"]
},
{
  source:{title:"Charades, and its talk-show version", kind:"Party game", detail:"Any round where the clue-giver gets angry"},
  media:{videoId:"", start:0}, module:"Metacognition & myths",
  surface:"One player is doing something they consider blindingly obvious. Their partner has no idea. The clue-giver becomes genuinely furious, which is the funniest part.",
  prompt:"Why is the anger the interesting bit rather than the failure?",
  concepts:[
    {name:"Curse of knowledge", area:"meta", verdict:"accurate",
     explanation:"Once you know something you cannot properly simulate not knowing it. Your own knowledge leaks into your model of the other person, so you systematically overestimate how clear you are being."},
    {name:"Illusion of transparency", area:"social", verdict:"accurate",
     explanation:"You also overestimate how visible your intentions are from outside. The gesture that feels unmistakable inside your head is genuinely ambiguous from across the room — the core problem in all teaching and all technical writing."}
  ],
  tags:["funny","game","communication"]
},
{
  source:{title:"Candid Camera", kind:"Hidden camera television", detail:"'Face the Rear' elevator segment"},
  media:{videoId:"", start:0}, module:"Social cognition",
  surface:"A man steps into an elevator. Everyone already inside is facing the back wall. Within seconds he turns to face the back too. When they remove their hats, he removes his.",
  prompt:"He will never see these people again. So why did he turn?",
  concepts:[
    {name:"Informational conformity", area:"social", verdict:"accurate",
     explanation:"Group behaviour is read as evidence about what the situation requires. If four people face the back, the reasonable inference is that there is a reason and you have missed it."},
    {name:"Normative conformity", area:"social", verdict:"accurate",
     explanation:"Separately, the cost of visible deviation feels high even among strangers. Both forces point the same way here, which is why the segment lands harder than Asch's line-judgement task does."}
  ],
  tags:["funny","classic","hidden camera"]
},
{
  source:{title:"Le Jeu de la Mort", kind:"French television experiment, 2010", detail:"Milgram's design restaged as a game show"},
  media:{videoId:"", start:0}, module:"Social cognition",
  note:"Simulated infliction of pain, and audible distress.",
  surface:"Contestants are told by a host, in front of a studio audience, to deliver escalating shocks to another contestant. A large majority continue past the point of protest.",
  prompt:"What would have had to be different in that studio for you to stop?",
  concepts:[
    {name:"Obedience to authority", area:"social", verdict:"accurate",
     explanation:"Swapping a laboratory coat for a television format did not reduce compliance; it slightly increased it. The finding is about the situation, not about the kind of person who ends up in it."},
    {name:"Fundamental attribution error", area:"social", verdict:"accurate",
     explanation:"Viewers reliably conclude the contestants were unusually weak people. That inference is the error the study exists to correct, and students make it in real time while watching. Handle with care: this material genuinely distresses people."}
  ],
  tags:["serious","obedience","television"]
},
{
  source:{title:"Talent show auditions", kind:"Reality television", detail:"Any first-round rejection where the contestant is stunned"},
  media:{videoId:"", start:0}, module:"Metacognition & myths",
  surface:"A contestant performs, is rejected, and reacts with total disbelief. The clip is captioned with the name of a psychology effect and shared several million times.",
  prompt:"The caption names an effect. Is the caption right?",
  concepts:[
    {name:"The Dunning-Kruger effect, as popularly retold", area:"meta", verdict:"overstated",
     explanation:"The popular version — the least able believe they are the best — overstates the original. The finding was milder and two-sided: weaker performers overestimate somewhat, while the strongest tend to underestimate. Useful precisely because it corrects a misconception students already hold confidently."},
    {name:"Absence of feedback", area:"meta", verdict:"accurate",
     explanation:"A likelier explanation for the specific clip. Assessing your own singing needs either good feedback or the very skill you are assessing, and friends and family systematically withhold the first. The gap is often about the environment, not the person."}
  ],
  tags:["funny","misconception","reality tv"]
},
{
  source:{title:"Derren Brown; Penn & Teller: Fool Us", kind:"Television specials", detail:"Any personality-reading routine"},
  media:{videoId:"", start:0}, module:"Metacognition & myths",
  surface:"Everyone in the room is handed a personality profile. Each person finds theirs uncannily accurate. Every profile is identical.",
  prompt:"Read one line aloud. How many people think it came from theirs?",
  concepts:[
    {name:"Barnum effect", area:"meta", verdict:"accurate",
     explanation:"Statements that apply to almost everyone feel personal when you believe they were written for you, because you supply the specifics yourself from memory."},
    {name:"Confirmation in real time", area:"meta", verdict:"accurate",
     explanation:"Add a reader watching your reactions and adjusting, and hits get remembered while misses get written off as the reader getting warm. Very hard to distinguish from real insight from the inside, which is the whole point."}
  ],
  tags:["funny","magic","gullibility"]
},
{
  source:{title:"Lie to Me", kind:"Television drama", detail:"Any microexpression analysis scene"},
  media:{videoId:"", start:0}, module:"Metacognition & myths",
  surface:"A consultant freezes video of a suspect's face, identifies a flicker lasting a fraction of a second, and declares the person is lying. He is always right.",
  prompt:"How would you design a study to test whether this works?",
  concepts:[
    {name:"Behavioural lie detection", area:"meta", verdict:"myth",
     explanation:"Across a large body of studies, people asked to detect deception from behaviour perform close to chance, and professional training barely moves the number. There is no reliable physical tell."},
    {name:"Illusory correlation", area:"meta", verdict:"accurate",
     explanation:"Why the belief survives: you notice the times a hunch was right and rarely learn about the times it was wrong, because liars you believed never correct you. The feedback needed to disconfirm the belief is structurally missing."}
  ],
  tags:["myth","television","deception"]
},
{
  source:{title:"Lucy and Limitless", kind:"Films", detail:"The premise, stated in dialogue in both"},
  media:{videoId:"", start:0}, module:"Metacognition & myths",
  surface:"A character is told humans use only a small fraction of their brain, and that unlocking the rest confers extraordinary abilities.",
  prompt:"What observation would you have to make for this to be true?",
  concepts:[
    {name:"The ten percent myth", area:"meta", verdict:"myth",
     explanation:"Wrong on every count. Imaging shows activity throughout the brain, damage to almost any region produces deficits, and no organ that metabolically expensive would be maintained unused."},
    {name:"Why appealing myths persist", area:"meta", verdict:"accurate",
     explanation:"The claim survives because it sells untapped potential, a more attractive story than a well-used brain with real limits. Tracking what a myth offers people is usually more informative than debunking it."}
  ],
  tags:["myth","film","neuroscience"]
}
];
