// Public content for /deck. Speaker notes are NOT here: they live encrypted in notes.enc.js.
//
// Each slide:
//   id     image name in slides/ (also the key for speaker notes)
//   min    minutes when presented
//   pri    1 = core story, 2 = strong support, 3 = nice to have
//   lens   audiences this slide matters most to (pm, design, dm, eng, ds)
//   label  small section label, title + body = reading version text
//
// To add a project: add an entry to DECK.projects with its own slides.

window.DECK = {
  lenses: [
    { id: 'all',    name: 'Everyone', plural: 'everyone' },
    { id: 'pm',     name: 'Product Manager', plural: 'Product Managers' },
    { id: 'design', name: 'Designer', plural: 'Designers' },
    { id: 'dm',     name: 'Design Manager', plural: 'Design Managers' },
    { id: 'eng',    name: 'Engineer', plural: 'Engineers' },
    { id: 'ds',     name: 'Data Scientist', plural: 'Data Scientists' }
  ],

  projects: [
    {
      id: 'intro',
      name: 'About me',
      short: 'Intro',
      slides: [
        { id: 'intro-name', min: 0.5, pri: 1, label: 'Hello',
          title: 'Yuxuan Li, Product Designer',
          body: 'Product designer who likes untangling complicated systems. Also Yoyo\'s person.' },
        { id: 'intro-tagline', min: 0.5, pri: 2, label: 'What I do',
          title: 'Making complex things simple',
          body: 'Most of my work sits where finance, AI and human services meet, and my job is to make that feel obvious to the people using it.' },
        { id: 'intro-values', min: 0.5, pri: 3, label: 'How I work',
          title: 'Curious, delightful, thoughtful',
          body: 'Ask a lot of questions, make it feel good to use, and think through the edges before they become problems.' },
        { id: 'intro-intuit', min: 1, pri: 1, label: 'Now',
          title: 'Intuit, QuickBooks Live Expert',
          body: 'End-to-end design for how AI and human experts work together inside QuickBooks, across bookkeeping and new service lines.' },
        { id: 'intro-offerland', min: 0.75, pri: 3, lens: ['pm', 'design'], label: 'Side project',
          title: 'Offerland.ai',
          body: 'A job search workspace with AI interview guidance. I lead design on it outside of work.' },
        { id: 'intro-lytx', min: 0.75, pri: 3, lens: ['eng', 'design'], label: 'Before',
          title: 'Lytx',
          body: 'Fleet management system, driver app and design system for a fleet safety platform.' },
        { id: 'intro-life', min: 0.5, pri: 2, label: 'Outside work',
          title: 'Yoyo, ceramics, travel and bouldering',
          body: 'What keeps me curious when I am away from the screen.' }
      ]
    },

    {
      id: 'qb',
      name: 'QuickBooks: AI + Embedded Human Expertise',
      short: 'QuickBooks AI + Human',
      tagline: 'Defining how human expertise shows up in an AI-native system',
      focus: {
        all:    'How I defined where AI stops and a human expert starts, and turned that into one experience inside QuickBooks.',
        pm:     'Watch for how the problem got framed, what we cut from the MVP, and the engagement and monetization signals.',
        design: 'Watch for the journey mapping, co-design sessions, and how the AI and expert touchpoints show up in the final UI.',
        dm:     'Watch for how I aligned core QBO, service delivery and the expert platform when each team optimized for a different outcome.',
        eng:    'Watch for the three-level responsibility model and the routing system: confidence, severity and thresholds that recalibrate over time.',
        ds:     'Watch for the scoring inputs behind routing and the results: engagement, repeat use, books close rate and tNPS.'
      },
      slides: [
        { id: 'qb-title', min: 0.5, pri: 1, must: true, label: 'Case study',
          title: 'QuickBooks: AI + Embedded Human Expertise',
          body: 'Defining how human expertise shows up in an AI-native system.' },
        { id: 'qb-context', min: 1.5, pri: 1, lens: ['pm', 'dm', 'ds'], label: 'Context',
          title: 'My role and the team',
          body: 'End-to-end product designer working with core QBO, PM, engineering, data science, service delivery, marketing and the expert platform. Shipped across 4 QBO SKUs with ~24% CTR on embedded expert support, 30% less manual work for SMBs and ~80 tNPS for the expert call.' },
        { id: 'qb-from', min: 0.75, pri: 3, label: 'Context',
          title: 'From: a manual chain',
          body: 'Customers did the bookkeeping themselves, and expert services were a separate thing they had to go buy.' },
        { id: 'qb-from-to', min: 1, pri: 2, lens: ['pm', 'design'], label: 'Context',
          title: 'To: support around the customer',
          body: 'Instead of a line from customer to workflow to paid service, AI and experts surround the customer and show up when they are needed.' },
        { id: 'qb-why', min: 1.5, pri: 2, lens: ['pm', 'ds'], label: 'Why this matters',
          title: 'Small businesses don\'t trust their books',
          body: '59% worry their books are inaccurate and 65% worry they are not tax ready. 43% have been in business for less than 3 years, so "I don\'t know what I don\'t know". And trust in AI alone is low.' },
        { id: 'qb-challenge', min: 1.5, pri: 1, lens: ['dm', 'pm'], label: 'Challenge',
          title: 'What should come first: AI, the expert, or both?',
          body: 'Customer needs were not clearly structured, there was no shared definition of AI + human in the product, and teams were optimizing for different outcomes.' },
        { id: 'qb-journey', min: 1.5, pri: 3, lens: ['design', 'dm'], label: 'What I did',
          title: 'Defining where expertise matters most',
          body: 'Mapped the customer journey with core QBO teams, a service designer and service delivery.' },
        { id: 'qb-journey-moments', min: 1.5, pri: 2, lens: ['design', 'dm', 'pm'], label: 'What I did',
          title: 'Four moments that need a human',
          body: 'Onboarding, ongoing support when something unexpected happens, critical financial decisions, and year-end review before tax season.' },
        { id: 'qb-levels', min: 2, pri: 1, lens: ['eng', 'pm', 'ds'], label: 'What I did',
          title: 'Clarifying AI vs human responsibilities',
          body: 'Level 1: AI has the data and handles it. Level 2: the customer has the context and confirms. Level 3: the expert has the judgment. Every job to be done got a level.' },
        { id: 'qb-system', min: 2, pri: 1, lens: ['eng', 'ds'], label: 'What I did',
          title: 'How the system works',
          body: 'AI scans the books and scores each issue on confidence, data quality, severity and business impact. It routes to auto-resolve, customer confirmation or an expert. Thresholds recalibrate, so the boundary moves as trust is earned.' },
        { id: 'qb-codesign', min: 1, pri: 3, lens: ['design', 'dm'], label: 'What I did',
          title: 'Co-design sessions',
          body: 'Explored how support fits the experience, what customers want visibility into, which signals build trust, and what makes the service feel valuable.' },
        { id: 'qb-prototypes', min: 1, pri: 2, lens: ['design'], label: 'What I did',
          title: 'Validating ideas through rapid prototypes',
          body: 'Tested information hierarchy, navigation, interaction patterns and where AI and expert touchpoints should live.' },
        { id: 'qb-solution', min: 1.5, pri: 1, lens: ['design', 'eng'], label: 'Solution',
          title: 'One overview, AI and experts built in',
          body: 'Books Health shows where things stand, Needs attention lists what AI found, and talking to an expert is one click away from the same page.' },
        { id: 'qb-james', min: 1, pri: 3, lens: ['design', 'pm'], label: 'Applied use case',
          title: 'Meet James Porter',
          body: 'Runs Porter General Contracting: 2 years in business, 5 employees, $675K revenue. Has a bookkeeper for year-end and wants to grow his business, not manage books.' },
        { id: 'qb-mvp', min: 1.5, pri: 2, lens: ['pm', 'eng', 'dm'], label: 'MVP & tradeoffs',
          title: 'What we prioritized and what we cut',
          body: 'Prioritized validating the service value, one integrated workflow, expert service for 10% of customers and a call summary email. Deprioritized full workflow coverage, all cohorts, deep personalization, async and post-call automation.' },
        { id: 'qb-results', min: 1.5, pri: 1, lens: ['pm', 'ds'], label: 'Results',
          title: 'Impact',
          body: '55% engagement, 30% less manual work, +3.2% monthly books close, ~24% expert call engagement, ~80 tNPS, higher customer confidence after sessions, and early monetization at ~2% conversion of existing expert services. Next: more personalization, more entry points across QBO, and accountant control.' },
        { id: 'qb-learned', min: 1, pri: 2, lens: ['dm', 'design'], label: 'What I learned',
          title: 'What I learned',
          body: 'Moving forward in ambiguity and owning the problem. Designing systems, not just screens: AI logic, decision boundaries and the service model. Aligning teams across a big platform with different incentives.' }
      ]
    },

    {
      id: 'bf',
      name: 'Business formation',
      short: 'Business formation',
      tagline: 'Form your business with confidence and maximize tax savings',
      focus: {
        all:    'How I found that the hard part of forming a business is the decision, not the paperwork, and piloted an expert service with zero engineering.',
        pm:     'Watch for market sizing, the insight that reframed the product, and how the pilot secured resources for MVP and GA.',
        design: 'Watch for the research, the service blueprint and the two entry flows for new and existing customers.',
        dm:     'Watch for running a pilot with no engineering support, and influencing through clarity and momentum.',
        eng:    'Watch for what we replaced with Zoom, email and an AI-assisted tool, and what that means for the real build.',
        ds:     'Watch for the research scale (1,500+ surveys) and the pilot results: 4.6/5 satisfaction and 100% would recommend.'
      },
      slides: [
        { id: 'bf-title', min: 0.5, pri: 1, must: true, label: 'Case study',
          title: 'Business formation',
          body: 'Form your business with confidence and maximize tax savings.' },
        { id: 'bf-context', min: 1, pri: 2, lens: ['pm', 'ds'], label: 'Context',
          title: 'One of four new services',
          body: 'A large market (8.6M sole props already in QBO plus 1 to 1.2M new filers a year), low investment since experts already know SMBs, and it grows the ecosystem by bringing businesses into QuickBooks on day one.' },
        { id: 'bf-research', min: 1, pri: 2, lens: ['ds', 'design'], label: 'What I did',
          title: 'How we learned what owners actually needed',
          body: '1,500+ surveys, 250+ hours of user interviews and 45+ expert sessions.' },
        { id: 'bf-paperwork', min: 0.5, pri: 3, label: 'Insight',
          title: 'Paperwork is easy',
          body: 'Choose an entity type, file articles, get an EIN, stay compliant. On paper it looks like four steps.' },
        { id: 'bf-decision', min: 1, pri: 1, lens: ['pm', 'design'], label: 'Insight',
          title: 'The decision is hard',
          body: 'Under step one are questions about taxes, liability, raising money, partners, state rules and future growth. Get it wrong and you overpay every year or expose personal assets.' },
        { id: 'bf-who', min: 1, pri: 2, lens: ['design', 'pm'], label: 'Insight',
          title: 'Owners don\'t know who to ask',
          body: 'A bookkeeper knows books, a CPA knows taxes, a lawyer knows the law, and a chatbot knows a bit of everything. The owner needs the whole picture.' },
        { id: 'bf-blueprint', min: 1, pri: 2, lens: ['design', 'dm', 'eng'], label: 'Service blueprint',
          title: 'What makes us stand out',
          body: 'An advisory call with a CPA, then three implementation paths: do it yourself, use a partner platform, or have an expert file for you, with follow-up for 30 days.' },
        { id: 'bf-prototype', min: 0.75, pri: 3, lens: ['design'], label: 'What I did',
          title: 'Rapid prototype',
          body: 'A personalized formation roadmap with cost, timeline and a direct line to an expert.' },
        { id: 'bf-new', min: 1, pri: 1, lens: ['design', 'pm'], label: 'Solution',
          title: 'New to QuickBooks',
          body: 'Quick onboarding, an advisory call to choose the right structure, forms filed by the expert or by the owner, and the right QBO plan set up from day one.' },
        { id: 'bf-existing', min: 0.75, pri: 3, lens: ['design', 'eng'], label: 'Solution',
          title: 'Existing QBO customers',
          body: 'A proactive reminder when the business is ready to form, nothing to re-enter, and an expert who already sees the context before the call.' },
        { id: 'bf-pilot', min: 1, pri: 1, lens: ['dm', 'eng', 'pm'], label: 'Pilot',
          title: 'Designing a pilot under zero engineering support',
          body: '6 experts and 20 customers. We planned for new and existing customers, in-product flows and the expert platform. We ran it with existing QBO customers, email and Zoom, a tool built with Claude, in 4 states.' },
        { id: 'bf-results', min: 1, pri: 1, lens: ['pm', 'ds', 'dm'], label: 'Pilot results',
          title: 'Results',
          body: '4.6/5 satisfaction and 100% would recommend. Customers highlighted human connection and personalized guidance. It validated demand, secured resources for MVP and GA, and raised the priority within the org.' },
        { id: 'bf-learned', min: 0.75, pri: 2, lens: ['dm'], label: 'What I learned',
          title: 'What I learned',
          body: 'Move forward without full product support, validate core value first, and influence through clarity and momentum.' }
      ]
    }
  ]
};
