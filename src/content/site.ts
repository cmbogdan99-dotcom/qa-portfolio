// Single source of truth for all site copy.
// Facts reconciled against CV_Bogdan_Carcadea.pdf (2026-07).

export const identity = {
  name: "Bogdan Carcadea",
  role: "Senior QA Engineer",
  location: "Bucharest, Romania",
  tagline:
    "I own quality end to end: test strategy, release readiness, and the processes behind them. Five years across PC, console, mobile, browser, and VR. Currently building deep expertise in test automation.",
  platforms: ["PC", "PlayStation", "Xbox", "Stadia", "Mobile", "Browser", "VR"],
};

export const stats = [
  { value: "5+", label: "years in QA" },
  { value: "10,000+", label: "defects reported" },
  { value: "7", label: "platforms tested" },
  { value: "15+", label: "projects worked on" },
];

export const links = {
  email: "bogdan.carcadea@gmail.com",
  linkedin: "https://www.linkedin.com/in/bogdan-carcadea",
  github: "https://github.com/cmbogdan99-dotcom",
  cv: "/cv/bogdan-carcadea-cv.pdf",
};

export const about: string[] = [
  "Quality work starts before the first test case. Most defects that matter trace back to unclear requirements, untested assumptions, or risks nobody named early enough. That is where I spend my attention first. Test execution is the visible part of QA; the useful part is deciding what could fail, what that would cost, and what to check first.",
  "I have spent over five years testing large, complex software: AAA productions at Ubisoft and EA, and now a multi-platform product where I am the only QA. Every quality decision, from planning to release sign-off, goes through me. Different industries share the same fundamentals: scope pressure, platform fragmentation, release risk, and the need for someone to say clearly what \"ready\" means.",
  "Right now I am investing in automation with C#, Python, Unity Test Framework, AltTester, and CI/CD. Not to replace judgment with scripts, but to remove the repetitive work that keeps testers away from the problems that need thinking.",
];

export type CaseStudy = {
  number: string;
  name: string;
  context: string;
  challenge: string;
  approach: string[];
  outcome: string;
};

export const caseStudies: CaseStudy[] = [
  {
    number: "01",
    name: "Sole QA ownership of a multi-platform product",
    context: "Avantaj Play · 2025 — present",
    challenge:
      "A live product with four cross-functional teams and no QA function behind it. No inherited process, no second opinion. Every decision about what to test, when to automate, and what blocks a release is mine.",
    approach: [
      "Designed the QA strategy from zero: risk-based coverage, tiered regression scope, release criteria, and 10 to 20 new test cases per feature each sprint.",
      "Introduced automated testing across core application flows using C#, Unity Test Framework, AltTester, and Python, removing repetitive smoke and regression passes.",
      "Redesigned the Jira workflows and tracking boards; the reporting standard is now used daily by QA, development, art, and management.",
      "Took over the department's technical hiring: running assessments, then training and mentoring the testers I helped bring in.",
    ],
    outcome:
      "Manual QA effort dropped by about half per sprint, the defect pipeline is used by the whole studio, and the QA function now scales beyond one person. Coverage extends to other internal products, including a finance-focused AR/MR application.",
  },
  {
    number: "02",
    name: "Expert coverage across AAA productions",
    context: "Ubisoft · 2021 — 2025 · QC Tester → Quality Analyst Technician",
    challenge:
      "Productions like Assassin's Creed Shadows, Star Wars Outlaws, Assassin's Creed Valhalla, and Watch Dogs: Legion ship across PlayStation, Xbox, PC, and mobile, with a state-space no team can test exhaustively. Build cadence swung with context, from one or two builds a week in quiet phases to 8-10 a day near release.",
    approach: [
      "Worked in a strike-team model: rotated onto projects needing senior coverage, delivered analysis and reports, moved to the next.",
      "As Quality Analyst Technician, covered specific features and areas sprint by sprint. On selected projects this included coordinating a team of 15 expert testers: allocating tasks, tracking technical KPIs, and reporting to QC leadership.",
      "Applied risk-based, functional, and non-functional testing to keep coverage meaningful when exhaustive testing was impossible.",
      "Supported milestone delivery, platform compliance, and certification across console generations, PC, and mobile.",
    ],
    outcome:
      "Contributed to an estimated 10,000+ reported defects across the portfolio, and was trusted with team coordination without holding the lead title.",
  },
  {
    number: "03",
    name: "Match-3 Automated QA Framework",
    context: "Personal project · built solo",
    challenge:
      "Manual test scripting for match-3 games does not scale: every new level means hours of case-by-case setup, and content updates quietly invalidate old coverage.",
    approach: [
      "Built a single reusable framework, with AI-assisted development in Claude Code, that runs automated suites for level validation, game-logic checks, and functional coverage across performance, visual, audio, event, notification, and monetization systems.",
      "Designed it to adapt to new levels and content updates instead of being rewritten for them.",
    ],
    outcome:
      "New-level test setup time went from hours to minutes, and the framework keeps working as content changes.",
  },
  {
    number: "04",
    name: "Fitness AI",
    context: "Personal project · live PWA with cloud backend",
    challenge:
      "A solo project run like a real product, to practice the engineering discipline QA usually observes from the outside: Git/PR workflow, release practices, and owning defects I wrote myself.",
    approach: [
      "Built a predictive analytics engine: regression-based progress forecasting with confidence scoring, self-correcting calorie targets, and meal planning that respects dietary restrictions.",
      "Integrated an AI conversational coach (Claude, Gemini, OpenAI) with persistent long-term memory and daily briefings.",
      "JavaScript, Firebase, and LLM API integration, developed end to end inside a PR-based workflow.",
    ],
    outcome:
      "A live, working app, and a better understanding of the developer's side of the defect lifecycle. It changed how I write bug reports and how I design automation.",
  },
];

export const earlierWork =
  "Earlier: Quality Controller at Electronic Arts (contact person for the FIFA 20 demo, plus Madden NFL 20 and UFC 4). Other Ubisoft titles include Avatar: Frontiers of Pandora, Rainbow Six Siege, Skull and Bones, and The Crew Motorfest.";

export type Role = { title: string; period: string; note?: string };

export type Experience = {
  company: string;
  period: string;
  roles: Role[];
  summary: string;
};

export const experience: Experience[] = [
  {
    company: "Avantaj Play",
    period: "Sep 2025 — present",
    roles: [{ title: "QA Engineer, sole QA owner", period: "Sep 2025 — present" }],
    summary:
      "Full ownership of quality for a multi-platform product: strategy, automation, process design, release sign-off, plus the department's technical recruitment and mentoring.",
  },
  {
    company: "Ubisoft",
    period: "Mar 2021 — Aug 2025",
    roles: [
      {
        title: "Quality Analyst Technician",
        period: "Jun 2024 — Aug 2025",
        note: "Strike-team role: expert coverage on assigned features and areas across projects; on selected projects also coordinated a team of 15 expert testers, with KPIs and reporting to QC leadership.",
      },
      {
        title: "QC Tester",
        period: "Mar 2021 — May 2024",
        note: "Testing, defect reporting, and test case design on AAA productions.",
      },
    ],
    summary:
      "Four and a half years on AAA productions, growing from tester to analyst in a strike team coordinating expert testers.",
  },
  {
    company: "Electronic Arts",
    period: "Jul 2019 — Oct 2019",
    roles: [{ title: "Quality Controller", period: "Jul 2019 — Oct 2019" }],
    summary:
      "First QA role, on some of the largest live sports titles in the industry, including serving as contact person for the FIFA 20 demo.",
  },
];

export type ExpertiseCategory = {
  title: string;
  body: string;
  tags: string[];
};

export const expertise: ExpertiseCategory[] = [
  {
    title: "Test Strategy & Risk",
    body: "Deciding what to test, in what order, and what to consciously leave untested. Risk analysis before test cases, release criteria before release dates, and go/no-go input backed by evidence.",
    tags: ["Risk-based testing", "Test planning", "Coverage design", "Release criteria"],
  },
  {
    title: "Execution & Defect Management",
    body: "10,000+ defects reported across my career. Reproducible reports, calibrated severity, and a defect lifecycle managed through to verified fixes.",
    tags: ["Exploratory testing", "Regression", "API testing", "SQL", "Jira", "TestRail", "Xray", "Equivalence partitioning", "Boundary value analysis", "Decision tables", "State transition", "Static testing"],
  },
  {
    title: "Platforms & Certification",
    body: "PC, PlayStation, Xbox, Stadia, mobile, browser, and VR. Including certification requirements, input differences, and defects that only exist on one hardware generation.",
    tags: ["Console certification", "Compatibility", "Mobile", "VR/AR"],
  },
  {
    title: "Automation & Tooling",
    body: "A working automation foundation: C#, Python, Unity Test Framework, and AltTester in production use today. Currently building depth in Playwright and Postman, plus CI/CD pipelines.",
    tags: ["C#", "Python", "Unity Test Framework", "AltTester", "Playwright", "Postman", "Jenkins", "Git"],
  },
  {
    title: "People & Process",
    body: "My entire career has run on Agile: sprint planning, dailies, retros, and QA embedded in the Scrum cadence rather than bolted on at the end. Plus technical recruitment, candidate assessments, mentoring testers through onboarding, and reporting standards adopted across teams.",
    tags: ["Agile", "Scrum", "Technical recruitment", "Mentoring", "Jira workflow design", "Stakeholder reporting"],
  },
  {
    title: "AI-Assisted Workflows",
    body: "AI tools as accelerators for test design, documentation, automation scaffolding, and prototyping. Human judgment stays in charge of what ships.",
    tags: ["Claude", "Claude Code", "Gemini", "Copilot", "Cursor", "Rovo AI"],
  },
];

export type DeepDive = { title: string; body: string[] };

export const deepDives: DeepDive[] = [
  {
    title: "How I structure a test strategy from zero",
    body: [
      "When I joined a product with no existing QA process, the first deliverable was not test cases. It was a risk map: which features carry real money or user trust, which platforms diverge most, and where the team had already been burned. Test scope, depth, and automation candidates all derive from that map.",
      "Regression scope is tiered: a small always-run core (money paths, session integrity, platform entry points), a per-area tier triggered by what a change touches, and a full sweep reserved for release candidates. The size of the test effort should track the size of the risk, not the size of the changelog.",
    ],
  },
  {
    title: "Release validation across changing build cadences",
    body: [
      "Build cadence is never constant. I have worked at one or two builds a week in stable phases and 8-10 builds a day near release. The approach has to adapt: when builds are rare, each one gets depth; when they arrive hourly, a strict build-verification pass answers 'is this build testable at all' in minutes, and coverage targets what changed plus what historically breaks alongside it.",
      "The discipline that matters most is triage honesty: resisting both inflation (everything critical) and deflation (ship it anyway). A severity scale is only useful if it stays calibrated under deadline pressure.",
    ],
  },
  {
    title: "Where automation earns its keep",
    body: [
      "My rule: automate what is repetitive, deterministic, and boring (smoke passes, level validation, data setup) and keep human attention on what is exploratory, visual, or judgment-heavy. Automation that tries to replace exploration produces green dashboards and shipped bugs.",
      "On my current project this split cut manual QA effort by about half each sprint: automated verification of stable flows in C#, Unity Test Framework, AltTester, and Python, freeing manual time for new features and edge exploration.",
    ],
  },
  {
    title: "How I use AI in QA work",
    body: [
      "AI tools are part of my daily workflow as accelerators: first-draft test charters from specs, automation scaffolding, summarizing long defect histories, and pressure-testing my own coverage plans by asking a model what I might have missed. Both of my personal projects were built this way, deliberately, to learn where AI-assisted development is strong and where it fails.",
      "The boundary I keep: AI drafts, humans decide. Anything that gates a release, from severity calls to sign-off, stays a human call.",
    ],
  },
];

export type DlcItem = {
  slug: string;
  name: string;
};

export type GalleryItem = {
  slug: string;
  name: string;
  studio: string;
  detail: string;
  /** Optional live link, shown as a "Visit" action on the card. */
  href?: string;
  /** DLC / expansion sub-cards shown on hover. */
  dlc?: DlcItem[];
};

export const gallery: GalleryItem[] = [
  {
    slug: "ac-shadows",
    name: "Assassin's Creed Shadows",
    studio: "Ubisoft",
    detail: "Open-world action · PS5, Xbox Series, PC",
    dlc: [{ slug: "ac-shadows-claws-of-awaji", name: "Claws of Awaji" }],
  },
  {
    slug: "star-wars-outlaws",
    name: "Star Wars Outlaws",
    studio: "Ubisoft",
    detail: "Open-world action · PS5, Xbox Series, PC",
    dlc: [{ slug: "star-wars-outlaws-wild-card", name: "Wild Card" }],
  },
  {
    slug: "ac-valhalla",
    name: "Assassin's Creed Valhalla",
    studio: "Ubisoft",
    detail: "Open-world action · PlayStation, Xbox, PC, Stadia",
    dlc: [
      { slug: "ac-valhalla-wrath-of-the-druids", name: "Wrath of the Druids" },
      { slug: "ac-valhalla-siege-of-paris", name: "The Siege of Paris" },
      { slug: "ac-valhalla-dawn-of-ragnarok", name: "Dawn of Ragnarök" },
    ],
  },
  { slug: "watch-dogs-legion", name: "Watch Dogs: Legion", studio: "Ubisoft", detail: "Open-world action · PlayStation, Xbox, PC, Stadia" },
  { slug: "avatar", name: "Avatar: Frontiers of Pandora", studio: "Ubisoft", detail: "Open-world action · PS5, Xbox Series, PC" },
  { slug: "rainbow-six-siege", name: "Rainbow Six Siege", studio: "Ubisoft", detail: "Tactical shooter · PlayStation, Xbox, PC" },
  { slug: "skull-and-bones", name: "Skull and Bones", studio: "Ubisoft", detail: "Naval action · PS5, Xbox Series, PC" },
  { slug: "crew-motorfest", name: "The Crew Motorfest", studio: "Ubisoft", detail: "Open-world racing · PlayStation, Xbox, PC" },
  { slug: "fifa-20", name: "FIFA 20", studio: "Electronic Arts", detail: "Sports · PlayStation, Xbox, PC" },
  { slug: "madden-20", name: "Madden NFL 20", studio: "Electronic Arts", detail: "Sports · PlayStation, Xbox, PC" },
  { slug: "ufc-4", name: "UFC 4", studio: "Electronic Arts", detail: "Fighting · PlayStation, Xbox" },
  { slug: "sugar-madness", name: "Sugar Madness", studio: "Avantaj Play", detail: "Casual game · VR, Browser" },
  { slug: "jolly-match-3", name: "Jolly Match 3", studio: "Avantaj Play", detail: "Puzzle · Mobile" },
  { slug: "jolly-match-3-ar", name: "Jolly Match 3 AR", studio: "Avantaj Play", detail: "Puzzle · VR/AR" },
  { slug: "finance-ar", name: "Finance AR/MR Application", studio: "Avantaj Play", detail: "Finance tool · AR/MR, internal product" },
  { slug: "match3-framework", name: "Match-3 QA Framework", studio: "Personal project", detail: "Test automation · Mobile games" },
  { slug: "fitness-ai", name: "Fitness AI", studio: "Personal project", detail: "Fitness app · Web, Mobile", href: "https://cmbogdan99-dotcom.github.io/dltate/" },
];

export const philosophyLine =
  "Testing is risk management. Everything else is technique.";

export const availability = {
  open: true,
  // Edit this label to match what you're currently open to.
  label: "Open to new QA roles",
};
