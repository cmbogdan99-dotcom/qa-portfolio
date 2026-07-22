// Single source of truth for all site copy.
// Facts reconciled against CV_Bogdan_Carcadea.pdf (2026-07).

export const identity = {
  name: "Bogdan Carcadea",
  role: "Senior QA Engineer",
  location: "Bucharest, Romania",
  tagline:
    "Five years of senior QA across AAA productions and live products. I build test automation on my own projects: Playwright and TypeScript with a Python API layer, Page Object Model, UI and API coverage, and GitHub Actions CI, including a bank-transfer suite that found and documented a real overdraft-enforcement gap. Looking to apply that professionally.",
  platforms: ["Automation", "API", "CI/CD", "Web", "Mobile", "VR", "Console"],
};

export const stats = [
  { value: "40+", label: "automated tests" },
  { value: "5+", label: "years in QA" },
  { value: "10,000+", label: "defects reported" },
  { value: "2", label: "language stacks" },
];

export const links = {
  email: "bogdan.carcadea@gmail.com",
  linkedin: "https://www.linkedin.com/in/bogdan-carcadea",
  github: "https://github.com/cmbogdan99-dotcom",
  cv: "/cv/bogdan-carcadea-cv.pdf",
};

export const about: string[] = [
  "I write test automation and I run test strategy, and the two feed each other. My Playwright and TypeScript framework covers UI and API against real applications, with a Python API layer, Docker, and GitHub Actions CI running on every push. It is built the way a team framework is built: Page Object Model, shared fixtures, data-driven tests, and network interception, not a folder of throwaway scripts.",
  "That automation sits on top of five years testing large, complex software: AAA productions at Ubisoft and EA, and now a multi-platform product where I am the only QA and own every quality decision from planning to release sign-off. Different industries share the same fundamentals: scope pressure, platform fragmentation, release risk, and the need for someone to say clearly what \"ready\" means.",
  "The part of QA that matters is deciding what could fail, what that would cost, and what to check first. Automation removes the repetitive work so that judgment goes where it counts. A bank-transfer suite I wrote is a small example: it did not just pass, it surfaced a service that lets accounts go negative. That is the kind of finding automation should produce.",
];

export type CaseStudy = {
  number: string;
  name: string;
  context: string;
  challenge: string;
  approach: string[];
  outcome: string;
  stats?: { value: string; label: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    number: "01",
    name: "QA Automation Portfolio: UI and API test framework",
    context: "Personal project · Playwright, TypeScript, Pytest, Docker, GitHub Actions CI",
    challenge:
      "Manual QA proves you can find bugs. It does not prove you can build the automation that catches them on every push. I built a production-style test framework, run against real applications rather than toy demos, to close that gap and to develop the capability I want to bring to a team.",
    approach: [
      "Framework: a Page Object Model architecture in Playwright and TypeScript with 11 page classes, shared fixtures, data-driven tests, and network interception, running across Chromium, Firefox, and WebKit.",
      "What is tested: five suites against live targets. A SauceDemo e-commerce UI suite, a restful-booker REST CRUD suite with authentication, a 12-test end-to-end suite against this portfolio site, an 8-test suite against my own live fitness PWA including ledger-precision checks, and a 6-test ParaBank demo-bank suite.",
      "Second stack: an API layer in Python with Pytest alongside the TypeScript suites, the whole thing containerized with Docker so it runs the same locally and in CI.",
      "How it runs: GitHub Actions CI executes the suites on every push and publishes HTML report artifacts, so every change is verified automatically and the results are inspectable.",
      "Problem it solves: repeatable, reviewable regression coverage across UI and API that a manual pass cannot sustain, with money-critical checks the target systems actually need.",
    ],
    outcome:
      "Found and documented a real overdraft-enforcement gap: the target bank's transfer service does not enforce overdraft limits and drives accounts negative. The suite verifies decimal precision on transfers, the one-cent boundary, and full-balance transfers. 40+ automated tests across five suites, two language stacks, and three browsers, green on every push.",
    stats: [
      { value: "40+", label: "automated tests" },
      { value: "5", label: "test suites" },
      { value: "3", label: "browsers" },
      { value: "2", label: "language stacks" },
    ],
  },
  {
    number: "02",
    name: "Match-3 Automated QA Framework",
    context: "Personal project · C#, Unity Test Framework, AltTester",
    challenge:
      "Manual test scripting for match-3 games does not scale: every new level means hours of case-by-case setup, and content updates quietly invalidate old coverage.",
    approach: [
      "Built a single reusable framework, with AI-assisted development in Claude Code, that runs automated suites for level validation, game-logic checks, and functional coverage across performance, visual, audio, event, notification, and monetization systems.",
      "Simulated multiple player personas through configurable alter-ego profiles (distinct playstyle presets) across parallel multi-device sessions, validating personality-driven mechanics and progression loops.",
      "Hunts and reports defects autonomously: extracting device logs, capturing screenshot and video evidence, and generating structured bug reports with full reproduction context.",
      "Designed it to adapt to new levels and content updates instead of being rewritten for them.",
    ],
    outcome:
      "New-level test setup time went from hours to minutes, and the framework keeps working as content changes.",
  },
  {
    number: "03",
    name: "Fitness AI",
    context: "Personal project · live PWA on Cloudflare Workers + Firebase",
    challenge:
      "A solo project run like a real product, to practice the engineering discipline QA usually observes from the outside: Git/PR workflow, release practices, and owning defects I wrote myself. It is also a live target for my automation suite.",
    approach: [
      "Built a predictive analytics engine: regression-based progress forecasting with confidence scoring, self-correcting calorie targets, and meal planning that respects dietary restrictions.",
      "Integrated an AI conversational coach (Claude, Gemini, Groq) with persistent long-term memory and proactive daily briefings, maintaining continuity across sessions.",
      "Implemented a gamification engine: XP progression, reward shop, wager challenges, power-ups, and clan boosts to drive sustained long-term engagement.",
      "JavaScript, Firebase, Cloudflare Workers, and LLM API integration, developed end to end inside a PR-based workflow, then covered by an 8-test Playwright suite including ledger-precision tests.",
    ],
    outcome:
      "A live, working app, and a better understanding of the developer's side of the defect lifecycle. It changed how I write bug reports and how I design automation.",
  },
  {
    number: "04",
    name: "Sole QA ownership of a multi-platform product",
    context: "Avantaj Play · 2025 to present",
    challenge:
      "A live product with four cross-functional teams and no QA function behind it. No inherited process, no second opinion. Every decision about what to test, when to automate, and what blocks a release is mine.",
    approach: [
      "Designed the QA strategy from zero: risk-based coverage, tiered regression scope, release criteria, and 10 to 20 new test cases per feature each sprint.",
      "Introduced automated testing across core application flows using C#, Unity Test Framework, AltTester, and Python, removing repetitive smoke and regression passes.",
      "Redesigned the Jira workflows and tracking boards; the reporting standard is now used daily by QA, development, art, and management.",
      "Took over the department's technical hiring: running assessments, then training and mentoring the testers I helped bring in.",
      "Produce end-of-sprint summaries for cross-functional stakeholders: completed and in-progress work alongside critical milestones.",
    ],
    outcome:
      "Manual QA effort dropped by about half per sprint, the defect pipeline is used by the whole studio, and the QA function now scales beyond one person. Coverage extends to other internal products, including an internal specialized VR application.",
  },
  {
    number: "05",
    name: "Expert coverage across AAA productions",
    context: "Ubisoft · 2021 to 2025 · QC Tester to Quality Analyst Technician",
    challenge:
      "Productions like Assassin's Creed Shadows, Star Wars Outlaws, Assassin's Creed Valhalla, and Watch Dogs: Legion ship across PlayStation, Xbox, PC, and mobile, with a state-space no team can test exhaustively. Build cadence swung with context, from one or two builds a week in quiet phases to 8-10 a day near release.",
    approach: [
      "Worked in a strike-team model: rotated onto projects needing senior coverage, delivered analysis and reports, moved to the next.",
      "As Quality Analyst Technician, served as technical lead on select projects across dedicated sprint rotations: coordinating tester allocation, tracking KPIs, and reporting to QC leadership.",
      "Applied risk-based, functional, and non-functional testing to keep coverage meaningful when exhaustive testing was impossible.",
      "Supported milestone delivery, platform compliance, and certification across console generations, PC, and mobile.",
    ],
    outcome:
      "Contributed to an estimated 10,000+ reported defects across the portfolio, and was trusted as technical lead on select projects without holding the lead title.",
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
    period: "Sep 2025 to present",
    roles: [{ title: "QA Engineer, sole QA owner", period: "Sep 2025 to present" }],
    summary:
      "Full ownership of quality for a multi-platform product: strategy, automation, process design, release sign-off, plus the department's technical recruitment and mentoring.",
  },
  {
    company: "Ubisoft",
    period: "Mar 2021 to Aug 2025",
    roles: [
      {
        title: "Quality Analyst Technician",
        period: "Jun 2024 to Aug 2025",
        note: "Strike-team role: expert coverage on assigned features and areas across projects; technical lead on select projects across sprint rotations, with tester allocation, KPIs, and reporting to QC leadership.",
      },
      {
        title: "QC Tester",
        period: "Mar 2021 to May 2024",
        note: "Testing, defect reporting, and test case design on AAA productions.",
      },
    ],
    summary:
      "Four and a half years on AAA productions, growing from tester to analyst in a strike team coordinating expert testers.",
  },
  {
    company: "Electronic Arts",
    period: "Jul 2019 to Oct 2019",
    roles: [{ title: "Quality Controller", period: "Jul 2019 to Oct 2019" }],
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
    title: "Automation & Frameworks",
    body: "A Page Object Model framework in Playwright and TypeScript covering UI and API, with a second API layer in Python and Pytest, Docker, and GitHub Actions CI on every push with HTML reporting. Data-driven tests, fixtures, and network interception across three browsers. Production automation in C#, Unity Test Framework, and AltTester.",
    tags: ["Playwright", "TypeScript", "Pytest", "Python", "API testing", "Page Object Model", "Docker", "GitHub Actions", "CI/CD", "C#", "Unity Test Framework", "AltTester"],
  },
  {
    title: "Test Strategy & Risk",
    body: "Deciding what to test, in what order, and what to consciously leave untested. Risk analysis before test cases, release criteria before release dates, and go/no-go input backed by evidence.",
    tags: ["Risk-based testing", "Test planning", "Coverage design", "Release criteria"],
  },
  {
    title: "Execution & Defect Management",
    body: "10,000+ defects reported across my career. Reproducible reports, calibrated severity, and a defect lifecycle managed through to verified fixes.",
    tags: ["Exploratory testing", "Regression", "SQL", "Jira", "TestRail", "Xray", "Equivalence partitioning", "Boundary value analysis", "Decision tables", "State transition", "Static testing"],
  },
  {
    title: "AI-Assisted Workflows",
    body: "AI tools as accelerators for test design, documentation, automation scaffolding, and prototyping. Both personal projects were built this way, deliberately, to learn where AI-assisted development is strong and where it fails. Human judgment stays in charge of what ships.",
    tags: ["Claude", "Claude Code", "Gemini", "ChatGPT", "Copilot", "Cursor", "Rovo AI"],
  },
  {
    title: "Platforms & Certification",
    body: "PC, PlayStation, Xbox, Stadia, mobile, browser, and VR. Including certification requirements, input differences, and defects that only exist on one hardware generation.",
    tags: ["Console certification", "Compatibility", "Mobile", "VR/AR"],
  },
  {
    title: "People & Process",
    body: "My entire career has run on Agile: sprint planning, dailies, retros, and QA embedded in the Scrum cadence rather than bolted on at the end. Plus technical recruitment, candidate assessments, mentoring testers through onboarding, and reporting standards adopted across teams.",
    tags: ["Agile", "Scrum", "Technical recruitment", "Mentoring", "Jira workflow design", "Stakeholder reporting"],
  },
];

export type DeepDive = { title: string; body: string[] };

export const deepDives: DeepDive[] = [
  {
    title: "How the automation framework is built and run",
    body: [
      "The framework uses a Page Object Model: 11 page classes that hide selectors and page mechanics behind intent-level methods, so a test reads as a scenario, not a DOM walk. Shared fixtures handle setup and teardown, data-driven tests iterate the same flow over varied inputs, and network interception lets me assert on and stub API traffic. UI runs across Chromium, Firefox, and WebKit; a Python and Pytest layer covers the API independently. Docker pins the environment so local and CI runs match.",
      "GitHub Actions runs the suites on every push and uploads HTML report artifacts, which makes failures inspectable after the fact rather than only visible in a terminal. The value is not the count of tests, it is that the coverage is repeatable, reviewable, and gates change automatically instead of depending on someone remembering to run it.",
    ],
  },
  {
    title: "Finding an overdraft-enforcement gap through automation",
    body: [
      "The ParaBank demo-bank suite targets money-critical behavior on purpose: decimal precision on transfers, the one-cent boundary, full-balance transfers, and overdraft handling. Writing tests around those boundaries is where the interesting finding surfaced.",
      "The transfer service does not enforce overdraft limits: a transfer larger than the available balance succeeds and drives the account negative. I documented it as a finding with reproduction steps rather than forcing the test green. That is the point of automation around financial logic, it makes boundary behavior explicit, and explicit behavior is where the real defects live.",
    ],
  },
  {
    title: "Where automation earns its keep",
    body: [
      "My rule: automate what is repetitive, deterministic, and boring (smoke passes, level validation, data setup, regression across UI and API) and keep human attention on what is exploratory, visual, or judgment-heavy. Automation that tries to replace exploration produces green dashboards and shipped bugs.",
      "On my current professional project this split cut manual QA effort by about half each sprint: automated verification of stable flows in C#, Unity Test Framework, AltTester, and Python, freeing manual time for new features and edge exploration.",
    ],
  },
  {
    title: "How I structure a test strategy from zero",
    body: [
      "When I joined a product with no existing QA process, the first deliverable was not test cases. It was a risk map: which features carry real money or user trust, which platforms diverge most, and where the team had already been burned. Test scope, depth, and automation candidates all derive from that map.",
      "Regression scope is tiered: a small always-run core (money paths, session integrity, platform entry points), a per-area tier triggered by what a change touches, and a full sweep reserved for release candidates. The size of the test effort should track the size of the risk, not the size of the changelog.",
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
  /** Optional live link, shown as an action on the card. */
  href?: string;
  /** Label for the href button. Defaults to "Visit" if omitted. */
  hrefLabel?: string;
  /** DLC / expansion sub-cards shown on hover. */
  dlc?: DlcItem[];
};

export const gallery: GalleryItem[] = [
  {
    slug: "qa-automation-portfolio",
    name: "QA Automation Portfolio",
    studio: "Personal projects",
    detail: "Playwright · TypeScript · Pytest · CI/CD",
    href: "https://github.com/cmbogdan99-dotcom/qa-automation-portfolio",
    hrefLabel: "View on GitHub",
  },
  {
    slug: "match3-framework",
    name: "Match-3 QA Framework",
    studio: "Personal projects",
    detail: "Test automation · Mobile games",
  },
  {
    slug: "fitness-ai",
    name: "Fitness AI",
    studio: "Personal projects",
    detail: "Fitness app · Web, Mobile",
    href: "https://cmbogdan99-dotcom.github.io/dltate/",
    hrefLabel: "Open app",
  },
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
  { slug: "ac-mirage", name: "Assassin's Creed Mirage", studio: "Ubisoft", detail: "Action · PlayStation, Xbox, PC" },
  { slug: "ac-origins", name: "Assassin's Creed Origins", studio: "Ubisoft", detail: "Open-world action · PlayStation, Xbox, PC" },
  { slug: "ac-odyssey", name: "Assassin's Creed Odyssey", studio: "Ubisoft", detail: "Open-world action · PlayStation, Xbox, PC" },
  { slug: "ac-black-flag-remake", name: "Assassin's Creed IV: Black Flag (Resynced)", studio: "Ubisoft", detail: "Action · PS5, Xbox Series, PC" },
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
  { slug: "finance-ar", name: "Internal VR Application", studio: "Avantaj Play", detail: "Specialized tool · VR, internal product" },
];

export const philosophyLine =
  "Testing is risk management. Everything else is technique.";

export const availability = {
  open: true,
  // Edit this label to match what you're currently open to.
  label: "Open to new QA roles",
};
