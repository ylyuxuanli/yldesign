// Public content for /deck. Speaker notes are NOT here: they live encrypted in notes.enc.js.
//
// Each slide:
//   id      key for speaker notes
//   min     minutes when presented
//   pri     1 = core story, 2 = strong support, 3 = nice to have
//   must    always included
//   lens    audiences this slide matters most to (pm, design, dm, eng, ds), used to pick slides
//   skills  skills this slide shows (see `skills` below), used to pick slides and order projects
//   label   small section label at the top of the slide
//   title   name used in the agenda
//   layout  how the slide is drawn (see render.js): statement, values, title, split, full
//
// The deck reads on its own, so any text can be written per audience and the viewer's role
// picks the right one, for example
//   p: { all: 'What happened', eng: 'How the system handled it', pm: 'Why it mattered to the business' }
// Missing roles fall back to `all`.
//
// Images: { ph: 'what goes here' } draws a placeholder. Add src: 'img/file.jpg' for an image, or video: 'img/file.mp4' (+ poster) for a looping clip.

window.DECK = {
  lenses: [
    { id: 'all',    name: 'Just curious',    plural: 'everyone' },
    { id: 'pm',     name: 'Product Manager', plural: 'Product Managers' },
    { id: 'design', name: 'Designer',        plural: 'Designers' },
    { id: 'dm',     name: 'Design Manager',  plural: 'Design Managers' },
    { id: 'eng',    name: 'Engineer',        plural: 'Engineers' },
    { id: 'ds',     name: 'Data Scientist',  plural: 'Data Scientists' }
  ],

  times: [10, 15, 20, 30],

  // What a viewer can ask to see. Slides list the skills they show in `skills`.
  skills: [
    { id: 'agentic',  name: 'Agentic AI design' },
    { id: 'hai',      name: 'Human + AI interaction' },
    { id: 'systems',  name: 'Systems thinking' },
    { id: 'service',  name: 'Service design' },
    { id: 'research', name: 'Research & insight' },
    { id: 'strategy', name: 'Product strategy' },
    { id: 'zero',     name: '0 to 1' },
    { id: 'proto',    name: 'Prototyping' },
    { id: 'align',    name: 'Cross-team alignment' },
    { id: 'craft',    name: 'Design systems & craft' }
  ],

  projects: [
    // ------------------------------------------------------------------ Intro
    {
      id: 'intro',
      name: 'About me',
      short: 'About me',
      slides: [
        { id: 'intro-who', min: 1, pri: 1, label: 'About me', title: 'My journey',
          layout: 'full', center: true,
          blocks: [{ h: 'Making complex things <em>simple</em>' },
                   { p: 'I\'m a product designer with 7+ years of experience, at both startups and large organizations. What I enjoy most is solving ambiguous problems, and turning complex systems into experiences that feel intuitive.' },
                   { journey: [
                     { when: 'Before design', h: 'Reporter', p: 'Ask thoughtful questions, find what matters, explain it clearly.', on: ['all', 'design', 'pm'] },
                     { when: '2018 – 2020', h: 'M.A. Interaction Design', p: 'Academy of Art University. Switched to design, with a sponsored project for Audi.' },
                     { when: '2021 – 2022', h: 'Lytx', p: 'Complex data and very different users. Built design systems.', on: ['eng', 'ds'] },
                     { when: '2022 – now', h: 'Intuit', p: 'AI + human experiences in QuickBooks, and a 0 to 1 service.', on: ['all', 'pm', 'dm', 'eng', 'ds', 'design'] },
                     { when: '2021 – 2024 · side project', h: 'Offerland.ai', p: 'An AI career platform, built with friends. 40K+ users.', side: [3, 5], on: ['dm', 'pm'] }
                   ] },
                   { note: { all: 'Thoughtful but pragmatic: I care about craft, and just as much about solving the right problem.',
                             eng: 'Along the way: HTML, CSS and JavaScript. Today I use Claude Code to build working prototypes and send PRs that engineering reviews. This deck is built in code, too.',
                             pm: 'Thoughtful but pragmatic: I care about craft, and just as much about solving the right problem and shipping something that works.',
                             design: 'The reporter in me still shows up: ask good questions first, then make it clear. And I care a lot about craft.',
                             dm: 'I\'ve led design end to end in a large org, and managed and mentored designers on a side startup.',
                             ds: 'I use AI throughout my process, from research synthesis to functional prototypes. So I think a lot about what a model should decide, and what it shouldn\'t.' } }] },

        { id: 'intro-values', min: 0.5, pri: 3, title: 'Curious, delightful, thoughtful',
          layout: 'values',
          items: [
            { name: 'Curious', color: '#FFC715', text: 'I ask why a lot, before drawing anything.' },
            { name: 'Delightful', color: '#FF8B22', text: 'I care how things feel, not just whether they work.' },
            { name: 'Thoughtful', color: '#ED5148', text: 'I think about what happens after launch, not just on launch day.' }
          ] },

        { id: 'intro-intuit', skills: ['hai', 'strategy'], min: 0.75, pri: 2, lens: ['pm', 'dm'], label: 'Now', title: 'Intuit',
          layout: 'split', ratio: 46,
          left: [{ k: 'Intuit · Sr. Product Designer' }, { h: 'AI + human experiences across QuickBooks' },
                 { p: { all: 'I lead end-to-end design for how AI and human experts help small businesses with complex financial work, in QuickBooks and in new areas like Business Formation.',
                        eng: 'I lead end-to-end design for AI + human experiences in QuickBooks. I also build: functional prototypes in code, and production changes through PRs reviewed by engineering.',
                        dm: 'I lead end-to-end design for AI + human experiences in QuickBooks, working across product, service and expert platform teams.' } },
                 { stats: [{ v: '2.6M', l: 'customers reached by QuickBooks Live Priority' }, { v: '85%', l: '31-day retention' }, { v: '0 → 1', l: 'Business Formation, from first concept' }], row: true, small: true }],
          right: [{ media: { src: '../imgs/qbl-overview-poster.jpg', ph: 'QuickBooks overview with Books Health' } }] },

        { id: 'intro-offerland', skills: ['zero', 'align'], min: 0.75, pri: 2, lens: ['pm', 'design', 'dm'], label: 'Side project', title: 'Offerland.ai',
          layout: 'split', ratio: 46,
          left: [{ k: 'Offerland.ai · Design lead · with friends' }, { h: 'An AI career platform, built from zero' },
                 { p: 'Friends and I built Offerland to help job seekers through a stressful, high-stakes process: tracking applications, writing resumes with AI, practicing interviews, and finding referrals.' },
                 { stats: [{ v: '40K+', l: 'users across web and a browser extension' }, { v: '3', l: 'designers I managed and mentored' }], row: true, small: true },
                 { p: { all: 'It was my 0 to 1 playground.',
                        pm: 'I set design and product direction, and decided what to build next with the team.',
                        design: 'It was where I tried AI interaction patterns fast, like helping people weigh offers and make big career decisions with more confidence.',
                        dm: 'It was where I first managed designers: setting direction, reviewing work, and helping them grow.' } }],
          right: [{ media: { ph: 'Offerland job tracker and AI interview coach' } }] },

        { id: 'intro-lytx', skills: ['systems', 'craft'], min: 0.75, pri: 2, lens: ['eng', 'design', 'ds'], label: 'Before', title: 'Lytx',
          layout: 'split', ratio: 42,
          left: [{ k: 'Lytx · Product Designer' }, { h: 'Fleet safety for 5.5M+ drivers' },
                 { p: { all: 'I designed the Driver App, the fleet manager dashboard, platform navigation and the design systems behind them. Across that work, I reduced workflow complexity by up to 30%.',
                        design: 'I was asked to digitize paper vehicle inspections. Along the way I found the app was Dark Mode only, and hard to read in bright sun. So I added Light Mode, and built a Driver App design system for what came next.',
                        eng: 'I built design systems for mobile and web with engineering: colors, type, reusable components and interaction patterns, including Light and Dark Mode. I think in components and states, not just mockups.',
                        pm: 'I went beyond my original scope. A paper-to-digital inspection feature turned into Light Mode and a design system that future Driver App work could build on.',
                        dm: 'I went beyond my original scope. A paper-to-digital inspection feature turned into Light Mode and a design system that future Driver App work could build on.',
                        ds: 'Fleet managers had to make sense of safety events, driver behavior, AI insights and video. I worked on dashboards and data visualization that turn that into the few things to act on.' } },
                 { note: { all: 'Designing for drivers taught me to design for the world beyond the screen: bright sun, busy routines, real constraints.', ds: 'Presenting data clearly isn\'t enough. You have to know what decision it supports.', eng: 'A design system should grow out of real product needs, not ahead of them.' } }],
          right: [{ mediaGrid: [{ src: '../imgs/lytx-insight1.png' }, { src: '../imgs/lytx-insight2.png' }, { src: '../imgs/lytx-hero.png' }, { src: '../imgs/lytx-insight3.png' }], cols: 2 }] },

        { id: 'intro-life', min: 0.5, pri: 2, label: 'Delightful moments', title: 'Yoyo, ceramics, bouldering and travel',
          layout: 'full',
          blocks: [{ h: 'My delightful moments' },
                   { p: 'Yoyo is my Chief Happiness Officer. Ceramics taught me there\'s no undo button, so you think before you commit. Bouldering is problem solving with your whole body. And travel keeps me curious.' },
                   { gallery: [
                     { src: '../imgs/oow-yoyo.jpg', cap: 'Yoyo' },
                     { src: '../imgs/oow-ceramics.jpg', cap: 'Ceramics' },
                     { src: '../imgs/oow-bouldering.jpg', cap: 'Bouldering' },
                     { src: '../imgs/oow-travelling.jpg', cap: 'Travel' }
                   ] }] }
      ]
    },

    // ------------------------------------------------------------------ QuickBooks
    {
      id: 'qb',
      name: 'QuickBooks: AI + Embedded Human Expertise',
      short: 'QuickBooks AI + Human',
      theme: 'navy',
      focus: {
        all:    'Where human experts should show up in an AI-powered QuickBooks, and how I turned that into one experience.',
        pm:     'How the problem got framed, what we cut from the MVP, and the engagement signals that came back.',
        design: 'Journey mapping, co-design, four interaction models, and how AI and experts show up in the final UI.',
        dm:     'Aligning teams that pulled in different directions, and pushing back when the data said automate more.',
        eng:    'The three-level responsibility model and the routing system: scoring, context handoff and feedback.',
        ds:     'Why a 90+ eval score wasn\'t enough, the scoring inputs behind routing, and what we measured.'
      },
      slides: [
        { id: 'qb-title', min: 0.5, pri: 1, must: true, title: 'QuickBooks: AI + Embedded Human Expertise',
          layout: 'title',
          h: 'QuickBooks: AI + Embedded Human Expertise',
          sub: 'Where should human experts show up in an AI-powered QuickBooks, and how?',
          media: [{ ph: 'Owner on a video call with an expert' },
                  { ph: 'Owner with an expense insight card' },
                  { ph: 'Contractor with "246 tasks done" AI card' }] },

        { id: 'qb-context', skills: ['align'], min: 1, pri: 1, lens: ['pm', 'dm', 'ds'], label: 'Context', title: 'My role and the team',
          layout: 'split', ratio: 40,
          left: [
            { groups: [
              { h: 'Role', p: 'End-to-end product designer' },
              { h: 'Worked with', p: 'PM · Engineering · Data Science · Service Design · Service Delivery · Core QuickBooks · Expert platform' }
            ] },
            { p: { all: 'My job went beyond the interface: framing the problem, aligning teams on a service model, and setting the boundaries between AI and people.',
                   pm: 'My job went beyond the interface. I helped frame the problem, aligned teams on one service model, and pushed for where the AI and human boundaries should sit.',
                   dm: 'My job went beyond the interface. Seven partner teams each had their own goals, and a lot of the work was getting them to one shared service model.',
                   eng: 'My job went beyond the interface. I didn\'t own the model. I owned how its decisions show up for customers and experts, and where the boundaries sit.',
                   ds: 'My job went beyond the interface. Data science owned the model. I owned how its work reaches customers, and what it should and shouldn\'t do on its own.' } }
          ],
          right: [{ media: { ph: 'QuickBooks overview: Books Health, Needs attention, expert video call' } }] },

        { id: 'qb-from', min: 0.75, pri: 3, label: 'Before', title: 'Help only came after something went wrong',
          layout: 'split', ratio: 46,
          left: [{ h: 'Help only came after something went wrong' },
                 { chain: ['Owner does the books alone', 'Notices a problem', 'Pays an expert to fix it'], vertical: true },
                 { p: 'Small business owners did most of their bookkeeping on their own, with very little AI help. They had to spot problems themselves.' }],
          right: [{ media: { ph: 'Contractor on a job site checking a tablet', fill: true } }] },

        { id: 'qb-from-to', skills: ['strategy', 'service'], min: 1, pri: 2, lens: ['pm', 'design'], label: 'The opportunity', title: 'Help before problems happen',
          layout: 'split', ratio: 40,
          left: [{ h: 'Can we help before problems happen?' },
                 { p: { all: 'With AI, we asked a bigger question: instead of waiting for customers to come to us, can AI and experts work together around them?',
                        pm: 'With AI, the strategy could shift. Experts stop being an upsell you buy after a problem, and become part of the product.',
                        design: 'With AI, the mental model changes: support isn\'t a line you call at the end, it surrounds the customer. That shaped every screen after this.' } },
                 { chain: ['Customers', 'Manual workflow', 'Expert services $$'], vertical: true, dim: true }],
          right: [{ orbit: { center: 'Customer + QuickBooks', nodes: ['Expert', 'AI', 'Expert', 'AI', 'Expert', 'AI', 'Expert', 'AI'] } }] },

        { id: 'qb-why', skills: ['research'], min: 1, pri: 2, lens: ['pm', 'ds'], label: 'Why it matters', title: '"I don\'t know what I don\'t know"',
          layout: 'split', ratio: 50,
          left: [
            { quote: 'I don\'t know what I don\'t know.', by: 'Small business owner, research interview' },
            { stats: [{ v: '59%', l: 'worry their books are inaccurate' },
                      { v: '65%', l: 'worry they are not tax ready' },
                      { v: '43%', l: 'in business less than 3 years' }], row: true },
            { p: { all: 'Most owners can\'t spot problems on their own. You can\'t ask for help with a problem you don\'t see.',
                   pm: 'Most owners can\'t spot problems on their own, so a help button isn\'t enough. You can\'t ask for help with a problem you don\'t see.',
                   ds: 'We sized the trust gap with survey data before building anything. The pattern: owners can\'t spot problems, so they can\'t ask for help.' } }
          ],
          right: [{ media: { ph: 'Business owners reviewing their books together', fill: true } }] },

        { id: 'qb-challenge', skills: ['align', 'strategy', 'hai'], min: 1.25, pri: 1, lens: ['dm', 'pm'], label: 'Challenge', title: 'AI first or human first?',
          layout: 'split', ratio: 42,
          left: [{ h: 'AI first or <em>human first?</em>', size: 'xl' },
                 { note: '<b>The real problem wasn\'t AI versus human. It was trust,</b> and a human is only one way to build it.' }],
          right: [{ numbered: [
            { h: 'Customers wanted a person', p: 'Our paid services showed people want to talk to a human. Even in free support, people didn\'t like chatting with AI.' },
            { h: 'The business wanted scale', p: 'Humans are expensive and hard to scale, and AI had gotten much better.' },
            { h: { all: 'Teams pulled in different directions', dm: 'Teams pulled in different directions', pm: 'No shared definition, no shared roadmap' },
              p: { all: 'Expert services worried AI would replace experts. Core QuickBooks cared most about the overall experience.',
                   dm: 'Expert services worried AI would replace experts and their services. Core QuickBooks cared most about the overall experience. Each was right about their part.',
                   pm: 'Expert services worried about their revenue. Core QuickBooks cared about the overall experience. We needed one definition before a roadmap.' } },
            { h: 'So I dug into why', p: 'People didn\'t need a person for everything. They didn\'t trust AI to get their books right.' }
          ] }], rightPanel: true },

        { id: 'qb-journey', skills: ['service', 'research', 'align'], min: 1, pri: 3, lens: ['design', 'dm'], label: 'Journey', title: 'Mapping the journey together',
          layout: 'full',
          blocks: [{ h: 'Mapping the journey together' },
                   { sub: { all: 'With core QuickBooks, service design and service delivery',
                            dm: 'Mapping it together is how three teams started to share one picture' } },
                   { media: { ph: 'Customer journey map across onboarding, ongoing use and year-end', grow: true } }] },

        { id: 'qb-journey-moments', skills: ['service', 'hai'], min: 1, pri: 2, lens: ['design', 'dm', 'pm'], label: 'Journey', title: 'Where a human really matters',
          layout: 'full', center: true,
          blocks: [{ h: 'Where a human really matters' },
                   { p: { all: 'The need for experts wasn\'t spread evenly. It peaked at onboarding and year-end. In between, most issues didn\'t need a live call. They needed something they could trust.',
                          pm: 'The need for experts wasn\'t spread evenly. That told us where to invest expert time first: onboarding and year-end, with lighter support in between.',
                          design: 'The need for experts wasn\'t spread evenly. These moments became the anchors for where experts show up in the product.',
                          dm: 'The need for experts wasn\'t spread evenly. This gave every team the same small set of moments to agree on, instead of arguing about AI versus human in general.' } },
                   { timeline: [
                     { h: 'Onboarding', p: 'Setting up the books and making early decisions. <b>Peak need.</b>' },
                     { h: 'Critical decisions', p: 'High-risk choices that affect accuracy and compliance' },
                     { h: 'Ongoing', p: 'Unexpected issues over time. Usually needs trust, not a call.' },
                     { h: 'Year-end', p: 'Accuracy and taxes matter most. <b>Peak need.</b>' }
                   ] }] },

        { id: 'qb-levels', skills: ['agentic', 'hai', 'systems'], min: 1.5, pri: 1, lens: ['eng', 'pm', 'ds'], label: 'Framework', title: 'Who holds the missing piece?',
          layout: 'split', ratio: 38,
          left: [{ h: 'Who holds the <em>missing piece?</em>' },
                 { p: { all: 'To decide who owns each decision, we sorted bookkeeping jobs by one question.',
                        eng: 'Each level is a different handling path in the system, sorted by one question.',
                        pm: 'This gave every team one shared language for prioritizing, sorted by one question.',
                        ds: 'Each level sets what the model must be confident about before it acts alone.' } },
                 { levels: [
                   { n: 1, t: 'AI has the data. Easy to undo, like catching duplicates.' },
                   { n: 2, t: 'The customer has the context. AI suggests, the owner confirms.' },
                   { n: 3, t: 'An expert has the judgment, like entity structure.' }] }],
          right: [{ jtbd: [
            ['Categorize transactions by vendor rules', 1],
            ['Detect duplicate transactions', 1],
            ['Track 1099 payments vs W-9 status', 1],
            ['Detect vendor name changes', 1],
            ['Pre-fill W-4 payroll forms', 1],
            ['Confirm invoice-to-payment matches', 2],
            ['Categorize ambiguous purchases', 2],
            ['Confirm contractor classification (W-2 vs 1099)', 2],
            ['Approve category merge recommendations', 2],
            ['Advise on entity structure (LLC vs S-Corp)', 3],
            ['Design chart of accounts structure', 3],
            ['Configure payroll for new hires', 3],
            ['Review and sign off books for handoff', 3]
          ] }] },

        { id: 'qb-should', skills: ['agentic', 'hai', 'strategy'], min: 1.5, pri: 1, lens: ['ds', 'pm', 'eng', 'dm'], label: 'The hard call', title: 'AI can do it. Should it?',
          layout: 'split', ratio: 50,
          left: [{ h: 'AI can do it. <em>Should it?</em>', size: 'xl' },
                 { p: { all: 'Our agent scored over 90 when AI and accountants evaluated it, so PM and engineering wanted to automate more. I pushed back, for two reasons.',
                        pm: 'Our agent scored over 90 in evals, and the obvious move was to automate more. I pushed back, because one wrong tax answer costs more trust than many correct auto-fixes earn.',
                        eng: 'Our agent scored over 90 in evals, so the team wanted to widen what runs on its own. I pushed back on where that score came from.',
                        ds: 'Our agent scored over 90 when AI and accountants evaluated it. I pushed back on reading that as "ready to automate", for two reasons.',
                        dm: 'Our agent scored over 90 in evals, and PM and engineering wanted to automate more. Pushing back meant disagreeing with partners using their own data.' } },
                 { numbered: [
                   { h: { all: 'Clean data isn\'t real data', ds: 'The eval set was clean. Production isn\'t.' },
                     p: { all: 'The score was measured on clean data. Real customers often have missing or outdated data.',
                          ds: 'The score was measured on clean data. Real customers have missing and stale data, so the score didn\'t transfer.' } },
                   { h: 'Trust breaks fast', p: 'If customers already doubt AI, one confident wrong answer, maybe one that ends up in a tax filing, breaks that trust.' }
                 ] }],
          right: [
            { k: 'What moved' },
            { swap: { cols: ['Level 1: AI does it', 'Level 2: AI suggests, owner confirms'], rows: [
              ['A charge from a vendor you always use', 'Stays at Level 1'],
              ['A Home Depot charge for a contractor', 'Job materials, office supplies or personal? Only James knows.']
            ] } },
            { p: { all: 'Level 2 builds trust without the cost of an expert. AI does the work and shows its evidence, the customer confirms, and tasks earn their way to Level 1 on real data.',
                   eng: 'Level 2 is cheap to run: AI does the work and attaches its evidence, the customer confirms. Confirmed outcomes are the signal that promotes a task to Level 1.',
                   ds: 'Every Level 2 confirmation is labeled data from real customers. Tasks graduate to Level 1 when outcomes hold up on that data, not on the eval set.' } },
            { note: '<b>The boundary isn\'t fixed.</b> It moves as trust is earned.' }
          ], rightPanel: true },

        { id: 'qb-system', skills: ['agentic', 'systems', 'service'], min: 1.5, pri: 1, lens: ['eng', 'ds'], label: 'System', title: 'How the system works',
          layout: 'full',
          blocks: [{ p: { all: 'AI scores every gap and routes it. The harder part was how context moves between AI, customers and experts, so nobody explains twice.',
                          eng: 'Routing was only half the problem. The harder part was the handoff: what context travels with an issue, so the next person never starts from zero.',
                          ds: 'Four inputs drive routing. High-risk actions go to a human whatever the score, and every outcome feeds back to retune the thresholds.' } },
                   { system: {
            steps: ['AI reviews and finds gaps', 'Routing', 'Resolution and learning'],
            scan: ['Transactions', 'Receipts & invoices', 'Bank feeds', 'Integrations', 'Customer inputs', 'Service history'],
            evaluate: ['Confidence', 'Data quality', 'Severity', 'Business impact'],
            routes: [
              { n: 1, t: 'AI resolves it', out: 'Resolved and logged', sub: 'Every action can be reviewed and undone' },
              { n: 2, t: 'Customer confirms', out: 'Evidence prepared', sub: 'AI doesn\'t just say something\'s wrong. It shows why, so the owner decides fast.' },
              { n: 3, t: 'Expert steps in', out: 'Expert gets full context', sub: 'The issue, the evidence and what the customer already confirmed' }
            ],
            loop: 'Outcomes feed back, so more moves to Level 1 and 2',
            footer: 'High-risk actions always go to a human'
          } }] },

        { id: 'qb-codesign', skills: ['research', 'hai'], min: 0.75, pri: 3, lens: ['design', 'dm'], label: 'Co-design', title: 'How much do you show?',
          layout: 'split', ratio: 40,
          left: [{ h: 'If AI works in the background, how much do you show?' },
                 { p: 'Show everything and it\'s overwhelming. Show too little and it\'s a black box. I ran co-design sessions with customers to find the line.' },
                 { list: ['How support fits into the experience', 'What they wanted visibility into', 'Signals that built confidence', 'What made the service feel worth it'], title: 'What we explored' }],
          right: [{ media: { ph: 'Co-design board with sticky notes and concept sketches' } }] },

        { id: 'qb-prototypes', skills: ['proto', 'hai'], min: 1, pri: 2, lens: ['design', 'pm'], label: 'Prototypes', title: 'Four interaction models',
          layout: 'full',
          blocks: [{ h: 'Four interaction models, one winner' },
                   { table: { cols: ['Chat first', 'By who does it', 'By level', 'By workflow'], hi: 3, rows: [
                     { h: 'Everything happens in', cells: ['A conversation', 'AI vs human', 'L1, L2, L3', 'The owner\'s books'] },
                     { h: 'Matches how customers think', cells: [false, false, false, true] }
                   ] } },
                   { p: { all: 'AI versus human and the three levels are how <b>we</b> think about the system. Customers think about their books: what\'s done, and what needs them. So AI and experts show up inside the workflow, and chat is a helper, not the main surface.',
                          pm: 'The levels were great for us internally, but customers don\'t think that way. We organized around their workflow, which also meant AI and expert features could ship into one surface.',
                          design: 'The lesson: don\'t ship your internal model as the IA. Customers think about their books, so AI and experts show up inside the workflow, and chat is a helper, not the main surface.' } },
                   { mediaGrid: [{ ph: 'Your bookkeeping team' }, { ph: 'Overview with tasks' }, { ph: 'Overview with insights' }, { ph: 'Overview with AI chat' }], cols: 4 }] },

        { id: 'qb-solution', skills: ['hai', 'craft'], min: 1, pri: 1, lens: ['design', 'eng'], label: 'Target experience', title: 'One overview, AI and experts built in',
          layout: 'split', ratio: 34,
          left: [{ h: 'Three questions, one page' },
                 { groups: [
                   { h: 'How is my business doing?', p: 'Books Health, at a glance' },
                   { h: 'What needs my attention?', p: 'What AI found, each with one action' },
                   { h: 'What is QuickBooks handling?', p: 'The work AI and experts already did' }
                 ] },
                 { link: { href: 'https://qb-aihi-demo.vercel.app/', text: 'Try the clickable prototype' } },
                 { p: { all: 'This is the target experience. What we launched first comes right after.',
                        eng: 'Each item under Needs attention is a routed issue from the system you just saw.',
                        design: 'Notice how the expert card changes across the customer lifecycle.' } }],
          right: [{ media: { video: '../imgs/qbl-overview.mp4', poster: '../imgs/qbl-overview-poster.jpg', ph: 'Prototype of the Books Health overview and AI chat' } }] },

        { id: 'qb-james', skills: ['hai', 'service'], min: 1.5, pri: 2, lens: ['design', 'pm'], label: 'A year with James', title: 'A year with James',
          layout: 'split', ratio: 36, leftTheme: true,
          left: [{ h: 'Meet James Porter' }, { p: 'He runs Porter General Contracting, and wants to grow his business, not manage books.' },
                 { stats: [{ v: '2', l: 'Years in business' }, { v: '5', l: 'Employees' }, { v: '$675K', l: 'Revenue' }], row: true }],
          right: [{ steps: [
            { h: 'Onboarding', p: '$12K in receivables may be unmatched. AI matched 14 deposits to invoices, and James reviews them before anything changes. <b>Level 2.</b>' },
            { h: 'After the call', p: 'His score rises to 78, and he gets a call summary: what we covered, what was decided, what to do next.' },
            { h: 'During the year', p: 'He asks AI what to charge for a new solar service. That\'s judgment, so an expert joins right in the chat. <b>Level 3.</b>' },
            { h: 'Year-end', p: 'His books are ready, and he books his year-end review.' }
          ] },
            { note: { all: 'AI prepares the work, customers decide what matters, and experts bring judgment where it counts.',
                      pm: 'We didn\'t start from how many calls to offer. We started from when an expert creates the most value.',
                      dm: 'Experts aren\'t replaced by AI. AI handles the prep, so experts focus on the moments where their judgment matters.' } },
            { link: { href: 'https://qb-aihi-demo.vercel.app/', text: 'Walk through James\'s year in the prototype' } }] },

        { id: 'qb-mvp', skills: ['strategy', 'align'], min: 1.5, pri: 1, lens: ['pm', 'eng', 'dm', 'ds'], label: 'What we shipped first', title: 'What we shipped first, and why',
          layout: 'split', ratio: 36,
          left: [{ h: 'What we shipped first' },
                 { p: { all: 'We couldn\'t ship it all at once. The MVP tested one thing: does this way of bringing AI and experts together actually work for customers?',
                        pm: 'The MVP tested one thing: does this way of bringing AI and experts together work? Every cut kept that test intact.',
                        eng: 'The MVP shipped the core framework and nothing that blocked on another team.',
                        dm: 'Two of three tradeoffs came from other teams\' plans. Instead of blocking the launch, we sequenced around them.' } },
                 { note: 'Sometimes building trust means being careful about what the system claims to know.' }],
          right: [{ numbered: [
            { h: 'The score stayed in the target state',
              p: { all: 'Customers loved the Books Health Score. But our data wasn\'t always complete, and what does 65 mean? In a financial product, that\'s false precision. The MVP used a status backed by specific issues.',
                   ds: 'Customers loved the score. But inputs were often incomplete or stale, and nobody could say what 65 means. That\'s false precision, so the MVP used a status backed by specific issues until the data can support a number.' } },
            { h: 'Expert in the AI chat became a fast follow',
              p: 'Another team owns that capability. We didn\'t block the launch on it.' },
            { h: 'The call summary went out by email first',
              p: { all: 'Expert services wanted it across all their services, which turned a feature into a platform capability. Email got customers the value right away.',
                   eng: 'Once expert services wanted it everywhere, it became a platform capability. Email shipped the value now, and the platform version could be built properly.' } }
          ] }], rightPanel: true },

        { id: 'qb-results', skills: ['strategy'], min: 1, pri: 1, lens: ['pm', 'ds'], label: 'Results', title: 'Early signals',
          layout: 'split', ratio: 58,
          left: [{ h: 'Early signals' },
                 { stats: [{ v: '55%', l: 'engagement' }, { v: '~24%', l: 'engaged with expert calls' }, { v: '30%', l: 'less manual work' },
                           { v: '+3.2%', l: 'monthly books close' }, { v: '~80', l: 'tNPS' }], small: true },
                 { p: { all: 'Most importantly, customers said they felt more confident after expert sessions. That\'s the problem we started with.',
                        pm: 'Most importantly, customers felt more confident after expert sessions, which is the problem we started with. Next: personalize the signals and add more entry points across QuickBooks.',
                        ds: 'I measured trust, completion and safety, not model accuracy. Next step: track Level 2 acceptance to decide what moves to Level 1.' } }],
          right: [{ media: { ph: 'Contractor smiling on site', fill: true } }] },

        { id: 'qb-learned', skills: ['systems', 'align'], min: 0.75, pri: 2, lens: ['dm', 'design'], label: 'What I learned', title: 'What I learned',
          layout: 'full',
          blocks: [{ cards: [
            { icon: '🧭', h: 'Move without a defined problem', p: 'Use the customer journey to align teams, not just as research.' },
            { icon: '🧩', h: 'From screens to systems', p: 'Design how work moves between AI, customers and experts.' },
            { icon: '🎯', h: 'Don\'t claim more than you know', p: 'That\'s why we kept a human in the loop, and why we held the score back.' }
          ] },
            { note: 'Designing AI products is as much about drawing the boundaries as designing the AI itself.' }] }
      ]
    },

    // ------------------------------------------------------------------ Business formation
    {
      id: 'bf',
      name: 'Business formation',
      short: 'Business formation',
      theme: 'green',
      focus: {
        all:    'A zero to one service: why the hard part is the decision, not the paperwork, and a pilot run with no engineering.',
        pm:     'Why this service first, where we could win against LegalZoom, and how a cheap pilot unlocked investment.',
        design: 'Research that reframed the problem, the roadmap prototype, two front doors, and the service blueprint.',
        dm:     'Running a pilot with no engineering support, and influencing through clarity and momentum.',
        eng:    'What we replaced with Zoom and email, and the rules-based expert tool we built ourselves.',
        ds:     'The research scale (1,500+ surveys, 250+ interview hours) and what the pilot proved.'
      },
      slides: [
        { id: 'bf-title', min: 0.5, pri: 1, must: true, title: 'Business formation',
          layout: 'title',
          h: 'Business formation',
          sub: 'From first concept to a pilot that proved the demand',
          media: [{ ph: 'Owner smiling on a video call with a formation expert' }],
          checklist: [['Choose your entity type', true], ['File your articles of org', true], ['Obtain your EIN', false]] },

        { id: 'bf-context', skills: ['strategy', 'zero'], min: 1, pri: 2, lens: ['pm', 'ds'], label: 'Opportunity', title: 'Start with us, stay with us',
          layout: 'split', ratio: 40,
          left: [{ h: 'Start with us, <em>stay with us</em>' },
                 { p: { all: 'QuickBooks wanted to expand into new services. I owned business formation from the very first concept through the pilot.',
                        pm: 'QuickBooks was exploring four new services in parallel. Business formation stood out on cost, market and ecosystem. I owned it from first concept through the pilot.' } },
                 { pick: ['Business formation', 'Tax advisory', 'Marketing', 'CFO advisory'], on: 0 }],
          right: [{ numbered: [
            { h: 'A big audience already here', p: '8.6M sole props in QuickBooks, many who know they should incorporate but haven\'t, plus 1 to 1.2M new filers a year' },
            { h: 'Low investment', p: 'Our experts already know small businesses, and only needed focused training' },
            { h: 'It\'s the very start of a business', p: 'If owners start with us, they\'re likely to stay for bookkeeping and more' }
          ] }], rightPanel: true },

        { id: 'bf-research', skills: ['research'], min: 0.75, pri: 2, lens: ['ds', 'design'], label: 'Research', title: 'How we learned what owners needed',
          layout: 'full',
          blocks: [{ h: 'How we learned what owners actually needed' },
                   { stats: [{ k: 'Breadth', v: '1,500+', l: 'Surveys' },
                             { k: 'Depth', v: '250+', l: 'Hours of interviews' },
                             { k: 'Validation', v: '45+', l: 'Sessions with experts' }], row: true },
                   { p: { all: 'Surveys for breadth, interviews for depth, and expert sessions to check what we heard.',
                          ds: 'Surveys for breadth, interviews for depth, and expert sessions to check what we heard against how formation really works.' } },
                   { mediaRow: [{ ph: 'Workshop with the team' }, { ph: 'Remote interview' }, { ph: 'Interview guide' }] }] },

        { id: 'bf-steps', skills: ['research'], min: 0.5, pri: 1, label: 'Insight', title: 'Four clear steps',
          layout: 'full', center: true,
          blocks: [{ h: 'On paper, forming a business is <em>four clear steps</em>' },
                   { chain: ['Choose entity type', 'File articles', 'Get an EIN', 'Ongoing compliance'], nums: true },
                   { p: 'Each step has clear rules. Some owners even file on their own to save money.' }] },

        { id: 'bf-decision', skills: ['research', 'strategy'], min: 1, pri: 1, lens: ['pm', 'design'], label: 'Insight', title: 'Step 1 hides the hard questions',
          layout: 'full',
          blocks: [{ h: 'But step 1 hides <em>the hard questions</em>' },
                   { p: { all: 'Choosing an entity type decides your taxes, your liability and whether you can raise money. And it\'s hard to undo.',
                          pm: 'Choosing an entity type decides taxes, liability and fundraising, and it\'s hard to undo. That moved the product from a filing tool to an advisory service.',
                          design: 'Choosing an entity type decides taxes, liability and fundraising, and it\'s hard to undo. So the design focus moved to the decision, not the form.' } },
                   { chain: ['Choose entity type', 'File articles', 'Get an EIN', 'Ongoing compliance'], nums: true, on: 0 },
                   { risks: {
                     cols: ['What\'s really under step 1', 'If it\'s wrong'],
                     rows: [
                       ['Taxes', 'Which structure saves me the most tax?', 'Overpaying every year'],
                       ['Liability', 'Is my house at risk if something goes wrong?', 'Personal assets exposed'],
                       ['Raising money', 'Can I bring in investors later?', 'Investors pass'],
                       ['Partners', 'What if I add a partner?', 'Ownership disputes'],
                       ['State rules', 'What does my state require?', 'Fines and penalties']
                     ] } }] },

        { id: 'bf-cost', skills: ['research', 'hai'], min: 0.75, pri: 2, lens: ['design', 'ds', 'eng'], label: 'Insight', title: 'A wrong start costs for years',
          layout: 'split', ratio: 52,
          left: [{ h: 'A wrong start <em>costs for years</em>' },
                 { p: 'One owner set up the wrong structure at the start. Now he pays a few hundred dollars extra every year. Can\'t he fix it? Yes, but it would cost thousands in CPA fees, so he just lives with it.' },
                 { note: { all: 'And AI doesn\'t make this safer. Ask "how do I pay the least tax?" and you can get an answer that saves money but doesn\'t fit your business, or isn\'t even allowed.',
                           eng: 'And a chatbot doesn\'t make this safer. "How do I pay the least tax?" can get a confident answer that doesn\'t fit the business, or isn\'t allowed. A wrong answer here is expensive.',
                           ds: 'And a model doesn\'t make this safer. "How do I pay the least tax?" can get an answer that optimizes the wrong thing, or isn\'t allowed. A confident wrong answer here is expensive.' } }],
          right: [{ stats: [{ k: 'Living with it', v: '$100s', l: 'extra, every year' }, { k: 'Fixing it', v: '$1,000s', l: 'in CPA fees, once' }], row: true }], rightPanel: true },

        { id: 'bf-who', skills: ['research', 'service'], min: 1, pri: 1, lens: ['design', 'pm', 'dm'], label: 'Insight', title: 'Owners don\'t know who to ask',
          layout: 'full',
          blocks: [{ h: 'Owners don\'t know <em>who to ask</em>' },
                   { p: { all: 'Everyone holds a piece, nobody holds the whole picture, so owners get stuck in between. Even their CPA isn\'t a great fit: state formation rules aren\'t their area, and they charge hundreds an hour.',
                          design: 'Remember "who holds the missing piece" from the first project? Here the missing piece was split across three professions, and owners got stuck in between.',
                          pm: 'Everyone holds a piece, nobody holds the whole picture. Even their CPA is poor value for both sides: formation isn\'t their area, and they charge tax-advice rates.' } },
                   { matrix: {
                     cols: ['Books', 'Tax', 'Legal', 'Your business'],
                     rows: [
                       { h: 'Bookkeeper', sub: 'Knows your books, not the law', cells: [1, 0, 0, 0.5] },
                       { h: 'Tax expert / CPA', sub: 'Knows taxes, not the legal side', cells: [0.5, 1, 0, 0.5] },
                       { h: 'Lawyer', sub: 'Knows the law, not always the tax impact', cells: [0, 0, 1, 0.5] },
                       { h: 'AI chatbot', sub: 'Knows a bit of everything', cells: [0.5, 0.5, 0.5, 0] },
                       { h: 'What the owner needs', sub: 'The whole picture', cells: [2, 2, 2, 2], strong: true }
                     ] } }] },

        { id: 'bf-gap', skills: ['strategy', 'zero'], min: 1, pri: 1, lens: ['pm', 'dm', 'design'], label: 'Positioning', title: 'Where we could win',
          layout: 'full',
          blocks: [{ h: 'Where we <em>could win</em>' },
                   { table: { cols: ['DIY', 'Filing services', 'CPA', 'QuickBooks'], hi: 3, rows: [
                     { h: 'Helps you decide', cells: [false, false, true, true] },
                     { h: 'Affordable', cells: [true, true, false, true] },
                     { h: 'Knows your business', cells: [false, false, 'Sometimes', true] },
                     { h: 'Stays with you after filing', cells: [false, false, false, true] }
                   ] } },
                   { p: { all: 'Filing services like LegalZoom have a polished flow, and much of their model is add-ons. Our edge: we already have the owner\'s financial data, a platform they trust, and experts who know small businesses. So we led with expert advice, and made filing part of the service.',
                          pm: 'LegalZoom is strong at filing and makes money on add-ons. Our edge was data, trust and experts who already know small businesses. Later, AI could even spot when it\'s time to change, like adding a partner.',
                          design: 'Competitors win on a polished filing flow. We designed around the expert conversation instead, with filing as one part of it.',
                          dm: 'This is where the project became a product decision, not a design task: lead with expert advice, and make filing part of the service.' } }] },

        { id: 'bf-prototype', skills: ['proto', 'craft'], min: 0.75, pri: 2, lens: ['design'], label: 'Prototype', title: 'A roadmap that prepares you for the expert',
          layout: 'split', ratio: 34,
          left: [{ h: 'A roadmap that prepares you for the expert' },
                 { p: 'Based on your goals, you see the recommended path, the cost and the timeline, with an expert one tap away.' },
                 { note: 'Because the decision is high stakes, the roadmap doesn\'t hand you an answer. It prepares you for the conversation.' }],
          right: [{ media: { ph: '"Welcome back, John" formation roadmap with cost, timeline and expert contact' } }] },

        { id: 'bf-new', skills: ['service'], min: 1, pri: 2, lens: ['design', 'pm', 'eng'], label: 'Two front doors', title: 'Two audiences, two front doors',
          layout: 'split', ratio: 50,
          left: [{ k: 'New businesses' },
                 { steps: [{ h: 'Fast onboarding', p: 'Just enough to get them formed' },
                           { h: 'Expert advice', p: 'A call to choose the right structure' },
                           { h: 'Formed', p: 'File with the expert or on their own' },
                           { h: 'The right QuickBooks plan', p: 'Recommended from what we learned' }] }],
          right: [{ k: 'Existing QuickBooks customers' },
                  { steps: [{ h: 'Proactive reminder', p: { all: 'When it\'s time to change, like adding a partner or profit growing enough for an S-Corp', eng: 'Triggered from signals we already have, like a new partner or profit crossing an S-Corp threshold' } },
                            { h: 'Nothing to re-enter', p: 'We already know their business' },
                            { h: 'Expert already prepped', p: 'The expert knows their situation before the call' }] }], rightPanel: true },

        { id: 'bf-blueprint', skills: ['service', 'systems'], min: 0.75, pri: 3, lens: ['design', 'dm', 'eng'], label: 'Service blueprint', title: 'The relationship continues after filing',
          layout: 'full',
          blocks: [{ h: 'The relationship continues after filing' },
                   { p: { all: 'This is a service as much as a product, so I mapped what the customer sees, what the expert does, and what happens behind the scenes.',
                          eng: 'The blueprint shows which steps are product, partner platform, or expert work, and what has to happen behind the scenes.',
                          dm: 'The blueprint is how service delivery and product agreed on one plan.' } },
                   { branch: { from: 'Advisory call', to: ['DIY', 'DIY with a partner platform', 'Expert files it'], note: 'Then into bookkeeping and compliance, with the same expert relationship' } },
                   { media: { ph: 'Service blueprint, zoomed into the after-filing lane', grow: true } }] },

        { id: 'bf-pilot', skills: ['zero', 'proto', 'align'], min: 1.25, pri: 1, lens: ['dm', 'eng', 'pm'], label: 'Pilot', title: 'No engineering, so we built it ourselves',
          layout: 'split', ratio: 44,
          left: [{ h: 'No engineering, so we <em>built it ourselves</em>' },
                 { p: { all: 'We lost engineering support for the pilot. Instead of waiting, I designed the pilot around what we had: 6 experts, 20 customers, 4 states.',
                        dm: 'We lost engineering support for the pilot. We could have paused. Instead I designed the pilot around what we had: 6 experts, 20 customers, 4 states.',
                        eng: 'No engineering, so nothing on the expert platform. My PM and I built a simple tool ourselves, using Claude to write the code. It\'s rules-based, not AI: for legal requirements you want predictable and easy to check.',
                        pm: 'We lost engineering support. Instead of waiting for resources, we ran a cheap pilot that could still prove the demand: 6 experts, 20 customers, 4 states.' } },
                 { swap: { cols: ['Planned', 'What we ran'], rows: [
                   ['New + existing customers', 'Existing customers only'],
                   ['In-product flows', 'Email + Zoom'],
                   ['Expert platform', 'A tool we built with Claude'],
                   ['Broad state coverage', '4 states, set up by hand']
                 ] } },
                 { note: 'Same pattern as the first project: <b>the system prepares, the expert decides.</b>' }],
          right: [{ mediaGrid: [{ ph: 'Expert tool: client information' }, { ph: 'Expert tool: state rules' }, { ph: 'Expert tool: entity options' }, { ph: 'Customer summary' }], cols: 2 }] },

        { id: 'bf-results', skills: ['zero', 'strategy'], min: 0.75, pri: 1, lens: ['pm', 'ds', 'dm'], label: 'Results', title: 'The pilot proved the demand',
          layout: 'split', ratio: 50,
          left: [{ h: 'The pilot proved the demand' },
                 { stats: [{ v: '4.6/5', l: 'satisfaction' }, { v: '100%', l: 'would recommend' }], row: true },
                 { p: 'People kept mentioning the <b>human connection</b> and the <b>personalized guidance</b>, which is exactly the gap we set out to fill.' },
                 { p: { all: 'That got us resources to move toward MVP and launch, and raised the project\'s priority in the org.',
                        ds: 'Twenty customers is a small sample, so we read it as a demand signal, not a final number. It was enough to get resources for MVP and launch.',
                        dm: 'Early proof did what a deck couldn\'t: it got resources for MVP and launch, and raised the project\'s priority in the org.' } }],
          right: [{ media: { ph: 'Owner smiling at her phone, with formation checklist', fill: true } }] },

        { id: 'bf-learned', skills: ['zero', 'align'], min: 0.5, pri: 2, lens: ['dm', 'pm'], label: 'What I learned', title: 'What I learned',
          layout: 'full',
          blocks: [{ cards: [
            { icon: '🔎', h: 'Research decides where to play', p: 'In zero to one, research isn\'t a phase.' },
            { icon: '🧪', h: 'Validate before you build', p: 'You can prove the core value without full product support, if you\'re creative.' },
            { icon: '🌱', h: 'Clarity and momentum', p: 'Influence comes from those, not from waiting for permission.' }
          ] }] }
      ]
    }
  ]
};
