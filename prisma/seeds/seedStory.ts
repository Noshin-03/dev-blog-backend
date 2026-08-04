import { PrismaClient, Category, User } from '@prisma/client';

type StorySeed = {
    authorUsername: string;
    title: string;
    body: string;
    categoryNames: string[];
};

const storySeeds = [
    // ---------------------------------------------------------------------
    // Technology
    // ---------------------------------------------------------------------
    {
        authorUsername: 'tabassum',
        title: 'The Quiet Rise of Edge Computing',
        body: 'While most of the AI conversation over the last few years has centered on massive centralized data centers, a quieter shift has been happening at the other end of the spectrum. Edge computing pushes processing closer to where data is actually generated — a security camera, a factory sensor, a phone — instead of shipping everything back to a distant server first.\n\nThe appeal is straightforward: lower latency, reduced bandwidth costs, and the ability to keep functioning even when a connection drops. For applications like autonomous vehicles or industrial monitoring, waiting on a round trip to the cloud simply isn\'t an option. As edge hardware gets cheaper and more capable, expect more of the "smart" features we take for granted to be running a few feet away from us, not a few thousand miles.',
        categoryNames: ['Technology'],
    },
    {
        authorUsername: 'rafiq',
        title: 'Why Rust Is Winning Over Systems Programmers',
        body: "Rust has spent the last several years steadily moving from \"interesting niche language\" to a default recommendation for new systems-level projects, and the reason usually comes down to one thing: it makes entire categories of bugs structurally impossible rather than just harder to write.\n\nMemory safety without a garbage collector was the initial hook, but the ecosystem that's grown around it — a genuinely good package manager, clear error messages, and a compiler that catches mistakes most languages would let slide into production — is what's kept engineers around. Teams at companies that historically lived and died by C++ are increasingly rewriting critical components in Rust, not because it's trendy, but because the maintenance burden of the old code was becoming unsustainable.",
        categoryNames: ['Technology'],
    },
    {
        authorUsername: 'nabil',
        title: 'Demystifying WebAssembly for Web Developers',
        body: "WebAssembly, or Wasm, gets described in intimidating terms, but the core idea is simple: it's a compact binary format that lets code written in languages like C++, Rust, or Go run in the browser at speeds close to native performance, alongside — not instead of — JavaScript.\n\nThe practical upshot is that computationally heavy tasks that used to be impractical in a browser, like video editing, CAD tools, or full game engines, are now genuinely usable on the web. It's not a JavaScript replacement so much as a release valve for the specific things JavaScript was never well suited for. If you've used a browser-based Photoshop alternative or played a AAA-adjacent game without installing anything, there's a good chance Wasm was doing the heavy lifting underneath.",
        categoryNames: ['Technology', 'Education'],
    },
    {
        authorUsername: 'mitu',
        title: 'The State of Serverless in 2026',
        body: "Serverless computing promised to let developers stop thinking about servers entirely, and for a large class of applications, that promise has mostly held up. Functions that scale automatically, bill by the millisecond, and require no capacity planning have become the default starting point for a lot of new backend work.\n\nThe rough edges are well known at this point too: cold starts, vendor lock-in, and the genuine difficulty of debugging a system spread across dozens of ephemeral functions instead of one long-running process. What's changed recently isn't the core trade-off so much as the tooling around it — better local emulation, clearer observability, and frameworks that make it easier to structure serverless code so it doesn't turn into an unmanageable web of tiny, tangled functions.",
        categoryNames: ['Technology'],
    },
    {
        authorUsername: 'arjun',
        title: 'How Vector Databases Power Modern AI Search',
        body: 'Traditional databases are built around exact matches — find the row where the email equals this string. AI-powered search needs something different: a way to find things that are conceptually similar, even if they don\'t share a single word in common. That\'s the job vector databases are built for.\n\nThey work by storing embeddings — numerical representations of meaning, produced by a model — and finding the nearest neighbors to a given query in that high-dimensional space. This is what lets a search for "cozy winter reads" surface a book whose description never actually uses the word "cozy." As more products bolt AI features onto search and recommendations, understanding this layer is becoming as fundamental as understanding SQL once was.',
        categoryNames: ['Technology', 'Science'],
    },
    {
        authorUsername: 'nusrat',
        title: 'A Developer\u2019s Guide to API Rate Limiting',
        body: "Rate limiting often gets bolted onto an API as an afterthought, right after the first time a misbehaving client or a bot brings a service to its knees. Done properly, it's a design decision made early, not a patch applied in a panic.\n\nThe two most common approaches — token bucket and sliding window — trade off differently between burst tolerance and strict fairness, and the right choice depends heavily on your actual traffic patterns rather than which algorithm sounds more sophisticated. Just as important as the algorithm is the client experience: clear rate-limit headers, meaningful error messages, and a documented policy save your support team from a flood of confused tickets when a legitimate integration hits an unexpected wall.",
        categoryNames: ['Technology', 'Business'],
    },
    {
        authorUsername: 'imran',
        title: 'The Return of Local-First Software',
        body: "For most of the last decade, \"cloud-first\" was the unquestioned default — your data lived on someone else's server, and the app on your device was mostly a window into it. Local-first software flips that assumption: your data lives on your device first, syncs opportunistically, and keeps working perfectly well with no connection at all.\n\nThe renewed interest isn't nostalgia so much as a response to real frustrations — apps that become unusable the moment wifi drops, and a growing unease about how much of our daily lives depend on services we don't control. New syncing techniques, particularly CRDTs, have made it practical to get the collaborative features people expect from cloud apps without giving up the resilience and privacy of software that genuinely works offline.",
        categoryNames: ['Technology'],
    },
    {
        authorUsername: 'zayed',
        title: 'Debugging Distributed Systems: Lessons from Production',
        body: "Debugging a single-process application is largely a solved problem — set a breakpoint, step through, done. Debugging a distributed system, where a single user request might touch a dozen services, is a fundamentally different skill, and one that most developers only really learn by getting paged at 3am.\n\nThe single highest-leverage investment is distributed tracing, which stitches a request's journey across every service it touches into one coherent timeline. Without it, you're left correlating timestamps across a dozen separate log files by hand, which is slow, error-prone, and miserable during an active incident. The second lesson, learned more painfully, is to instrument for the failure you haven't had yet, not just the one you just fixed — the next outage is rarely a repeat of the last one.",
        categoryNames: ['Technology'],
    },

    // ---------------------------------------------------------------------
    // Lifestyle
    // ---------------------------------------------------------------------
    {
        authorUsername: 'sara',
        title: 'The Case for a Slower Morning Routine',
        body: "It's tempting to treat mornings as a race — alarm, phone, coffee, door, all compressed into the smallest possible window. But a slower start, even by fifteen or twenty minutes, tends to pay for itself many times over across the rest of the day.\n\nThe specifics matter less than the principle: some stretch of time before the demands of the day begin, spent on something that isn't reactive. That might be a short walk, journaling, or simply drinking coffee without a screen in hand. The point isn't productivity theater — it's giving your mind a few unhurried minutes before it has to start responding to other people's priorities.",
        categoryNames: ['Lifestyle'],
    },
    {
        authorUsername: 'kabir',
        title: 'Digital Decluttering: A Practical Guide',
        body: "Most people's phones are a graveyard of apps they downloaded once, notifications they've learned to tune out, and photo libraries with tens of thousands of nearly identical shots. Digital clutter has the same quiet, draining effect as physical clutter, even though it's easier to ignore because it's not visibly piled in a corner.\n\nA useful starting point is auditing notifications first, since that's the layer actively interrupting your attention throughout the day — most apps default to notifying you far more than you'd ever choose if asked directly. From there, unused apps, duplicate files, and an overflowing downloads folder are easy, low-stakes wins that make the whole experience of using your devices noticeably calmer.",
        categoryNames: ['Lifestyle', 'Technology'],
    },
    {
        authorUsername: 'ayesha',
        title: 'Why I Stopped Multitasking and What Changed',
        body: "For years I treated multitasking as a skill to be proud of — emails during meetings, podcasts during work, three browser windows open at once. What eventually changed my mind wasn't a productivity book, but noticing how little I actually retained from any of it.\n\nSingle-tasking, it turns out, isn't about doing less — it's about doing one thing with your full attention instead of three things with a third of it each. The work itself got faster once I stopped context-switching, and conversations got noticeably better once I stopped half-listening while doing something else on the side. The hardest part wasn't the habit itself; it was tolerating the mild discomfort of sitting with just one thing at a time.",
        categoryNames: ['Lifestyle', 'Health'],
    },
    {
        authorUsername: 'farhan',
        title: 'Building a Reading Habit That Actually Sticks',
        body: 'Most attempts to "read more" fail for the same reason most New Year\'s resolutions fail — they start with an ambitious goal and no actual system to sustain it. Reading twelve books this year sounds nice, but it doesn\'t tell you what to do on a random Tuesday when you\'re tired and the TV is right there.\n\nWhat actually works is smaller and less glamorous: keeping a book physically visible instead of buried in a drawer, lowering the bar to "read one page" on hard days, and giving yourself full permission to abandon a book that isn\'t working rather than forcing your way through it out of guilt. Consistency over weeks and months, at a pace that feels almost too easy, beats an ambitious streak that burns out by February.',
        categoryNames: ['Lifestyle', 'Education'],
    },
    {
        authorUsername: 'mitu',
        title: 'The Art of Saying No Without Guilt',
        body: 'Saying yes feels good in the moment and costly later — an overcommitted calendar is usually the result of a hundred individually reasonable-seeming yeses that added up to something unsustainable. Learning to say no well is less about willpower and more about having a few honest, low-drama phrases ready before you need them.\n\nA clear, brief no — without an over-explained justification — tends to land better than a long apologetic one, which can read as an invitation to negotiate. The uncomfortable truth is that every yes is also, implicitly, a no to something else, usually something closer to your actual priorities. Getting comfortable with that trade-off is most of what "boundaries" actually means in practice.',
        categoryNames: ['Lifestyle'],
    },
    {
        authorUsername: 'arjun',
        title: 'Home Cooking as a Form of Self-Care',
        body: "It's easy to treat cooking as just another chore competing for time against work and everything else, but there's a real difference between grabbing takeout out of exhaustion and deliberately cooking something, even something simple, as a way of taking care of yourself.\n\nThe self-care framing isn't about elaborate meals or perfect technique — it's about the twenty unhurried minutes of chopping vegetables, the smell of something simmering, the small satisfaction of eating something you made with your own hands. On the busiest weeks that might mean a five-ingredient dinner instead of a real project, and that's fine — the value is in the ritual and the attention, not in the complexity of what ends up on the plate.",
        categoryNames: ['Lifestyle', 'Health'],
    },
    {
        authorUsername: 'priya',
        title: 'Rethinking Your Relationship With Your Phone',
        body: "The average person checks their phone well over a hundred times a day, and most of those checks aren't decisions so much as reflexes — a hand moving toward a pocket before the brain has even registered boredom. Rethinking that relationship doesn't require abandoning the phone; it requires making the reflex a little less automatic.\n\nSimple friction helps more than willpower does — a home screen with no apps on it, notifications trimmed down to actual people rather than every app that wants your attention, charging the phone outside the bedroom. None of these are dramatic changes individually, but together they shift the phone from something that constantly interrupts you to something you deliberately pick up.",
        categoryNames: ['Lifestyle', 'Technology'],
    },
    {
        authorUsername: 'lubna',
        title: 'Small Rituals That Make a House Feel Like Home',
        body: "A house full of furniture can still feel like a waiting room if nothing about the daily rhythm of it feels lived-in. It's often the small, repeated rituals — not the decor — that make a space feel genuinely like home.\n\nLighting a candle while cooking dinner, a Sunday routine of changing the sheets and airing out the rooms, a specific mug reserved for the first coffee of the day — none of these change anything structural about the space, but they give it a texture of familiarity that accumulates slowly. The rituals that stick tend to be the ones tied to the senses — smell and light especially — rather than anything you'd actually notice if you tried to describe the room to someone else.",
        categoryNames: ['Lifestyle'],
    },

    // ---------------------------------------------------------------------
    // Business
    // ---------------------------------------------------------------------
    {
        authorUsername: 'rafiq',
        title: 'What Startups Get Wrong About Product-Market Fit',
        body: "Product-market fit gets treated as a switch that flips one day, but in practice it's closer to a signal that gets louder gradually — usage that keeps climbing without a matching increase in marketing spend, customers who get upset when the product goes down, organic referrals that show up without being asked for.\n\nThe most common mistake isn't failing to find fit; it's convincing yourself you've found it too early, based on a handful of enthusiastic early adopters who aren't representative of the broader market you actually need. A few passionate users are necessary but not sufficient — the real test is whether a much less forgiving, less patient group of customers would still pay for and stick with what you've built.",
        categoryNames: ['Business'],
    },
    {
        authorUsername: 'sara',
        title: 'The Hidden Cost of Constant Context Switching at Work',
        body: 'Open-plan offices and chat apps have made it trivially easy to interrupt a colleague, and trivially easy to be interrupted — which sounds efficient in the moment but is quietly expensive in aggregate. Studies on task-switching consistently find that it takes meaningful time to fully re-engage with deep work after even a short interruption.\n\nTeams that protect blocks of uninterrupted time — no-meeting mornings, explicit "do not disturb" norms, batching messages instead of answering in real time — tend to ship complex work faster, not slower, even though it can feel counterintuitive to be less immediately responsive. The productivity lost to constant availability rarely shows up on anyone\'s dashboard, which is exactly why it\'s so persistently underestimated.',
        categoryNames: ['Business'],
    },
    {
        authorUsername: 'kabir',
        title: 'How to Run a Meeting People Don\u2019t Dread',
        body: "Most meetings fail for one of two reasons: no clear purpose, or a purpose that didn't actually need a meeting in the first place. A status update that could have been a written summary, sent to a channel and read in two minutes, is a common and easily fixable offender.\n\nMeetings that do earn their place tend to share a few habits — a written agenda circulated in advance, a clear owner and decision to be made by the end, and a hard stop that's actually respected. Ending five minutes early more often than not is a better signal of a well-run meeting than filling every allotted minute out of habit.",
        categoryNames: ['Business'],
    },
    {
        authorUsername: 'nabil',
        title: 'Building a Company Culture That Survives Remote Work',
        body: "A lot of company culture used to happen accidentally — overheard hallway conversations, the shared context of everyone sitting in the same room. Remote and hybrid teams don't get that for free, and pretending otherwise tends to produce a culture that only exists on paper.\n\nWhat actually transfers to a distributed team is deliberate, not accidental: documented decisions instead of tribal knowledge, explicit norms around response times and availability, and intentional space for informal connection rather than assuming it'll happen organically the way it might have around a coffee machine. Culture in a remote company isn't weaker by default — it just has to be built on purpose instead of absorbed by osmosis.",
        categoryNames: ['Business'],
    },
    {
        authorUsername: 'mitu',
        title: 'Lessons From Bootstrapping a SaaS to Profitability',
        body: "Bootstrapping gets romanticized online, but the actual experience is less \"hustle culture highlight reel\" and more a long stretch of unglamorous discipline — watching every dollar of spend, saying no to features that would be nice but aren't necessary, and resisting the urge to hire ahead of revenue just because a competitor with venture funding is doing it.\n\nThe single biggest advantage of bootstrapping isn't the money saved; it's the forced proximity to actual paying customers from day one, since there's no other source of runway to fall back on. That constraint, uncomfortable as it is early on, tends to produce a product genuinely shaped by what people will pay for rather than what looks impressive in a pitch deck.",
        categoryNames: ['Business', 'Finance'],
    },
    {
        authorUsername: 'arjun',
        title: 'Why Most Rebrands Fail',
        body: 'A rebrand is often pitched internally as a fresh start, but most of the ones that fail share a common root cause: the new logo and color palette were treated as a substitute for solving an actual underlying business problem, rather than a reflection of a problem that had already been solved.\n\nCustomers rarely leave a brand because the visual identity felt dated; they leave because the product stopped meeting their needs, or a competitor started meeting them better. A rebrand layered on top of an unresolved product problem tends to just be a more expensive, more confusing version of the same problem — new packaging around the same underlying issue customers were already unhappy about.',
        categoryNames: ['Business'],
    },
    {
        authorUsername: 'tanvir',
        title: 'The Founder\u2019s Dilemma: When to Hire Your First Employee',
        body: "There's a specific, uncomfortable moment in most early-stage companies where the founder is doing everything, poorly, because there simply aren't enough hours in the day — and hiring too early can burn through runway just as fast as hiring too late can burn out the founder.\n\nA reasonable rule of thumb is to hire for whatever's becoming a genuine bottleneck on growth, not for whatever role sounds most impressive to have filled. The first hire is disproportionately important because it sets the bar — culturally and in terms of competence — for everyone who comes after, which is a strong argument for being patient rather than hiring the first plausible candidate out of sheer exhaustion.",
        categoryNames: ['Business'],
    },
    {
        authorUsername: 'lubna',
        title: 'Customer Support as a Growth Channel, Not a Cost Center',
        body: 'Support is frequently budgeted and staffed like a cost to be minimized, which is a reasonable instinct for a call center handling routine password resets, but a genuinely bad one for a product where the support team is often the only humans a customer ever actually talks to at the company.\n\nCompanies that treat support conversations as a source of product insight — not just ticket resolution — tend to catch confusing onboarding flows and missing features long before they show up in churn numbers. A support team empowered to actually fix small things, not just apologize for them, quietly becomes one of the highest-leverage teams in the company, even though it rarely gets credited that way on an org chart.',
        categoryNames: ['Business'],
    },

    // ---------------------------------------------------------------------
    // Education
    // ---------------------------------------------------------------------
    {
        authorUsername: 'ayesha',
        title: 'Rethinking Homework in the Age of AI',
        body: 'The arrival of capable AI writing tools has forced a fairly uncomfortable question in classrooms: if a chatbot can produce a passable five-paragraph essay in seconds, what was that assignment actually supposed to be teaching, and is there a better way to teach it?\n\nMany educators are shifting toward assignments that are harder for a tool to shortcut — in-class writing, oral defenses of a written argument, or projects built iteratively with visible drafts along the way. The more interesting long-term shift may be treating AI as a tool students are explicitly taught to use well, the way calculators eventually became accepted in math class, rather than something to be purely policed against.',
        categoryNames: ['Education', 'Technology'],
    },
    {
        authorUsername: 'nabil',
        title: 'The Case for Teaching Financial Literacy in School',
        body: "It's a strange gap in most education systems: students can graduate having studied calculus and never once been taught how compound interest, credit scores, or a basic budget actually work — despite the latter being far more likely to affect their daily lives.\n\nThe argument for teaching it earlier isn't that financial literacy is more important than other subjects, but that the cost of not knowing it compounds just as relentlessly as interest does, often in the form of debt taken on without fully understanding the terms. A single well-taught unit on how credit actually works could plausibly save more real money over a lifetime than most electives combined.",
        categoryNames: ['Education', 'Finance'],
    },
    {
        authorUsername: 'farhan',
        title: 'How Spaced Repetition Actually Works',
        body: "Cramming feels productive in the moment because recall is easy right after you've just studied something — which is exactly why it's such a poor predictor of what you'll actually remember a week later. Spaced repetition works by deliberately reviewing material right at the point you're about to forget it, which is uncomfortable but far more effective.\n\nThe underlying mechanism is that each successful recall at increasing intervals strengthens the memory more than passive re-reading ever does, which is why flashcard apps built around this principle can produce retention that feels almost unfair compared to traditional studying. The catch is that it requires trusting a system over multiple weeks rather than seeing results the night before an exam.",
        categoryNames: ['Education'],
    },
    {
        authorUsername: 'mitu',
        title: 'Why Standardized Tests Struggle to Measure Curiosity',
        body: "Standardized tests are good at measuring a narrow, useful thing — whether a student can reliably produce a correct answer under time pressure. What they're notably bad at measuring is the kind of curiosity that drives someone to keep pulling on a thread long after the \"correct\" answer has already been found.\n\nThis isn't necessarily an argument against testing altogether — some measurement is genuinely useful — but it is an argument against treating test scores as a complete picture of a student's potential. Some of the most capable people in any field are famously mediocre test-takers, not because they lack ability, but because the format itself rewards a specific, narrow kind of thinking that doesn't map cleanly onto real intellectual curiosity.",
        categoryNames: ['Education'],
    },
    {
        authorUsername: 'arjun',
        title: 'Learning to Code Later in Life',
        body: "There's a persistent myth that programming is a young person's game, best learned before your brain \"sets\" in your twenties. In practice, career-changers who start learning to code in their thirties, forties, or later bring something younger beginners often lack: a much clearer sense of what they actually want to build and why.\n\nThe genuine challenge isn't cognitive ability — it's the discomfort of being a beginner again after years of competence in a different field, and the patience required to sit with confusion as a normal part of the process rather than a sign you're in the wrong field. Most people who stick with it for six honest months of consistent practice find the \"too old for this\" fear was the biggest obstacle, not any actual limitation.",
        categoryNames: ['Education', 'Technology'],
    },
    {
        authorUsername: 'nusrat',
        title: 'The Value of Boring, Repetitive Practice',
        body: "Every skill that looks effortless from the outside — a musician's improvisation, a chess player's intuition, a writer's clean first draft — was built on a foundation of unglamorous, repetitive practice that nobody ever sees or particularly enjoys doing.\n\nThe discomfort of repetitive practice isn't a sign you're doing it wrong; it's usually a sign you're doing it right, since genuine skill-building happens specifically at the edge of what already feels easy. Modern culture is fairly allergic to boredom, which makes this kind of unglamorous, repetitive work a quietly underrated advantage for anyone still willing to put in the hours everyone else is trying to shortcut.",
        categoryNames: ['Education'],
    },
    {
        authorUsername: 'imran',
        title: 'What Makes a Good Mentor',
        body: "Good mentorship gets confused with simply being generous with advice, but the mentors people remember for years tend to do something subtler: they ask better questions than they give answers, and they let you struggle with a problem just long enough to learn something from it before stepping in.\n\nThe best mentors also tend to be honest about failure — their own, specifically — in a way that makes a mentee's own inevitable mistakes feel less like a catastrophe and more like an expected part of the process. Advice given too early, before someone has really wrestled with a problem themselves, is often forgotten within a week; advice given at the right moment, after genuine struggle, tends to stick for years.",
        categoryNames: ['Education', 'Business'],
    },
    {
        authorUsername: 'zayed',
        title: 'Self-Taught vs. Formal Education in Tech Careers',
        body: 'The debate between bootcamps, self-teaching, and a traditional computer science degree tends to generate more heat than light, mostly because it treats "which path is better" as a single question when it\'s really several different questions depending on someone\'s goals, resources, and how they learn best.\n\nA formal degree still tends to provide a stronger foundation in the theoretical underpinnings — algorithms, systems, the "why" behind the tools — while self-taught and bootcamp paths often produce developers who are faster to become practically productive on real projects, having spent their time building rather than proving theorems. In practice, the strongest engineers from either path eventually fill in whatever their original route left out; the starting point matters less than most people assume once a few years of real work have passed.',
        categoryNames: ['Education', 'Technology'],
    },

    // ---------------------------------------------------------------------
    // Entertainment
    // ---------------------------------------------------------------------
    {
        authorUsername: 'sara',
        title: 'The Comeback of Vinyl in a Streaming World',
        body: "It would have sounded absurd a decade ago to predict that vinyl records — a format most people had written off as a relic — would be outselling CDs and, in some markets, growing faster than digital sales. But that's roughly where things have landed.\n\nThe appeal isn't really about audio fidelity, despite what enthusiasts sometimes claim; digital streaming is technically cleaner in most objective ways. It's about physicality and intention in a listening experience that has otherwise become nearly frictionless and disposable — a record demands you sit with an album rather than skip through a shuffled playlist, and for a lot of listeners tired of infinite, effortless choice, that constraint has become the whole point.",
        categoryNames: ['Entertainment'],
    },
    {
        authorUsername: 'kabir',
        title: 'How Video Game Soundtracks Became Serious Art',
        body: "Game music used to be an afterthought, constrained by primitive hardware into short, looping chiptunes. Today, some of the most ambitious orchestral composition being written anywhere is being written for games, performed by full orchestras and sold as standalone albums that stand entirely on their own outside the games they were written for.\n\nWhat sets great game music apart from film scoring is a structural constraint film composers never have to deal with: the music has to work at any length, looping seamlessly or adapting dynamically to unpredictable player choices, without ever feeling repetitive or intrusive. That's a genuinely different compositional problem, and the composers who've solved it well have quietly built some of the more technically interesting music of the last two decades.",
        categoryNames: ['Entertainment', 'Technology'],
    },
    {
        authorUsername: 'nabil',
        title: 'Why Slow Cinema Still Has an Audience',
        body: 'In an entertainment landscape increasingly optimized for retention algorithms and constant stimulation, it\'s a little surprising that "slow cinema" — long takes, minimal dialogue, plots that unfold at a deliberately unhurried pace — still finds a dedicated, and arguably growing, audience.\n\nPart of the appeal is precisely the resistance to the pace of everything else. A film that refuses to rush gives you something modern media rarely offers anymore: unstructured time to simply sit with an image or a feeling without being pulled immediately toward the next beat. It\'s not for everyone, and it was never designed to be, but for the audience it does reach, that patience is the entire point rather than a flaw to be fixed.',
        categoryNames: ['Entertainment'],
    },
    {
        authorUsername: 'mitu',
        title: 'The Economics of the Modern Film Franchise',
        body: 'Original films still get made, but the financial logic of a modern studio increasingly points toward franchises — a built-in audience, a recognizable brand, and a much lower marketing cost per dollar of expected revenue compared to something entirely new and unproven.\n\nThe risk of that logic, playing out visibly over the last several years, is franchise fatigue — audiences growing weary of sequels and spin-offs that exist primarily to extend a brand rather than to tell a story that genuinely needed telling. Studios are increasingly caught between the near-term safety of a known franchise and the longer-term risk that an oversaturated audience simply stops caring about the next installment altogether.',
        categoryNames: ['Entertainment', 'Business'],
    },
    {
        authorUsername: 'arjun',
        title: 'Podcasts and the New Golden Age of Audio Drama',
        body: "Long before television, radio drama was a genuinely massive form of mainstream entertainment, before it was largely displaced and mostly forgotten for decades. Podcasting, almost accidentally, has revived the format — narrative fiction podcasts with full casts, sound design, and serialized plots are drawing audiences that rival some television shows.\n\nWhat makes the format distinct from television isn't just cost, though audio drama is dramatically cheaper to produce — it's the intimacy of a medium consumed almost entirely through headphones, often while doing something else, which creates a different, more personal kind of engagement than a show competing for your undivided visual attention on a screen.",
        categoryNames: ['Entertainment'],
    },
    {
        authorUsername: 'priya',
        title: 'What Makes a Plot Twist Actually Work',
        body: "A great plot twist doesn't feel like a trick when you look back on it — it feels inevitable, as though the story was quietly pointing toward it the entire time and you simply weren't looking closely enough. A twist that only works because information was actively withheld tends to feel cheap on a second viewing in a way the best ones never do.\n\nThe difference between a twist that lands and one that falls flat usually comes down to whether it recontextualizes what came before, or simply replaces it. The best twists make you want to immediately go back and reread or rewatch the beginning, because you now understand you were seeing the same events through the wrong lens the entire time.",
        categoryNames: ['Entertainment'],
    },
    {
        authorUsername: 'lubna',
        title: 'The Rise of Cozy Games',
        body: 'Amid a gaming industry often defined by punishing difficulty and competitive stakes, "cozy games" — low-stress, often narrative-light experiences built around gentle activities like farming, decorating, or fishing — have quietly become one of the fastest-growing genres, especially among players who never previously identified as gamers at all.\n\nThe appeal is fairly explicit in the name: no fail states, no time pressure, no possibility of losing progress you\'ve worked toward. In a media landscape that\'s otherwise relentlessly demanding of attention and reaction time, a genre explicitly built around the absence of stress has turned out to be exactly what a large, previously underserved audience actually wanted.',
        categoryNames: ['Entertainment', 'Lifestyle'],
    },
    {
        authorUsername: 'tanvir',
        title: 'Live Theater in the Age of Streaming',
        body: "It would be reasonable to assume that live theater, an expensive and logistically demanding art form, would have been quietly squeezed out by the convenience of streaming. Instead, ticket sales in many major theater markets have held up surprisingly well, suggesting the two mediums are competing for different things rather than directly for the same audience.\n\nWhat streaming can't replicate is the specific, unrepeatable nature of a live performance — the knowledge that what you're watching is happening once, in real time, with the small imperfections and genuine risk that implies. For an audience increasingly saturated with content that's infinitely repeatable and algorithmically optimized, that unrepeatability has become, somewhat unexpectedly, part of the draw rather than a limitation.",
        categoryNames: ['Entertainment'],
    },

    // ---------------------------------------------------------------------
    // Health
    // ---------------------------------------------------------------------
    {
        authorUsername: 'farhan',
        title: 'Understanding Sleep Debt and How to Recover From It',
        body: "Sleep debt behaves less like a simple deficit you can pay back with one long weekend sleep-in and more like a slow accumulation that quietly erodes cognitive performance, mood, and even immune function well before it becomes obviously noticeable.\n\nRecovering from a genuine, sustained sleep debt takes consistency over days, not a single marathon night — going to bed even thirty minutes earlier for a week tends to do more for actual recovery than one dramatic twelve-hour sleep followed by a return to the same short-sleep pattern. The uncomfortable reality is that there's no real shortcut here: the only reliable fix for chronic sleep debt is, somewhat anticlimactically, more sleep, spread consistently across more nights.",
        categoryNames: ['Health'],
    },
    {
        authorUsername: 'mitu',
        title: 'The Truth About Stretching Before Exercise',
        body: "For decades, static stretching — holding a stretch for thirty seconds before a workout — was treated as an unquestioned prerequisite to exercise. More recent research has complicated that picture considerably, finding that static stretching immediately before an activity requiring power or speed can actually temporarily reduce muscle performance.\n\nThe current, better-supported approach for most people is dynamic warm-ups before activity — movements that gradually raise heart rate and take joints through their range of motion — and saving static stretching for after exercise, or for a separate flexibility-focused session entirely. It's a good reminder that even fairly settled-seeming conventional wisdom about health is worth periodically revisiting against newer evidence.",
        categoryNames: ['Health'],
    },
    {
        authorUsername: 'arjun',
        title: 'What Actually Helps With Seasonal Allergies',
        body: "Seasonal allergy advice online tends to swing between two extremes — resigned suffering, or elaborate home remedies with little actual evidence behind them. The reality sits somewhere more boring and more effective in the middle.\n\nStarting an antihistamine before symptoms peak, rather than reactively once they're already miserable, meaningfully changes how effective it is, since it's working with your immune response rather than trying to catch up to it. Simple environmental steps — checking daily pollen counts, keeping windows closed on high-count days, showering before bed to avoid transferring pollen onto pillows — do more collectively than most people expect, without requiring anything exotic.",
        categoryNames: ['Health'],
    },
    {
        authorUsername: 'nusrat',
        title: 'Building Strength After 40',
        body: "There's a persistent, discouraging myth that meaningful strength gains become essentially unavailable once you pass forty. The research doesn't support that at all — muscle responds to progressive resistance training at any age, and the loss of strength commonly associated with aging is, to a significant degree, a consequence of inactivity rather than an unavoidable biological inevitability.\n\nWhat does change with age is recovery time, which tends to argue for slightly more conservative progression and more attention to rest between sessions, not for avoiding strength training altogether. If anything, strength training becomes more valuable, not less, past this point, given its well-documented role in maintaining bone density, balance, and independence in later decades.",
        categoryNames: ['Health', 'Lifestyle'],
    },
    {
        authorUsername: 'imran',
        title: 'The Gut-Brain Connection, Explained Simply',
        body: "The idea that your digestive system and your mood are connected used to sound like a wellness-industry talking point, but the research behind the gut-brain axis has become substantial enough that it's now taken seriously in mainstream medicine, not just alternative health circles.\n\nThe short version is that the gut and brain communicate constantly through the vagus nerve, hormones, and signals produced by gut bacteria, which is part of why digestive distress and anxiety so often show up together, and why some early research is exploring whether specific probiotic strains might meaningfully influence mood. It's an active, genuinely exciting area of research, but still far from the point where anyone should be replacing established mental health treatment with a supplement.",
        categoryNames: ['Health', 'Science'],
    },
    {
        authorUsername: 'zayed',
        title: 'Why Hydration Advice Is More Nuanced Than "8 Glasses a Day"',
        body: "The \"eight glasses a day\" rule has been repeated so often it feels like established science, but it doesn't actually have a clear origin in rigorous research, and it ignores that hydration needs vary enormously by body size, climate, activity level, and even the water content of what you're eating.\n\nA more genuinely useful heuristic is simply paying attention to thirst and urine color, which for the vast majority of healthy people is a far more accurate real-time signal of hydration status than a fixed daily number ever could be. The exceptions worth knowing — endurance athletes, people in extreme heat, certain medical conditions — do sometimes need more deliberate tracking, but for most people, the body's own signals are already doing the job.",
        categoryNames: ['Health'],
    },
    {
        authorUsername: 'anika',
        title: 'Managing Screen Time Eye Strain',
        body: 'Digital eye strain has become almost universal in office and remote-work jobs, showing up as dryness, headaches, and blurred vision after long stretches in front of a screen — largely because people blink significantly less often while focused on a display than they do during normal activity.\n\nThe 20-20-20 rule — every twenty minutes, look at something twenty feet away for twenty seconds — remains one of the simplest and best-supported interventions, since it gives the eye muscles a genuine break from sustained close-focus effort. Screen brightness matched to ambient room lighting, and simply remembering to blink consciously during focused work, round out most of what actually helps, well before more expensive interventions like specialty glasses become necessary.',
        categoryNames: ['Health', 'Technology'],
    },
    {
        authorUsername: 'sabbir',
        title: 'The Basics of Mindful Eating',
        body: "Mindful eating gets sometimes dismissed as a vague wellness buzzword, but stripped of the jargon, it's a fairly concrete practice: eating without distraction, paying attention to actual hunger and fullness cues, and noticing the taste and texture of food rather than eating on autopilot while scrolling a phone or watching TV.\n\nThe research behind it is reasonably solid — people who eat mindfully tend to naturally eat slower and stop closer to genuine satiety, largely because it takes roughly twenty minutes for fullness signals to fully register, a window that's easy to blow straight through when eating quickly and distractedly. It's not a diet in any conventional sense, which is part of why it tends to be more sustainable than approaches built around restriction.",
        categoryNames: ['Health', 'Lifestyle'],
    },

    // ---------------------------------------------------------------------
    // Travel
    // ---------------------------------------------------------------------
    {
        authorUsername: 'kabir',
        title: 'Slow Travel: Why Fewer Destinations Can Mean More',
        body: "The instinct on a big trip is often to pack in as many cities and countries as possible, treating a vacation like a checklist to be completed. Slow travel argues for the opposite: staying in fewer places for longer, and getting to know one neighborhood well instead of skimming the surface of ten.\n\nThe practical benefits are real — less time lost to transit and packing, a lower budget once you're not paying premium short-stay prices everywhere, and the chance to actually build a small routine somewhere unfamiliar, which tends to produce far more memorable moments than another rushed morning at a famous landmark. It's a harder sell against the fear of missing out, but most people who've tried both styles of travel report that slow travel is the one they actually remember clearly years later.",
        categoryNames: ['Travel', 'Lifestyle'],
    },
    {
        authorUsername: 'sara',
        title: 'Packing Light: A Practical System That Works',
        body: "Packing light isn't really about owning less; it's about having a repeatable system so you're not re-deciding what to bring from scratch every single trip. A short capsule wardrobe built around a single color palette, where every item can mix and match with several others, does most of the heavy lifting.\n\nThe habit that saves the most space, though, isn't clever folding techniques — it's simply committing to doing laundry mid-trip rather than packing an outfit for every single day. A single carry-on for a two-week trip sounds implausible until you've actually tried it once and realized how rarely you wear half of what you normally bring \"just in case.\"",
        categoryNames: ['Travel'],
    },
    {
        authorUsername: 'nabil',
        title: 'Hidden Gems of Northern Bangladesh',
        body: "Northern Bangladesh rarely makes it onto a typical traveler's itinerary, which is largely a shame — the region's tea gardens, haor wetlands, and quiet river towns offer a genuinely different experience from the more familiar coastal and southern routes most visitors default to.\n\nSylhet's rolling tea estates are the most well-known draw, but the haor wetlands further into the region, especially during the monsoon when they briefly transform into vast inland seas dotted with submerged villages, are a far more distinctive sight that most international visitors never hear about. Traveling here rewards a slower pace and a willingness to rely on local guidance over rigid planning, since infrastructure is genuinely more limited than in the country's major tourist hubs.",
        categoryNames: ['Travel'],
    },
    {
        authorUsername: 'mitu',
        title: 'Solo Travel Safety Tips That Actually Matter',
        body: "A lot of solo travel safety advice online is either painfully obvious or, worse, actively counterproductive — vague fear-based warnings that discourage travel altogether rather than genuinely useful, actionable guidance. The advice that actually holds up tends to be far more specific and practical.\n\nSharing a rough daily itinerary with someone back home, keeping a digital copy of important documents somewhere accessible offline, and researching a neighborhood's general safety before booking accommodation there matter far more than most of the more dramatic advice that circulates. Trusting a calm, specific instinct that something feels wrong — and being willing to act on it immediately without second-guessing yourself out of politeness — remains one of the single most effective safety tools any traveler has.",
        categoryNames: ['Travel'],
    },
    {
        authorUsername: 'arjun',
        title: 'Making the Most of a Long Layover',
        body: 'A long layover, six hours or more, used to feel like pure dead time to be endured in an uncomfortable airport chair. With a bit of planning, it can actually become a short, low-stakes preview of a city you might never otherwise have a specific reason to visit.\n\nThe key logistics to sort out ahead of time are visa requirements for a short visit, luggage storage options at the airport, and a realistic estimate of transit and security time on the way back — underestimating that last one is the single most common way a layover excursion turns into a missed connecting flight. Done carefully, even a short few hours in a new city center can be genuinely worth the modest extra planning it requires.',
        categoryNames: ['Travel'],
    },
    {
        authorUsername: 'nusrat',
        title: 'Budget Train Travel Across Europe',
        body: "Europe's train network remains one of the more underrated ways to see the continent, especially for travelers willing to plan a little ahead and book tickets well before departure, when fares are considerably cheaper than the last-minute prices most casual travelers end up paying.\n\nOvernight trains deserve more attention than they usually get — they let you cover significant distance while sleeping, effectively saving a night of accommodation cost, and arriving in a new city first thing in the morning rather than losing half a travel day to a flight and airport transfers. A rail pass makes sense for travelers covering many countries in a short window, but for a more focused trip through two or three regions, individual point-to-point tickets booked in advance are often the cheaper option.",
        categoryNames: ['Travel', 'Finance'],
    },
    {
        authorUsername: 'imran',
        title: 'What to Know Before Visiting Japan for the First Time',
        body: "Japan has a well-earned reputation as one of the most rewarding countries to visit, but also one where a small amount of preparation goes further than it does almost anywhere else, given how different some everyday norms are from what most first-time visitors are used to.\n\nCash still matters more than travelers expect in a country famous for its technology — many smaller restaurants and shops don't take cards, so carrying yen is genuinely necessary rather than a backup plan. A prepaid transit card covers most trains and buses across the country with minimal hassle, and learning even a small handful of polite phrases goes a noticeably long way, not because English isn't occasionally understood, but because the effort itself is clearly appreciated.",
        categoryNames: ['Travel'],
    },
    {
        authorUsername: 'shuvo',
        title: 'Traveling With Food Allergies',
        body: "Traveling with a serious food allergy adds a layer of genuine risk that most travel advice doesn't address at all, and getting it wrong isn't just an inconvenience — it can mean an actual medical emergency in an unfamiliar place, far from the healthcare system you know.\n\nHaving allergy information translated clearly into the local language, ideally on a printed card rather than relying on a phone that might run out of battery, removes most of the ambiguity that leads to accidental cross-contamination. Researching a destination's specific food culture in advance — some cuisines rely far more heavily on common allergens like peanuts or shellfish than others — matters just as much as the immediate emergency preparation, since prevention is always safer than the best-case emergency response.",
        categoryNames: ['Travel', 'Health'],
    },

    // ---------------------------------------------------------------------
    // Science
    // ---------------------------------------------------------------------
    {
        authorUsername: 'tabassum',
        title: 'What We\u2019re Learning About the Deep Ocean',
        body: 'More of the ocean floor has been mapped on the surface of Mars than on our own planet, a fact that consistently surprises people, given how much attention space exploration receives compared to the genuinely alien environment sitting largely unexplored beneath our own oceans.\n\nRecent expeditions using improved submersible technology have found entire ecosystems thriving around deep-sea hydrothermal vents, running on chemical energy rather than sunlight — a discovery that has meaningfully reshaped scientific thinking about where else in the solar system life might plausibly exist, particularly on icy moons with subsurface oceans of their own. Every new expedition to previously unmapped depths seems to turn up species entirely new to science, a reminder of just how much of our own planet remains genuinely unknown.',
        categoryNames: ['Science'],
    },
    {
        authorUsername: 'rafiq',
        title: 'The Physics of Why Ice Is Slippery',
        body: "Ice being slippery seems like one of those facts too obvious to need explaining, but the actual physics behind it was genuinely debated by scientists for well over a century, and the full picture turns out to be more subtle than most textbook explanations suggest.\n\nThe old explanation — that pressure from a skate blade melts the ice slightly — turns out to be largely wrong; the pressure involved isn't nearly enough to melt ice at typical temperatures. The more accurate modern explanation centers on a naturally occurring, extremely thin liquid-like layer that exists on the surface of ice even without any added pressure, along with friction-generated heat, working together to create the slipperiness we take for granted.",
        categoryNames: ['Science'],
    },
    {
        authorUsername: 'sara',
        title: 'How Vaccines Actually Train the Immune System',
        body: 'A vaccine works by giving the immune system a safe preview of a threat — a harmless piece or weakened version of a pathogen — so the body can build a targeted defense before ever encountering the real, dangerous version.\n\nThe key players in this process are memory cells, a specialized subset of immune cells that persist long after the initial exposure and "remember" exactly how to recognize and respond to that specific threat far faster the second time around. This is the entire mechanism behind why a second exposure, whether from a booster or the actual pathogen, typically produces a faster, stronger, more effective immune response than the body\'s very first encounter with something new.',
        categoryNames: ['Science', 'Health'],
    },
    {
        authorUsername: 'kabir',
        title: 'Understanding Quantum Computing Without the Hype',
        body: "Quantum computing coverage tends to swing between two unhelpful extremes: breathless hype suggesting it will imminently solve every hard computational problem, or dismissive skepticism that it's all overblown marketing. The more accurate, less exciting picture sits firmly in between.\n\nQuantum computers aren't simply faster classical computers — they're a fundamentally different computational model, genuinely well suited to a narrow set of problems like certain kinds of optimization and molecular simulation, while offering no meaningful advantage at all for most everyday computing tasks like browsing the web or running a spreadsheet. The realistic near-term impact is narrower and more specialized than the popular narrative suggests, even as the underlying research remains a genuinely exciting frontier of physics.",
        categoryNames: ['Science', 'Technology'],
    },
    {
        authorUsername: 'mitu',
        title: 'Why Bees Are More Important Than You Think',
        body: 'Bees get talked about often enough in a general "save the bees" framing that it\'s easy to lose sight of just how concretely important they are — a substantial share of global food crops depend at least partly on pollination by bees and other insects, not as a nice-to-have, but as a genuine requirement for reliable yields.\n\nColony collapse and general pollinator decline stem from a combination of factors working together — pesticide exposure, habitat loss, disease, and climate-driven changes in flowering timing — rather than any single cause, which is exactly why the problem has proven so stubbornly difficult to fully solve with any one intervention. It\'s a rare case where an unglamorous insect turns out to be genuinely load-bearing for a meaningful fraction of the global food supply.',
        categoryNames: ['Science'],
    },
    {
        authorUsername: 'arjun',
        title: 'The Search for Life on Europa',
        body: "Jupiter's moon Europa has become one of the most compelling targets in the search for life beyond Earth, not despite its harsh, icy surface, but specifically because of what almost certainly lies beneath it: a vast subsurface ocean, kept liquid by tidal heating, that may contain more water than every ocean on Earth combined.\n\nThe scientific interest isn't speculative optimism so much as genuine chemistry — a liquid water ocean in long-term contact with a rocky seafloor is, by every model we currently have of what life plausibly requires, a genuinely promising environment. Upcoming missions specifically designed to study Europa's ice shell and search for signs of that subsurface ocean represent one of the most concrete, near-term opportunities we have to meaningfully advance the search for life elsewhere in our own solar system.",
        categoryNames: ['Science'],
    },
    {
        authorUsername: 'nusrat',
        title: 'How Weather Forecasting Actually Works',
        body: "Modern weather forecasting can feel almost magical given how far in advance it now reliably predicts things, but it's built on a surprisingly unglamorous foundation: enormous quantities of real-time atmospheric data fed into physics-based computer models that simulate how the atmosphere is likely to evolve over the coming hours and days.\n\nThe reason forecasts get noticeably less reliable further out isn't a limitation of the underlying models so much as a fundamental property of the atmosphere itself — it's a genuinely chaotic system, meaning tiny, even immeasurably small differences in starting conditions can compound into significantly different outcomes just days later. This is exactly why meteorologists increasingly present forecasts as probabilities rather than certainties, and why \"forecast confidence\" itself has become a genuinely meaningful, actively communicated part of a modern weather report.",
        categoryNames: ['Science'],
    },
    {
        authorUsername: 'imran',
        title: 'The Science Behind Muscle Memory',
        body: 'The phrase "muscle memory" is technically a bit of a misnomer — muscles themselves don\'t actually store memories in any meaningful sense. What\'s really happening lives almost entirely in the brain and nervous system, in specific neural pathways that get progressively more efficient the more a particular movement is repeated.\n\nThis is why a skill practiced heavily years ago, like riding a bicycle or playing a musical instrument, tends to come back remarkably fast even after a long absence, while a skill that was never fully embedded through sufficient repetition fades much more quickly. The underlying neuroscience helps explain why deliberate, focused repetition genuinely matters far more than simple time spent practicing — quality and attentiveness of repetition, not raw hours logged, is what actually builds these lasting neural pathways.',
        categoryNames: ['Science', 'Health'],
    },

    // ---------------------------------------------------------------------
    // Finance
    // ---------------------------------------------------------------------
    {
        authorUsername: 'nabil',
        title: 'Building an Emergency Fund From Scratch',
        body: "An emergency fund is one of the least exciting pieces of financial advice out there, which is probably exactly why so many people skip it in favor of more engaging goals like investing — right up until an unexpected expense forces them into debt that a modest cushion would have easily absorbed.\n\nThe common advice of saving three to six months of expenses can feel discouraging as a starting target, which is exactly why it's worth reframing as a series of much smaller, genuinely achievable milestones — a first goal of even a few hundred dollars, enough to cover a typical car repair or medical copay without reaching for a credit card, matters more for building the habit than the eventual full six-month target ever will on its own.",
        categoryNames: ['Finance'],
    },
    {
        authorUsername: 'farhan',
        title: 'Understanding Index Funds in Plain English',
        body: 'An index fund is, at its core, a fairly simple idea dressed up in intimidating financial jargon: instead of trying to pick individual winning stocks, you buy a small slice of an entire market index, like the S&P 500, all at once, through a single investment.\n\nThe appeal isn\'t excitement — it\'s consistency and cost. Decades of data consistently show that the large majority of actively managed funds, run by professional stock-pickers, fail to beat a simple low-cost index fund over long time horizons, largely because of the significantly higher fees active management typically charges. For most long-term investors, "boring and cheap" has repeatedly outperformed "exciting and expensive," which is precisely why index funds have become the default recommendation across most mainstream financial advice.',
        categoryNames: ['Finance', 'Education'],
    },
    {
        authorUsername: 'mitu',
        title: 'The Psychology of Impulse Spending',
        body: "Impulse spending rarely has much to do with a genuine, carefully considered need for the item being purchased — it's far more often a response to an emotional state, whether that's stress, boredom, or simply the small dopamine hit that comes from the act of buying something new.\n\nRetailers understand this dynamic extremely well, which is precisely why so much of modern e-commerce design — one-click checkout, limited-time countdown timers, algorithmically personalized recommendations — is specifically engineered to shorten the gap between impulse and purchase as much as technically possible. A simple, deliberately imposed waiting period before any non-essential purchase, even something as short as twenty-four hours, reliably filters out a surprising fraction of purchases that, on reflection the next morning, no longer feel worth the money.",
        categoryNames: ['Finance', 'Lifestyle'],
    },
    {
        authorUsername: 'arjun',
        title: 'How Inflation Quietly Erodes Savings',
        body: 'Money sitting in a low-interest savings account can feel perfectly safe, since the number on the balance never goes down, but inflation means the actual purchasing power of that same balance is quietly shrinking in the background even while the number itself stays flat or grows only marginally.\n\nThis is exactly why financial advisors generally distinguish between an emergency fund — appropriately kept in cash for genuine, immediate accessibility — and longer-term savings, which historically need to be invested in assets that have a realistic chance of outpacing inflation over time in order to actually grow, rather than merely preserving the same number on a statement while its real value slowly declines.',
        categoryNames: ['Finance'],
    },
    {
        authorUsername: 'nusrat',
        title: 'A Beginner\u2019s Guide to Reading a Balance Sheet',
        body: "A balance sheet can look intimidating at first glance, but the underlying structure is genuinely simple once you know what you're actually looking at: it's a snapshot, at one specific point in time, of what a company owns (assets), what it owes (liabilities), and what's genuinely left over for its owners (equity).\n\nThe single most useful habit for a beginner isn't memorizing every individual line item, but developing a feel for the relationships between the major sections — how much of the company's assets are financed by debt versus by equity, for instance, is often more immediately revealing about the health and risk profile of a business than any single number examined entirely in isolation.",
        categoryNames: ['Finance', 'Education'],
    },
    {
        authorUsername: 'imran',
        title: 'Renting vs. Buying: Running the Actual Numbers',
        body: 'The rent-versus-buy debate tends to get treated as a moral question — buying framed as responsible "building equity," renting framed as somehow "throwing money away" — when it\'s really, underneath all that framing, primarily a math question that depends heavily on local market conditions and how long you actually plan to stay put.\n\nA genuinely useful comparison has to account for far more than just the monthly mortgage versus the monthly rent — property taxes, maintenance, opportunity cost on a down payment that could otherwise have been invested elsewhere, and the very real transaction costs of eventually selling all belong in the calculation. In many markets, and especially for someone who might realistically relocate within just a few years, renting turns out to be the financially stronger choice, contrary to the strong cultural assumption that buying is automatically the more responsible path.',
        categoryNames: ['Finance'],
    },
    {
        authorUsername: 'zayed',
        title: 'Why Diversification Matters More Than Picking Winners',
        body: "New investors often spend a disproportionate amount of energy trying to identify the next big winning stock, when the research on this is fairly discouraging — even most professional fund managers, working full-time with vastly more resources and information than an individual investor, consistently fail to reliably beat a simple, broadly diversified market index over long time horizons.\n\nDiversification works precisely because it doesn't require successfully predicting which specific company or sector will outperform — spreading investments across many assets simply reduces the damage any single bad outcome can do to a portfolio's overall performance. It's a distinctly less exciting strategy than confidently picking winners, but the actual long-term evidence consistently favors boring, broad diversification over concentrated, high-conviction bets, however psychologically appealing the latter approach tends to feel in the moment.",
        categoryNames: ['Finance'],
    },
    {
        authorUsername: 'anika',
        title: 'Side Income Ideas That Don\u2019t Eat Your Weekends',
        body: 'Most "side hustle" content online implicitly assumes an unlimited supply of free evenings and weekends, which quietly makes a lot of the standard advice impractical for anyone already stretched thin by a demanding full-time job, family responsibilities, or both at once.\n\nThe side income streams that actually hold up under real time constraints tend to share a common trait: they front-load the effort once, then require minimal ongoing maintenance afterward — a well-made digital template sold repeatedly, a small niche affiliate site that doesn\'t need daily attention, or renting out equipment or space you already own without needing to actively manage anything on a regular basis. The honest trade-off is that this kind of low-maintenance income usually starts smaller and grows more slowly than a more hands-on hustle, but it\'s also the version genuinely compatible with an already full life.',
        categoryNames: ['Finance', 'Lifestyle'],
    },
];

export async function seedStories(
    prisma: PrismaClient,
    allUsers: User[],
    categories: Category[],
) {
    const findUser = (username: string) => {
        const user = allUsers.find((u) => u.username === username);
        if (!user) throw new Error(`User "${username}" not found in seed data`);
        return user;
    };

    const findCategory = (name: string) => {
        const category = categories.find((c) => c.name === name);
        if (!category)
            throw new Error(`Category "${name}" not found in seed data`);
        return category;
    };

    for (const s of storySeeds) {
        const author = findUser(s.authorUsername);
        const story = await prisma.story.create({
            data: {
                userId: author.id,
                title: s.title,
                body: s.body,
                categories: {
                    create: s.categoryNames.map((name) => ({
                        categoryId: findCategory(name).id,
                    })),
                },
            },
        });
        console.log(`Created story: "${story.title}" (by ${author.username})`);
    }
}
