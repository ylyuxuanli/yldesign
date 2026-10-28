// Public content for /deck. Speaker notes are NOT here: they live encrypted in notes.enc.js.
//
// Each slide:
//   id      key for speaker notes
//   min     minutes when presented
//   pri     1 = core story, 2 = strong support, 3 = nice to have
//   lens    audiences this slide matters most to (pm, design, dm, eng, ds)
//   why     one line per audience on why this slide matters to them (shown as a caption)
//   label   small section label at the top of the slide
//   title   name used in the agenda and "what to look for" lists
//   layout  how the slide is drawn (see app.js): statement, values, title, split, full
//
// Any text can also be written per audience, for example
//   h: { all: 'Impact', eng: 'What the system changed' }
// and the viewer's role picks the right one.
//
// Images: { ph: 'what goes here' } draws a placeholder. Add src: 'img/file.jpg' to use a real image.

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

  projects: [
    // ------------------------------------------------------------------ Intro
    {
      id: 'intro',
      name: 'About me',
      short: 'About me',
      slides: [
        { id: 'intro-tagline', min: 0.5, pri: 2, title: 'Making complex things simple',
          layout: 'statement', text: 'Making complex things simple' },

        { id: 'intro-values', min: 0.5, pri: 3, title: 'Curious, delightful, thoughtful',
          layout: 'values',
          items: [
            { name: 'Curious', color: '#FFC715', text: 'Ask a lot of questions before drawing anything.' },
            { name: 'Delightful', color: '#FF8B22', text: 'It should feel good to use, not just work.' },
            { name: 'Thoughtful', color: '#ED5148', text: 'Think through the edges before they become problems.' }
          ] },

        { id: 'intro-intuit', min: 1, pri: 1, label: 'Now', title: 'Intuit, QuickBooks Live Expert',
          layout: 'split', ratio: 34,
          left: [{ k: 'Intuit' }, { h: 'QuickBooks Live Expert' },
                 { p: 'End-to-end design for how AI and human experts work together inside QuickBooks.' }],
          right: [{ media: { ph: 'QuickBooks overview with Books Health and a live expert video call' } }] },

        { id: 'intro-offerland', min: 0.75, pri: 3, lens: ['pm', 'design'], label: 'Side project', title: 'Offerland.ai',
          why: { pm: 'A 0 to 1 product where I own scope and priorities end to end.',
                 design: 'A playground for fast AI interaction patterns outside a big company.' },
          layout: 'split', ratio: 34,
          left: [{ h: 'Offerland.ai' },
                 { p: 'A job search workspace with AI interview guidance.' }],
          right: [{ media: { ph: 'Offerland job dashboard and interview experience page' } }] },

        { id: 'intro-lytx', min: 0.75, pri: 3, lens: ['eng', 'design'], label: 'Before', title: 'Lytx',
          why: { eng: 'Built a design system with engineering, so I think in components and tokens.',
                 design: 'Design system work across web and mobile for very different users.' },
          layout: 'split', ratio: 34,
          left: [{ h: 'Lytx' },
                 { list: ['Fleet management system', 'Driver app', 'Design system'] }],
          right: [{ media: { ph: 'Driver app screens and fleet dashboard components' } }] },

        { id: 'intro-life', min: 0.5, pri: 2, label: 'Outside work', title: 'Yoyo, ceramics, travel and bouldering',
          layout: 'full',
          blocks: [{ gallery: [
            { src: '../imgs/oow-yoyo.jpg', cap: 'Yoyo' },
            { src: '../imgs/oow-ceramics.jpg', cap: 'Ceramics' },
            { src: '../imgs/oow-travelling.jpg', cap: 'Travel' },
            { src: '../imgs/oow-bouldering.jpg', cap: 'Bouldering' }
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
        all:    'How I defined where AI stops and a human expert starts, and turned that into one experience inside QuickBooks.',
        pm:     'How the problem got framed, what we cut from the MVP, and the engagement and monetization signals.',
        design: 'The journey mapping, co-design sessions, and how AI and expert touchpoints show up in the final UI.',
        dm:     'How I aligned core QBO, service delivery and the expert platform when each team optimized for a different outcome.',
        eng:    'The three-level responsibility model and the routing system: confidence, severity, and thresholds that recalibrate.',
        ds:     'The scoring inputs behind routing and the results: engagement, repeat use, books close rate and tNPS.'
      },
      slides: [
        { id: 'qb-title', min: 0.5, pri: 1, must: true, title: 'QuickBooks: AI + Embedded Human Expertise',
          layout: 'title',
          h: 'QuickBooks: AI + Embedded Human Expertise',
          sub: 'Defining how human expertise shows up in an AI-native system',
          media: [{ ph: 'Owner on a video call with an expert' },
                  { ph: 'Owner with an expense insight card' },
                  { ph: 'Contractor with "246 tasks done" AI card' }] },

        { id: 'qb-context', min: 1.5, pri: 1, lens: ['pm', 'dm', 'ds'], label: 'Context', title: 'My role and the team',
          why: { pm: 'Shipped across 4 SKUs, with demand validated by ~24% CTR.',
                 dm: 'Seven partner teams, each with its own goals. Keep that in mind for later.',
                 ds: 'CTR, manual work reduction and tNPS were the success metrics from day one.' },
          layout: 'split', ratio: 36,
          left: [
            { groups: [
              { h: 'Role', p: 'E2E Product Designer' },
              { h: 'XFN teams', p: 'Core QBO · PM · Engineering · Data Science · Service Delivery · Marketing · Expert platform' }
            ] },
            { stats: [
              { v: '4', l: 'QBO SKUs' },
              { v: '~24%', l: 'CTR validating demand for embedded expert support' },
              { v: '30%', l: 'less manual work for SMBs' },
              { v: '~80', l: 'tNPS for the expert call experience' }
            ], small: true }
          ],
          right: [{ media: { ph: 'QuickBooks overview: Books Health, Needs attention, expert video call' } }] },

        { id: 'qb-from', min: 0.75, pri: 3, label: 'Context', title: 'From: a manual chain',
          layout: 'split', ratio: 46,
          left: [{ h: 'From' }, { chain: ['Customers', 'Manual workflow', 'Expert services $$'], vertical: true }],
          right: [{ media: { ph: 'Contractor on a job site checking a tablet', fill: true } }] },

        { id: 'qb-from-to', min: 1, pri: 2, lens: ['pm', 'design'], label: 'Context', title: 'To: support around the customer',
          why: { pm: 'The strategy shift: experts move from an upsell to part of the product.',
                 design: 'The mental model that shaped every screen after this.' },
          layout: 'split', ratio: 40,
          left: [{ h: 'From' }, { chain: ['Customers', 'Manual workflow', 'Expert services $$'], vertical: true, dim: true }],
          right: [{ h: 'To' }, { orbit: { center: 'Customer + QuickBooks', nodes: ['Expert', 'AI', 'Expert', 'AI', 'Expert', 'AI', 'Expert', 'AI'] } }] },

        { id: 'qb-why', min: 1.5, pri: 2, lens: ['pm', 'ds'], label: 'Why this matters', title: 'Small businesses don\'t trust their books',
          why: { pm: 'The customer problem and why AI alone would not solve it.',
                 ds: 'Survey data that sized the trust gap before we built anything.' },
          layout: 'split', ratio: 46,
          left: [
            { h: 'Customer key problems' },
            { p: 'Small businesses lack confidence in their book accuracy.' },
            { stats: [{ v: '59%', l: 'worry their books are inaccurate' },
                      { v: '65%', l: 'worry they are not tax ready' },
                      { v: '43%', l: 'have been in business for less than 3 years' }] },
            { list: ['"I don\'t know what I don\'t know"', 'Low trust in AI alone'] }
          ],
          right: [{ media: { ph: 'Business owners reviewing their books together', fill: true } }] },

        { id: 'qb-challenge', min: 1.5, pri: 1, lens: ['dm', 'pm'], label: 'Challenge', title: 'What should come first: AI, the expert, or both?',
          why: { dm: 'Org misalignment was the hardest part, more than the UI.',
                 pm: 'No shared definition meant no shared roadmap. This is what we had to fix first.' },
          layout: 'split', ratio: 42,
          left: [{ h: 'What should come first: AI, the expert, or both?', size: 'xl' }],
          right: [{ numbered: [
            { h: 'Undefined customer needs', p: 'Customer needs were not clearly structured or understood' },
            { h: 'Ambiguity', p: 'No shared definition of AI + human in product' },
            { h: 'Org misalignment', p: 'Teams optimizing for different outcomes' }
          ] }], rightPanel: true },

        { id: 'qb-journey', min: 1.5, pri: 3, lens: ['design', 'dm'], label: 'What I did', title: 'Defining where expertise matters most',
          why: { design: 'A full service journey, not just a product flow.',
                 dm: 'Mapping it together is how the teams started to share one picture.' },
          layout: 'full',
          blocks: [{ h: 'Defining where expertise matters most' },
                   { sub: 'with core QBO teams, service designer, service delivery' },
                   { media: { ph: 'Customer journey map across onboarding, ongoing use and year-end', grow: true } }] },

        { id: 'qb-journey-moments', min: 1.5, pri: 2, lens: ['design', 'dm', 'pm'], label: 'What I did', title: 'Four moments that need a human',
          why: { design: 'These four moments became the anchors for where experts show up.',
                 dm: 'A small set of moments every team could agree on.',
                 pm: 'This is how we scoped where to invest first.' },
          layout: 'full', center: true,
          blocks: [{ h: 'Defining where expertise matters most' },
                   { sub: 'Four moments in the journey where a human makes the difference' },
                   { timeline: [
                     { h: 'Onboarding', p: 'Customers are unsure how to set up and make initial decisions' },
                     { h: 'Critical financial decisions', p: 'High-risk decisions impacting accuracy and compliance' },
                     { h: 'Ongoing support', p: 'Unexpected issues and anomalies over time' },
                     { h: 'Year-end review', p: 'Prepare for tax season' }
                   ] }] },

        { id: 'qb-levels', min: 2, pri: 1, lens: ['eng', 'pm', 'ds'], label: 'What I did', title: 'Clarifying AI vs human responsibilities',
          why: { eng: 'Each level maps to a different handling path in the system.',
                 pm: 'One shared language that unblocked prioritization across teams.',
                 ds: 'The levels set what the model must be confident about before acting alone.' },
          layout: 'split', ratio: 34,
          left: [{ h: 'Clarifying AI vs Human responsibilities' },
                 { levels: [{ n: 1, t: 'AI has the data' }, { n: 2, t: 'Customer has the context' }, { n: 3, t: 'Expert has the judgment' }] }],
          right: [{ jtbd: [
            ['Categorize transactions by vendor rules', 1],
            ['Detect duplicate transactions', 1],
            ['Track 1099 payments vs W-9 status', 1],
            ['Detect vendor name changes', 1],
            ['Calculate and refresh business health score', 1],
            ['Pre-fill W-4 payroll forms', 1],
            ['Confirm invoice-to-payment matches', 2],
            ['Approve new vendor categorization rules', 2],
            ['Confirm contractor classification (W-2 vs 1099)', 2],
            ['Approve category merge recommendations', 2],
            ['Approve early milestone invoicing suggestions', 2],
            ['Advise on entity structure (LLC vs S-Corp)', 3],
            ['Design chart of accounts structure', 3],
            ['Configure payroll for new hires', 3],
            ['Review and sign off books for handoff', 3]
          ] }] },

        { id: 'qb-system', min: 2, pri: 1, lens: ['eng', 'ds'], label: 'What I did', title: 'How the system works',
          why: { eng: 'Scoring, routing and a feedback loop. Undo and logging make Level 1 safe.',
                 ds: 'Four scoring inputs, and thresholds that retune from outcomes.' },
          layout: 'full',
          blocks: [{ system: {
            steps: ['AI review and identify gaps', 'Intelligent routing', 'Resolution & learning'],
            scan: ['Transactions', 'Receipts & invoices', 'Bank feeds', 'Integrations', 'Customer inputs', 'Service history'],
            evaluate: ['Confidence', 'Data quality', 'Severity', 'Business impact'],
            routes: [
              { n: 1, t: 'Intuit AI auto-resolves', out: 'Resolved and logged', sub: 'Every action can be reviewed and undone' },
              { n: 2, t: 'Customer confirmation or minor inputs', out: 'Confirmed or edited', sub: 'Used to suggest similar items next time' },
              { n: 3, t: 'Escalate to expert support', out: 'Expert gets full context', sub: 'Issue, evidence, and what the customer confirmed' }
            ],
            loop: 'Thresholds recalibrate',
            footer: 'The boundary moves as trust is earned'
          } }] },

        { id: 'qb-codesign', min: 1, pri: 3, lens: ['design', 'dm'], label: 'What I did', title: 'Co-design sessions',
          why: { design: 'Customers shaped which trust signals made it into the UI.',
                 dm: 'Bringing partners into the sessions built buy-in early.' },
          layout: 'split', ratio: 34,
          left: [{ h: 'Co-design sessions' },
                 { list: ['How support fit into the experience', 'What they wanted visibility into', 'Signals that built confidence and trust', 'What made the service feel valuable'], title: 'What we explored' }],
          right: [{ media: { ph: 'Co-design board with sticky notes and concept sketches' } }] },

        { id: 'qb-prototypes', min: 1, pri: 2, lens: ['design'], label: 'What I did', title: 'Validating ideas through rapid prototypes',
          why: { design: 'Many directions tested quickly before committing to one.' },
          layout: 'full',
          blocks: [{ h: 'Validating ideas through rapid prototypes' },
                   { chips: ['Information hierarchy & content structure', 'Navigation & key workflows', 'Interaction patterns', 'AI and expert touchpoints'] },
                   { mediaGrid: [{ ph: 'Your bookkeeping team' }, { ph: 'Overview with tasks' }, { ph: 'Overview with insights' },
                                 { ph: 'Close June 2026' }, { ph: 'Overview with AI chat' }, { ph: 'Expert chat' }] }] },

        { id: 'qb-solution', min: 1.5, pri: 1, lens: ['design', 'eng'], label: 'Solution', title: 'One overview, AI and experts built in',
          why: { design: 'Notice how the expert card changes across the customer lifecycle.',
                 eng: 'Each Needs attention item is a routed issue from the system you just saw.' },
          layout: 'split', ratio: 30,
          left: [{ h: 'Solution' },
                 { groups: [
                   { h: 'Books Health', p: 'A clear score for where the books stand' },
                   { h: 'Needs attention', p: 'What AI found, each with one action' },
                   { h: 'Talk to an expert', p: 'One click away, on the same page' }
                 ] }],
          right: [{ media: { ph: 'Final design: "Good morning, James" overview with Books Health and Needs attention' } }] },

        { id: 'qb-james', min: 1, pri: 3, lens: ['design', 'pm'], label: 'Applied use cases', title: 'Meet James Porter',
          why: { design: 'The persona every design decision was tested against.',
                 pm: 'The target customer for the MVP cohort.' },
          layout: 'split', ratio: 42, leftTheme: true,
          left: [{ h: 'Meet James Porter!' }, { p: 'runs Porter General Contracting' },
                 { stats: [{ v: '2', l: 'Years in biz' }, { v: '5', l: 'Employees' }, { v: '675K', l: 'Revenue' }], row: true },
                 { groups: [{ h: 'Bookkeeping', p: 'Has a bookkeeper for year-end' }, { h: 'Goal', p: 'Grow business, not manage books' }] }],
          right: [{ media: { ph: 'James and his team on a job site', fill: true } }] },

        { id: 'qb-mvp', min: 1.5, pri: 2, lens: ['pm', 'eng', 'dm'], label: 'MVP & tradeoffs', title: 'What we prioritized and what we cut',
          why: { pm: 'Why 10% of customers: enough signal without overloading expert capacity.',
                 eng: 'What we kept manual so we did not over-build before validation.',
                 dm: 'Saying no to good ideas, and getting partners to agree.' },
          layout: 'split', ratio: 36,
          left: [{ list: ['Validating services value', 'Integrating expert support into single workflow', 'Expert service for 10% customers', 'Call summary email from expert'], title: 'We prioritized' },
                 { list: ['Full coverage across all workflows', 'All customer cohorts', 'Deep customization or personalization', 'Async experience', 'Automation post-call experience'], title: 'We deprioritized', muted: true }],
          right: [{ media: { ph: 'MVP: Bookkeeping review card with books status and expert call' } }] },

        { id: 'qb-results', min: 1.5, pri: 1, lens: ['pm', 'ds'], label: 'Results', title: 'Impact',
          why: { pm: 'Engagement, books close and early monetization, plus what comes next.',
                 ds: '55% engagement, +3.2% books close, ~24% expert call engagement, ~80 tNPS.' },
          layout: 'split', ratio: 58,
          left: [{ h: 'Impact & learnings' },
                 { stats: [{ v: '55%', l: 'engagement' }, { v: '30%', l: 'less manual work' }, { v: '+3.2%', l: 'monthly books close' },
                           { v: '~24%', l: 'expert call engagement' }, { v: '~80', l: 'tNPS for the experience' }, { v: '~2%', l: 'conversion of existing expert services' }], small: true },
                 { p: 'Customers reported a higher confidence level after expert sessions.' },
                 { list: ['Increase personalization of signals and recommendations', 'Expand contextual access points across the QBO platform', 'Turn expert outputs (call summaries, plans, rules) and async channels into reusable platform capabilities', 'Accountant control'], title: 'Next' }],
          right: [{ media: { ph: 'Contractor smiling on site', fill: true } }] },

        { id: 'qb-learned', min: 1, pri: 2, lens: ['dm', 'design'], label: 'What I learned', title: 'What I learned',
          why: { dm: 'How I grew in alignment and ownership on a large platform.',
                 design: 'The shift from designing screens to designing systems.' },
          layout: 'full',
          blocks: [{ cards: [
            { icon: '🎯', p: 'Learned to move forward in ambiguity, and take ownership in shaping the problem' },
            { icon: '🎨', p: 'Moved from designing screens and features to designing systems, including AI logic, decision boundaries, and service model' },
            { icon: '👫', p: 'Got more comfortable aligning teams across a big platform with different incentives' }
          ] }] }
      ]
    },

    // ------------------------------------------------------------------ Business formation
    {
      id: 'bf',
      name: 'Business formation',
      short: 'Business formation',
      theme: 'green',
      focus: {
        all:    'How I found that the hard part of forming a business is the decision, not the paperwork, and piloted an expert service with zero engineering.',
        pm:     'Market sizing, the insight that reframed the product, and how the pilot secured resources for MVP and GA.',
        design: 'The research, the service blueprint and the two entry flows for new and existing customers.',
        dm:     'Running a pilot with no engineering support, and influencing through clarity and momentum.',
        eng:    'What we replaced with Zoom, email and an AI-assisted tool, and what that means for the real build.',
        ds:     'The research scale (1,500+ surveys) and the pilot results: 4.6/5 satisfaction and 100% would recommend.'
      },
      slides: [
        { id: 'bf-title', min: 0.5, pri: 1, must: true, title: 'Business formation',
          layout: 'title',
          h: 'Business formation',
          sub: 'Form business with confidence and maximize tax savings',
          media: [{ ph: 'Owner smiling on a video call with a formation expert' }],
          checklist: [['Choose your entity type', true], ['File your articles of org', true], ['Obtain your EIN', false]] },

        { id: 'bf-context', min: 1, pri: 2, lens: ['pm', 'ds'], label: 'Context', title: 'One of four new services',
          why: { pm: 'The business case: market size, low cost, and ecosystem growth.',
                 ds: '8.6M sole props in QBO and 1 to 1.2M new filers a year.' },
          layout: 'split', ratio: 40,
          left: [{ k: '4 new services in progress' },
                 { pick: ['Business formation', 'Tax advisory', 'Marketing', 'CFO advisory'], on: 0 }],
          right: [{ numbered: [
            { h: 'A large market', p: '8.6M sole props already in QBO + 1 to 1.2M new filers every year' },
            { h: 'Low investment', p: 'Fewer resources to train experts, since they already know SMBs' },
            { h: 'Grows the ecosystem', p: 'Brings new businesses into QuickBooks on day one, and keeps existing customers as they grow into a new entity' }
          ] }], rightPanel: true },

        { id: 'bf-research', min: 1, pri: 2, lens: ['ds', 'design'], label: 'What I did', title: 'How we learned what owners actually needed',
          why: { ds: 'Survey scale for breadth, interviews and expert sessions for depth.',
                 design: 'Mixed methods: quant reach, qual depth, and expert validation.' },
          layout: 'full',
          blocks: [{ h: 'How we learned what owners actually needed' },
                   { stats: [{ k: 'Quantitative reach', v: '1,500+', l: 'Surveys' },
                             { k: 'Qualitative depth', v: '250+', l: 'User interview hours' },
                             { k: 'Industry validation', v: '45+', l: 'Expert sessions' }], row: true },
                   { mediaRow: [{ ph: 'Workshop with the team' }, { ph: 'Remote interview' }, { ph: 'Interview guide' }] }] },

        { id: 'bf-paperwork', min: 0.5, pri: 3, label: 'Insight', title: 'Paperwork is easy',
          layout: 'full', center: true,
          blocks: [{ h: 'Paperwork is easy' },
                   { chain: ['Choose entity type', 'File articles', 'Get an EIN', 'Ongoing compliance'], nums: true }] },

        { id: 'bf-decision', min: 1, pri: 1, lens: ['pm', 'design'], label: 'Insights', title: 'The decision is hard',
          why: { pm: 'This reframed the product from a filing tool to an advisory service.',
                 design: 'The insight that moved the design focus to the decision, not the form.' },
          layout: 'full',
          blocks: [{ h: 'Paperwork is easy, <em>the decision is hard.</em>' },
                   { chain: ['Choose entity type', 'File articles', 'Get an EIN', 'Ongoing compliance'], nums: true, on: 0 },
                   { risks: {
                     cols: ['What\'s really under step 1', 'If it\'s wrong'],
                     rows: [
                       ['Taxes', 'Which structure saves me the most tax?', 'Overpaying every year'],
                       ['Liability', 'Is my house at risk if something goes wrong?', 'Personal assets exposed'],
                       ['Raising money', 'Can I bring in investors later?', 'Investors pass'],
                       ['Partners', 'What if I add a partner?', 'Ownership disputes'],
                       ['State rules', 'What does my state require?', 'Fines and penalties'],
                       ['Future growth', 'Will this still fit in three years?', 'Costly to switch later']
                     ] } }] },

        { id: 'bf-who', min: 1, pri: 2, lens: ['design', 'pm'], label: 'Insights', title: 'Owners don\'t know who to ask',
          why: { design: 'The gap the service was designed to fill.',
                 pm: 'Our position against bookkeepers, CPAs, lawyers and chatbots.' },
          layout: 'full',
          blocks: [{ h: 'Owners don\'t know who to ask' },
                   { matrix: {
                     cols: ['Books', 'Tax', 'Legal', 'Industry'],
                     rows: [
                       { h: 'Bookkeeper', sub: 'Knows your books', cells: [1, 0, 0, 0.5] },
                       { h: 'Tax expert / CPA', sub: 'Knows your taxes', cells: [0, 1, 0, 0.5] },
                       { h: 'Lawyer', sub: 'Knows the law', cells: [0, 0, 1, 0.5] },
                       { h: 'AI chatbot', sub: 'Knows a bit of everything', cells: [0.5, 0.5, 0.5, 0.5] },
                       { h: 'What the owner needs', sub: 'The whole picture', cells: [2, 2, 2, 2], strong: true }
                     ] } }] },

        { id: 'bf-blueprint', min: 1, pri: 2, lens: ['design', 'dm', 'eng'], label: 'Service blueprint', title: 'What makes us stand out',
          why: { design: 'Front stage and back stage, customer and expert, in one view.',
                 dm: 'The blueprint is how service delivery and product agreed on the plan.',
                 eng: 'Shows which steps are product, partner platform, or expert work.' },
          layout: 'full',
          blocks: [{ h: 'What makes us stand out' },
                   { branch: { from: 'Advisory call with a CPA', to: ['DIY implementation', 'DIY using a partner platform', 'Expert implementation'], note: 'Expert stays available for 30 days after the advisory call' } },
                   { media: { ph: 'Service blueprint: customer and expert lanes across the advisory call and implementation', grow: true } }] },

        { id: 'bf-prototype', min: 0.75, pri: 3, lens: ['design'], label: 'What I did', title: 'Rapid prototype',
          why: { design: 'A roadmap that makes a complex process feel doable.' },
          layout: 'split', ratio: 30,
          left: [{ h: 'Rapid prototype' }, { p: 'A personalized formation roadmap with total cost, timeline, and a direct line to an expert.' }],
          right: [{ media: { ph: '"Welcome back, John" formation roadmap with cost, timeline and expert contact' } }] },

        { id: 'bf-new', min: 1, pri: 1, lens: ['design', 'pm'], label: 'Solutions', title: 'New to QuickBooks',
          why: { design: 'The end-to-end flow for someone starting from zero.',
                 pm: 'How formation turns into a QBO customer on day one.' },
          layout: 'split', ratio: 30,
          left: [{ h: 'New to QuickBooks' },
                 { steps: [{ h: 'Quick onboarding', p: 'We learn about the business and its goal' },
                           { h: 'Expert advice', p: 'An advisory call to choose the right structure' },
                           { h: 'Fill the forms', p: 'File with the expert or on their own' },
                           { h: 'The right QBO plan', p: 'Books set up on the right plan from day one' }] }],
          right: [{ mediaGrid: [{ ph: 'Landing page: form your business' }, { ph: 'Business details' }, { ph: 'Entity questions' }, { ph: 'Expert call booked' }], cols: 2 }] },

        { id: 'bf-existing', min: 0.75, pri: 3, lens: ['design', 'eng'], label: 'Solutions', title: 'Existing QBO customers',
          why: { design: 'A proactive entry point instead of waiting for the customer to search.',
                 eng: 'Existing QBO data pre-fills everything, so the expert has context.' },
          layout: 'split', ratio: 34,
          left: [{ h: 'Existing QBO Customers' },
                 { steps: [{ h: 'Proactive reminder', p: 'Prompted when the business is ready to form' },
                           { h: 'Nothing to re-enter', p: 'Business details come from their QuickBooks account' },
                           { h: 'Expert already prepped', p: 'Expert sees their context before the call' }] }],
          right: [{ mediaGrid: [{ ph: 'Expert hub with formation card' }, { ph: 'Expert view of customer context' }], cols: 2 }] },

        { id: 'bf-pilot', min: 1, pri: 1, lens: ['dm', 'eng', 'pm'], label: 'Pilot', title: 'Designing a pilot under zero engineering support',
          why: { dm: 'Creating momentum without waiting for resources.',
                 eng: 'What we faked with Zoom, email and a Claude-built tool, and what the real build needs.',
                 pm: 'A cheap pilot that de-risked the investment.' },
          layout: 'split', ratio: 40,
          left: [{ h: 'Designing a pilot under ZERO engineering support' }, { p: '6 experts + 20 customers' },
                 { swap: { cols: ['Planned', 'What we ran'], rows: [
                   ['New + existing customers', 'Existing QBO customers'],
                   ['In-product flows', 'Email + Zoom'],
                   ['Intuit Expert Platform', 'Tool built with Claude'],
                   ['Broader state coverage', '4 states']
                 ] } }],
          right: [{ mediaGrid: [{ ph: 'Expert tool: client information' }, { ph: 'Expert tool: state selection' }, { ph: 'Expert tool: entity details' }, { ph: 'Expert tool: included steps' }], cols: 2 }] },

        { id: 'bf-results', min: 1, pri: 1, lens: ['pm', 'ds', 'dm'], label: 'Pilot results', title: 'Results',
          why: { pm: 'Validated demand and secured resources for MVP and GA.',
                 ds: '4.6/5 satisfaction and 100% would recommend, from a 20-customer pilot.',
                 dm: 'Early signals that raised the project\'s priority in the org.' },
          layout: 'split', ratio: 46,
          left: [{ h: 'Results' },
                 { stats: [{ v: '4.6/5', l: 'satisfaction score in pilot sessions' }, { v: '100%', l: 'of participants said they would recommend the service' }], row: true },
                 { p: 'Customers consistently highlighted <b>human connection</b> and <b>personalized, contextual guidance</b>.' },
                 { list: ['Validated demand for expert-led business formation support', 'Secured resources to move toward MVP & GA', 'Elevated priority within the org based on early signals'], title: 'What this unlocked' }],
          right: [{ media: { ph: 'Owner smiling at her phone, with formation checklist', fill: true } }] },

        { id: 'bf-learned', min: 0.75, pri: 2, lens: ['dm'], label: 'What I learned', title: 'What I learned',
          why: { dm: 'Influence through clarity and momentum, not authority.' },
          layout: 'full',
          blocks: [{ cards: [
            { icon: '🚀', p: 'Move forward without full product support' },
            { icon: '🧩', p: 'Focus on validating core value first' },
            { icon: '🌱', p: 'Influence through clarity and momentum' }
          ] }] }
      ]
    }
  ]
};
