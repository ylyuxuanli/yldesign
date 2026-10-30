// Public content for /deck. Speaker notes are NOT here: they live encrypted in notes.enc.js.
//
// Each slide:
//   id      key for speaker notes
//   min     minutes when presented
//   pri     1 = core story, 2 = strong support, 3 = nice to have
//   must    always included
//   lens    audiences this slide matters most to (pm, design, dm, eng, ds), used to pick slides
//   skills  skills this slide shows (see `skills` below), used to pick slides and order projects
//   group   slides that come in or out together (e.g. 'work')
//   title   name used in the agenda
//   section small label in the top-left corner (Context, What I did, ...)
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
    { id: 'ai',       name: 'AI design' },
    { id: 'service',  name: 'Service design' },
    { id: 'systems',  name: 'Systems thinking' },
    { id: 'ixd',      name: 'Interaction design' },
    { id: 'proto',    name: 'Prototyping' },
    { id: 'research', name: 'Research' },
    { id: 'strategy', name: 'Product strategy' },
    { id: 'zero',     name: '0 to 1' },
    { id: 'align',    name: 'Cross-team alignment' }
  ],

  projects: [
    // ------------------------------------------------------------------ Intro
    {
      id: 'intro',
      name: 'About me',
      short: 'About me',
      slides: [
        // About me: the same for everyone. What kind of designer, and why; the reporter years are a bonus, not the story
        { id: 'intro-who', section: 'About me', min: 0.5, pri: 1, title: 'About me',
          layout: 'full',
          blocks: [{ h: 'I enjoy solving complex problems. Here\'s how I do it.' },
                   { mid: true, cards: [
            { k: 'Curious', color: '#E0A800', h: 'I ask the right questions', p: 'Working as a reporter taught me to dig past the request to the real cause.' },
            { k: 'Delightful', color: '#FF8B22', h: 'I design for how people feel', p: 'Solving the problem is half of it. I want people to leave calmer, and a little happier.' },
            { k: 'Thoughtful', color: '#ED5148', h: 'I find the right balance', p: 'I understand business needs and how code works, so I weigh them with user needs and find what holds up.' }
          ] }] },

        // What I bring: written for each role
        { id: 'intro-bring', section: 'About me', min: 0.5, pri: 1, title: 'What I bring',
          layout: 'split', ratio: 40, zone: 'left',
          left: [{ h: 'What I bring<br/>to a team', size: 'xl' }],
          right: [{ rows: { all: [
                       { h: 'Make complex things simple', p: 'I turn messy, high-stakes problems into experiences people understand and trust' },
                       { h: 'Design AI and people together', p: 'I decide what AI should do, what people should do, and how they hand off' },
                       { h: 'Prove it early', p: 'I test ideas with real users and working prototypes before teams commit' } ],
                     pm: [
                       { h: 'Frame the problem', p: 'So we build the right thing, and know what to cut' },
                       { h: 'Ship in steps', p: 'MVPs that test one idea, with clear signals' },
                       { h: 'Align partners', p: 'One service model, shared across teams' } ],
                     design: [
                       { h: 'Systems, not just screens', p: 'How work moves between AI, customers and experts' },
                       { h: 'Research that changes direction', p: 'Interviews and co-design that reframed both projects' },
                       { h: 'Craft', p: 'Design systems, prototypes and the details' } ],
                     dm: [
                       { h: 'Align teams with different goals', p: 'Through shared journeys and clear tradeoffs' },
                       { h: 'Move without waiting', p: 'Ran a pilot with no engineering support' },
                       { h: 'Grow designers', p: 'Managed three designers at Offerland.ai' } ],
                     eng: [
                       { h: 'Buildable designs', p: 'States, edge cases and logic, not just screens' },
                       { h: 'Clear logic', p: 'What AI does alone, and when a person steps in' },
                       { h: 'Shippable scope', p: 'MVPs that don\'t block on other teams' } ],
                     ds: [
                       { h: 'Evidence first', p: 'Surveys and interviews before design' },
                       { h: 'Trust over scores', p: 'A 90+ eval doesn\'t mean ready to automate' },
                       { h: 'Measure what matters', p: 'Trust, completion and safety, not just accuracy' } ]
                   } }] },

        // Work experience comes as a set: all three when there's time, none when there isn't.
        { id: 'intro-intuit', section: 'Work experience', group: 'work', skills: ['ai', 'strategy'], min: 0.5, pri: 2, lens: ['pm', 'dm'], title: 'Intuit',
          layout: 'split', ratio: 36,
          left: [{ h: 'Intuit' },
                 { p: { all: 'I lead design for AI + human experiences in QuickBooks, and a new Business Formation service.',
                        eng: 'I lead design for AI + human experiences in QuickBooks. I also prototype in code and send PRs.' } },
                 { stats: [{ v: '2.6M', l: 'customers reached' }, { v: '85%', l: '31-day retention' }], row: true, small: true }],
          right: [{ media: { src: '../imgs/deck/intro-intuit.webp', fit: 'contain', ph: 'Intuit Experts services inside QuickBooks' } }] },

        { id: 'intro-lytx', section: 'Work experience', group: 'work', skills: ['systems', 'proto', 'ixd'], min: 0.5, pri: 2, lens: ['eng', 'design', 'ds'], title: 'Lytx',
          layout: 'split', ratio: 36,
          left: [{ h: 'Lytx' },
                 { p: { all: 'Fleet safety software for 5.5M+ drivers. I designed the driver app, dashboards and the design systems behind them.',
                        design: 'Fleet safety software for 5.5M+ drivers. The driver app was dark-only and hard to read in the sun, so I added light mode and built its design system.',
                        eng: 'Fleet safety software for 5.5M+ drivers. I built the mobile and web design systems with engineering, light and dark mode included.',
                        ds: 'Fleet safety software for 5.5M+ drivers. I designed dashboards that turn safety data into a few things to act on.' } }],
          right: [{ media: { src: '../imgs/deck/intro-lytx.webp', fit: 'contain', ph: 'Driver app in light and dark mode, with chart components' } }] },

        { id: 'intro-offerland', section: 'Work experience', group: 'work', skills: ['zero', 'align'], min: 0.5, pri: 2, lens: ['pm', 'design', 'dm'], title: 'Offerland.ai',
          layout: 'split', ratio: 36,
          left: [{ h: 'Offerland.ai' },
                 { p: { all: 'An AI career platform I built with friends: job tracking, resumes, interview practice.',
                        dm: 'An AI career platform I built with friends. My first time managing designers.' } },
                 { stats: [{ v: '40K+', l: 'users' }, { v: '3', l: 'designers I managed' }], row: true, small: true }],
          right: [{ media: { src: '../imgs/deck/intro-offerland.webp', fit: 'contain', ph: 'Offerland job tracker and AI interview coach' } }] },

        { id: 'intro-life', section: 'Outside of work', min: 0.5, pri: 2, title: 'Delightful moments',
          layout: 'full', center: true,
          blocks: [{ h: 'My delightful moments' },
                   { p: 'Ceramics taught me something useful for design: there\'s no undo button, so you think before you commit.' },
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
      talk: { 45: 20, 60: 25 }, // minutes when she presents, by session length
      name: 'QuickBooks: AI + Embedded Human Expertise',
      short: 'QuickBooks AI + Human',
      theme: 'navy',
      keywords: ['AI + human', 'Service design', 'Systems', 'MVP tradeoffs'],
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
          wide: true,
          media: [{ src: '../imgs/deck/qb-title.webp', fit: 'contain', ph: 'Owners working with AI and QuickBooks experts' }] },

        { id: 'qb-context', section: 'Context', skills: ['align'], min: 1, pri: 1, lens: ['pm', 'dm', 'ds'], title: 'My role and the team',
          layout: 'split', ratio: 34,
          left: [
            { h: 'As an end-to-end product designer' },
            { lines: ['Find the real problem', 'Design the service', 'Set what AI and people own', 'Prototype and test early', 'Align the teams'] },
            { groups: [
              { h: 'Scope', p: 'Across 4 QuickBooks Online plans' },
              { h: 'Cross-functional teams', p: 'PM · Engineering · Data Science · Service Design · Service Delivery · Core QuickBooks · Expert platform' }
            ] }
          ],
          right: [{ media: { src: '../imgs/deck/qb-context.webp', fit: 'contain', ph: 'QuickBooks overview: Books Health, Needs attention, expert video call' } }] },

        { id: 'qb-from-to', section: 'Context', skills: ['strategy', 'service'], min: 1.5, pri: 2, lens: ['pm', 'design'], title: 'From help after problems, to help around the customer',
          layout: 'split', ratio: 44, zone: 'right', reveal: 'right', top: true,
          left: [{ h: 'From' },
                 { flow: [{ img: '../imgs/deck/from-customer.png', t: 'Customers' },
                          { img: '../imgs/deck/from-qb.png', t: 'Manual workflow' },
                          { img: '../imgs/deck/from-expert.png', t: 'Expert services $$', dashed: true }] }],
          right: [{ h: 'To' },
                  { read: true, p: 'Can AI and experts work together around the customer, and help before problems happen?' },
                  { media: { src: '../imgs/deck/qb-to-aihi.webp', fit: 'contain', ph: 'AI and experts around the customer' } }] },

        { id: 'qb-why', section: 'Why this matters', skills: ['research'], min: 1, pri: 2, lens: ['pm', 'ds'], title: '"I don\'t know what I don\'t know"',
          layout: 'full', center: true,
          blocks: [
            { quote: 'I don\'t know what I don\'t know.', by: 'Small business owner, research interview' },
            { stats: [{ v: '59%', l: 'worry their books are inaccurate' },
                      { v: '65%', l: 'worry they are not tax ready' },
                      { v: '43%', l: 'in business less than 3 years' }], row: true },
            { p: { all: 'Most owners can\'t spot problems on their own. You can\'t ask for help with a problem you don\'t see.',
                   pm: 'Most owners can\'t spot problems on their own, so a help button isn\'t enough. You can\'t ask for help with a problem you don\'t see.',
                   ds: 'We sized the trust gap with survey data before building anything. The pattern: owners can\'t spot problems, so they can\'t ask for help.' } }
          ] },

        { id: 'qb-challenge', section: 'Challenge', skills: ['align', 'strategy', 'ai'], min: 1.25, pri: 1, lens: ['dm', 'pm'], title: 'What should come first: AI, the expert, or both?',
          layout: 'split', ratio: 42, zone: 'right',
          left: [{ h: 'What should come first: AI, the expert, or both?', size: 'xl' },
                 { read: true, p: 'I dug into why. People didn\'t need a person for everything. They didn\'t trust AI to get their books right. The real problem was trust, and a human is only one way to build it.' }],
          right: [{ numbered: [
            { h: 'No pattern to reuse', p: 'AI and human experts in one product was new. There was no playbook for who does what.' },
            { h: 'Customers asked for a person', p: 'But not for what, or when. Their needs weren\'t defined yet.' },
            { h: 'Teams pulled in different directions', p: 'Expert services feared AI would replace experts. Core QuickBooks guarded the overall experience.' }
          ] }] },

        { id: 'qb-journey', section: 'What I did', skills: ['service', 'research', 'align', 'ai'], min: 1.75, pri: 2, lens: ['design', 'dm', 'pm'], title: 'Where expertise matters most',
          layout: 'full',
          blocks: [{ h: 'Defining where expertise matters most' },
                   { sub: 'With core QuickBooks teams, service design and service delivery' },
                   { pins: { reveal: true, color: '#003E31', src: '../imgs/deck/qb-journey.webp', alt: 'Customer journey map across onboarding, ongoing use and year-end', at: [
                     { x: 30.6, y: 44, h: 'Onboarding', p: 'Customers are unsure how to set up and make initial decisions' },
                     { x: 49, y: 44, up: true, h: 'Critical financial decisions', p: 'High-risk decisions impacting accuracy and compliance' },
                     { x: 65.4, y: 44, h: 'Ongoing support', p: 'Unexpected issues and anomalies over time' },
                     { x: 83, y: 44, up: true, h: 'Year-end review', p: 'Prepare for tax season' }
                   ] } }] },

        { id: 'qb-levels', section: 'What I did', skills: ['ai', 'systems'], min: 1.5, pri: 1, lens: ['eng', 'pm', 'ds'], title: 'Who holds the missing piece?',
          layout: 'split', ratio: 38, zone: 'left',
          left: [{ h: 'Who holds the missing piece?' },
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

        { id: 'qb-should', section: 'What I did', skills: ['ai', 'strategy'], min: 1.5, pri: 1, lens: ['ds', 'pm', 'eng', 'dm'], title: 'AI can do it. Should it?',
          layout: 'split', ratio: 50, zone: 'right',
          left: [{ h: 'AI can do it. Should it?', size: 'xl' },
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
            { swap: { cols: ['Level 1: AI does it', 'Level 2: AI suggests, owner confirms'], rows: [
              ['A charge from a vendor you always use', 'Stays at Level 1'],
              ['A Home Depot charge for a contractor', 'Job materials, office supplies or personal? Only James knows.']
            ] } },
            { p: { all: 'Level 2 builds trust without the cost of an expert. AI does the work and shows its evidence, the customer confirms, and tasks earn their way to Level 1 on real data.',
                   eng: 'Level 2 is cheap to run: AI does the work and attaches its evidence, the customer confirms. Confirmed outcomes are the signal that promotes a task to Level 1.',
                   ds: 'Every Level 2 confirmation is labeled data from real customers. Tasks graduate to Level 1 when outcomes hold up on that data, not on the eval set.' } }
          ] },

        { id: 'qb-system', section: 'What I did', skills: ['ai', 'systems'], min: 1.5, pri: 1, lens: ['eng', 'ds'], title: 'How the system works',
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

        { id: 'qb-codesign', section: 'What I did', skills: ['research', 'ai', 'ixd'], min: 0.75, pri: 3, lens: ['design', 'dm'], title: 'How much do you show?',
          layout: 'split', ratio: 36,
          left: [{ h: 'If AI works in the background, how much do you show?' },
                 { p: 'Show everything and it\'s overwhelming. Show too little and it\'s a black box. I ran co-design sessions with customers to find the line.' }],
          right: [{ media: { src: '../imgs/deck/qb-codesign.webp', fit: 'contain', ph: 'Co-design board with sticky notes and concept sketches' } }] },

        { id: 'qb-prototypes', section: 'What I did', skills: ['proto', 'ixd', 'ai'], min: 1, pri: 2, lens: ['design', 'pm'], title: 'Four interaction models',
          layout: 'full',
          blocks: [{ h: 'Four interaction models, one winner' },
                   { table: { cols: ['Chat first', 'By who does it', 'By level', 'By workflow'], hi: 3,
                     imgs: [{ src: '../imgs/deck/qb-model-2.webp', ph: 'Overview with AI chat' },
                            { src: '../imgs/deck/qb-model-6.webp', ph: 'Your bookkeeping team' },
                            { src: '../imgs/deck/qb-model-3.webp', ph: 'Grouped by AI confidence' },
                            { src: '../imgs/deck/qb-model-5.webp', ph: 'Close the month, step by step' }],
                     rows: [
                     { h: 'Everything happens in', cells: ['A conversation', 'AI vs human', 'L1, L2, L3', 'The owner\'s books'] },
                     { h: 'Matches how customers think', cells: [false, false, false, true] }
                   ] } },
                   { p: { all: 'AI versus human and the three levels are how we think about the system. Customers think about their books: what\'s done, and what needs them. So AI and experts show up inside the workflow, and chat is a helper, not the main surface.',
                          pm: 'The levels were great for us internally, but customers don\'t think that way. We organized around their workflow, which also meant AI and expert features could ship into one surface.',
                          design: 'The lesson: don\'t ship your internal model as the IA. Customers think about their books, so AI and experts show up inside the workflow, and chat is a helper, not the main surface.' } }] },

        { id: 'qb-solution', section: 'Final design', skills: ['ixd', 'ai', 'proto'], min: 1, pri: 1, lens: ['design', 'eng'], title: 'One overview, AI and experts built in',
          layout: 'split', ratio: 34,
          left: [{ h: 'Three questions, one page' },
                 { groups: [
                   { h: 'How is my business doing?', p: 'Books Health, at a glance' },
                   { h: 'What needs my attention?', p: 'What AI found, each with one action' },
                   { h: 'What is QuickBooks handling?', p: 'The work AI and experts already did' }
                 ] },
                 { link: { href: 'https://qb-aihi-demo.vercel.app/', text: 'Try the clickable prototype' } }],
          right: [{ media: { video: '../imgs/qbl-overview.mp4', poster: '../imgs/qbl-overview-poster.jpg', ph: 'Prototype of the Books Health overview and AI chat' } }] },

        { id: 'qb-james', section: 'Applied use case', skills: ['ai', 'service'], min: 1.5, pri: 2, lens: ['design', 'pm'], title: 'A year with James',
          layout: 'split', ratio: 36, leftTheme: true,
          left: [{ h: 'Meet James Porter' }, { p: 'Runs Porter General Contracting' },
                 { stats: [{ v: '2', l: 'Years in business' }, { v: '5', l: 'Employees' }, { v: '$675K', l: 'Revenue' }], row: true, small: true },
                 { groups: [{ h: 'Goal', p: 'Grow the business, not manage books' }] }],
          right: [{ steps: [
            { h: 'Onboarding', p: '$12K in receivables may be unmatched. AI matched 14 deposits to invoices, and James reviews them before anything changes. Level 2.' },
            { h: 'After the call', p: 'His score rises to 78, and he gets a call summary: what we covered, what was decided, what to do next.' },
            { h: 'During the year', p: 'He asks AI what to charge for a new solar service. That\'s judgment, so an expert joins right in the chat. Level 3.' },
            { h: 'Year-end', p: 'His books are ready, and he books his year-end review.' }
          ] }] },

        { id: 'qb-mvp', section: 'MVP & tradeoffs', skills: ['strategy', 'align'], min: 1.5, pri: 1, lens: ['pm', 'eng', 'dm', 'ds'], title: 'What we shipped first, and why',
          layout: 'split', ratio: 36,
          left: [{ h: 'What we shipped first' },
                 { p: { all: 'We couldn\'t ship it all at once. The MVP tested one thing: does this way of bringing AI and experts together actually work for customers?',
                        pm: 'The MVP tested one thing: does this way of bringing AI and experts together work? Every cut kept that test intact.',
                        eng: 'The MVP shipped the core framework and nothing that blocked on another team.',
                        dm: 'Two of three tradeoffs came from other teams\' plans. Instead of blocking the launch, we sequenced around them.' } },
                 { swap: { cols: ['We prioritized', 'We deprioritized'], rows: [
                   ['Validating the value of the service', 'Full coverage across all workflows'],
                   ['Expert support in one workflow', 'All customer groups'],
                   ['Expert service for 10% of customers', 'Deep personalization']
                 ] } }],
          right: [{ numbered: [
            { h: 'The score stayed in the target state',
              p: { all: 'Customers loved the Books Health Score. But our data wasn\'t always complete, and what does 65 mean? In a financial product, that\'s false precision. The MVP used a status backed by specific issues.',
                   ds: 'Customers loved the score. But inputs were often incomplete or stale, and nobody could say what 65 means. That\'s false precision, so the MVP used a status backed by specific issues until the data can support a number.' } },
            { h: 'Expert in the AI chat became a fast follow',
              p: 'Another team owns that capability. We didn\'t block the launch on it.' },
            { h: 'The call summary went out by email first',
              p: { all: 'Expert services wanted it across all their services, which turned a feature into a platform capability. Email got customers the value right away.',
                   eng: 'Once expert services wanted it everywhere, it became a platform capability. Email shipped the value now, and the platform version could be built properly.' } }
          ] }] },

        { id: 'qb-results', section: 'Results', skills: ['strategy'], min: 1, pri: 1, lens: ['pm', 'ds'], title: 'Early signals',
          layout: 'full', center: true,
          blocks: [{ h: 'Early signals' },
                 { stats: [{ v: '55%', l: 'engagement' }, { v: '~24%', l: 'engaged with expert calls' }, { v: '30%', l: 'less manual work' },
                           { v: '+3.2%', l: 'monthly books close' }, { v: '~80', l: 'tNPS' },
                           { v: '~2%', l: 'converted to paid expert services' }], row: true },
                 { p: { all: 'Most importantly, customers said they felt more confident after expert sessions. That\'s the problem we started with.',
                        pm: 'Most importantly, customers felt more confident after expert sessions, which is the problem we started with. Next: personalize the signals and add more entry points across QuickBooks.',
                        ds: 'I measured trust, completion and safety, not model accuracy. Next step: track Level 2 acceptance to decide what moves to Level 1.' } }] },

        { id: 'qb-learned', section: 'What I learned', skills: ['systems', 'align'], min: 0.75, pri: 2, lens: ['dm', 'design'], title: 'What I learned',
          layout: 'full', center: true,
          blocks: [{ h: 'What I learned' }, { cards: [
            { icon: '🧭', h: 'Move without a defined problem', p: 'Use the customer journey to align teams, not just as research.' },
            { icon: '🧩', h: 'From screens to systems', p: 'Design how work moves between AI, customers and experts.' },
            { icon: '🎯', h: 'Don\'t claim more than you know', p: 'That\'s why we kept a human in the loop, and why we held the score back.' }
          ] }] }
      ]
    },

    // ------------------------------------------------------------------ Business formation
    {
      id: 'bf',
      talk: { 45: 10, 60: 15 },
      name: 'Business formation',
      short: 'Business formation',
      theme: 'green',
      keywords: ['0 to 1', 'Research', 'Service design', 'Pilot without engineering'],
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

        { id: 'bf-context', section: 'Context', skills: ['strategy', 'zero'], min: 1, pri: 2, lens: ['pm', 'ds'], title: 'Start with us, stay with us',
          layout: 'split', ratio: 40, zone: 'right',
          left: [{ h: 'Start with us, stay with us' },
                 { p: { all: 'QuickBooks was exploring four new services, and business formation stood out. I owned it from the very first concept through the pilot.',
                        pm: 'QuickBooks was exploring four new services in parallel. Business formation stood out on cost, market and ecosystem. I owned it from first concept through the pilot.' } }],
          right: [{ numbered: [
            { h: 'A big audience already here', p: '8.6M sole props in QuickBooks, many who know they should incorporate but haven\'t, plus 1 to 1.2M new filers a year' },
            { h: 'Low investment', p: 'Our experts already know small businesses, and only needed focused training' },
            { h: 'It\'s the very start of a business', p: 'If owners start with us, they\'re likely to stay for bookkeeping and more' }
          ] }] },

        { id: 'bf-research', section: 'Research', skills: ['research'], min: 0.75, pri: 2, lens: ['ds', 'design'], title: 'How we learned what owners needed',
          layout: 'full',
          blocks: [{ h: 'How we learned what owners actually needed' },
                   { stats: [{ v: '1,500+', l: 'Surveys' },
                             { v: '250+', l: 'Hours of interviews' },
                             { v: '45+', l: 'Sessions with experts' }], row: true },
                   { mediaRow: [{ ph: 'Workshop with the team' }, { ph: 'Remote interview' }, { ph: 'Interview guide' }] }] },

        { id: 'bf-steps', section: 'Why this matters', skills: ['research'], min: 0.5, pri: 1, title: 'Four clear steps',
          layout: 'full', center: true,
          blocks: [{ h: 'On paper, forming a business is four clear steps' },
                   { chain: ['Choose entity type', 'File articles', 'Get an EIN', 'Ongoing compliance'], nums: true },
                   { p: 'Each step has clear rules. Some owners even file on their own to save money.' }] },

        { id: 'bf-decision', section: 'Why this matters', skills: ['research', 'strategy'], min: 1, pri: 1, lens: ['pm', 'design'], title: 'Step 1 hides the hard questions',
          layout: 'full',
          blocks: [{ h: 'But step 1 hides the hard questions' },
                   { chain: ['Choose entity type', 'File articles', 'Get an EIN', 'Ongoing compliance'], nums: true, on: 0 },
                   { risks: {
                     cols: ['What\'s really under step 1', 'If it\'s wrong'],
                     rows: [
                       ['Taxes', 'Which structure saves me the most tax?', 'Overpaying every year'],
                       ['Liability', 'Is my house at risk if something goes wrong?', 'Personal assets exposed'],
                       ['Raising money', 'Can I bring in investors later?', 'Hard and costly to change later']
                     ] } }] },

        { id: 'bf-cost', read: true, section: 'Why this matters', skills: ['research', 'ai'], min: 0.75, pri: 2, lens: ['design', 'ds', 'eng'], title: 'A wrong start costs for years',
          layout: 'split', ratio: 52,
          left: [{ h: 'A wrong start costs for years' },
                 { p: 'One owner set up the wrong structure at the start. Now he pays a few hundred dollars extra every year. Can\'t he fix it? Yes, but it would cost thousands in CPA fees, so he just lives with it.' },
                 { p: { all: 'And AI doesn\'t make this safer. Ask "how do I pay the least tax?" and you can get an answer that saves money but doesn\'t fit your business, or isn\'t even allowed.',
                           eng: 'And a chatbot doesn\'t make this safer. "How do I pay the least tax?" can get a confident answer that doesn\'t fit the business, or isn\'t allowed. A wrong answer here is expensive.',
                           ds: 'And a model doesn\'t make this safer. "How do I pay the least tax?" can get an answer that optimizes the wrong thing, or isn\'t allowed. A confident wrong answer here is expensive.' } }],
          right: [{ stats: [{ v: '$100s', l: 'extra, every year' }, { v: '$1,000s', l: 'in CPA fees, once' }], row: true }] },

        { id: 'bf-who', section: 'Why this matters', skills: ['research', 'service'], min: 1, pri: 1, lens: ['design', 'pm', 'dm'], title: 'Owners don\'t know who to ask',
          layout: 'full',
          blocks: [{ h: 'Owners don\'t know who to ask' },
                   { p: { all: 'Everyone holds a piece, nobody holds the whole picture, so owners get stuck in between. Even their CPA isn\'t a great fit: state formation rules aren\'t their area, and they charge hundreds an hour.',
                          design: 'Remember "who holds the missing piece" from the first project? Here the missing piece was split across three professions, and owners got stuck in between.',
                          pm: 'Everyone holds a piece, nobody holds the whole picture. Even their CPA is poor value for both sides: formation isn\'t their area, and they charge tax-advice rates.' } },
                   { matrix: {
                     cols: ['Books', 'Tax', 'Legal', 'Your business'],
                     rows: [
                       { h: 'Bookkeeper', sub: 'Knows your books, not the law', cells: [1, 0, 0, 0.5] },
                       { h: 'Tax expert / CPA', sub: 'Knows taxes, not the legal side', cells: [0.5, 1, 0, 0.5] },
                       { h: 'Lawyer', sub: 'Knows the law, not always the tax impact', cells: [0, 0, 1, 0.5] },
                       { h: 'What the owner needs', sub: 'The whole picture', cells: [2, 2, 2, 2], strong: true }
                     ] } }] },

        { id: 'bf-gap', read: true, section: 'Strategy', skills: ['strategy', 'zero'], min: 1, pri: 1, lens: ['pm', 'dm', 'design'], title: 'Where we could win',
          layout: 'full',
          blocks: [{ h: 'Where we could win' },
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

        { id: 'bf-onboard', section: 'What I did', skills: ['ixd', 'service'], min: 1, pri: 1, lens: ['design', 'pm'], title: 'New businesses: just enough to get formed',
          layout: 'split', ratio: 38, zone: 'left',
          left: [{ h: 'New businesses: just enough to get formed' },
                 { p: 'Owners outside QuickBooks start from zero, so onboarding stays short and gets them to an expert fast.' },
                 { steps: [{ h: 'Quick onboarding', p: 'We learn about the business and its goals' },
                           { h: 'Expert advice', p: 'A call to choose the right structure' },
                           { h: 'Formed', p: 'File with the expert, or on their own' },
                           { h: 'The right QuickBooks plan', p: 'Recommended from what we learned' }] }],
          right: [{ media: { ph: 'Onboarding flow: business info, goals, schedule a call with an expert' } }] },

        { id: 'bf-roadmap', section: 'What I did', skills: ['ixd', 'proto', 'service'], min: 1, pri: 1, lens: ['design', 'pm', 'eng'], title: 'Existing customers: a roadmap and a prepared expert',
          layout: 'split', ratio: 38, zone: 'left',
          left: [{ h: 'Existing customers: a roadmap, and an expert who\'s ready' },
                 { p: 'The decision is high stakes, so the roadmap doesn\'t hand you an answer. It prepares you, and the expert, for the conversation.' },
                 { steps: [{ h: 'A reminder at the right time', p: { all: 'Like adding a partner, or profit growing enough for an S-Corp', eng: 'Triggered from signals we already have, like a new partner or profit crossing an S-Corp threshold' } },
                           { h: 'A personal roadmap', p: 'The recommended path, cost and timeline, with nothing to re-enter' },
                           { h: 'An expert who\'s ready', p: 'They know the business before the call starts' }] }],
          right: [{ media: { ph: '"Welcome back, John" formation roadmap with cost, timeline and expert contact' } }] },

        { id: 'bf-blueprint', section: 'Service blueprint', skills: ['service', 'systems'], min: 0.75, pri: 3, lens: ['design', 'dm', 'eng'], title: 'The relationship continues after filing',
          layout: 'full',
          blocks: [{ h: 'The relationship continues after filing' },
                   { p: { all: 'This is a service as much as a product, so I mapped what the customer sees, what the expert does, and what happens behind the scenes.',
                          eng: 'The blueprint shows which steps are product, partner platform, or expert work, and what has to happen behind the scenes.',
                          dm: 'The blueprint is how service delivery and product agreed on one plan.' } },
                   { media: { ph: 'Service blueprint, zoomed into the after-filing lane', grow: true } }] },

        { id: 'bf-pilot', section: 'Pilot', skills: ['zero', 'proto', 'align'], min: 1.25, pri: 1, lens: ['dm', 'eng', 'pm'], title: 'No engineering, so we built it ourselves',
          layout: 'split', ratio: 44,
          left: [{ h: 'No engineering, so we built it ourselves' },
                 { p: { all: 'We lost engineering support for the pilot. Instead of waiting, I designed the pilot around what we had: 6 experts, 20 customers, 4 states, and only the common business structures.',
                        dm: 'We lost engineering support for the pilot. We could have paused. Instead I designed the pilot around what we had: 6 experts, 20 customers, 4 states.',
                        eng: 'No engineering, so nothing on the expert platform. My PM and I built a simple tool ourselves, using Claude to write the code. It\'s rules-based, not AI: for legal requirements you want predictable and easy to check.',
                        pm: 'We lost engineering support. Instead of waiting for resources, we ran a cheap pilot that could still prove the demand: 6 experts, 20 customers, 4 states.' } },
                 { swap: { cols: ['Planned', 'What we ran'], rows: [
                   ['New + existing customers', 'Existing customers only'],
                   ['In-product flows', 'Email + Zoom'],
                   ['Expert platform', 'A tool we built with Claude']
                 ] } }],
          right: [{ mediaGrid: [{ ph: 'Expert tool: client information' }, { ph: 'Expert tool: state rules' }, { ph: 'Expert tool: entity options' }, { ph: 'Customer summary' }], cols: 2 }] },

        { id: 'bf-results', section: 'Pilot results', skills: ['zero', 'strategy'], min: 0.75, pri: 1, lens: ['pm', 'ds', 'dm'], title: 'The pilot proved the demand',
          layout: 'full', center: true,
          blocks: [{ h: 'The pilot proved the demand' },
                 { stats: [{ v: '4.6/5', l: 'satisfaction' }, { v: '100%', l: 'would recommend' }], row: true },
                 { p: { all: 'People kept mentioning the human connection and the personalized guidance, the gap we set out to fill. That got us resources for MVP and launch.',
                        ds: 'People kept mentioning the human connection and the personalized guidance. Twenty customers is a small sample, so we read it as a demand signal, and it was enough to get resources for MVP and launch.',
                        dm: 'People kept mentioning the human connection and the personalized guidance. Early proof did what a deck couldn\'t: it got resources for MVP and launch.' } }] },

        { id: 'bf-learned', section: 'What I learned', skills: ['zero', 'align'], min: 0.5, pri: 2, lens: ['dm', 'pm'], title: 'What I learned',
          layout: 'full', center: true,
          blocks: [{ h: 'What I learned' }, { cards: [
            { icon: '🔎', h: 'Research decides where to play', p: 'In zero to one, research isn\'t a phase.' },
            { icon: '🧪', h: 'Validate before you build', p: 'You can prove the core value without full product support, if you\'re creative.' },
            { icon: '🌱', h: 'Clarity and momentum', p: 'Influence comes from those, not from waiting for permission.' }
          ] }] }
      ]
    }
  ]
};
