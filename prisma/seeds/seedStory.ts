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
        authorUsername: 'nusrat',
        title: 'A Developer\u2019s Guide to API Rate Limiting',
        body: "Rate limiting often gets bolted onto an API as an afterthought, right after the first time a misbehaving client or a bot brings a service to its knees. Done properly, it's a design decision made early, not a patch applied in a panic.\n\nThe two most common approaches — token bucket and sliding window — trade off differently between burst tolerance and strict fairness, and the right choice depends heavily on your actual traffic patterns rather than which algorithm sounds more sophisticated. Just as important as the algorithm is the client experience: clear rate-limit headers, meaningful error messages, and a documented policy save your support team from a flood of confused tickets when a legitimate integration hits an unexpected wall.",
        categoryNames: ['Technology', 'Business'],
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
        authorUsername: 'mitu',
        title: 'The Art of Saying No Without Guilt',
        body: 'Saying yes feels good in the moment and costly later — an overcommitted calendar is usually the result of a hundred individually reasonable-seeming yeses that added up to something unsustainable. Learning to say no well is less about willpower and more about having a few honest, low-drama phrases ready before you need them.\n\nA clear, brief no — without an over-explained justification — tends to land better than a long apologetic one, which can read as an invitation to negotiate. The uncomfortable truth is that every yes is also, implicitly, a no to something else, usually something closer to your actual priorities. Getting comfortable with that trade-off is most of what "boundaries" actually means in practice.',
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
        authorUsername: 'nabil',
        title: 'Building a Company Culture That Survives Remote Work',
        body: "A lot of company culture used to happen accidentally — overheard hallway conversations, the shared context of everyone sitting in the same room. Remote and hybrid teams don't get that for free, and pretending otherwise tends to produce a culture that only exists on paper.\n\nWhat actually transfers to a distributed team is deliberate, not accidental: documented decisions instead of tribal knowledge, explicit norms around response times and availability, and intentional space for informal connection rather than assuming it'll happen organically the way it might have around a coffee machine. Culture in a remote company isn't weaker by default — it just has to be built on purpose instead of absorbed by osmosis.",
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
        authorUsername: 'nusrat',
        title: 'The Value of Boring, Repetitive Practice',
        body: "Every skill that looks effortless from the outside — a musician's improvisation, a chess player's intuition, a writer's clean first draft — was built on a foundation of unglamorous, repetitive practice that nobody ever sees or particularly enjoys doing.\n\nThe discomfort of repetitive practice isn't a sign you're doing it wrong; it's usually a sign you're doing it right, since genuine skill-building happens specifically at the edge of what already feels easy. Modern culture is fairly allergic to boredom, which makes this kind of unglamorous, repetitive work a quietly underrated advantage for anyone still willing to put in the hours everyone else is trying to shortcut.",
        categoryNames: ['Education'],
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
        authorUsername: 'nusrat',
        title: 'Building Strength After 40',
        body: "There's a persistent, discouraging myth that meaningful strength gains become essentially unavailable once you pass forty. The research doesn't support that at all — muscle responds to progressive resistance training at any age, and the loss of strength commonly associated with aging is, to a significant degree, a consequence of inactivity rather than an unavoidable biological inevitability.\n\nWhat does change with age is recovery time, which tends to argue for slightly more conservative progression and more attention to rest between sessions, not for avoiding strength training altogether. If anything, strength training becomes more valuable, not less, past this point, given its well-documented role in maintaining bone density, balance, and independence in later decades.",
        categoryNames: ['Health', 'Lifestyle'],
    },
    {
        authorUsername: 'zayed',
        title: 'Why Hydration Advice Is More Nuanced Than "8 Glasses a Day"',
        body: "The \"eight glasses a day\" rule has been repeated so often it feels like established science, but it doesn't actually have a clear origin in rigorous research, and it ignores that hydration needs vary enormously by body size, climate, activity level, and even the water content of what you're eating.\n\nA more genuinely useful heuristic is simply paying attention to thirst and urine color, which for the vast majority of healthy people is a far more accurate real-time signal of hydration status than a fixed daily number ever could be. The exceptions worth knowing — endurance athletes, people in extreme heat, certain medical conditions — do sometimes need more deliberate tracking, but for most people, the body's own signals are already doing the job.",
        categoryNames: ['Health'],
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
        authorUsername: 'mitu',
        title: 'Solo Travel Safety Tips That Actually Matter',
        body: "A lot of solo travel safety advice online is either painfully obvious or, worse, actively counterproductive — vague fear-based warnings that discourage travel altogether rather than genuinely useful, actionable guidance. The advice that actually holds up tends to be far more specific and practical.\n\nSharing a rough daily itinerary with someone back home, keeping a digital copy of important documents somewhere accessible offline, and researching a neighborhood's general safety before booking accommodation there matter far more than most of the more dramatic advice that circulates. Trusting a calm, specific instinct that something feels wrong — and being willing to act on it immediately without second-guessing yourself out of politeness — remains one of the single most effective safety tools any traveler has.",
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
        authorUsername: 'mitu',
        title: 'Why Bees Are More Important Than You Think',
        body: 'Bees get talked about often enough in a general "save the bees" framing that it\'s easy to lose sight of just how concretely important they are — a substantial share of global food crops depend at least partly on pollination by bees and other insects, not as a nice-to-have, but as a genuine requirement for reliable yields.\n\nColony collapse and general pollinator decline stem from a combination of factors working together — pesticide exposure, habitat loss, disease, and climate-driven changes in flowering timing — rather than any single cause, which is exactly why the problem has proven so stubbornly difficult to fully solve with any one intervention. It\'s a rare case where an unglamorous insect turns out to be genuinely load-bearing for a meaningful fraction of the global food supply.',
        categoryNames: ['Science'],
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
