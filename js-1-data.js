/* ═══════════════════════════════════════════════════════
   JS 1 — Static Data: Categories, Prompts, Personalities,
           Challenges, Daily Prompts, Language Prompts
   ═══════════════════════════════════════════════════════ */

const CATEGORIES = [
  { id:'programming', label:'Programming', emoji:'💻', color:'#2F4156', bgKey:'terminal',
    subcats:['Debugging','Code Review','System Design','DSA','Backend','Frontend','Python','JavaScript','React','Node.js'] },
  { id:'art',         label:'Art & Design',  emoji:'🎨', color:'#567C8D', bgKey:'paint',
    subcats:['Fantasy','Cyberpunk','Anime','Medieval','Pixel Art','Nature','Sci-Fi'] },
  { id:'story',       label:'Story Writing', emoji:'📖', color:'#8FA8B8', bgKey:'book',
    subcats:['Horror','Romance','Mystery','Adventure','Historical','War','Space'] },
  { id:'business',    label:'Business',      emoji:'💼', color:'#4A6E7D', bgKey:'city',
    subcats:['Startup Ideas','Marketing','Sales','Product Launch','Brand Naming','SEO'] },
  { id:'gamedev',     label:'Game Dev',      emoji:'🎮', color:'#3A5F70', bgKey:'terminal',
    subcats:['Mechanics','Story','Level Design','AI','Multiplayer','Monetization'] },
  { id:'learning',    label:'Learning',      emoji:'🧠', color:'#2F4156', bgKey:'book',
    subcats:['Explain Concepts','Study Plans','Quiz Creation','Flashcards','Summaries'] },
  { id:'fun',         label:'Fun & Random',  emoji:'😂', color:'#567C8D', bgKey:'paint',
    subcats:['Roast Me','Pickup Lines','Dad Jokes','Random Facts','Fake News'] },
];

const PROMPTS = {
  programming: [
    { text:"Act as a senior software engineer. Explain how {topic} works using simple analogies, time complexity, and 3 common interview questions.", tags:['#DSA','#Interview'], diff:'intermediate' },
    { text:"You are a code reviewer. Review my {language} code for bugs, security issues, and performance improvements. Be blunt and specific.", tags:['#CodeReview','#Backend'], diff:'advanced' },
    { text:"Explain {concept} like I'm 12 years old. Use a real-world analogy and a simple code example.", tags:['#Learning','#Beginner'], diff:'beginner' },
    { text:"Design a scalable system for {app}. Include microservices, database choice, caching strategy, and load balancing.", tags:['#SystemDesign','#Architecture'], diff:'advanced' },
    { text:"Write a React component for {feature} with hooks, error boundaries, and TypeScript types. Include tests.", tags:['#React','#Frontend'], diff:'intermediate' },
    { text:"Debug this Python code and explain every issue you find. Then refactor it to be production-ready.", tags:['#Python','#Debugging'], diff:'intermediate' },
    { text:"Act as a Node.js expert. Build an authentication system with JWT, refresh tokens, and rate limiting.", tags:['#Node.js','#Backend'], diff:'advanced' },
    { text:"Explain the difference between {concept1} and {concept2} in JavaScript with code examples and use cases.", tags:['#JavaScript','#Concepts'], diff:'beginner' },
    { text:"Create a complete DSA study plan for 3 months to crack FAANG interviews. Include daily schedule and resources.", tags:['#DSA','#Interview','#StudyPlan'], diff:'intermediate' },
    { text:"Write a complete website using only CSS animations — no JavaScript allowed. Make it impressive.", tags:['#CSS','#Frontend','#Challenge'], diff:'advanced' },
  ],
  art: [
    { text:"A floating city above glowing cyan oceans during sunset, ultra-detailed, cinematic lighting, 4K, octane render.", tags:['#Sci-Fi','#Fantasy'], diff:'intermediate' },
    { text:"Cyberpunk street market at 3AM, neon reflections on wet asphalt, vendors selling black-market tech, moody atmosphere.", tags:['#Cyberpunk'], diff:'intermediate' },
    { text:"Ancient medieval castle overgrown with glowing bioluminescent vines, fantasy art style, epic scale.", tags:['#Medieval','#Fantasy'], diff:'beginner' },
    { text:"Pixel art 16-bit RPG village scene with animated torches, NPCs, and a secret dungeon entrance.", tags:['#PixelArt'], diff:'intermediate' },
    { text:"Anime-style warrior princess in samurai armor, cherry blossoms falling, golden hour, Studio Ghibli mood.", tags:['#Anime'], diff:'beginner' },
    { text:"Deep ocean abyss with bioluminescent creatures never seen before, terrifying and beautiful, photo-realistic.", tags:['#Nature','#Sci-Fi'], diff:'advanced' },
    { text:"Abandoned space station floating in a nebula, windows shattered, plants growing through metal, hauntingly beautiful.", tags:['#Sci-Fi','#Fantasy'], diff:'intermediate' },
  ],
  story: [
    { text:"Write a horror story set inside an abandoned underwater laboratory where every clock stopped at exactly 3:17.", tags:['#Horror'], diff:'intermediate' },
    { text:"A romance between two rival astronomers who discover they've been observing the same star — which is dying.", tags:['#Romance','#Space'], diff:'intermediate' },
    { text:"A mystery where the detective realizes every clue was planted by their own future self to prevent a catastrophe.", tags:['#Mystery','#Thriller'], diff:'advanced' },
    { text:"Write a war story told from the perspective of the last working robot soldier, 200 years after the war ended.", tags:['#War','#Sci-Fi'], diff:'advanced' },
    { text:"An adventure set in a world where music is a physical substance that can be mined, weaponized, or stolen.", tags:['#Adventure','#Fantasy'], diff:'intermediate' },
    { text:"A historical fiction where Nikola Tesla and Marie Curie secretly collaborated on a project that was buried.", tags:['#Historical'], diff:'intermediate' },
    { text:"Space exploration thriller: the crew of a colony ship discover the destination planet is already inhabited — by humans.", tags:['#Space','#Thriller'], diff:'advanced' },
  ],
  business: [
    { text:"Act as a startup mentor. Give me 5 SaaS startup ideas for 2025 that can be built solo and reach $10K MRR.", tags:['#Startup','#SaaS'], diff:'intermediate' },
    { text:"Write a complete go-to-market strategy for a {product} targeting {audience}. Include channels, pricing, and KPIs.", tags:['#Marketing','#GTM'], diff:'advanced' },
    { text:"Create a cold email sequence (5 emails) for a B2B SaaS product. Focus on pain points, not features.", tags:['#Sales','#Email'], diff:'intermediate' },
    { text:"Brand naming workshop: Generate 20 unique brand names for a {niche} company. Include rationale for each.", tags:['#Branding','#Naming'], diff:'beginner' },
    { text:"Write an SEO content strategy for a {industry} blog. Include keyword clusters, content types, and a 6-month calendar.", tags:['#SEO','#Content'], diff:'advanced' },
    { text:"Plan a product launch for {product}. Include pre-launch, launch day, and post-launch phases with metrics.", tags:['#ProductLaunch'], diff:'intermediate' },
  ],
  gamedev: [
    { text:"Design a survival game where every NPC remembers your previous choices and updates their behavior accordingly.", tags:['#Mechanics','#AI'], diff:'advanced' },
    { text:"Create a compelling game villain backstory for {villain} who genuinely believes they're saving the world.", tags:['#Story','#Character'], diff:'intermediate' },
    { text:"Design a roguelike level generation algorithm for a dungeon crawler. Include room types, enemy spawning, and loot.", tags:['#LevelDesign','#Algorithm'], diff:'advanced' },
    { text:"Balance a multiplayer game economy where three factions compete for resources without one dominating in 20 hours.", tags:['#Multiplayer','#Balance'], diff:'advanced' },
    { text:"Write a puzzle game concept where the player controls time in 5-second loops to solve increasingly complex puzzles.", tags:['#Mechanics','#Puzzle'], diff:'intermediate' },
  ],
  learning: [
    { text:"Explain Quantum Physics to a five-year-old using only toys and everyday objects as analogies.", tags:['#Science','#ELI5'], diff:'beginner' },
    { text:"Create a 30-day study plan to learn {skill} from zero to job-ready. Include daily tasks and free resources.", tags:['#StudyPlan'], diff:'intermediate' },
    { text:"Generate a 20-question quiz on {topic} with answers, explanations, and difficulty levels for each question.", tags:['#Quiz'], diff:'intermediate' },
    { text:"Create Anki-style flashcards for the 50 most important concepts in {subject}. Front: question. Back: detailed answer.", tags:['#Flashcards'], diff:'beginner' },
    { text:"Teach me {concept} using the Feynman Technique. Start simple, identify gaps, and deepen understanding step by step.", tags:['#Feynman','#DeepLearning'], diff:'intermediate' },
  ],
  fun: [
    { text:"Roast my career choices as if you're a disappointed Gordon Ramsay who just found raw chicken in my life decisions.", tags:['#Roast','#Comedy'], diff:'beginner' },
    { text:"Write 10 terrible pickup lines from a robot who just learned about human romance by watching 90s sitcoms.", tags:['#Romance','#Comedy'], diff:'beginner' },
    { text:"Give me 5 dad jokes about {topic} so bad they loop back around to being hilarious.", tags:['#DadJokes'], diff:'beginner' },
    { text:"Write a fake Wikipedia article for a completely made-up but eerily plausible historical event.", tags:['#FakeNews','#Comedy'], diff:'intermediate' },
    { text:"Share 10 mind-blowing facts about {topic} that sound fake but are completely true.", tags:['#Facts','#Random'], diff:'beginner' },
  ],
};

const PERSONALITIES = {
  'None':        '',
  'Teacher':     'Explain as if you are a patient, brilliant teacher who loves breaking down complex ideas.',
  'Pirate':      'Arrr! Answer as a swashbuckling pirate who somehow knows everything about this topic.',
  'Shakespeare': 'Respondeth in the style of Shakespeare, with flowery prose and dramatic flair, yet keep meaning clear.',
  'Hacker':      'Respond like a 1990s hacker: terse, technical, use l33tspeak occasionally, assume the user is on dial-up.',
  'CEO':         'Think like a visionary CEO. Focus on impact, strategy, ROI, and scaling. Be bold and decisive.',
  'Scientist':   'Respond with scientific precision. Cite hypothetical studies, use proper terminology, hedge appropriately.',
  'Detective':   'Examine this like a world-weary detective piecing together clues. Be analytical, suspicious, and dramatic.',
};

const CHALLENGES = [
  "Build a complete e-commerce website using only HTML and CSS — no JavaScript, no frameworks.",
  "Explain the entire history of computing in exactly 280 characters.",
  "Write a sorting algorithm that only a medieval knight would understand.",
  "Design an app that replaces all human meetings with haiku exchanges.",
  "Explain Quantum Physics to a five-year-old using only emojis.",
  "Write a business plan for a company that sells clouds to people who've never seen rain.",
  "Create a programming language where all syntax is based on cooking recipes.",
  "Design a video game where death makes you more powerful each time you fail.",
  "Write a mystery novel plot where the murderer is the concept of time itself.",
  "Build a machine learning model that predicts what someone will dream about.",
];

const DAILY_PROMPTS = [
  "Write a compelling origin story for an AI that became self-aware by reading poetry at 3AM.",
  "Design a city where architecture changes based on residents' collective emotions.",
  "Create a conversation between the last two humans and the AI that outlived civilization.",
  "Write the user manual for a time machine written by someone who's never time traveled.",
  "Explain the internet to someone from ancient Rome who's surprisingly tech-savvy.",
  "Design a programming language where bugs are illegal and compile errors cost $5.",
  "Write a horror story set in a world where your thoughts become audible to everyone nearby.",
];

const HINDI_PROMPTS = [
  "एक वरिष्ठ सॉफ्टवेयर इंजीनियर के रूप में बताएं कि hash table कैसे काम करती है — सरल उदाहरणों के साथ।",
  "एक भूतिया समुद्री प्रयोगशाला में horror story लिखें जहाँ हर घड़ी 3:17 पर रुकी हुई है।",
  "ऐसे 5 startup ideas बताएं जो 2025 में अकेला developer बना सके और $10K MRR तक पहुँच सके।",
];

const SPANISH_PROMPTS = [
  "Actúa como ingeniero senior. Explica cómo funciona una tabla hash con ejemplos simples y complejidad temporal.",
  "Escribe una historia de terror en un laboratorio submarino abandonado donde todos los relojes se detuvieron a las 3:17.",
  "Dame 5 ideas de startups para 2025 que un desarrollador solo pueda construir y alcanzar $10K MRR.",
];

const SLOT_OPTIONS = [
  ['Programming','Art','Story','Business','Game Dev','Learning','Fun'],
  ['Beginner','Intermediate','Advanced','Expert','Random','Unique'],
  ['Explain','Build','Design','Create','Analyze','Optimize'],
];
