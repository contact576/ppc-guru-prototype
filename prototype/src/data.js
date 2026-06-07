/* PPC Guru — Sample data + locked stage definitions
   ------------------------------------------------------------
   "users", "stages", "boards" mirror the LOCKED process described
   in the brief. Owner-type drives column tinting + behavior:
     team     — auto-assign on entry, fires notification+task
     client   — visually distinct, no auto-assign, "waiting on client"
     designer — manual only; shows "Assign designer" prompt
     multi    — multiple owners (e.g., Harsh + Vanshika)
*/
(function (root) {
  const USERS = [
    { id: "jaydeep",  name: "Jaydeep Patel",   role: "Owner / CEO",              initials: "JP", color: "#C5552D", reportsTo: [],                                              salary: null,    currency: "CAD" },
    { id: "dhaval",   name: "Dhaval Patel",         role: "Owner / COO",              initials: "DP", color: "#A8431F", reportsTo: [],                                              salary: null,    currency: "CAD" },
    { id: "shrikant", name: "Shrikaanth Shyamsundar", role: "Head of Delivery",       initials: "SS", color: "#5B4B8A", reportsTo: ["jaydeep","dhaval"],                            salary: 6500,    currency: "CAD" },
    { id: "vihar",    name: "Vihar Kalariya",       role: "Sr. Project Manager",      initials: "VK", color: "#4E6FAE", reportsTo: ["shrikant"],                                    salary: 4200,    currency: "CAD" },
    { id: "abhishek", name: "Abhishek Tewari",      role: "Sales Manager",            initials: "AT", color: "#2F7A57", reportsTo: ["jaydeep","dhaval"],                            salary: 3500,    currency: "CAD", targetMultiplier: 3, salesCommission: { firstMonth: 0.05, monthsTwoToSix: 0.03, afterSix: 0 } },
    { id: "vanshika", name: "Vanshika Raghuvanshi", role: "Creative Manager",         initials: "VR", color: "#B98426", reportsTo: ["jaydeep","dhaval"],                            salary: 4000,    currency: "CAD" },
    { id: "harsh",    name: "Harsh Rathod",         role: "Ads Manager (Google+Meta)",initials: "HR", color: "#3A8C9E", reportsTo: ["jaydeep","dhaval"],                            salary: 4200,    currency: "CAD" },
    { id: "rayu",     name: "Rayu Naik",            role: "Sr. Designer / Editor",    initials: "RN", color: "#7A5BA8", reportsTo: ["vanshika"],                                    salary: 2800,    currency: "CAD" },
    { id: "aadil",    name: "Aadil Tauro",          role: "Designer / Editor",        initials: "AD", color: "#9F4677", reportsTo: ["vanshika"],                                    salary: 2400,    currency: "CAD" },
    { id: "client",   name: "Client",          role: "Client",                   initials: "•",  color: "#4E6FAE", reportsTo: [],                                              salary: null }
  ];

  const userMap = Object.fromEntries(USERS.map(u => [u.id, u]));

  /* Onboarding stages (LOCKED) */
  const ONBOARD_META = [
    { id: "m1",  name: "Form Sent",                       owner: "abhishek", type: "team" },
    { id: "m2",  name: "Form Received",                   owner: "abhishek", type: "team" },
    { id: "m3",  name: "Business & Industry Research",    owner: "vanshika", type: "team" },
    { id: "m4",  name: "Discovery Call (Access)",         owner: ["harsh","vanshika"], type: "multi" },
    { id: "m5",  name: "Creative Strategy",               owner: "vanshika", type: "team" },
    { id: "m6",  name: "Creative Concept Approval",       owner: "client",   type: "client" },
    { id: "m7",  name: "Design Production",               owner: null,       type: "designer" },
    { id: "m8",  name: "Creative Done",                   owner: null,       type: "designer" },
    { id: "m9",  name: "Final Creative Approval",         owner: "client",   type: "client" },
    { id: "m10", name: "Campaign Build & Tracking",       owner: "harsh",    type: "team" },
    { id: "m11", name: "Live + Looker Access",            owner: "harsh",    type: "team", terminal: true }
  ];

  const ONBOARD_GOOGLE = [
    { id: "g1",  name: "Form Sent",                       owner: "abhishek", type: "team" },
    { id: "g2",  name: "Form Received",                   owner: "abhishek", type: "team" },
    { id: "g3",  name: "Onboarding & Access",             owner: "harsh",    type: "team", nonBlocking: true },
    { id: "g4",  name: "Keyword Research & Ad Copy",      owner: "harsh",    type: "team" },
    { id: "g5",  name: "Client Approval",                 owner: "client",   type: "client" },
    { id: "g6",  name: "Campaign Build & Tracking",       owner: "harsh",    type: "team" },
    { id: "g7",  name: "Live + Looker Access",            owner: "harsh",    type: "team", terminal: true }
  ];

  const ONBOARD_SMM = [
    { id: "s1", name: "Initial Meeting & Access",         owner: "vanshika", type: "team" },
    { id: "s2", name: "Content Strategy & Calendar",      owner: "vanshika", type: "team" },
    { id: "s3", name: "Client Approval",                  owner: "client",   type: "client" },
    { id: "s4", name: "Production",                       owner: null,       type: "designer" },
    { id: "s5", name: "Production Done",                  owner: null,       type: "designer" },
    { id: "s6", name: "Internal Final Review",            owner: "vanshika", type: "team" },
    { id: "s7", name: "Scheduling",                       owner: "vanshika", type: "team" },
    { id: "s8", name: "Live + Recurring",                 owner: "vanshika", type: "team", terminal: true }
  ];

  /* Active (monthly loop) stages (LOCKED) */
  const ACTIVE_META = [
    { id: "am1", name: "Monthly Briefing Call",           owner: ["vanshika","client"], type: "multi" },
    { id: "am2", name: "Creative Strategy",               owner: "vanshika", type: "team" },
    { id: "am3", name: "Creative Concept Approval",       owner: "client",   type: "client" },
    { id: "am4", name: "Design Production",               owner: null,       type: "designer" },
    { id: "am5", name: "Creative Done",                   owner: null,       type: "designer" },
    { id: "am6", name: "Final Creative Approval",         owner: "client",   type: "client" },
    { id: "am7", name: "Handoff to Harsh",                owner: "vanshika", type: "team" },
    { id: "am8", name: "Campaign Update / New Build",     owner: "harsh",    type: "team" },
    { id: "am9", name: "Live",                            owner: "harsh",    type: "team", terminal: true }
  ];

  const ACTIVE_SMM = [
    { id: "as1", name: "Monthly Briefing Call",           owner: ["vanshika","client"], type: "multi" },
    { id: "as2", name: "Content Strategy & Calendar",     owner: "vanshika", type: "team" },
    { id: "as3", name: "Client Approval",                 owner: "client",   type: "client" },
    { id: "as4", name: "Production",                      owner: null,       type: "designer" },
    { id: "as5", name: "Production Done",                 owner: null,       type: "designer" },
    { id: "as6", name: "Internal Final Review",           owner: "vanshika", type: "team" },
    { id: "as7", name: "Scheduling",                      owner: "vanshika", type: "team" },
    { id: "as8", name: "Live",                            owner: "vanshika", type: "team", terminal: true }
  ];

  /* Sample onboarding cards spread across stages */
  const ONB_CARDS = [
    // Meta
    { id: "c-meta-1", name: "Alpine Roofing Co.",     service: "meta",   stage: "m3", days: 2, niche: "Construction",     blocker: null,    designer: null, override: null },
    { id: "c-meta-2", name: "Kawartha Physio",       service: "meta",   stage: "m5", days: 4, niche: "Physiotherapy",    blocker: null,    designer: null, override: null },
    { id: "c-meta-3", name: "Sundara Immigration",   service: "meta",   stage: "m6", days: 7, niche: "Immigration",      blocker: "Awaiting client review",  designer: null, override: null },
    { id: "c-meta-4", name: "Maple Lawn & Snow",     service: "meta",   stage: "m7", days: 3, niche: "Home Services",    blocker: null,    designer: null, override: null }, // unassigned designer
    { id: "c-meta-5", name: "Crema Café",            service: "meta",   stage: "m7", days: 1, niche: "Restaurant",       blocker: null,    designer: "rayu", override: null },
    { id: "c-meta-6", name: "Devon Realty Group",    service: "meta",   stage: "m9", days: 9, niche: "Real Estate",      blocker: "Client unresponsive 5d", designer: null, override: null },
    { id: "c-meta-7", name: "BlueCrest HVAC",        service: "meta",   stage: "m10", days: 1, niche: "Home Services",   blocker: null,    designer: null, override: null },
    { id: "c-meta-8", name: "Northwind Movers",      service: "meta",   stage: "m4", days: 2, niche: "Home Services",    blocker: null,    designer: null, override: null },

    // Google
    { id: "c-goog-1", name: "Pinecrest Dental",      service: "google", stage: "g2", days: 1, niche: "Healthcare",        blocker: null,    designer: null, override: null },
    { id: "c-goog-2", name: "Riverstone Law",        service: "google", stage: "g3", days: 6, niche: "Legal",             blocker: null,    accessPending: true, designer: null, override: null },
    { id: "c-goog-3", name: "Aurora Wellness",       service: "google", stage: "g4", days: 3, niche: "Healthcare",        blocker: null,    accessPending: true, designer: null, override: null },
    { id: "c-goog-4", name: "Trillium Pediatrics",   service: "google", stage: "g5", days: 4, niche: "Healthcare",        blocker: null,    designer: null, override: null },
    { id: "c-goog-5", name: "Harbour Auto Body",     service: "google", stage: "g6", days: 2, niche: "Home Services",     blocker: null,    designer: null, override: "vihar" },

    // SMM
    { id: "c-smm-1", name: "Birchwood Yoga",         service: "smm",    stage: "s1", days: 1, niche: "Wellness",          blocker: null,    designer: null, override: null },
    { id: "c-smm-2", name: "Tahini & Thyme",         service: "smm",    stage: "s2", days: 3, niche: "Restaurant",        blocker: null,    designer: null, override: null },
    { id: "c-smm-3", name: "Stonebridge Homes",      service: "smm",    stage: "s3", days: 8, niche: "Real Estate",       blocker: "Client review overdue",  designer: null, override: null },
    { id: "c-smm-4", name: "PeakForm Strength",      service: "smm",    stage: "s4", days: 2, niche: "Fitness",           blocker: null,    designer: null, override: null }, // unassigned
    { id: "c-smm-5", name: "Lumiere Skin Clinic",    service: "smm",    stage: "s4", days: 4, niche: "Healthcare",        blocker: null,    designer: "aadil", override: null },
    { id: "c-smm-6", name: "GoldenLeaf Pharmacy",    service: "smm",    stage: "s6", days: 1, niche: "Healthcare",        blocker: null,    designer: null, override: null }
  ];

  /* Sample active (monthly) cards */
  const ACT_CARDS = [
    // Meta — November cycle
    { id: "a-meta-1", name: "Bluestone Construction", service: "meta", stage: "am2", days: 2, niche: "Construction",  designer: null, mrr: 4500, currency: "CAD" },
    { id: "a-meta-2", name: "Cedarwood Physio",       service: "meta", stage: "am3", days: 5, niche: "Physiotherapy", designer: null, mrr: 2500, currency: "CAD", blocker: "Concepts with client" },
    { id: "a-meta-3", name: "Maritime Realty",        service: "meta", stage: "am4", days: 1, niche: "Real Estate",   designer: "rayu", mrr: 3800, currency: "CAD" },
    { id: "a-meta-4", name: "FreshLeaf Cannabis Co.", service: "meta", stage: "am4", days: 3, niche: "Retail",        designer: null, mrr: 6800, currency: "USD" }, // unassigned
    { id: "a-meta-5", name: "Northern Lights Auto",   service: "meta", stage: "am6", days: 2, niche: "Auto",          designer: null, mrr: 2200, currency: "CAD" },
    { id: "a-meta-6", name: "Halcyon Hotels",         service: "meta", stage: "am7", days: 1, niche: "Hospitality",   designer: null, mrr: 5400, currency: "USD" },
    { id: "a-meta-7", name: "Vesper Boutique",        service: "meta", stage: "am9", days: 0, niche: "Retail",        designer: null, mrr: 1800, currency: "CAD" },
    { id: "a-meta-8", name: "GreenGrove Landscaping", service: "meta", stage: "am1", days: 0, niche: "Home Services", designer: null, mrr: 1500, currency: "CAD" },

    // SMM — November cycle
    { id: "a-smm-1",  name: "Wildflower Bakery",      service: "smm",  stage: "as2", days: 2, niche: "Restaurant",    designer: null, mrr: 1200, currency: "CAD" },
    { id: "a-smm-2",  name: "Ironside Gym",           service: "smm",  stage: "as3", days: 4, niche: "Fitness",       designer: null, mrr: 1500, currency: "CAD" },
    { id: "a-smm-3",  name: "Saffron & Spice",        service: "smm",  stage: "as4", days: 1, niche: "Restaurant",    designer: "aadil", mrr: 1800, currency: "CAD" },
    { id: "a-smm-4",  name: "Cove Med Spa",           service: "smm",  stage: "as4", days: 3, niche: "Healthcare",    designer: null, mrr: 2100, currency: "USD" }, // unassigned
    { id: "a-smm-5",  name: "Birchbark Outfitters",   service: "smm",  stage: "as6", days: 1, niche: "Retail",        designer: null, mrr: 1400, currency: "CAD" },
    { id: "a-smm-6",  name: "Solstice Yoga Studio",   service: "smm",  stage: "as7", days: 0, niche: "Wellness",      designer: null, mrr: 1100, currency: "CAD" }
  ];

  /* Sales pipeline (real warm leads from §4.7) */
  const SALES_STAGES = [
    { id: "sn",  name: "New Lead",       intent: "open" },
    { id: "sq",  name: "Qualifying",     intent: "open" },
    { id: "sp",  name: "Proposal Sent",  intent: "open" },
    { id: "sa",  name: "Trial Active",   intent: "trial" },
    { id: "sw",  name: "Won (Paid)",     intent: "won" },
    { id: "sl",  name: "Lost",           intent: "lost" }
  ];
  const LEADS = [
    { id: "ld1", company: "GlobalFinancials",   contact: "Anita Bhatia",  service: ["google","meta"], budget: 2500, currency: "USD", source: "Referral",      stage: "sp", days: 3,  cpa: null,  notes: "Wants combined Google + Meta. High intent." },
    { id: "ld2", company: "Upwell Homecare",    contact: "Marc Levesque", service: ["google"],        budget: 1500, currency: "CAD", source: "Google Ads",    stage: "sa", days: 9,  cpa: 38,    notes: "Trial day 9. Strong call volume." },
    { id: "ld3", company: "Crafts Forever",     contact: "Priya Krishna", service: ["google","meta"], budget: 1500, currency: "CAD", source: "Meta",           stage: "sq", days: 2,  cpa: 22,    notes: "Combined event series, 90-day calendar." },
    { id: "ld4", company: "Krishna Events",     contact: "Priya Krishna", service: ["meta"],          budget: 800,  currency: "CAD", source: "Meta",           stage: "sa", days: 14, cpa: 19,    notes: "Sister brand to Crafts Forever. Trial converting soon." },
    { id: "ld5", company: "WFG",                contact: "Daniel Wu",     service: ["meta"],          budget: 500,  currency: "USD", source: "LinkedIn",       stage: "sn", days: 1,  cpa: null,  notes: "Small budget — qualifying fit." },
    { id: "ld6", company: "XCEED Homes",        contact: "Rohit Sharma",  service: ["meta","google","smm"], budget: 0, currency: "CAD", source: "Inbound",  stage: "sq", days: 5,  cpa: null,  notes: "Multi-service. Budget TBD." },
    { id: "ld7", company: "Gokaddal",           contact: "Sridhar Iyer",  service: ["meta"],          budget: 0,    currency: "USD", source: "Inbound",        stage: "sn", days: 4,  cpa: null,  notes: "B2B lead-gen. Budget TBD." },
    { id: "ld8", company: "Mosaic Dental",      contact: "Lina Park",     service: ["google"],        budget: 1200, currency: "CAD", source: "Google Ads",    stage: "sw", days: 0,  cpa: 31,    notes: "Converted last week." },
    { id: "ld9", company: "Ferndale Vet",       contact: "Owen Hart",     service: ["smm","meta"],    budget: 900,  currency: "CAD", source: "Referral",      stage: "sl", days: 0,  cpa: null,  notes: "Chose competitor — price." }
  ];

  /* Notifications */
  const NOTIFS = [
    { id: "n1", to: "vanshika", type: "assign",   text: "You were assigned to Creative Strategy — Kawartha Physio",        time: "2m ago", read: false, ref: "c-meta-2" },
    { id: "n2", to: "harsh",    type: "assign",   text: "You were assigned to Campaign Build — BlueCrest HVAC",            time: "12m ago", read: false, ref: "c-meta-7" },
    { id: "n3", to: "vihar",    type: "stuck",    text: "Sundara Immigration sitting 7 days at Concept Approval (client)", time: "1h ago", read: false, ref: "c-meta-3" },
    { id: "n4", to: "vanshika", type: "designer", text: "Assign a designer for Maple Lawn & Snow — Design Production",     time: "1h ago", read: false, ref: "c-meta-4" },
    { id: "n5", to: "vanshika", type: "designer", text: "Assign a designer for PeakForm Strength — Production",            time: "2h ago", read: false, ref: "c-smm-4" },
    { id: "n6", to: "rayu",     type: "assign",   text: "Manually assigned to Crema Café — Design Production",             time: "3h ago", read: true,  ref: "c-meta-5" },
    { id: "n7", to: "aadil",    type: "assign",   text: "Manually assigned to Lumiere Skin Clinic — Production",           time: "3h ago", read: true,  ref: "c-smm-5" },
    { id: "n8", to: "harsh",    type: "flag",     text: "Riverstone Law — access pending 6 days (Google non-blocking)",    time: "4h ago", read: true,  ref: "c-goog-2" },
    { id: "n9", to: "vihar",    type: "stuck",    text: "Stonebridge Homes overdue at Client Approval (SMM)",              time: "5h ago", read: true,  ref: "c-smm-3" },
    { id: "n10", to: "vanshika",type: "system",   text: "FreshLeaf Cannabis Co. moved to Design Production — designer needed", time: "6h ago", read: true, ref: "a-meta-4" },
    { id: "n11", to: "harsh",   type: "review",   text: "Maritime Realty monthly review due in 3 days",                    time: "7h ago", read: true,  ref: "review-maritime" },
    { id: "n12", to: "abhishek",type: "lead",     text: "New lead: WFG (Meta — $500/mo)",                                  time: "1d ago", read: true,  ref: "ld5" }
  ];

  /* Tasks — auto-generated mirror of cards-at-current-stage assignments */
  const TASKS_EXTRA = [
    { id: "tx1", to: "harsh",    text: "Review optimization log — Maritime Realty",        client: "Maritime Realty",  service: "google", due: "Today",       priority: "med",  done: false, kind: "review" },
    { id: "tx2", to: "harsh",    text: "Pause underperforming keywords — Mosaic Dental",   client: "Mosaic Dental",    service: "google", due: "Today",       priority: "high", done: false, kind: "optimize" },
    { id: "tx3", to: "vanshika", text: "Draft November content calendar — Wildflower",     client: "Wildflower Bakery",service: "smm",    due: "Tomorrow",    priority: "med",  done: false, kind: "work" },
    { id: "tx4", to: "vihar",    text: "Unblock Stonebridge Homes (client review)",        client: "Stonebridge Homes",service: "smm",    due: "Today",       priority: "high", done: false, kind: "unblock" },
    { id: "tx5", to: "rayu",     text: "Deliver 6 reels — Saffron & Spice",                client: "Saffron & Spice",  service: "smm",    due: "Fri",         priority: "med",  done: false, kind: "design" },
    { id: "tx6", to: "aadil",    text: "Static set (8) — Lumiere Skin Clinic",             client: "Lumiere Skin Clinic", service: "smm", due: "Thu",         priority: "med",  done: false, kind: "design" },
    { id: "tx7", to: "abhishek", text: "Follow up — GlobalFinancials proposal",            client: "GlobalFinancials", service: "sales",  due: "Today",       priority: "high", done: false, kind: "sales" },
    { id: "tx8", to: "harsh",    text: "Build Looker dashboard — BlueCrest HVAC",          client: "BlueCrest HVAC",   service: "meta",   due: "Wed",         priority: "med",  done: true,  kind: "work" }
  ];

  /* Client reviews
     Two entries are intentionally due within ~3 days of TODAY (2026-05-25)
     so the monthly-review auto-rule has something to fire on. */
  const REVIEWS = [
    { id: "r1", client: "Maritime Realty",        service: "meta",   mrr: 3800, currency: "CAD", last: "Apr 24", due: "May 27", health: "ok",     concentration: false },
    { id: "r2", client: "FreshLeaf Cannabis Co.", service: "meta",   mrr: 6800, currency: "USD", last: "Apr 30", due: "May 28", health: "warn",   concentration: true,  note: "Anchor account — 18% of MRR" },
    { id: "r3", client: "Cedarwood Physio",       service: "meta",   mrr: 2500, currency: "CAD", last: "Oct 18", due: "Nov 18", health: "warn",   concentration: false, note: "CPL +22% MoM" },
    { id: "r4", client: "Halcyon Hotels",         service: "meta",   mrr: 5400, currency: "USD", last: "Oct 28", due: "Nov 28", health: "ok",     concentration: true,  note: "Anchor account — 14% of MRR" },
    { id: "r5", client: "Bluestone Construction", service: "meta",   mrr: 4500, currency: "CAD", last: "Nov 02", due: "Dec 02", health: "ok",     concentration: false },
    { id: "r6", client: "Northern Lights Auto",   service: "meta",   mrr: 2200, currency: "CAD", last: "Oct 14", due: "Nov 14", health: "danger", concentration: false, note: "Overdue — 11 days" },
    { id: "r7", client: "Vesper Boutique",        service: "meta",   mrr: 1800, currency: "CAD", last: "Oct 26", due: "Nov 26", health: "ok",     concentration: false },
    { id: "r8", client: "Solstice Yoga Studio",   service: "smm",    mrr: 1100, currency: "CAD", last: "Oct 22", due: "Nov 22", health: "ok",     concentration: false },
    { id: "r9", client: "Saffron & Spice",        service: "smm",    mrr: 1800, currency: "CAD", last: "Oct 31", due: "Nov 30", health: "ok",     concentration: false },
    { id: "r10", client: "Cove Med Spa",          service: "smm",    mrr: 2100, currency: "USD", last: "Oct 20", due: "Nov 20", health: "warn",   concentration: false, note: "Engagement -14% MoM" },
    { id: "r11", client: "Wildflower Bakery",     service: "smm",    mrr: 1200, currency: "CAD", last: "Oct 27", due: "Nov 27", health: "ok",     concentration: false },
    { id: "r12", client: "Mosaic Dental",         service: "google", mrr: 1200, currency: "CAD", last: "Nov 06", due: "Dec 06", health: "ok",     concentration: false }
  ];

  /* ─────────────────────────────────────────────────────────────────
     CLIENT BIBLE — credentials vault, Drive folder index, meeting transcripts.
     ─────────────────────────────────────────────────────────────────

     Vault: per-client list of credentials. Passwords/keys are hidden
     by default. The UI exposes a reveal action that posts a row to
     CRED_AUDIT — auditable forever, never deleted. Junior team members
     can request reveals; vault keepers can revoke if needed.

     Drive: structured shape (not just a flat file list). Folders
     follow the PPC Guru convention: Brand, Brief & Discovery,
     Creative Pack, Reports, Meeting Notes, Contracts. Each entry
     surfaces an external Drive URL.

     Transcripts: meeting transcripts. Two paths in:
       1) Manual upload (paste / drop a transcript text file)
       2) Auto-pull mock from "Google Meet recordings" — UI button
          fires a fake 2-3s poll then lands a generated transcript.
  */
  const CLIENT_VAULTS = {
    "Maritime Realty": [
      { id: "v-mr-1", platform: "Meta Business Manager", label: "Jess admin login",
        username: "jess@maritimerealty.ca", secret: "M@ritime2024!#sx",
        kind: "login", note: "Personal — never share. Use BM access instead.",
        owner: "harsh", lastReveal: "2025-10-02", expiresInDays: null, status: "active" },
      { id: "v-mr-2", platform: "Looker Studio",         label: "View-only token",
        username: null, secret: "lstk_a91f7…b04",
        kind: "token", note: "For sharing with Tim (broker). Expires Jan 2026.",
        owner: "harsh", lastReveal: "2025-10-28", expiresInDays: 73, status: "active" },
      { id: "v-mr-3", platform: "GA4",                   label: "Property — admin",
        username: "ppcguru-svc@maritime.iam", secret: "ga4-srv-acct-key.json",
        kind: "service-key", note: "Service account JSON in Drive (vault/keys).",
        owner: "harsh", lastReveal: "2025-08-14", expiresInDays: null, status: "active" },
      { id: "v-mr-4", platform: "WordPress CMS",         label: "Editor — for landing pages",
        username: "ppcguru-editor",          secret: "Maritime$Editor!22",
        kind: "login", note: "Limited to /lp/* paths.",
        owner: "vanshika", lastReveal: "2025-09-30", expiresInDays: null, status: "active" }
    ],
    "FreshLeaf Cannabis Co.": [
      { id: "v-fl-1", platform: "Meta Business Manager", label: "Dana super-admin",
        username: "dana@freshleaf.co", secret: "FL-2025-restrict!Sx",
        kind: "login", note: "Restricted advertiser — extra 2FA. Use Authy code from Dana.",
        owner: "harsh", lastReveal: "2025-10-30", expiresInDays: null, status: "active" },
      { id: "v-fl-2", platform: "Looker Studio",         label: "Multi-store dashboard token",
        username: null, secret: "lstk_freshleaf_77c2…b9",
        kind: "token", note: "Auto-rotates quarterly. Next rotation Jan 1, 2026.",
        owner: "harsh", lastReveal: "2025-11-12", expiresInDays: 38, status: "expiring" },
      { id: "v-fl-3", platform: "Shopify (Detroit)",     label: "Pixel admin",
        username: "ppcguru-pixel@freshleaf.co", secret: "shp_pat_4f8c12…d1",
        kind: "token", note: "PAT — needs scope refresh April 2026.",
        owner: "harsh", lastReveal: "2025-07-22", expiresInDays: null, status: "active" }
    ],
    "Wildflower Bakery": [
      { id: "v-wf-1", platform: "Instagram", label: "@wildflowerbakery — primary",
        username: "wildflowerbakery", secret: "S0urdough-Hearth!",
        kind: "login", note: "Lina insists on rotating monthly. Last rotation Nov 1.",
        owner: "vanshika", lastReveal: "2025-11-04", expiresInDays: null, status: "active" },
      { id: "v-wf-2", platform: "Meta Business Manager", label: "Page admin",
        username: "lina@wildflowerbakery.ca", secret: "WFB-page-admin-77a",
        kind: "login", note: "Use BM-level access; this is the page-level fallback.",
        owner: "vanshika", lastReveal: "2025-09-12", expiresInDays: null, status: "active" }
    ],
    "Bluestone Custom Homes": [
      { id: "v-bs-1", platform: "Google Ads", label: "MCC link approval",
        username: "ppcguru-mcc",            secret: "(no secret — link-based)",
        kind: "mcc",   note: "MCC link approved Aug 2024. Refresh once a year.",
        owner: "harsh", lastReveal: "2025-08-04", expiresInDays: null, status: "active" },
      { id: "v-bs-2", platform: "GA4",        label: "Property admin",
        username: "ppcguru-svc@bluestone",   secret: "ga4-bluestone-acct-key.json",
        kind: "service-key", note: "Service account; key in Drive.",
        owner: "harsh", lastReveal: "2025-08-04", expiresInDays: null, status: "active" }
    ]
  };

  /* Audit log — every reveal is appended. Reset-proof for the demo. */
  const CRED_AUDIT = [
    { id: "a-1", client: "Maritime Realty",        credId: "v-mr-2", who: "harsh",    action: "reveal", when: "2025-10-28 · 09:14", reason: "Pulling monthly report for Jess" },
    { id: "a-2", client: "Maritime Realty",        credId: "v-mr-1", who: "harsh",    action: "reveal", when: "2025-10-02 · 14:28", reason: "Re-linking Meta pixel" },
    { id: "a-3", client: "FreshLeaf Cannabis Co.", credId: "v-fl-1", who: "harsh",    action: "reveal", when: "2025-10-30 · 16:18", reason: "Compliance recheck after Meta restriction warning" },
    { id: "a-4", client: "Wildflower Bakery",      credId: "v-wf-1", who: "vanshika", action: "reveal", when: "2025-11-04 · 11:02", reason: "Scheduling Nov posts" },
    { id: "a-5", client: "FreshLeaf Cannabis Co.", credId: "v-fl-2", who: "harsh",    action: "rotate", when: "2025-11-12 · 08:30", reason: "Looker quarterly rotation" }
  ];

  /* Drive folder index — keyed by client. Each entry models a real Drive sub-folder. */
  const DRIVE_FOLDERS = {
    "Maritime Realty": {
      root: "drive.google.com/drive/folders/0B-maritime-root",
      folders: [
        { id: "f-mr-brand",   name: "01 · Brand",            url: "drive.google.com/maritime/brand",
          updated: "Aug 2024", items: 14, owners: ["abhishek","vanshika"],
          highlights: ["Brand guidelines v3.pdf", "Logo lockups (SVG)", "Approved photography"] },
        { id: "f-mr-brief",   name: "02 · Brief & Discovery", url: "drive.google.com/maritime/brief",
          updated: "May 2024", items: 8,  owners: ["abhishek"],
          highlights: ["Discovery call transcript", "Brief v3.pdf", "Persona pack"] },
        { id: "f-mr-creative",name: "03 · Creative Pack",     url: "drive.google.com/maritime/creative",
          updated: "Oct 2025", items: 142, owners: ["vanshika","rayu"],
          highlights: ["October — reels (12)", "October — statics (28)", "Sable Island shoot"] },
        { id: "f-mr-reports", name: "04 · Monthly Reports",   url: "drive.google.com/maritime/reports",
          updated: "Oct 2025", items: 18, owners: ["harsh"],
          highlights: ["October monthly.pdf", "Looker exports"] },
        { id: "f-mr-meet",    name: "05 · Meeting Notes",     url: "drive.google.com/maritime/meetings",
          updated: "Oct 2025", items: 23, owners: ["vihar"],
          highlights: ["Q4 strategy call (Oct 02)", "Weekly syncs (12)"] },
        { id: "f-mr-contracts",name: "06 · Contracts",        url: "drive.google.com/maritime/contracts",
          updated: "May 2024", items: 4,  owners: ["jaydeep"],
          highlights: ["MSA 2024.pdf", "Q4 budget addendum"] }
      ]
    },
    "FreshLeaf Cannabis Co.": {
      root: "drive.google.com/drive/folders/0B-freshleaf-root",
      folders: [
        { id: "f-fl-brand",   name: "01 · Brand",            url: "drive.google.com/freshleaf/brand",
          updated: "Mar 2024", items: 22, owners: ["vanshika"],
          highlights: ["Brand book.pdf", "Color/type system"] },
        { id: "f-fl-compliance", name: "02 · Compliance",      url: "drive.google.com/freshleaf/compliance",
          updated: "Sep 2025", items: 11, owners: ["jaydeep","harsh"],
          highlights: ["Meta compliance checklist", "State-level ad rules"] },
        { id: "f-fl-creative",name: "03 · Creative Pack",     url: "drive.google.com/freshleaf/creative",
          updated: "Oct 2025", items: 96, owners: ["vanshika","rayu","aadil"],
          highlights: ["October creatives (24)", "Loyalty campaign assets"] },
        { id: "f-fl-reports", name: "04 · Multi-Store Reports",url: "drive.google.com/freshleaf/reports",
          updated: "Oct 2025", items: 14, owners: ["harsh"],
          highlights: ["CO/MI/NM monthly", "Loyalty cohort export"] },
        { id: "f-fl-meet",    name: "05 · Meeting Notes",     url: "drive.google.com/freshleaf/meetings",
          updated: "Nov 2025", items: 31, owners: ["jaydeep","vihar"],
          highlights: ["Quarterly business review", "Compliance briefings (4)"] }
      ]
    },
    "Wildflower Bakery": {
      root: "drive.google.com/drive/folders/0B-wildflower-root",
      folders: [
        { id: "f-wf-brand",   name: "01 · Brand",            url: "drive.google.com/wildflower/brand",
          updated: "Aug 2024", items: 9, owners: ["vanshika"],
          highlights: ["Brand kit", "Type system", "Color palette"] },
        { id: "f-wf-calendars",name: "02 · Monthly Calendars",url: "drive.google.com/wildflower/calendars",
          updated: "Oct 2025", items: 16, owners: ["vanshika"],
          highlights: ["November draft", "October calendar", "September final"] },
        { id: "f-wf-creative",name: "03 · Creative",         url: "drive.google.com/wildflower/creative",
          updated: "Oct 2025", items: 48, owners: ["rayu"],
          highlights: ["Reels (8)", "Statics (12)", "Wholesale assets"] }
      ]
    },
    "Bluestone Custom Homes": {
      root: "drive.google.com/drive/folders/0B-bluestone-root",
      folders: [
        { id: "f-bs-brand",   name: "01 · Brand",            url: "drive.google.com/bluestone/brand",
          updated: "Jul 2024", items: 7, owners: ["vanshika"],
          highlights: ["Brand kit", "Builder portfolio reel"] },
        { id: "f-bs-brief",   name: "02 · Brief & Discovery", url: "drive.google.com/bluestone/brief",
          updated: "Jun 2024", items: 5, owners: ["abhishek"],
          highlights: ["Discovery call notes", "Persona pack"] },
        { id: "f-bs-reports", name: "03 · Monthly Reports",   url: "drive.google.com/bluestone/reports",
          updated: "Oct 2025", items: 4,  owners: ["harsh"],
          highlights: ["Q4 report"] }
      ]
    }
  };

  /* Meeting transcripts — keyed by client. Real transcripts in the demo
     are excerpted (we don't ship a 5000-word block per client). */
  const TRANSCRIPTS = {
    "Maritime Realty": [
      { id: "tr-mr-1", title: "Quarterly strategy call — Q4 push",
        when: "2025-10-02 · 10:00", duration: 47, source: "Google Meet (auto-pull)",
        attendees: ["Jess Cormier","Tim McGrath","Vihar Patel","Harsh Mehta"],
        summary: "Q4 push on luxury segment. Budget increase approved (4k→4.8k Nov-Dec). Adding 'Just Sold' creative format. Looker dashboard now shared with Tim.",
        actionItems: [
          { who: "vanshika", text: "Storyboard 'Just Sold' format — 3 variants" },
          { who: "harsh",    text: "Increase Nov budget to $4,800; allocate 60/40 to luxury LAL" },
          { who: "vihar",    text: "Share Looker access with tim@maritimerealty.ca" }
        ],
        excerpt: "JESS: We've had a really strong fall on the buyer side — the lookalike from the CRM is working hard. Where I want to push next is luxury. Tim and I are watching the over-$1.2M segment closely and we want to be the obvious choice in HRM there.\nTIM: We're already getting the listings; we just need to be louder on the marketing side.\nVIHAR: That's a clear ask. Harsh, what does the math look like if we bump the budget 20% and weight it toward the luxury lookalike?\nHARSH: Reasonable. With the current CPA around $34 we'd expect 30-40 more conversions a month, but on luxury the CPA is closer to $90, so closer to 8-10 incremental qualified leads. Worth it given the deal size.",
        keyMoments: [
          { t: "00:08", text: "Budget bump confirmed: $4,000 → $4,800 Nov-Dec" },
          { t: "00:21", text: "Tim asks about Looker access — Vihar to share" },
          { t: "00:34", text: "'Just Sold' format approved — storyboard owed by Oct 14" }
        ]
      },
      { id: "tr-mr-2", title: "Weekly sync — Sable Island listing",
        when: "2025-10-14 · 14:00", duration: 22, source: "Google Meet (auto-pull)",
        attendees: ["Jess Cormier","Vanshika Rao"],
        summary: "Jess wants drone footage prioritized on Sable Island listing. Agreed: 2 reels + 1 carousel by Oct 21.",
        actionItems: [
          { who: "vanshika", text: "Schedule drone shoot — Sable Island" },
          { who: "rayu",     text: "Edit 2 reels + 1 carousel for Sable Island" }
        ],
        excerpt: "JESS: Drone footage is what's going to sell this one. The photos don't do it justice.\nVANSHIKA: Got it — I'll have Rayu put two reels and a carousel together by the 21st.",
        keyMoments: [
          { t: "00:04", text: "Drone footage prioritized" },
          { t: "00:12", text: "Deadline locked to Oct 21" }
        ]
      }
    ],
    "FreshLeaf Cannabis Co.": [
      { id: "tr-fl-1", title: "Quarterly business review — Q3",
        when: "2025-10-08 · 14:00", duration: 62, source: "Google Meet (auto-pull)",
        attendees: ["Dana Whitfield","Jaydeep Patel","Harsh Mehta"],
        summary: "CPA drift discussed (target $50, current $55.5). Dana approved creative refresh and lifestyle direction shift. Concerns about Meta restriction reset.",
        actionItems: [
          { who: "harsh",   text: "Refresh top-3 creative across CO, MI, NM" },
          { who: "vanshika",text: "Develop 'autumn/cozy' lifestyle direction A/B" },
          { who: "jaydeep", text: "Follow up on Meta restriction tier (compliance call)" }
        ],
        excerpt: "DANA: I'm watching the CPA creep and it's making me nervous. We're at $55 against a $50 target and I can feel the audience fatigue.\nHARSH: Agreed. The top three creatives have been running for nine weeks now. Time to refresh.\nJAYDEEP: I think there's a bigger story here — the lifestyle angle has been the same since spring. We should test something autumnal.\nDANA: I'd love that. Wellness + cozy. Less 'product', more 'moment'.",
        keyMoments: [
          { t: "00:09", text: "CPA drift acknowledged — refresh approved" },
          { t: "00:27", text: "Autumn/cozy direction approved" },
          { t: "00:48", text: "Meta restriction tier follow-up tagged" }
        ]
      }
    ],
    "Wildflower Bakery": [
      { id: "tr-wf-1", title: "November planning call",
        when: "2025-10-28 · 11:00", duration: 28, source: "Manual upload",
        attendees: ["Lina Holm","Vanshika Rao"],
        summary: "November theme: 'Hearth — winter sourdough'. 6 posts (2 reels + 4 statics). Sunday brunch focus on last 2.",
        actionItems: [
          { who: "vanshika", text: "Draft Nov calendar; send for approval by Nov 1" },
          { who: "rayu",     text: "Edit laminated-dough reel + monthly bake-along reel" }
        ],
        excerpt: "LINA: I love the idea of leaning into 'hearth' — it's so on-brand for winter. Let's make sure the laminated-dough reel makes the cut.\nVANSHIKA: It's locked in. We'll pair it with a bake-along reel near month-end. The Sunday brunch ones can land on the last two weekends.",
        keyMoments: [
          { t: "00:03", text: "Theme locked: 'Hearth'" },
          { t: "00:14", text: "6-post plan finalized" }
        ]
      }
    ],
    "Bluestone Custom Homes": []
  };

  /* CSV import list for the auto-pull mock — pretend these are sitting
     in Google Meet recordings waiting to be pulled. */
  const PENDING_AUTOPULL = {
    "Maritime Realty": [
      { external: "meet.google.com/rec/abc-xyz-001",
        title: "Weekly sync — Nov 21",
        when: "2025-11-21 · 14:00",
        duration: 18, attendees: ["Jess Cormier","Vihar Patel"] }
    ],
    "FreshLeaf Cannabis Co.": [
      { external: "meet.google.com/rec/def-uvw-014",
        title: "Compliance briefing — Nov 18",
        when: "2025-11-18 · 16:30",
        duration: 41, attendees: ["Dana Whitfield","Jaydeep Patel","Harsh Mehta"] }
    ],
    "Wildflower Bakery": [],
    "Bluestone Custom Homes": [
      { external: "meet.google.com/rec/ghi-rst-088",
        title: "Discovery call — Nov 20",
        when: "2025-11-20 · 10:30",
        duration: 53, attendees: ["Mike Brennan","Abhishek Sharma"] }
    ]
  };

  /* Generic synthesized excerpts the auto-pull mock can drop in. */
  const AUTOPULL_SYNTH = {
    "Maritime Realty": {
      summary: "Tight weekly sync. Sable Island listing performance was strong (12 leads in 8 days). Jess wants the Lunenburg waterfront listing prioritized next.",
      actionItems: [
        { who: "harsh",   text: "Build new audience for Lunenburg waterfront — start lookalike from past sellers" },
        { who: "vanshika",text: "Coordinate drone shoot for Lunenburg waterfront" }
      ],
      excerpt: "JESS: Sable Island has been a hit — we got 12 qualified leads in just over a week.\nVIHAR: Great. What's the next listing you want us to push hard on?\nJESS: The Lunenburg waterfront. It's a $1.4M listing and we just got the photography done.\nHARSH: I'll spin up a new lookalike off our past seller list and target the over-50 affluent segment.",
      keyMoments: [
        { t: "00:02", text: "Sable Island — 12 leads in 8 days" },
        { t: "00:09", text: "Lunenburg waterfront prioritized next" }
      ]
    },
    "FreshLeaf Cannabis Co.": {
      summary: "Compliance briefing covering Meta's Nov policy update. Dana confirmed no impact on current ad set. Next briefing scheduled for Jan to cover state-level CO rules.",
      actionItems: [
        { who: "harsh",   text: "Run a compliance audit of all 24 active ads against Nov rules" },
        { who: "jaydeep", text: "Schedule January state-level compliance briefing" }
      ],
      excerpt: "DANA: Meta dropped a policy update last Friday. Wanted to talk through it.\nHARSH: I read through it this morning. The big change is the wording around 'lifestyle adjacency' — but we've never advertised products directly, so I don't think we're affected.\nJAYDEEP: Let's still audit all 24 active ads. Better safe than restricted.",
      keyMoments: [
        { t: "00:04", text: "Meta Nov policy reviewed" },
        { t: "00:23", text: "Full compliance audit scheduled" }
      ]
    },
    "Bluestone Custom Homes": {
      summary: "Discovery call with Mike Brennan. He's looking for steady consultation bookings (6-10/mo). Wants to invest in Google search ads + portfolio reel on IG.",
      actionItems: [
        { who: "abhishek",text: "Send proposal — Google Ads ($1,500/mo) + SMM lite" },
        { who: "harsh",   text: "Build initial keyword set for custom home builder GTA West" }
      ],
      excerpt: "MIKE: My business is referral-heavy but we have spare capacity. I'd like to fill a few more slots a month with people who want what we actually do — custom $1.5M-plus.\nABHISHEK: Our typical recommendation for builders in your range is Google search ads as the workhorse with a small SMM presence to validate when they Google you.\nMIKE: That sounds right. What does that cost?\nABHISHEK: We'd start at $1,500/mo on Google plus the management fee.",
      keyMoments: [
        { t: "00:06", text: "Goal: 6-10 qualified consults/mo" },
        { t: "00:18", text: "Budget anchor: $1,500/mo Google" },
        { t: "00:34", text: "Proposal owed by EOW" }
      ]
    }
  };

  /* ─────────────────────────────────────────────────────────────────
     PLATFORM — Daily budget pacing (Meta + Google).
     This is the daily-driver tool for Harsh (Google) + Vanshika (Meta).
     Math is computed live in the component from these inputs:
       monthlyBudget · currentMonthBudget · mtdSpend
       excludedWeekdays · excludedDates · TODAY
     Pacing derived: pro-rata target, shortfall, utilization,
     suggestedDaily, guidance (fine/increase/decrease/error).
     ───────────────────────────────────────────────────────────────── */

  /* Today is hardcoded for the demo — matches the SMM "25th rule" date. */
  const TODAY = "2026-05-25";  /* Monday, day 25 of 31 (May 2026) */

  /* Default sub-fields for legibility */
  const SUN = 0, SAT = 6;
  const WEEKEND = [SUN, SAT];

  /* Platform — Meta accounts (Vanshika's daily-driver) */
  const META_ACCTS = [
    {
      id: "p-m-1", client: "Maritime Realty", currency: "CAD", status: "active",
      monthlyBudget: 5000, currentMonthBudget: 5000,
      mtdSpend: 3820.40, yesterdaySpend: 0, todaySpend: 22.10,
      currentDailyBudget: 165, conv: 142, cpa: 26.9, ctr: 2.1,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: true,
      campaigns: [
        { name: "Search — Listings Leadgen", monthly: 2200 },
        { name: "PMax — Luxury Sellers GTA", monthly: 1800 },
        { name: "Retargeting — Site Visitors", monthly: 1000 }
      ],
      prevMonthUtil: 0.94, lastMonthUtil: 0.97,
      trend: [165, 160, 158, 175, 195, 215, 240, 268, 280],
      acctNumber: "act_204…8841", accountUrl: "https://adsmanager.facebook.com/",
      note: ""
    },
    {
      id: "p-m-2", client: "FreshLeaf Cannabis Co.", currency: "USD", status: "active",
      monthlyBudget: 9500, currentMonthBudget: 9500,
      mtdSpend: 8920.80, yesterdaySpend: 0, todaySpend: 38.00,
      currentDailyBudget: 390, conv: 168, cpa: 53.1, ctr: 1.8,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: true,
      campaigns: [
        { name: "Awareness — Wellness lifestyle", monthly: 4500 },
        { name: "Foot-traffic — CO + MI stores",   monthly: 3500 },
        { name: "Retargeting — Loyalty app",       monthly: 1500 }
      ],
      prevMonthUtil: 1.04, lastMonthUtil: 1.02,
      trend: [340, 360, 388, 405, 420, 445, 462, 478, 490],
      acctNumber: "act_472…1209", accountUrl: "https://adsmanager.facebook.com/",
      note: "Overpacing — CPA drift"
    },
    {
      id: "p-m-3", client: "Cedarwood Physio", currency: "CAD", status: "active",
      monthlyBudget: 2500, currentMonthBudget: 2500,
      mtdSpend: 1985.60, yesterdaySpend: 0, todaySpend: 12.50,
      currentDailyBudget: 95, conv: 58, cpa: 34.2, ctr: 1.5,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: false,
      campaigns: [
        { name: "Lead form — Knee/Hip rehab", monthly: 1500 },
        { name: "Lead form — Sports recovery", monthly: 1000 }
      ],
      prevMonthUtil: 0.91, lastMonthUtil: 0.93,
      trend: [85, 88, 92, 98, 105, 112, 118, 122, 128],
      acctNumber: "act_188…0744", accountUrl: "https://adsmanager.facebook.com/",
      note: "CPL drift"
    },
    {
      id: "p-m-4", client: "Halcyon Hotels", currency: "USD", status: "active",
      monthlyBudget: 7500, currentMonthBudget: 7500,
      mtdSpend: 6040.30, yesterdaySpend: 0, todaySpend: 32.40,
      currentDailyBudget: 245, conv: 211, cpa: 28.6, ctr: 2.4,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: true,
      campaigns: [
        { name: "Conversion — Direct bookings", monthly: 4200 },
        { name: "Retargeting — Site abandoners", monthly: 1800 },
        { name: "Awareness — Loyalty", monthly: 1500 }
      ],
      prevMonthUtil: 0.96, lastMonthUtil: 0.98,
      trend: [220, 235, 240, 245, 255, 268, 275, 282, 290],
      acctNumber: "act_551…3328", accountUrl: "https://adsmanager.facebook.com/",
      note: ""
    },
    {
      id: "p-m-5", client: "Bluestone Construction", currency: "CAD", status: "active",
      monthlyBudget: 5000, currentMonthBudget: 5000,
      mtdSpend: 4080.50, yesterdaySpend: 0, todaySpend: 44.00,
      currentDailyBudget: 215, conv: 96, cpa: 42.5, ctr: 1.7,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: true,
      campaigns: [
        { name: "Search — Custom home builds GTA west", monthly: 3500 },
        { name: "PMax — Net-zero showcase", monthly: 1500 }
      ],
      prevMonthUtil: 0.98, lastMonthUtil: 0.99,
      trend: [180, 195, 210, 218, 225, 232, 238, 245, 250],
      acctNumber: "act_603…7712", accountUrl: "https://adsmanager.facebook.com/",
      note: ""
    },
    {
      id: "p-m-6", client: "Northern Lights Auto", currency: "CAD", status: "error",
      monthlyBudget: 2200, currentMonthBudget: 2200,
      mtdSpend: 830.10, yesterdaySpend: 0, todaySpend: 0,
      currentDailyBudget: 0, conv: 18, cpa: 46.1, ctr: 1.3,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: false,
      campaigns: [
        { name: "Lead form — Service bookings", monthly: 2200 }
      ],
      prevMonthUtil: 0.62, lastMonthUtil: 0.71,
      trend: [85, 92, 70, 58, 0, 0, 0, 0, 0],
      acctNumber: "act_812…0014", accountUrl: "https://adsmanager.facebook.com/",
      note: "Paused — payment issue"
    },
    {
      id: "p-m-7", client: "Vesper Boutique", currency: "CAD", status: "active",
      monthlyBudget: 1800, currentMonthBudget: 1800,
      mtdSpend: 1464.20, yesterdaySpend: 0, todaySpend: 14.80,
      currentDailyBudget: 60, conv: 51, cpa: 28.7, ctr: 2.0,
      excludedWeekdays: [], excludedDates: [],
      conversionTracking: true, automatedRules: true,
      campaigns: [
        { name: "Sales — Catalog ads", monthly: 1200 },
        { name: "Retargeting — Cart abandoners", monthly: 600 }
      ],
      prevMonthUtil: 0.93, lastMonthUtil: 0.97,
      trend: [52, 55, 58, 60, 62, 64, 66, 68, 70],
      acctNumber: "act_298…6644", accountUrl: "https://adsmanager.facebook.com/",
      note: ""
    }
  ];

  /* Platform — Google accounts (Harsh's daily-driver) */
  const GOOG_ACCTS = [
    {
      id: "p-g-1", client: "Mosaic Dental", currency: "CAD", status: "active",
      monthlyBudget: 1500, currentMonthBudget: 1500,
      mtdSpend: 940.20, yesterdaySpend: 0, todaySpend: 8.60,
      currentDailyBudget: 52, conv: 38, cpa: 24.6, ctr: 5.4,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: true,
      campaigns: [
        { name: "Search — New patients", monthly: 1000 },
        { name: "Search — Emergency dentist", monthly: 500 }
      ],
      prevMonthUtil: 0.92, lastMonthUtil: 0.95,
      trend: [44, 48, 50, 52, 55, 58, 62, 65, 68],
      acctNumber: "847-220-1144", accountUrl: "https://ads.google.com/",
      lastOptISO: "2026-05-23", lastOptCount: 6, note: ""
    },
    {
      id: "p-g-2", client: "Upwell Homecare", currency: "CAD", status: "active",
      monthlyBudget: 1500, currentMonthBudget: 1500,
      mtdSpend: 1180.40, yesterdaySpend: 0, todaySpend: 6.20,
      currentDailyBudget: 50, conv: 36, cpa: 32.8, ctr: 4.8,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: true,
      campaigns: [
        { name: "Search — Homecare services BC", monthly: 1500 }
      ],
      prevMonthUtil: 0.95, lastMonthUtil: 0.99,
      trend: [55, 58, 60, 62, 64, 66, 68, 70, 72],
      acctNumber: "881-447-9023", accountUrl: "https://ads.google.com/",
      lastOptISO: "2026-05-20", lastOptCount: 4, note: ""
    },
    {
      id: "p-g-3", client: "Riverstone Law", currency: "CAD", status: "active",
      monthlyBudget: 2500, currentMonthBudget: 2500,
      mtdSpend: 2180.50, yesterdaySpend: 0, todaySpend: 14.40,
      currentDailyBudget: 112, conv: 22, cpa: 99.1, ctr: 3.1,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: false, automatedRules: false,
      campaigns: [
        { name: "Search — Personal injury Vancouver", monthly: 1600 },
        { name: "Search — ICBC dispute", monthly: 900 }
      ],
      prevMonthUtil: 0.88, lastMonthUtil: 0.91,
      trend: [88, 92, 98, 102, 105, 108, 112, 116, 118],
      acctNumber: "472-018-3361", accountUrl: "https://ads.google.com/",
      lastOptISO: "2026-05-14", lastOptCount: 2, note: "Call tracking pending"
    },
    {
      id: "p-g-4", client: "Aurora Wellness", currency: "CAD", status: "active",
      monthlyBudget: 1800, currentMonthBudget: 1800,
      mtdSpend: 1540.80, yesterdaySpend: 0, todaySpend: 11.20,
      currentDailyBudget: 58, conv: 41, cpa: 37.6, ctr: 5.0,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: true,
      campaigns: [
        { name: "Search — Therapy intake", monthly: 1200 },
        { name: "Search — Yoga classes", monthly: 600 }
      ],
      prevMonthUtil: 0.97, lastMonthUtil: 1.00,
      trend: [62, 65, 68, 70, 72, 75, 76, 78, 80],
      acctNumber: "904-281-7710", accountUrl: "https://ads.google.com/",
      lastOptISO: "2026-05-24", lastOptCount: 7, note: ""
    },
    {
      id: "p-g-5", client: "Trillium Pediatrics", currency: "CAD", status: "active",
      monthlyBudget: 1000, currentMonthBudget: 1000,
      mtdSpend: 885.40, yesterdaySpend: 0, todaySpend: 4.80,
      currentDailyBudget: 42, conv: 29, cpa: 30.5, ctr: 6.2,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: true,
      campaigns: [
        { name: "Search — Pediatric clinic GTA", monthly: 1000 }
      ],
      prevMonthUtil: 0.96, lastMonthUtil: 0.98,
      trend: [46, 48, 49, 52, 55, 56, 58, 60, 62],
      acctNumber: "552-014-2280", accountUrl: "https://ads.google.com/",
      lastOptISO: "2026-05-22", lastOptCount: 5, note: ""
    },
    {
      id: "p-g-6", client: "Harbour Auto Body", currency: "CAD", status: "active",
      monthlyBudget: 1500, currentMonthBudget: 1500,
      mtdSpend: 1240.10, yesterdaySpend: 0, todaySpend: 9.00,
      currentDailyBudget: 62, conv: 21, cpa: 59.0, ctr: 4.0,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: true, automatedRules: false,
      campaigns: [
        { name: "Search — Collision repair", monthly: 900 },
        { name: "Search — ICBC claims", monthly: 600 }
      ],
      prevMonthUtil: 0.94, lastMonthUtil: 0.96,
      trend: [55, 58, 60, 62, 64, 65, 66, 68, 70],
      acctNumber: "631-704-1182", accountUrl: "https://ads.google.com/",
      lastOptISO: "2026-05-17", lastOptCount: 3, note: "CPA above target"
    },
    {
      id: "p-g-7", client: "Pinecrest Dental", currency: "CAD", status: "error",
      monthlyBudget: 1200, currentMonthBudget: 1200,
      mtdSpend: 0, yesterdaySpend: 0, todaySpend: 0,
      currentDailyBudget: 40, conv: 0, cpa: 0, ctr: 0,
      excludedWeekdays: WEEKEND, excludedDates: [],
      conversionTracking: false, automatedRules: false,
      campaigns: [
        { name: "Search — New patients", monthly: 1200 }
      ],
      prevMonthUtil: 0, lastMonthUtil: 0,
      trend: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      acctNumber: "228-091-4470", accountUrl: "https://ads.google.com/",
      lastOptISO: null, lastOptCount: 0, note: "Conversion tracking missing"
    }
  ];

  /* Optimization log — extended to cover Meta + Google.
     `platform`: meta | google. `who` is the specialist id. */
  const OPT_LOG = [
    /* Google */
    { id: "ol-1",  platform: "google", account: "Mosaic Dental",       who: "harsh",    dateISO: "2026-05-23", when: "2d ago",  action: "Paused 4 underperforming keywords",         impact: "CPA -8% projected",        tags: ["keywords","budget-neutral"] },
    { id: "ol-2",  platform: "google", account: "Aurora Wellness",     who: "harsh",    dateISO: "2026-05-24", when: "Yesterday", action: "Raised budget +15% on top-3 ad groups", impact: "Conv. volume +18%",        tags: ["budget"] },
    { id: "ol-3",  platform: "google", account: "Trillium Pediatrics", who: "harsh",    dateISO: "2026-05-22", when: "3d ago",  action: "Added 12 negative keywords",                impact: "Wasted spend -$140/wk",    tags: ["negatives"] },
    { id: "ol-4",  platform: "google", account: "Upwell Homecare",     who: "harsh",    dateISO: "2026-05-20", when: "5d ago",  action: "Switched to Max Conversions bid strategy",  impact: "Awaiting 7-day signal",    tags: ["bidding"] },
    { id: "ol-5",  platform: "google", account: "Riverstone Law",      who: "harsh",    dateISO: "2026-05-14", when: "11d ago", action: "New responsive search ad variant",          impact: "CTR +0.4pp",               tags: ["ad-copy"], stale: true },
    { id: "ol-6",  platform: "google", account: "Mosaic Dental",       who: "harsh",    dateISO: "2026-05-18", when: "1 wk ago",action: "Geo-targeting refined to GTA core",         impact: "CTR +0.6pp",               tags: ["geo"] },
    { id: "ol-7",  platform: "google", account: "Harbour Auto Body",   who: "harsh",    dateISO: "2026-05-17", when: "8d ago",  action: "Bid adjustment on mobile -10%",             impact: "CPA -4%",                  tags: ["bidding"] },

    /* Meta */
    { id: "ol-8",  platform: "meta",   account: "Maritime Realty",       who: "vanshika", dateISO: "2026-05-24", when: "Yesterday", action: "Audience refresh — 2% LAL off May CRM", impact: "Reach +22%, CPL TBD",      tags: ["audience"] },
    { id: "ol-9",  platform: "meta",   account: "FreshLeaf Cannabis Co.",who: "vanshika", dateISO: "2026-05-23", when: "2d ago",  action: "Killed 2 fatigued creatives, launched 4 new", impact: "Frequency 4.2 → 2.1",   tags: ["creative"] },
    { id: "ol-10", platform: "meta",   account: "Bluestone Construction",who: "vanshika", dateISO: "2026-05-22", when: "3d ago",  action: "New 'sustainability' landing page split-test", impact: "+12% link CTR (early)", tags: ["landing-page","creative"] },
    { id: "ol-11", platform: "meta",   account: "Halcyon Hotels",        who: "vanshika", dateISO: "2026-05-19", when: "6d ago",  action: "Budget shift: $400 → Retargeting from Conversion", impact: "ROAS +0.4x",        tags: ["budget"] },
    { id: "ol-12", platform: "meta",   account: "Cedarwood Physio",      who: "vanshika", dateISO: "2026-05-13", when: "12d ago", action: "Broadened lookalike 1% → 2%",               impact: "CPL trending down",        tags: ["audience"], stale: true }
  ];

  /* Capacity / workload */
  const CAPACITY = {
    vanshika: { hours: 36, max: 40 },
    harsh:    { hours: 38, max: 40 },
    shrikant: { hours: 32, max: 40 },
    vihar:    { hours: 22, max: 40 },
    rayu:     { hours: 34, max: 40 },
    aadil:    { hours: 41, max: 40 },   // overloaded
    abhishek: { hours: 28, max: 40 },
    jaydeep:  { hours: 18, max: 40 },
    dhaval:   { hours: 16, max: 40 }
  };

  /* Revenue / MRR */
  const MRR_TREND = [
    { m: "May", mrr: 38400 },
    { m: "Jun", mrr: 41200 },
    { m: "Jul", mrr: 43800 },
    { m: "Aug", mrr: 46300 },
    { m: "Sep", mrr: 47900 },
    { m: "Oct", mrr: 49250 },
    { m: "Nov", mrr: 51420 }
  ];

  /* Today's meetings — per user, in chronological order.
     Used by the "My Day" planner to render each role's calendar strip. */
  const MEETINGS_TODAY = {
    jaydeep: [
      { id: "m-jd-1", t: "09:00", dur: 30, title: "Owners sync (w/ Dhaval)",       kind: "internal", attendees: ["dhaval","shrikant"] },
      { id: "m-jd-2", t: "11:00", dur: 45, title: "GlobalFinancials — discovery",   kind: "sales",    client: "GlobalFinancials", attendees: ["abhishek"] },
      { id: "m-jd-3", t: "15:30", dur: 30, title: "Forecast review (Q3)",           kind: "internal", attendees: ["shrikant","abhishek"] }
    ],
    dhaval: [
      { id: "m-dv-1", t: "09:00", dur: 30, title: "Owners sync (w/ Jaydeep)",       kind: "internal", attendees: ["jaydeep","shrikant"] },
      { id: "m-dv-2", t: "13:00", dur: 60, title: "Maple Lawn & Snow — escalation", kind: "client",   client: "Maple Lawn & Snow", attendees: ["vihar","harsh"] }
    ],
    shrikant: [
      { id: "m-sk-1", t: "09:00", dur: 30, title: "Owners sync",                    kind: "internal", attendees: ["jaydeep","dhaval"] },
      { id: "m-sk-2", t: "10:00", dur: 45, title: "Delivery standup",               kind: "internal", attendees: ["vihar","harsh","vanshika"] },
      { id: "m-sk-3", t: "14:00", dur: 30, title: "Maritime Realty — monthly review",kind: "review",  client: "Maritime Realty", attendees: ["vihar"] }
    ],
    vihar: [
      { id: "m-vh-1", t: "10:00", dur: 45, title: "Delivery standup",               kind: "internal", attendees: ["shrikant","harsh","vanshika"] },
      { id: "m-vh-2", t: "11:30", dur: 30, title: "Stonebridge Homes — unblock",    kind: "client",   client: "Stonebridge Homes", attendees: [] },
      { id: "m-vh-3", t: "14:00", dur: 30, title: "Maritime Realty — monthly review",kind: "review",  client: "Maritime Realty", attendees: ["shrikant"] },
      { id: "m-vh-4", t: "16:00", dur: 30, title: "Sundara Immigration — concept re-pitch", kind: "client", client: "Sundara Immigration", attendees: ["vanshika"] }
    ],
    abhishek: [
      { id: "m-ab-1", t: "09:30", dur: 30, title: "Crafts Forever — discovery",     kind: "sales",    client: "Crafts Forever", attendees: [] },
      { id: "m-ab-2", t: "11:00", dur: 45, title: "GlobalFinancials — proposal",    kind: "sales",    client: "GlobalFinancials", attendees: ["jaydeep"] },
      { id: "m-ab-3", t: "14:30", dur: 30, title: "Upwell Homecare — trial close",  kind: "sales",    client: "Upwell Homecare", attendees: [] },
      { id: "m-ab-4", t: "16:00", dur: 30, title: "WFG — qualification",            kind: "sales",    client: "WFG", attendees: [] }
    ],
    vanshika: [
      { id: "m-vk-1", t: "10:00", dur: 45, title: "Delivery standup",               kind: "internal", attendees: ["shrikant","harsh","vihar"] },
      { id: "m-vk-2", t: "11:30", dur: 30, title: "Wildflower — June calendar review", kind: "review", client: "Wildflower Bakery", attendees: [] },
      { id: "m-vk-3", t: "13:30", dur: 30, title: "Internal review — Saffron reels", kind: "internal", attendees: ["rayu"] },
      { id: "m-vk-4", t: "16:00", dur: 30, title: "Sundara Immigration — concept re-pitch", kind: "client", client: "Sundara Immigration", attendees: ["vihar"] }
    ],
    harsh: [
      { id: "m-hr-1", t: "10:00", dur: 45, title: "Delivery standup",               kind: "internal", attendees: ["shrikant","vihar","vanshika"] },
      { id: "m-hr-2", t: "13:00", dur: 60, title: "Maple Lawn & Snow — escalation", kind: "client",   client: "Maple Lawn & Snow", attendees: ["dhaval","vihar"] }
    ],
    rayu: [
      { id: "m-ry-1", t: "13:30", dur: 30, title: "Internal review — Saffron reels", kind: "internal", attendees: ["vanshika"] }
    ],
    aadil: []
  };

  /* Per-role focus blocks — the "what should I tackle next" hint shown
     beside each meeting block. Pure copy; mutations not allowed. */
  const FOCUS_BLOCKS = {
    jaydeep:  ["Review the week's churn-risk list", "Sign off on May commission payouts"],
    dhaval:   ["MRR + cash position review", "Look at the 3 paused contracts"],
    shrikant: ["Walk every team's load before standup", "Push Maritime monthly review through"],
    vihar:    ["Clear 2 stuck cards before standup", "Confirm July plans are drafted by Friday"],
    abhishek: ["Send GlobalFinancials proposal before 11", "Trial-end nudges for Upwell and Krishna"],
    vanshika: ["Approve internal-review reels", "Wildflower June calendar — final pass before client"],
    harsh:    ["Pace check before noon — Mosaic + Cedar Ridge", "Log 1 optimization on every account this week"],
    rayu:     ["Finish 2 statics from June plan", "Pull-ahead: start a July reel"],
    aadil:    ["You're over capacity — finish 1 in-flight, then push back", "Hand off 1 piece to Rayu"]
  };

  /* Role-based access — service visibility */
  const ROLE_ACCESS = {
    jaydeep:  { services: ["meta","google","smm"], money: true,  scope: "all",   sales: true },
    dhaval:   { services: ["meta","google","smm"], money: true,  scope: "all",   sales: true },
    shrikant: { services: ["meta","google","smm"], money: true,  scope: "all",   sales: true },
    vihar:    { services: ["meta","google","smm"], money: false, scope: "all",   sales: true },
    abhishek: { services: ["meta","google","smm"], money: false, scope: "sales", sales: true },
    vanshika: { services: ["meta","smm"],          money: false, scope: "mine",  sales: false },
    harsh:    { services: ["meta","google"],       money: false, scope: "mine",  sales: false },
    rayu:     { services: ["meta","smm"],          money: false, scope: "designer", sales: false },
    aadil:    { services: ["meta","smm"],          money: false, scope: "designer", sales: false }
  };

  /* Service display config */
  const SERVICE_INFO = {
    meta:   { label: "Meta Ads",     short: "Meta",   color: "#4267B2" },
    google: { label: "Google Ads",   short: "Google", color: "#34A853" },
    smm:    { label: "Social Media", short: "SMM",    color: "#7A5BA8" }
  };

  /* ─────────────────────────────────────────────────────────────────
     CLIENT STATUS — per-service lifecycle states.
     Every contract carries an independent status. Top-level
     `profile.status` is derived: if all services cancelled → cancelled;
     all paused → paused; any active → active; else onboarding.
     ───────────────────────────────────────────────────────────────── */
  const STATUS_DEFS = {
    onboarding: { label: "Onboarding",  color: "#B98426", tint: "#F5EAD0", dot: "#B98426", visibleOnBoards: true,  inMRR: false, autoTasks: true  },
    active:     { label: "Active",      color: "#2F7A57", tint: "#E1EFE6", dot: "#2F7A57", visibleOnBoards: true,  inMRR: true,  autoTasks: true  },
    paused:     { label: "Paused",      color: "#4E6FAE", tint: "#DEE5F2", dot: "#4E6FAE", visibleOnBoards: false, inMRR: false, autoTasks: false },
    cancelled:  { label: "Cancelled",   color: "#6E665C", tint: "#EFE9DD", dot: "#A09689", visibleOnBoards: false, inMRR: false, autoTasks: false }
  };

  /* Commission rules per sales role.
     Standard PPC Guru cadence (per Jaydeep): salesperson earns a
     higher % the first month a deal is signed, then a recurring %
     for months 2-6 the client stays, then 0 after month 6.       */
  const COMMISSION_RULES = {
    abhishek: { firstMonth: 0.05, monthsTwoToSix: 0.03, afterSix: 0,    monthlyTarget3xSalary: true }
  };

  /* Reference pricing — used as quick-pick defaults when a salesperson
     adds a new client. Values are the typical management fee charged. */
  const PRICING_GUIDE = {
    meta:   [{ tier: "starter",  fee: 1500 }, { tier: "growth",  fee: 3500 }, { tier: "anchor", fee: 6800 }],
    google: [{ tier: "starter",  fee: 1200 }, { tier: "growth",  fee: 2500 }, { tier: "anchor", fee: 5500 }],
    smm:    [{ tier: "starter",  fee: 1000 }, { tier: "growth",  fee: 1800 }, { tier: "anchor", fee: 3200 }]
  };

  /* Creative refresh defaults — drives the day-35 auto-task to Vanshika. */
  const CREATIVE_REFRESH = {
    cadenceDays: 45,    /* full cycle target */
    alertAtDay:  35     /* fire reminder at day 35 (10-day runway) */
  };

  /* ─────────────────────────────────────────────────────────────────
     CLIENT PROFILES — the single source of truth for every client.
     Keyed by `name` (cards reference clients by name today).
     Rich profiles are spelled out for the most visible clients;
     anything else uses a generated template so the panel never empties.
     ───────────────────────────────────────────────────────────────── */

  const todayISO = () => new Date().toISOString().slice(0,10);
  const t = (rel) => rel; // human-readable timestamps for the demo

  const PROFILES_RICH = {
    "Maritime Realty": {
      status: "active", services: ["meta"], niche: "Real Estate",
      currency: "CAD", mrr: 3800, startDate: "May 12, 2024", lifetimeMos: 18,
      owners: { am: "vihar", ads: "harsh", creative: "vanshika" },
      contact: { name: "Jess Cormier", role: "Marketing Director", email: "jess@maritimerealty.ca", phone: "+1 902 555 0144", timezone: "Atlantic (UTC-4)", pref: "Email" },
      brief: {
        overview: "Boutique brokerage covering Halifax, Dartmouth, and the South Shore. Mix of luxury waterfront and first-time-buyer condos. Differentiate on local market knowledge + slow-marketing aesthetic.",
        audience: ["Move-up buyers 35-55", "Out-of-province buyers (ON, AB)", "Luxury sellers $1M+"],
        goals: ["20 qualified seller leads / mo", "Reduce CPA below $40", "Build email list for monthly market report"],
        usps: ["18 agents — every listing gets a senior", "Free pre-listing valuation video", "First brokerage in NS with 3D Matterport on every listing"],
        avoid: ["Generic stock photos of houses", "Aggressive 'sell fast' language", "Comparisons to other named brokerages"],
        geo: "HRM + Lunenburg County + St. Margaret's Bay",
        brandKit: "drive.google.com/maritime-brand-2024"
      },
      accounts: [
        { platform: "Meta Business Manager", name: "Maritime Realty (BM 31840…)", access: "ok", note: "Admin" },
        { platform: "Meta Ad Account",       name: "Maritime Realty Ads",         access: "ok" },
        { platform: "Facebook Page",          name: "@maritimerealty",             access: "ok" },
        { platform: "Instagram",              name: "@maritime.realty",            access: "ok" },
        { platform: "Looker Studio",          name: "Maritime — Monthly",          access: "ok", note: "Auto-refresh daily" },
        { platform: "GA4",                    name: "maritimerealty.ca",           access: "ok" }
      ],
      findings: {
        keywords: [],
        competitors: [
          { name: "Royal LePage Atlantic", note: "Heavy on luxury listings, weak buyer-side funnel" },
          { name: "Engel & Völkers Halifax", note: "Strong brand, expensive — leaves opening on $400-700k segment" }
        ],
        audit: [],
        summary: "Buyer-side leads come cheap (~$22) but seller-side ($75-110) needs lookalike from CRM."
      },
      notes: [
        { id: "n-mr-1", category: "monthly", title: "October monthly review",
          body: "Spend $4,820. 142 conv. CPA $33.9 (target ≤$40). CTR healthy at 2.1%. Wins: new agent profile video creative drove 38% of leads. Concerns: South Shore lookalike fatiguing — refresh creative for Nov.",
          who: "harsh", when: "Oct 28, 2025 · 11:30" },
        { id: "n-mr-2", category: "optimization", title: "Audience refresh — South Shore",
          body: "Built new 2% lookalike off Oct CRM upload (412 qualified buyers). Old lookalike paused, not deleted — running 70/30 split for 7 days to confirm.",
          who: "harsh", when: "Oct 22, 2025 · 09:14" },
        { id: "n-mr-3", category: "weekly", title: "Weekly sync — Oct 14",
          body: "Discussed Sable Island listing creative direction. Jess wants drone footage prioritized. Agreed: 2 reels + 1 carousel by Oct 21.",
          who: "vanshika", when: "Oct 14, 2025 · 14:00" },
        { id: "n-mr-4", category: "meeting", title: "Quarterly strategy call",
          body: "Q4 push on luxury segment. Budget bump approved: $4,000 → $4,800/mo for Nov-Dec. Adding 'Just Sold' creative format. Looker dashboard sharing with Jess's broker (Tim).",
          who: "vihar", when: "Oct 02, 2025 · 10:00" },
        { id: "n-mr-5", category: "internal", title: "Concentration flag",
          body: "Anchor-ish account — keep service level high. Tim (broker) reviewed dashboard Oct, was happy.",
          who: "jaydeep", when: "Sep 30, 2025" }
      ],
      files: [
        { name: "Maritime — Brief 2024 v3.pdf",   kind: "pdf", size: "1.8 MB", when: "May 18, 2024",  who: "abhishek" },
        { name: "Brand guidelines.pdf",            kind: "pdf", size: "4.2 MB", when: "May 18, 2024",  who: "abhishek" },
        { name: "October — Creative pack.zip",     kind: "zip", size: "84 MB",  when: "Oct 03, 2025",  who: "vanshika" },
        { name: "Looker — Monthly export.pdf",     kind: "pdf", size: "640 KB", when: "Oct 28, 2025",  who: "harsh" }
      ],
      activity: [
        { who: "Harsh", when: "Today, 09:14", text: "Logged optimization: paused 4 keywords (–8% projected CPA)." },
        { who: "Vanshika", when: "Yesterday", text: "Uploaded 2 new reels for review." },
        { who: "Jess (client)", when: "2 days ago", text: "Replied to creative approval — go ahead on reels." }
      ],
      performance: { spend: 4820, conv: 142, cpa: 33.9, ctr: 2.1, trend: [22,24,28,21,26,30,33] }
    },

    "FreshLeaf Cannabis Co.": {
      status: "active", services: ["meta"], niche: "Retail / Cannabis",
      currency: "USD", mrr: 6800, startDate: "Mar 04, 2024", lifetimeMos: 20,
      owners: { am: "jaydeep", ads: "harsh", creative: "vanshika" },
      contact: { name: "Dana Whitfield", role: "Director of Growth", email: "dana@freshleaf.co", phone: "+1 720 555 0181", timezone: "Mountain (UTC-7)", pref: "Slack" },
      brief: {
        overview: "Multi-state dispensary chain (CO, MI, NM). Strict Meta compliance — no product imagery in ads, lifestyle/wellness angle only. Anchor account.",
        audience: ["Wellness-curious 30-55", "Existing customers (retention)", "First-time legal buyers"],
        goals: ["Drive in-store foot traffic (CO, MI)", "Grow loyalty app installs", "Lower CPA below $50"],
        usps: ["Locally owned", "Hand-sourced flower from 4 small farms", "Loyalty program: $5 back / $50 spent"],
        avoid: ["Product imagery (Meta policy)", "Health claims", "Pricing in copy"],
        geo: "Denver, Boulder, Detroit, Albuquerque",
        brandKit: "drive.google.com/freshleaf-2024"
      },
      accounts: [
        { platform: "Meta BM", name: "FreshLeaf (BM 47210…)", access: "ok", note: "Restricted advertiser" },
        { platform: "Meta Ad Account", name: "FreshLeaf Ads", access: "ok" },
        { platform: "Looker Studio", name: "FreshLeaf — Multi-Store", access: "ok" }
      ],
      findings: { keywords: [], competitors: [{ name: "Native Roots", note: "Aggressive loyalty push" }], audit: [], summary: "" },
      notes: [
        { id: "n-fl-1", category: "monthly", title: "October review — CPA drift",
          body: "Spend $9,320. 168 conv. CPA $55.5 (target $50). CTR slipping to 1.8%. Action: refresh top-3 creative, kill 2 underperforming audiences, A/B new lifestyle direction (autumn/cozy angle).",
          who: "harsh", when: "Oct 30, 2025 · 16:20" },
        { id: "n-fl-2", category: "internal", title: "Anchor account — 18% of MRR",
          body: "Highest single-client revenue. Quarterly business review owed by mid-Nov. Jaydeep to call Dana directly.",
          who: "jaydeep", when: "Oct 28, 2025" },
        { id: "n-fl-3", category: "optimization", title: "Audience cleanup",
          body: "Removed 'cannabis enthusiasts' interest cluster (Meta is downranking). Now only behavioral + lookalike.",
          who: "harsh", when: "Oct 15, 2025" }
      ],
      files: [
        { name: "FreshLeaf — Brief.pdf", kind: "pdf", size: "2.1 MB", when: "Mar 04, 2024", who: "abhishek" },
        { name: "Compliance checklist.pdf", kind: "pdf", size: "320 KB", when: "Mar 04, 2024", who: "abhishek" },
        { name: "October creative pack.zip", kind: "zip", size: "120 MB", when: "Oct 05, 2025", who: "vanshika" }
      ],
      activity: [
        { who: "System", when: "Today, 08:00", text: "Moved to Design Production — designer needed." },
        { who: "Harsh", when: "Yesterday", text: "Audience refresh shipped." }
      ],
      performance: { spend: 9320, conv: 168, cpa: 55.5, ctr: 1.8, trend: [40,46,52,49,55,58,62] }
    },

    "Sundara Immigration": {
      status: "onboarding", services: ["meta"], niche: "Immigration / Legal",
      currency: "CAD", mrr: null, startDate: "Oct 14, 2025", lifetimeMos: 0,
      owners: { am: "vihar", ads: "harsh", creative: "vanshika" },
      contact: { name: "Rahul Iyer", role: "Founder / Lead Consultant", email: "rahul@sundaraimm.com", phone: "+1 416 555 0117", timezone: "Eastern (UTC-5)", pref: "WhatsApp" },
      brief: {
        overview: "RCIC-licensed immigration consultancy specializing in PR and Express Entry from India + UAE. 6 years in business, 80% of clients are referrals.",
        audience: ["Skilled workers 28-40 (India / UAE)", "Recent grads in Canada (PGWP → PR)", "Family sponsorships"],
        goals: ["12-15 qualified consults / mo", "Lower CPL below $35", "Build IG following (currently 1.2k → 5k)"],
        usps: ["100% RCIC, no unlicensed reps", "Fee guarantee — refund if not lodged in 90 days", "Mumbai + Dubai monthly Q&A webinars"],
        avoid: ["Guarantee of approval language", "Stock photos of generic 'happy immigrants'", "Comparison ads"],
        geo: "Targeting India + UAE for inbound; GTA for local follow-up",
        brandKit: "—"
      },
      accounts: [
        { platform: "Meta BM", name: "Sundara Immigration", access: "pending", note: "Awaiting client to invite us" },
        { platform: "Facebook Page", name: "@sundaraimmigration", access: "ok" },
        { platform: "Instagram", name: "@sundara.immigration", access: "pending" }
      ],
      findings: {
        keywords: [],
        competitors: [
          { name: "Canadim", note: "Heavy spender, strong SEO. Avoid direct competition on PR keywords." },
          { name: "Sobirovs", note: "Premium positioning ($$). We can sit below them on price." }
        ],
        audit: [], summary: ""
      },
      notes: [
        { id: "n-si-1", category: "meeting", title: "Discovery call — Oct 16",
          body: "60-min call. Rahul wants to ship campaigns by Nov 1. Budget: $2,500 CAD/mo. Hot buttons: speed-to-launch, transparency on what we're testing. Mentioned bad experience with previous agency (over-promised conversions).",
          who: "harsh", when: "Oct 16, 2025 · 11:00" },
        { id: "n-si-2", category: "internal", title: "BLOCKER — concepts sitting 7 days",
          body: "Concepts sent Oct 19. No response. Rahul is in Mumbai this week — try WhatsApp not email. Vihar to nudge.",
          who: "vihar", when: "Oct 26, 2025" },
        { id: "n-si-3", category: "weekly", title: "Research scan",
          body: "PR + Express Entry queries are highly competitive on Meta. Recommendation: lead with consult-CTA + free assessment quiz, not 'Apply now' direct.",
          who: "vanshika", when: "Oct 21, 2025" }
      ],
      files: [
        { name: "Sundara — Onboarding form.pdf", kind: "pdf", size: "480 KB", when: "Oct 14, 2025", who: "client" },
        { name: "Concepts v1 (3 directions).pdf", kind: "pdf", size: "12 MB",  when: "Oct 19, 2025", who: "vanshika" }
      ],
      activity: [
        { who: "Vihar", when: "Yesterday", text: "Sent WhatsApp nudge to Rahul." },
        { who: "Vanshika", when: "Oct 19", text: "Uploaded 3 concept directions." }
      ],
      performance: null
    },

    "Riverstone Law": {
      status: "onboarding", services: ["google"], niche: "Legal",
      currency: "CAD", mrr: null, startDate: "Oct 22, 2025", lifetimeMos: 0,
      owners: { am: "vihar", ads: "harsh", creative: null },
      contact: { name: "Anya Petrov", role: "Office Manager", email: "anya@riverstonelaw.ca", phone: "+1 604 555 0173", timezone: "Pacific (UTC-8)", pref: "Email" },
      brief: {
        overview: "BC personal injury firm, 8 lawyers. High-ticket vertical — single case can be $50k+ in fees. Heavy reliance on referrals; want Google to fill top-of-funnel.",
        audience: ["Recent accident victims (last 60 days)", "ICBC dispute cases"],
        goals: ["3-5 qualified consults / mo", "Defensible CPA up to $120", "Avoid intake from out-of-province"],
        usps: ["No-win-no-fee", "30+ years combined experience", "Free first consult — same day"],
        avoid: ["Aggressive ambulance-chaser tone", "Generic stock 'gavel' imagery"],
        geo: "Lower Mainland + Vancouver Island",
        brandKit: "—"
      },
      accounts: [
        { platform: "Google Ads", name: "Riverstone Law (8472-…)", access: "ok", note: "Read+modify granted Oct 23" },
        { platform: "GA4", name: "riverstonelaw.ca", access: "pending", note: "Awaiting tag manager access" },
        { platform: "Looker Studio", name: "—", access: "not-yet" }
      ],
      findings: {
        keywords: [
          { term: "personal injury lawyer vancouver", vol: "1.6k/mo", cpc: "$32", intent: "high" },
          { term: "icbc dispute lawyer", vol: "590/mo", cpc: "$28", intent: "high" },
          { term: "car accident lawyer no win no fee bc", vol: "210/mo", cpc: "$24", intent: "very high" },
          { term: "free injury consultation surrey", vol: "140/mo", cpc: "$18", intent: "high" }
        ],
        competitors: [
          { name: "Murphy Battista", note: "Dominant in this market — 20+ year ad presence" },
          { name: "Preszler Injury Lawyers", note: "National player, less local SEO" }
        ],
        audit: [
          { label: "Site speed (mobile)", status: "warn", note: "3.8s LCP — recommend client side-fix" },
          { label: "Call tracking installed", status: "danger", note: "Not yet — blocking accurate CPA" },
          { label: "Conversion goals in GA4", status: "danger", note: "Pending tag manager access" },
          { label: "Landing page match", status: "ok", note: "Per-service landing pages exist" }
        ],
        summary: "High-CPA vertical but defensible at $80-110 CPA. Call tracking is the #1 blocker — without it, CPA reports are unreliable."
      },
      notes: [
        { id: "n-rl-1", category: "meeting", title: "Discovery call — Oct 24",
          body: "Anya, Mark (managing partner), us. Mark cares about lead quality > volume. Budget approved $2,500/mo. Wants weekly snapshot via email, not full Looker dive.",
          who: "harsh", when: "Oct 24, 2025 · 14:30" },
        { id: "n-rl-2", category: "optimization", title: "Keyword research log",
          body: "Top intent terms (see Findings tab). Excluded: 'lawyer salary', 'lawyer jobs', 'icbc claim status' (informational, not commercial).",
          who: "harsh", when: "Oct 28, 2025" },
        { id: "n-rl-3", category: "internal", title: "Access pending — non-blocking",
          body: "Google Ads access granted. GA4 access still pending — flagging client side. Per process, we can advance to keyword stage (non-blocking flag).",
          who: "harsh", when: "Oct 28, 2025" }
      ],
      files: [
        { name: "Riverstone — Onboarding form.pdf", kind: "pdf", size: "520 KB", when: "Oct 22, 2025", who: "client" },
        { name: "Keyword research v1.xlsx", kind: "xlsx", size: "84 KB", when: "Oct 28, 2025", who: "harsh" }
      ],
      activity: [
        { who: "Harsh", when: "Yesterday", text: "Logged keyword research v1." },
        { who: "Anya (client)", when: "Oct 23", text: "Granted Google Ads access." }
      ],
      performance: null
    },

    "Bluestone Construction": {
      status: "active", services: ["meta"], niche: "Construction",
      currency: "CAD", mrr: 4500, startDate: "Jul 02, 2024", lifetimeMos: 16,
      owners: { am: "vihar", ads: "harsh", creative: "vanshika" },
      contact: { name: "Mike Brennan", role: "Owner", email: "mike@bluestone.ca", phone: "+1 905 555 0102", timezone: "Eastern (UTC-5)", pref: "Phone" },
      brief: {
        overview: "Custom home builder, GTA west. Avg project $1.2-2.5M. Pipeline-driven business — needs steady consult bookings, not impulse buys.",
        audience: ["Move-up homeowners 40-65", "Lot owners building dream home"],
        goals: ["6-10 qualified consults / mo", "CPA below $200 (high-value vertical)", "Build portfolio reel for IG"],
        usps: ["28 years building in Halton", "Net-zero ready designs", "In-house architect"],
        avoid: ["Aggressive 'limited spots' language", "Comparing to 'builder grade' competitors"],
        geo: "Oakville + Burlington + Milton",
        brandKit: "drive.google.com/bluestone-2024"
      },
      accounts: [
        { platform: "Meta BM", name: "Bluestone", access: "ok" },
        { platform: "Looker Studio", name: "Bluestone — Monthly", access: "ok" }
      ],
      findings: { keywords: [], competitors: [], audit: [], summary: "" },
      notes: [
        { id: "n-bs-1", category: "monthly", title: "November briefing call",
          body: "Mike wants 'sustainability' angle pushed in Nov creative — net-zero designs winning awards. New landing page launching Nov 8.",
          who: "vanshika", when: "Oct 30, 2025" },
        { id: "n-bs-2", category: "weekly", title: "Concepts approved",
          body: "Mike approved all 3 directions. Vanshika to start production by Friday.",
          who: "vanshika", when: "Nov 03, 2025" }
      ],
      files: [
        { name: "Bluestone — Brief.pdf", kind: "pdf", size: "1.1 MB", when: "Jul 02, 2024", who: "abhishek" },
        { name: "Portfolio shots (Oct).zip", kind: "zip", size: "240 MB", when: "Oct 18, 2025", who: "client" }
      ],
      activity: [
        { who: "Mike (client)", when: "Today", text: "Approved Nov concepts." }
      ],
      performance: { spend: 4900, conv: 96, cpa: 51.0, ctr: 1.7, trend: [46,49,50,55,52,49,51] }
    },

    "Wildflower Bakery": {
      status: "active", services: ["smm"], niche: "Restaurant / Café",
      currency: "CAD", mrr: 1200, startDate: "Aug 15, 2024", lifetimeMos: 15,
      owners: { am: "vihar", ads: null, creative: "vanshika" },
      contact: { name: "Lina Holm", role: "Owner / Head Baker", email: "lina@wildflowerbakery.ca", phone: "+1 613 555 0144", timezone: "Eastern (UTC-5)", pref: "DM / Instagram" },
      brief: {
        overview: "Single-location craft bakery, Old Ottawa South. Sourdough, viennoiserie, seasonal pies. Wholesale to 3 cafés. Wants IG presence to drive both retail walk-ins and wholesale inquiries.",
        audience: ["Local food enthusiasts 25-55", "Wedding/event customers", "Wholesale cafés"],
        goals: ["6 posts / mo", "Grow IG to 8k (currently 4.2k)", "Drive Sunday brunch traffic"],
        usps: ["Wild-yeast sourdough, 36-hour ferment", "Seasonal-only menu", "Cookbook coming spring 2026"],
        avoid: ["Generic 'bread is life' captions", "Overly polished/staged shots — keep raw/honest"],
        geo: "Ottawa core",
        brandKit: "drive.google.com/wildflower"
      },
      accounts: [
        { platform: "Instagram", name: "@wildflower.bakery", access: "ok" },
        { platform: "Facebook Page", name: "@wildflowerbakery", access: "ok" },
        { platform: "Meta BM", name: "Wildflower", access: "ok" }
      ],
      findings: { keywords: [], competitors: [], audit: [], summary: "" },
      notes: [
        { id: "n-wf-1", category: "monthly", title: "November content calendar",
          body: "Theme: 'Hearth — winter sourdough'. 6 posts planned: 2 reels (laminated dough process, monthly bake-along), 4 statics. Sunday brunch focus for last 2.",
          who: "vanshika", when: "Oct 28, 2025" },
        { id: "n-wf-2", category: "weekly", title: "Engagement check",
          body: "Followers +84 last week. Top post: Tarte Tatin reel (12k views). Wholesale inquiry from Brouhaha Café via DM.",
          who: "vanshika", when: "Oct 24, 2025" }
      ],
      files: [
        { name: "Wildflower — Brand kit.pdf", kind: "pdf", size: "3.8 MB", when: "Aug 15, 2024", who: "client" }
      ],
      activity: [{ who: "Vanshika", when: "Today", text: "Drafted Nov calendar." }],
      performance: null
    },

    "Cedarwood Physio": {
      status: "active", services: ["meta"], niche: "Physiotherapy",
      currency: "CAD", mrr: 2500, startDate: "Apr 22, 2024", lifetimeMos: 19,
      owners: { am: "vihar", ads: "harsh", creative: "vanshika" },
      contact: { name: "Dr. Aman Kapoor", role: "Clinic Director", email: "aman@cedarwoodphysio.ca", phone: "+1 403 555 0190", timezone: "Mountain (UTC-7)", pref: "Email" },
      brief: {
        overview: "3-location physio clinic in Calgary. Direct-billing to most insurers. Niche: post-surgical knee/hip rehab + sports recovery for amateur athletes.",
        audience: ["Active adults 30-65", "Post-surgery patients", "Local sports clubs"],
        goals: ["40-60 new patient bookings / mo across 3 locations", "Lower CPL below $30"],
        usps: ["Direct-billing — no out-of-pocket", "Same-week appointments", "30-min initial assessment free"],
        avoid: ["Medical claims", "Before/after imagery"],
        geo: "Calgary NW, NE, S",
        brandKit: "—"
      },
      accounts: [{ platform: "Meta BM", name: "Cedarwood Physio", access: "ok" }],
      findings: { keywords: [], competitors: [], audit: [], summary: "" },
      notes: [
        { id: "n-cw-1", category: "monthly", title: "October — CPL drift",
          body: "CPL crept to $45 (target $30). Diagnosis: ad fatigue on lead creative + audience too narrow. Action: refresh 4 statics, broaden lookalike from 1% → 2%.",
          who: "harsh", when: "Oct 28, 2025" }
      ],
      files: [],
      activity: [],
      performance: { spend: 2640, conv: 58, cpa: 45.5, ctr: 1.5, trend: [38,40,41,44,43,46,48] }
    },

    "Maple Lawn & Snow": {
      status: "onboarding", services: ["meta"], niche: "Home Services",
      currency: "CAD", mrr: null, startDate: "Oct 18, 2025", lifetimeMos: 0,
      owners: { am: "vihar", ads: "harsh", creative: "vanshika" },
      contact: { name: "Ben Carruthers", role: "Owner", email: "ben@maplelawnsnow.ca", phone: "+1 905 555 0233", timezone: "Eastern (UTC-5)", pref: "Phone" },
      brief: {
        overview: "Seasonal lawn-care (Apr-Oct) + snow removal (Nov-Mar) contractor, Hamilton area. Mostly residential, growing commercial side.",
        audience: ["Homeowners with 2000+ sqft lots", "Property managers (commercial)", "Seniors (de-icing services)"],
        goals: ["Build seasonal contract list for winter '25-'26", "12 commercial quotes / mo"],
        usps: ["Insured + WSIB", "Salt-light eco mix available", "Per-visit or seasonal contract"],
        avoid: [],
        geo: "Hamilton + Burlington + Ancaster",
        brandKit: "—"
      },
      accounts: [
        { platform: "Meta BM", name: "Maple Lawn", access: "ok" },
        { platform: "Facebook Page", name: "@maplelawnsnow", access: "ok" }
      ],
      findings: { keywords: [], competitors: [], audit: [], summary: "" },
      notes: [
        { id: "n-ml-1", category: "internal", title: "Designer needed",
          body: "Concepts approved — need designer assigned to push production. Aadil is at cap; Rayu has bandwidth.",
          who: "vanshika", when: "Today" }
      ],
      files: [{ name: "Maple Lawn — Onboarding form.pdf", kind: "pdf", size: "390 KB", when: "Oct 18, 2025", who: "client" }],
      activity: [{ who: "System", when: "Today", text: "Moved to Design Production. Designer needed." }],
      performance: null
    },

    /* — Demo profiles for paused / multi-service scenarios — */
    "Northern Lights Auto": {
      status: "active", services: ["meta"], niche: "Auto",
      currency: "CAD", mrr: 2200, startDate: "Feb 02, 2025", lifetimeMos: 14,
      owners: { am: "vihar", ads: "harsh", creative: "vanshika" },
      contact: { name: "Ravi Patel", role: "Service Manager", email: "ravi@northernlightsauto.ca", phone: "+1 705 555 0117", timezone: "Eastern (UTC-5)", pref: "Phone" },
      brief: {
        overview: "Multi-bay auto service shop in Sudbury. Bookings + tire-storage subscriptions.",
        audience: ["Local drivers 25-70", "Seasonal tire customers"],
        goals: ["50 service bookings / mo", "Tire-storage signups in fall"],
        usps: ["Same-day service", "Loaner cars"],
        avoid: ["Price-cut messaging"],
        geo: "Greater Sudbury",
        brandKit: "—"
      },
      accounts: [{ platform: "Meta BM", name: "Northern Lights Auto", access: "ok" }],
      findings: { keywords: [], competitors: [], audit: [], summary: "" },
      notes: [
        { id: "n-nl-1", category: "internal", title: "Payment issue — Meta restricted advertiser",
          body: "Meta flagged the account for a billing card mismatch. Client updating with new corporate card. ETA back live: ~10 days.",
          who: "harsh", when: "May 12, 2026" }
      ],
      files: [],
      activity: [{ who: "Meta", when: "May 12, 2026", text: "Account restricted — pending advertiser verification." }],
      performance: { spend: 830, conv: 18, cpa: 46.1, ctr: 1.3, trend: [85, 92, 70, 58, 0, 0, 0] }
    },

    "Aurora Wellness": {
      status: "active", services: ["google"], niche: "Wellness / Therapy",
      currency: "CAD", mrr: 1800, startDate: "Nov 18, 2024", lifetimeMos: 6,
      owners: { am: "vihar", ads: "harsh", creative: "vanshika" },
      contact: { name: "Hannah Lee", role: "Owner / Therapist", email: "hannah@aurorawellness.ca", phone: "+1 778 555 0181", timezone: "Pacific (UTC-8)", pref: "Email" },
      brief: {
        overview: "Group therapy + yoga + dry-needling clinic, Vancouver. Practitioner-led, single owner.",
        audience: ["Adults 28-55 in West End / Kits", "First-time therapy seekers"],
        goals: ["20 new intakes / mo", "Build yoga membership"],
        usps: ["Sliding-scale pricing", "Direct-billing", "Therapist-owned"],
        avoid: ["Medical claims"],
        geo: "Vancouver West End + Kitsilano",
        brandKit: "—"
      },
      accounts: [{ platform: "Google Ads", name: "Aurora Wellness", access: "ok" }],
      findings: { keywords: [], competitors: [], audit: [], summary: "" },
      notes: [
        { id: "n-aw-1", category: "monthly", title: "Multi-service expansion · added SMM",
          body: "Hannah added SMM service Feb 1 — pure content, 6 posts/mo, focused on therapist-led education.",
          who: "vanshika", when: "Jan 28, 2026" }
      ],
      files: [],
      activity: [],
      performance: { spend: 1540, conv: 41, cpa: 37.6, ctr: 5.0, trend: [62, 65, 68, 70, 72, 75, 76] }
    }
  };

  /* ─────────────────────────────────────────────────────────────────
     PHASE 1 MIGRATION — Per-service contracts on every profile.
     Walk each rich profile and back-fill:
       serviceContracts[svc] = { status, statusSince, statusReason,
                                 monthlyFee, currency, billingSchedule,
                                 contractStart, contractTerm, salesperson,
                                 [creativeRefresh] }
       payments[] (3-6 months of mock receipts + current invoice)
     Then apply explicit overrides for paused / cancelled scenarios.
     ───────────────────────────────────────────────────────────────── */

  function shiftDate(iso, days) {
    const d = parseISOdate(iso); d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }
  function shiftMonth(iso, months) {
    const d = parseISOdate(iso); d.setUTCMonth(d.getUTCMonth() + months);
    return d.toISOString().slice(0, 7) + "-01";
  }
  function parseISOdate(iso) {
    /* Robust: accepts "2024-05-12" OR "May 12, 2024" OR "May 12, 2024 · 14:30" */
    if (!iso) return new Date(NaN);
    const cleaned = String(iso).split("·")[0].trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(cleaned)) {
      const [y, m, d] = cleaned.split("-").map(Number);
      return new Date(Date.UTC(y, m - 1, d || 1));
    }
    const parsed = new Date(cleaned + " UTC");
    return isNaN(parsed.getTime()) ? new Date(cleaned) : parsed;
  }
  function daysBetween(aISO, bISO) {
    return Math.round((parseISOdate(bISO) - parseISOdate(aISO)) / 86400000);
  }

  /* Deterministic pseudo-random based on string (for stable demo data) */
  function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

  Object.entries(PROFILES_RICH).forEach(([name, prof]) => {
    if (prof.serviceContracts) return;
    const services = prof.services || [];
    const monthlyTotal = prof.mrr || 0;
    const perService = services.length ? Math.round(monthlyTotal / services.length) : monthlyTotal;
    prof.serviceContracts = {};
    services.forEach((s, idx) => {
      const stat = prof.status === "onboarding" ? "onboarding" : "active";
      const c = {
        status: stat,
        statusSince: prof.startDate || TODAY,
        statusReason: null,
        monthlyFee: perService,
        currency: prof.currency,
        billingSchedule: "monthly",
        contractStart: prof.startDate || TODAY,
        contractTerm: "month-to-month",
        salesperson: "abhishek"
      };
      if (s === "meta" && stat === "active") {
        /* Last refresh was 8-42 days ago — stable per client */
        const offset = 8 + (hash(name + s) % 35);
        c.creativeRefresh = {
          lastRefreshDate: shiftDate(TODAY, -offset),
          nextDueDate:     shiftDate(TODAY, CREATIVE_REFRESH.cadenceDays - offset),
          cadenceDays: CREATIVE_REFRESH.cadenceDays,
          alertAtDay:  CREATIVE_REFRESH.alertAtDay,
          daysSinceRefresh: offset
        };
      }
      prof.serviceContracts[s] = c;
    });

    /* Targeted overrides so the day-35 creative-refresh auto-rule has
       something to fire on against the demo's hardcoded TODAY. */
    if (name === "Maritime Realty" && prof.serviceContracts?.meta?.creativeRefresh) {
      const cr = prof.serviceContracts.meta.creativeRefresh;
      cr.lastRefreshDate   = shiftDate(TODAY, -40);
      cr.nextDueDate       = shiftDate(TODAY, CREATIVE_REFRESH.cadenceDays - 40);
      cr.daysSinceRefresh  = 40;
    }

    /* Mock payments */
    prof.payments = prof.payments || [];
    if (monthlyTotal > 0 && prof.status === "active") {
      const back = Math.min(prof.lifetimeMos || 4, 6);
      for (let i = back; i >= 1; i--) {
        const d = shiftMonth(TODAY, -i);
        prof.payments.push({
          date: d, amount: monthlyTotal, status: "received",
          invoice: `INV-${d.slice(0,7)}-${(name.replace(/[^A-Za-z]/g,"").slice(0,4) || "XXXX").toUpperCase()}`,
          currency: prof.currency
        });
      }
      const cur = TODAY.slice(0,7) + "-01";
      prof.payments.push({
        date: cur, amount: monthlyTotal,
        status: (hash(name) % 10) >= 4 ? "received" : "outstanding",
        invoice: `INV-${cur.slice(0,7)}-${(name.replace(/[^A-Za-z]/g,"").slice(0,4) || "XXXX").toUpperCase()}`,
        currency: prof.currency
      });
    }
  });

  /* ─── Explicit demo overrides — show off paused & cancelled states ── */

  /* Northern Lights Auto — Meta paused due to payment issue (already in
     pacing screen as `error`; sync the whole client status). */
  if (PROFILES_RICH["Northern Lights Auto"]) {
    const p = PROFILES_RICH["Northern Lights Auto"];
    p.status = "paused";
    if (p.serviceContracts?.meta) {
      p.serviceContracts.meta.status = "paused";
      p.serviceContracts.meta.statusSince = "2026-05-12";
      p.serviceContracts.meta.statusReason = "Payment issue — pending advertiser verification.";
    }
  }

  /* Cedarwood Physio — adds a PAUSED google contract for demo of multi-service
     mixed states (Meta active, Google paused). */
  if (PROFILES_RICH["Cedarwood Physio"]) {
    const p = PROFILES_RICH["Cedarwood Physio"];
    if (!p.services.includes("google")) p.services.push("google");
    p.serviceContracts.google = {
      status: "paused",
      statusSince: "2026-04-28",
      statusReason: "Client wants to focus Meta-only for Q2. Re-evaluate July.",
      monthlyFee: 1500, currency: "CAD",
      billingSchedule: "monthly",
      contractStart: "2025-08-12",
      contractTerm: "month-to-month",
      salesperson: "abhishek"
    };
  }

  /* Aurora Wellness — add SMM contract that's ACTIVE (multi-service expansion). */
  if (PROFILES_RICH["Aurora Wellness"]) {
    const p = PROFILES_RICH["Aurora Wellness"];
    if (!p.services.includes("smm")) p.services.push("smm");
    p.serviceContracts = p.serviceContracts || {};
    p.serviceContracts.smm = {
      status: "active",
      statusSince: "2026-02-01",
      statusReason: null,
      monthlyFee: 1200, currency: "CAD",
      billingSchedule: "monthly",
      contractStart: "2026-02-01",
      contractTerm: "month-to-month",
      salesperson: "abhishek"
    };
  }

  /* New CANCELLED demo client — Glasspoint Eyecare (churned 47 days ago) */
  PROFILES_RICH["Glasspoint Eyecare"] = {
    status: "cancelled", services: ["meta"], niche: "Healthcare / Optometry",
    currency: "CAD", mrr: 2400, startDate: "Sep 14, 2024", lifetimeMos: 7,
    owners: { am: "vihar", ads: "harsh", creative: "vanshika" },
    contact: { name: "Dr. Mira Hassan", role: "Owner", email: "mira@glasspoint.ca", phone: "+1 416 555 0124", timezone: "Eastern (UTC-5)", pref: "Email" },
    brief: {
      overview: "3-location optometry practice in Toronto. Specialty: dry-eye treatment + contact lens fitting.",
      audience: ["Adults 35-65", "Dry-eye sufferers", "Contact lens upgraders"],
      goals: ["20 new patient bookings / mo / location"],
      usps: ["Dry-eye clinic — only one in midtown", "Same-week appointments"],
      avoid: ["Medical claims", "Pricing in copy"],
      geo: "Toronto midtown",
      brandKit: "—"
    },
    accounts: [{ platform: "Meta BM", name: "Glasspoint", access: "revoked", note: "Access revoked Apr 8" }],
    findings: { keywords: [], competitors: [], audit: [], summary: "" },
    notes: [
      { id: "n-gp-1", category: "internal", title: "Cancellation reason",
        body: "Client cited budget cuts (Q2 expansion delayed). Closing call cordial — left door open to return Q4. Last invoice paid in full. Looker access kept live for 60 days post-cancel.",
        who: "vihar", when: "Apr 08, 2026 · 14:30" },
      { id: "n-gp-2", category: "monthly", title: "March final report",
        body: "47 conv. @ $51 CPA, CTR 1.9%. Healthy account — purely a budget call from their side.",
        who: "harsh", when: "Apr 02, 2026" }
    ],
    files: [
      { name: "Final report — March 2026.pdf", kind: "pdf", size: "1.4 MB", when: "Apr 02, 2026", who: "harsh" },
      { name: "Cancellation snapshot.pdf",     kind: "pdf", size: "820 KB", when: "Apr 08, 2026", who: "system" }
    ],
    activity: [
      { who: "System", when: "Apr 08, 2026", text: "Status → Cancelled. Auto-snapshot generated. Looker access expires Jun 08, 2026." }
    ],
    performance: { spend: 2280, conv: 47, cpa: 48.5, ctr: 1.9, trend: [42,44,46,45,47,46,47] },
    serviceContracts: {
      meta: {
        status: "cancelled",
        statusSince: "2026-04-08",
        statusReason: "Budget cuts (Q2 expansion delayed). Door left open for Q4 return.",
        monthlyFee: 2400, currency: "CAD",
        billingSchedule: "monthly",
        contractStart: "2024-09-14",
        contractTerm: "month-to-month",
        salesperson: "abhishek"
      }
    },
    payments: [
      { date: "2025-12-01", amount: 2400, status: "received", invoice: "INV-2025-12-GLAS", currency: "CAD" },
      { date: "2026-01-01", amount: 2400, status: "received", invoice: "INV-2026-01-GLAS", currency: "CAD" },
      { date: "2026-02-01", amount: 2400, status: "received", invoice: "INV-2026-02-GLAS", currency: "CAD" },
      { date: "2026-03-01", amount: 2400, status: "received", invoice: "INV-2026-03-GLAS", currency: "CAD" },
      { date: "2026-04-01", amount: 2400, status: "received", invoice: "INV-2026-04-GLAS-FINAL", currency: "CAD" }
    ]
  };

  /* ─── Derived helpers ─────────────────────────────────────────────── */
  function getDerivedStatus(profile) {
    if (!profile) return "active";
    if (profile.status === "onboarding") return "onboarding";
    const contracts = profile.serviceContracts || {};
    const statuses = Object.values(contracts).map(c => c.status);
    if (statuses.length === 0) return profile.status || "active";
    if (statuses.every(s => s === "cancelled")) return "cancelled";
    if (statuses.every(s => s === "paused" || s === "cancelled")) return "paused";
    if (statuses.some(s => s === "active")) return "active";
    return statuses[0];
  }

  /* MRR contribution = only active service contracts. */
  function profileMRR(profile, currency = null) {
    if (!profile?.serviceContracts) return 0;
    let total = 0;
    Object.values(profile.serviceContracts).forEach(c => {
      if (c.status !== "active") return;
      if (currency && c.currency !== currency) return;
      total += c.monthlyFee || 0;
    });
    return total;
  }

  /* Creative-refresh: returns { daysSince, daysUntilDue, dueSoon, overdue, lastRefresh } */
  function creativeRefreshState(contract, today = TODAY) {
    if (!contract?.creativeRefresh) return null;
    const cr = contract.creativeRefresh;
    const daysSince = daysBetween(cr.lastRefreshDate, today);
    const daysUntilDue = daysBetween(today, cr.nextDueDate);
    const dueSoon = daysSince >= cr.alertAtDay && daysSince < cr.cadenceDays;
    const overdue = daysSince >= cr.cadenceDays;
    return { ...cr, daysSince, daysUntilDue, dueSoon, overdue };
  }

  /* Commission earned by salesperson over a window.
     Walks every contract and computes per-month commission.
     For the current month, contracts in their N'th billing month
     earn at the appropriate rate (firstMonth → 5%, 2-6 → 3%, 7+ → 0). */
  function commissionEarned(salesId, monthISO = TODAY.slice(0,7) + "-01") {
    const rules = COMMISSION_RULES[salesId];
    if (!rules) return { total: 0, byClient: [] };
    let total = 0;
    const byClient = [];
    Object.entries(PROFILES_RICH).forEach(([name, prof]) => {
      const contracts = prof.serviceContracts || {};
      Object.entries(contracts).forEach(([service, c]) => {
        if (c.salesperson !== salesId) return;
        if (c.status === "cancelled" && c.statusSince < monthISO) return;
        const start = c.contractStart || c.statusSince;
        if (!start) return;
        const monthsLive = Math.max(0,
          (parseISOdate(monthISO).getUTCFullYear() - parseISOdate(start).getUTCFullYear()) * 12 +
          (parseISOdate(monthISO).getUTCMonth()    - parseISOdate(start).getUTCMonth())
        );
        let rate = 0;
        if (monthsLive === 0)       rate = rules.firstMonth;
        else if (monthsLive < 6)    rate = rules.monthsTwoToSix;
        else                        rate = rules.afterSix;
        const earn = (c.monthlyFee || 0) * rate;
        if (earn > 0) {
          total += earn;
          byClient.push({ client: name, service, fee: c.monthlyFee, currency: c.currency, monthsLive, rate, earn });
        }
      });
    });
    return { total, byClient };
  }

  /* Generate a minimal-but-valid template for any client that doesn't have a rich profile yet.
     This makes "click any card anywhere → see SOMETHING reasonable" work universally. */
  function generateTemplate(name, card) {
    const service = card?.service || "meta";
    const niche = card?.niche || "—";
    const isActive = (window.PPC?.ACT_CARDS || []).some(c => c.name === name);
    return {
      status: isActive ? "active" : (card ? "onboarding" : "active"),
      services: [service],
      niche, currency: card?.currency || "CAD",
      mrr: card?.mrr || null,
      startDate: "—", lifetimeMos: 0,
      owners: { am: "vihar", ads: service === "google" ? "harsh" : (service === "smm" ? null : "harsh"), creative: service === "google" ? null : "vanshika" },
      contact: { name: "Primary contact", role: "—", email: "—", phone: "—", timezone: "—", pref: "Email" },
      brief: {
        overview: "Brief not filled in yet — capture key context from kickoff call here.",
        audience: [], goals: [], usps: [], avoid: [], geo: "—", brandKit: "—"
      },
      accounts: [], findings: { keywords: [], competitors: [], audit: [], summary: "" },
      notes: [], files: [], activity: [],
      performance: null,
      serviceContracts: {
        [service]: {
          status: isActive ? "active" : "onboarding",
          statusSince: TODAY, statusReason: null,
          monthlyFee: card?.mrr || 0, currency: card?.currency || "CAD",
          billingSchedule: "monthly", contractStart: TODAY,
          contractTerm: "month-to-month", salesperson: "abhishek"
        }
      },
      payments: []
    };
  }

  /* ─────────────────────────────────────────────────────────────────
     RICH TASK STORE — full detail records with checklist, links, comments, etc.
     The id-prefixed `auto-…` legacy id format from tasks.jsx still works because
     we merge auto-generated card-tasks at read time.
     ───────────────────────────────────────────────────────────────── */
  /* ── Fresh task database (real-clock anchored). 5 fully-widgeted tasks per
     employee, spread across today / tomorrow / this week so Today, Upcoming,
     Calendar and the board all show real, current data. Rebuilt 2026-06. ──── */
  const _RT0 = new Date(); _RT0.setHours(0, 0, 0, 0);
  const rISO = (days) => { const d = new Date(_RT0); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
  const rLabel = (days) => days === 0 ? "Today" : days === 1 ? "Tomorrow" : new Date(rISO(days) + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const _mkTask = (id, who, s) => ({
    id, title: s.t, description: s.desc || "",
    assignee: who, reporter: s.rep || who, watchers: s.w || [],
    due: rLabel(s.dueOff), dueISO: rISO(s.dueOff), dueTime: s.time || null,
    priority: s.p || "med", status: "open",
    client: s.c || null, service: s.svc || null, services: s.svc ? [s.svc] : [],
    links: [], checklist: (s.subs || []).map((x, i) => ({ id: id + "-c" + i, text: x, done: false })),
    attachments: [], comments: [], labels: s.lbl || [], reminders: [],
    timeEstimateMin: s.est != null ? s.est : null, timeSpentMin: 0, timerStartedAt: null,
    deadlineISO: s.dlOff != null ? rISO(s.dlOff) : null, recur: null, projectId: null,
    createdISO: rISO(0), completedISO: null, createdAt: "Today"
  });
  /* per employee: 3 due today (varied → clean #1/#2/#3 ranking), 1 tomorrow, 1 later */
  const TASK_SPECS = {
    jaydeep: [
      { t: "Approve May commission payouts", p: "high", dueOff: 0, time: "10:00", est: 30, lbl: ["urgent"], w: ["dhaval"], dlOff: 0, subs: ["Review Abhishek's sheet", "Confirm 3x target", "Sign off"], desc: "Finance needs sign-off before the payroll run." },
      { t: "Owners sync — Q3 priorities", p: "high", dueOff: 0, time: "09:00", est: 60, w: ["dhaval", "shrikant"] },
      { t: "Review GlobalFinancials proposal", p: "med", dueOff: 0, time: "15:00", est: 20, c: "GlobalFinancials", svc: "sales" },
      { t: "Interview — senior PM candidate", p: "med", dueOff: 1, time: "14:00", est: 45 },
      { t: "Draft investor update", p: "low", dueOff: 3, time: "11:00", est: 90, lbl: ["work"], subs: ["MRR chart", "Churn note", "Hiring plan"] }
    ],
    dhaval: [
      { t: "Reconcile May P&L", p: "high", dueOff: 0, time: "10:00", est: 90, lbl: ["urgent"], dlOff: 0, subs: ["Pull Zoho books", "Match bank", "Flag variances"] },
      { t: "Approve new vendor contract", p: "med", dueOff: 0, time: "13:00", est: 20 },
      { t: "Ops standup", p: "med", dueOff: 0, time: "09:30", est: 15, w: ["shrikant"] },
      { t: "Renew software licenses", p: "low", dueOff: 1, time: "11:00", est: 30 },
      { t: "Quarterly capacity plan", p: "med", dueOff: 4, time: "14:00", est: 60, w: ["shrikant", "vihar"] }
    ],
    shrikant: [
      { t: "Escalation — Stonebridge approval stuck", p: "high", dueOff: 0, time: "11:00", est: 30, c: "Stonebridge Homes", svc: "smm", w: ["vihar"], dlOff: 0, subs: ["Call client", "Reset SLA clock"] },
      { t: "QA — Maritime Meta creative pack", p: "high", dueOff: 0, time: "14:00", est: 45, c: "Maritime Realty", svc: "meta" },
      { t: "Delivery sync + capacity", p: "med", dueOff: 0, time: "09:30", est: 30, w: ["vihar", "vanshika", "harsh"] },
      { t: "Review onboarding SLA misses", p: "med", dueOff: 1, time: "10:00", est: 45 },
      { t: "Update service catalog stages", p: "low", dueOff: 5, est: 60 }
    ],
    vihar: [
      { t: "Churn-risk check-in — Northern Lights", p: "high", dueOff: 0, time: "11:00", est: 30, c: "Northern Lights Auto", svc: "meta", dlOff: 0, subs: ["Review pause reason", "Draft win-back"] },
      { t: "Monthly review — FreshLeaf", p: "high", dueOff: 0, time: "15:00", est: 60, c: "FreshLeaf Cannabis Co.", svc: "meta", w: ["harsh"] },
      { t: "Onboarding kickoff — Harbour Auto Body", p: "med", dueOff: 0, time: "13:00", est: 30, c: "Harbour Auto Body", svc: "google" },
      { t: "Prep Maritime monthly review", p: "med", dueOff: 1, time: "10:00", est: 45, c: "Maritime Realty" },
      { t: "Cedarwood win-back call", p: "med", dueOff: 2, time: "14:00", est: 20, c: "Cedarwood Physio" }
    ],
    abhishek: [
      { t: "Demo call — Aurora Wellness", p: "high", dueOff: 0, time: "13:00", est: 30, c: "Aurora Wellness", svc: "sales", dlOff: 0, subs: ["Prep deck", "Send recap"] },
      { t: "Send proposal — Pinecrest Dental", p: "high", dueOff: 0, time: "11:00", est: 30, c: "Pinecrest Dental", svc: "sales", lbl: ["urgent"] },
      { t: "Follow up — GlobalFinancials", p: "med", dueOff: 0, time: "16:00", est: 15, c: "GlobalFinancials", svc: "sales" },
      { t: "Qualify new Meta leads (5)", p: "med", dueOff: 1, time: "10:00", est: 45, svc: "sales" },
      { t: "Pipeline review prep", p: "low", dueOff: 3, est: 30, w: ["jaydeep"] }
    ],
    vanshika: [
      { t: "Creative refresh — Maritime Meta", p: "high", dueOff: 0, time: "10:00", est: 45, c: "Maritime Realty", svc: "meta", dlOff: 0, subs: ["Brief new angle", "Assign editor"] },
      { t: "Approve Wildflower June calendar", p: "high", dueOff: 0, time: "14:00", est: 30, c: "Wildflower Bakery", svc: "smm", w: ["rayu"] },
      { t: "Internal review — Aurora reels", p: "med", dueOff: 0, time: "16:00", est: 30, c: "Aurora Wellness", svc: "smm", w: ["aadil"] },
      { t: "Plan July content themes", p: "med", dueOff: 1, time: "11:00", est: 60, svc: "smm" },
      { t: "Editor workload check", p: "low", dueOff: 2, est: 20, w: ["rayu", "aadil"] }
    ],
    harsh: [
      { t: "Pause underperforming keywords — Pinecrest", p: "high", dueOff: 0, time: "10:00", est: 30, c: "Pinecrest Dental", svc: "google", lbl: ["optimization", "urgent"], dlOff: 0, subs: ["Export 21d report", "Pause 0-conv", "Log opt"] },
      { t: "Fix Maritime Meta overpacing", p: "high", dueOff: 0, time: "13:00", est: 45, c: "Maritime Realty", svc: "meta" },
      { t: "Pull MTD spend report", p: "med", dueOff: 0, time: "16:00", est: 15, lbl: ["report"] },
      { t: "Weekly Google opt log — 3 accounts", p: "med", dueOff: 1, time: "11:00", est: 45, svc: "google" },
      { t: "Northern Lights budget reset", p: "med", dueOff: 3, est: 30, c: "Northern Lights Auto", svc: "meta" }
    ],
    rayu: [
      { t: "Edit Aurora reel 1", p: "high", dueOff: 0, time: "10:00", est: 270, c: "Aurora Wellness", svc: "smm", dlOff: 1, subs: ["Rough cut", "Captions", "Color"] },
      { t: "Edit Aurora reel 2", p: "med", dueOff: 0, time: "14:00", est: 270, c: "Aurora Wellness", svc: "smm" },
      { t: "Wildflower statics 1–2", p: "med", dueOff: 0, time: "16:00", est: 45, c: "Wildflower Bakery", svc: "smm" },
      { t: "Maritime reel revisions", p: "med", dueOff: 1, time: "11:00", est: 120, c: "Maritime Realty", svc: "meta" },
      { t: "FreshLeaf statics batch", p: "low", dueOff: 2, est: 90, c: "FreshLeaf Cannabis Co.", svc: "smm" }
    ],
    aadil: [
      { t: "Pinecrest statics 1–4", p: "high", dueOff: 0, time: "10:00", est: 120, c: "Pinecrest Dental", svc: "smm", dlOff: 0, subs: ["Templates", "Copy", "Export"] },
      { t: "Aurora statics 1–3", p: "med", dueOff: 0, time: "13:00", est: 90, c: "Aurora Wellness", svc: "smm" },
      { t: "Harbour Auto Body logo refresh", p: "med", dueOff: 0, time: "15:30", est: 60, c: "Harbour Auto Body" },
      { t: "Wildflower reel thumbnails", p: "low", dueOff: 1, time: "11:00", est: 30, c: "Wildflower Bakery", svc: "smm" },
      { t: "Stonebridge statics", p: "med", dueOff: 4, est: 90, c: "Stonebridge Homes", svc: "smm" }
    ]
  };
  const TASKS_RICH = [];
  Object.keys(TASK_SPECS).forEach(who => TASK_SPECS[who].forEach((s, i) => TASKS_RICH.push(_mkTask("tk-" + who + "-" + (i + 1), who, s))));

  /* Completed tasks (this week, weekday-spread) so Reporting + Team report have
     real numbers: 1 done today + 1 done earlier this week per employee. */
  const _doneSpec = {
    jaydeep: ["Weekly leadership review", "Sign off April commissions"],
    dhaval: ["Approve Q2 budget", "Vendor payment run"],
    shrikant: ["Delivery standup", "Resolve Cedarwood escalation"],
    vihar: ["Maritime weekly check-in", "Stonebridge status call"],
    abhishek: ["Discovery call — new lead", "Send recap — Aurora"],
    vanshika: ["Approve FreshLeaf statics", "Wildflower reel review"],
    harsh: ["Daily budget pacing — 6 accts", "Pinecrest search-terms audit"],
    rayu: ["Edit Maritime reel 3", "FreshLeaf reel cut"],
    aadil: ["Lumiere statics 1–4", "Aurora thumbnail set"]
  };
  Object.keys(_doneSpec).forEach(who => {
    _doneSpec[who].forEach((title, i) => {
      const day = i === 0 ? rISO(0) : rISO(-2);
      TASKS_RICH.push({
        id: "tkd-" + who + "-" + i, title, description: "",
        assignee: who, reporter: who, watchers: [],
        due: "Done", dueISO: day, dueTime: null, priority: i === 0 ? "med" : "low", status: "done",
        client: null, service: null, services: [],
        links: [], checklist: [], attachments: [], comments: [], labels: [], reminders: [],
        timeEstimateMin: 30, timeSpentMin: i === 0 ? 25 : 35, timerStartedAt: null,
        deadlineISO: null, recur: null, projectId: null,
        createdISO: day, completedISO: day, createdAt: day
      });
    });
  });

  /* duration buckets + due/label helpers (restored alongside the new task DB) */
  const DURATION_BUCKETS = [
    { id: "1m",    label: "1 min",     maxMin: 1 },
    { id: "5m",    label: "5 min",     maxMin: 5 },
    { id: "5-10",  label: "5–10 min",  maxMin: 10 },
    { id: "10-30", label: "10–30 min", maxMin: 30 },
    { id: "30-60", label: "30–60 min", maxMin: 60 },
    { id: "60+",   label: "60 min+",   maxMin: Infinity }
  ];
  function bucketFor(min) { if (min == null) return null; return DURATION_BUCKETS.find(b => min <= b.maxMin) || DURATION_BUCKETS[DURATION_BUCKETS.length - 1]; }
  const DUE_OFFSET = { "Today": 0, "Tomorrow": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Next Mon": 7, "Yesterday": -1, "Overdue": -3 };
  function dueLabelToISO(due) {
    if (due == null || due === "No date" || due === "Done") return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(due)) return due;          // already ISO
    const off = DUE_OFFSET[due];
    return off == null ? null : shiftDate(nowISO(), off);     // real-clock anchor
  }

  /* ─────────────────────────────────────────────────────────────────
     SMM CONTENT WORKFLOW — quotas + monthly plans + per-deliverable cards.
     One plan per (client, month). Drives the Content Studio screen.
     ───────────────────────────────────────────────────────────────── */

  /* Plan-level pipeline (overall month status) */
  const PLAN_STAGES = [
    { id: "calendar-draft",     label: "Calendar — drafting",  who: "vanshika", color: "#A09689" },
    { id: "calendar-pending",   label: "Calendar w/ client",   who: "client",   color: "#4E6FAE" },
    { id: "calendar-approved",  label: "Calendar approved",    who: "vanshika", color: "#7A5BA8" },
    { id: "in-production",      label: "In production",        who: "editors",  color: "#C5552D" },
    { id: "creative-pending",   label: "Creatives w/ client",  who: "client",   color: "#4E6FAE" },
    { id: "approved",           label: "Approved",             who: "vanshika", color: "#2F7A57" },
    { id: "scheduled",          label: "Scheduled",            who: "vanshika", color: "#2F7A57" },
    { id: "live",               label: "Live this month",      who: "—",        color: "#1B7E55" }
  ];
  const PLAN_STAGE_INDEX = Object.fromEntries(PLAN_STAGES.map((s, i) => [s.id, i]));

  /* Per-deliverable mini-pipeline */
  const DELIV_STAGES = [
    { id: "briefed",         label: "Briefed" },
    { id: "in-production",   label: "In editing" },
    { id: "internal-review", label: "Vanshika review" },
    { id: "client-review",   label: "Client review" },
    { id: "approved",        label: "Approved" },
    { id: "scheduled",       label: "Scheduled" },
    { id: "posted",          label: "Posted" }
  ];

  /* Standing monthly quota per active SMM client */
  const SMM_QUOTAS = {
    "Wildflower Bakery":    { reels: 2, statics: 4, postingDays: "Tue · Sun" },
    "Ironside Gym":         { reels: 3, statics: 5, postingDays: "Mon · Wed · Fri" },
    "Saffron & Spice":      { reels: 6, statics: 0, postingDays: "Tue · Thu · Sat" },
    "Cove Med Spa":         { reels: 5, statics: 5, postingDays: "Mon · Thu" },
    "Birchbark Outfitters": { reels: 4, statics: 6, postingDays: "Wed · Sun" },
    "Solstice Yoga Studio": { reels: 3, statics: 7, postingDays: "Mon · Wed · Sat" }
  };

  /* Time budgets per piece (hours) */
  const TIME_BUDGET = { reel: 4.5, static: 0.75 };

  /* Helper to mass-generate deliverables for a plan */
  function mkDeliverables(prefix, reels, statics, scheduledDays, status, assigneeFn) {
    const out = [];
    for (let i = 0; i < reels; i++) {
      out.push({
        id: `${prefix}-r${i+1}`, type: "reel", slot: i + 1,
        title: `Reel ${i+1}`, caption: "", platform: ["IG","FB"],
        scheduledDate: scheduledDays[i] || null,
        scheduledTime: "10:00",
        assignee: assigneeFn?.("reel", i) ?? "rayu",
        status, timeBudget: TIME_BUDGET.reel, timeSpent: 0, notes: ""
      });
    }
    for (let i = 0; i < statics; i++) {
      out.push({
        id: `${prefix}-s${i+1}`, type: "static", slot: reels + i + 1,
        title: `Static ${i+1}`, caption: "", platform: ["IG"],
        scheduledDate: scheduledDays[reels + i] || null,
        scheduledTime: "10:00",
        assignee: assigneeFn?.("static", i) ?? "aadil",
        status, timeBudget: TIME_BUDGET.static, timeSpent: 0, notes: ""
      });
    }
    return out;
  }

  // Realistic spread of days through a 30-day month
  const spread = (n, max = 30) => {
    if (n <= 0) return [];
    const gap = Math.floor(max / n);
    return Array.from({ length: n }, (_, i) => 2 + i * gap);
  };

  /* Build plans for May (current/live), June (next — must be 100% scheduled by 25th),
     July (working-ahead). Today's date is May 25, 2026 per system info. */

  const _plans = [];
  const PLAN_CLIENTS = Object.keys(SMM_QUOTAS);

  // MAY 2026 — should be LIVE. All clients done.
  PLAN_CLIENTS.forEach(client => {
    const q = SMM_QUOTAS[client];
    const total = q.reels + q.statics;
    const days = spread(total);
    _plans.push({
      id: `cp-${slug(client)}-2026-05`,
      client, month: "2026-05",
      status: "live",
      quota: { ...q },
      calendarApprovedAt: "Apr 24",
      creativesApprovedAt: "Apr 28",
      strategist: "vanshika",
      deliverables: mkDeliverables(`d-${slug(client)}-05`, q.reels, q.statics, days, "posted")
    });
  });

  // JUNE 2026 — most should be scheduled (good!); two clients lag (red alert).
  PLAN_CLIENTS.forEach((client, idx) => {
    const q = SMM_QUOTAS[client];
    const total = q.reels + q.statics;
    const days = spread(total);
    let status, deliverableStatus, calApproved, crApproved;
    if (idx === 0 || idx === 1 || idx === 5) {
      // Wildflower, Ironside, Solstice — on track, fully scheduled
      status = "scheduled";
      deliverableStatus = "scheduled";
      calApproved = "May 14"; crApproved = "May 22";
    } else if (idx === 2 || idx === 3) {
      // Saffron, Cove — production in progress, behind schedule
      status = "in-production";
      deliverableStatus = null; // mixed
      calApproved = "May 16"; crApproved = null;
    } else {
      // Birchbark — calendar still with client (very behind)
      status = "calendar-pending";
      deliverableStatus = "briefed";
      calApproved = null; crApproved = null;
    }
    const plan = {
      id: `cp-${slug(client)}-2026-06`,
      client, month: "2026-06",
      status,
      quota: { ...q },
      calendarApprovedAt: calApproved,
      creativesApprovedAt: crApproved,
      strategist: "vanshika",
      deliverables: mkDeliverables(`d-${slug(client)}-06`, q.reels, q.statics, days, deliverableStatus || "in-production")
    };
    // for "in-production" plans, give a mix of statuses
    if (status === "in-production") {
      plan.deliverables = plan.deliverables.map((d, i) => {
        if (i < plan.deliverables.length * 0.3) return { ...d, status: "approved", timeSpent: d.timeBudget };
        if (i < plan.deliverables.length * 0.55) return { ...d, status: "internal-review", timeSpent: d.timeBudget };
        if (i < plan.deliverables.length * 0.85) return { ...d, status: "in-production", timeSpent: d.timeBudget * 0.6 };
        return { ...d, status: "briefed", timeSpent: 0 };
      });
    }
    _plans.push(plan);
  });

  // JULY 2026 — most clients only at draft / calendar stage; one (Wildflower) is "approved" — pulled-ahead work.
  PLAN_CLIENTS.forEach((client, idx) => {
    const q = SMM_QUOTAS[client];
    const total = q.reels + q.statics;
    const days = spread(total);
    let status, calApproved;
    if (idx === 0) { status = "calendar-approved"; calApproved = "May 22"; }       // ahead
    else if (idx === 1) { status = "calendar-pending"; calApproved = null; }
    else if (idx === 2 || idx === 5) { status = "calendar-draft"; calApproved = null; }
    else { status = null; calApproved = null; }                                    // not started yet
    if (!status) return; // skip
    _plans.push({
      id: `cp-${slug(client)}-2026-07`,
      client, month: "2026-07",
      status,
      quota: { ...q },
      calendarApprovedAt: calApproved,
      creativesApprovedAt: null,
      strategist: "vanshika",
      deliverables: mkDeliverables(`d-${slug(client)}-07`, q.reels, q.statics, days, "briefed")
    });
  });

  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  const CONTENT_PLANS = _plans;

  /* Helpers (placed on PPC for screen use) */
  function getPlan(client, month) {
    return CONTENT_PLANS.find(p => p.client === client && p.month === month);
  }
  function planProgress(plan) {
    if (!plan) return 0;
    const done = plan.deliverables.filter(d =>
      ["approved","scheduled","posted"].includes(d.status)
    ).length;
    return plan.deliverables.length === 0 ? 0 : Math.round((done / plan.deliverables.length) * 100);
  }
  function planLabel(stageId) {
    return PLAN_STAGES.find(s => s.id === stageId)?.label || stageId;
  }
  function monthLabel(monthStr) {
    // "2026-05" -> "May 2026"
    const [y, m] = monthStr.split("-");
    return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString("en-US", { month: "short", year: "numeric" });
  }
  function monthShort(monthStr) {
    const [y, m] = monthStr.split("-");
    return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString("en-US", { month: "short" });
  }
  function monthDaysIn(monthStr) {
    const [y, m] = monthStr.split("-");
    return new Date(parseInt(y), parseInt(m), 0).getDate();
  }
  function nextMonth(monthStr) {
    const [y, m] = monthStr.split("-").map(Number);
    return m === 12 ? `${y+1}-01` : `${y}-${String(m+1).padStart(2,"0")}`;
  }
  function prevMonth(monthStr) {
    const [y, m] = monthStr.split("-").map(Number);
    return m === 1 ? `${y-1}-12` : `${y}-${String(m-1).padStart(2,"0")}`;
  }

  /* ───────────────────────────────────────────────────────────────── */
  const NOTE_CATEGORIES = [
    { id: "meeting",      label: "Meeting",      color: "#4E6FAE" },
    { id: "weekly",       label: "Weekly",       color: "#2F7A57" },
    { id: "monthly",      label: "Monthly",      color: "#C5552D" },
    { id: "optimization", label: "Optimization", color: "#B98426" },
    { id: "internal",     label: "Internal",     color: "#6E665C" }
  ];

  /* ─────────────────────────────────────────────────────────────────
     STORE — mutations + change events. Screens subscribe via useStore.
     ───────────────────────────────────────────────────────────────── */
  const profiles = { ...PROFILES_RICH };
  function getProfile(name) {
    if (!name) return null;
    if (profiles[name]) return profiles[name];
    const card = [...ONB_CARDS, ...ACT_CARDS].find(c => c.name === name);
    profiles[name] = generateTemplate(name, card);
    return profiles[name];
  }
  function bump() { window.dispatchEvent(new CustomEvent("ppc:update")); }
  /* "now" for user actions = the REAL current date (so created/completed stamps line
     up with the real-date task views & reporting). Falls back to demo TODAY pre-boot. */
  function nowISO() { try { return (window.PPC && window.PPC.realToday) ? window.PPC.realToday() : TODAY; } catch (e) { return TODAY; } }

  const store = {
    profiles,
    tasks: TASKS_RICH.slice(),
    /* Phase 7 — Tasks workspace: "projects". "team" is a virtual/system project
       (board grouped by teammate, owners only). Users can add their own. */
    projects: [
      { id: "team", name: "Team", color: "#C5552D", system: true, owner: null }
    ],
    getProfile,

    addNote(clientName, { category = "weekly", title, body, who }) {
      const p = getProfile(clientName);
      const id = "n-" + Math.random().toString(36).slice(2, 8);
      const when = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " · " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      p.notes.unshift({ id, category, title, body, who, when });
      p.activity.unshift({ who: userMap[who]?.name.split(" ")[0] || "You", when: "Just now", text: `Added a ${category} note: ${title}` });
      bump();
    },
    addLinkToProfile(clientName, link) {
      const p = getProfile(clientName);
      p.files = p.files || [];
      p.files.unshift({ name: link.label || link.url, kind: "link", url: link.url, size: "—", when: "Just now", who: link.who || "you" });
      bump();
    },
    addFile(clientName, file) {
      const p = getProfile(clientName);
      p.files = p.files || [];
      p.files.unshift({ ...file, when: "Just now" });
      bump();
    },

    addTask(t) {
      const due = t.due || "Today";
      const task = {
        id: "tk-" + Math.random().toString(36).slice(2, 8),
        status: "open",
        watchers: [],
        links: [],
        checklist: [],
        attachments: [],
        comments: [],
        labels: [],
        services: [],
        timeEstimateMin: null,
        timeSpentMin: 0,
        timerStartedAt: null,
        deadlineISO: null,
        recur: null,
        reminders: [],
        projectId: null,
        createdISO: nowISO(),
        completedISO: null,
        createdAt: "Just now",
        ...t,
        due,
        dueISO: t.dueISO != null ? t.dueISO : dueLabelToISO(due)
      };
      this.tasks.unshift(task);
      // log to client if related
      if (task.client) {
        const p = profiles[task.client];
        if (p) p.activity.unshift({ who: userMap[task.reporter]?.name.split(" ")[0] || "You", when: "Just now", text: `Created task: ${task.title}` });
      }
      bump();
      return task;
    },
    updateTask(id, patch) {
      this.tasks = this.tasks.map(t => {
        if (t.id !== id) return t;
        const next = { ...t, ...patch };
        if (patch.status) next.completedISO = patch.status === "done" ? (t.completedISO || nowISO()) : null;
        if (patch.due != null && patch.dueISO == null) next.dueISO = dueLabelToISO(patch.due);
        return next;
      });
      bump();
    },
    toggleTaskDone(id) {
      this.tasks = this.tasks.map(t => {
        if (t.id !== id) return t;
        const done = t.status !== "done";
        return { ...t, status: done ? "done" : "open", completedISO: done ? nowISO() : null };
      });
      bump();
    },
    /* Phase 6 — duration estimate + start/stop timer (actual tracked minutes) */
    setTaskEstimate(id, min) {
      this.tasks = this.tasks.map(t => t.id === id ? { ...t, timeEstimateMin: min } : t);
      bump();
    },
    startTaskTimer(id) {
      this.tasks = this.tasks.map(t => t.id === id ? { ...t, timerStartedAt: Date.now() } : t);
      bump();
    },
    stopTaskTimer(id) {
      this.tasks = this.tasks.map(t => {
        if (t.id !== id || !t.timerStartedAt) return t;
        const elapsedMin = Math.max(1, Math.round((Date.now() - t.timerStartedAt) / 60000));
        return { ...t, timeSpentMin: (t.timeSpentMin || 0) + elapsedMin, timerStartedAt: null };
      });
      bump();
    },
    toggleChecklistItem(taskId, itemId) {
      this.tasks = this.tasks.map(t => {
        if (t.id !== taskId) return t;
        return { ...t, checklist: t.checklist.map(c => c.id === itemId ? { ...c, done: !c.done } : c) };
      });
      bump();
    },
    addChecklistItem(taskId, text) {
      this.tasks = this.tasks.map(t => {
        if (t.id !== taskId) return t;
        return { ...t, checklist: [...t.checklist, { id: "c" + Math.random().toString(36).slice(2,6), text, done: false }] };
      });
      bump();
    },
    addComment(taskId, who, text) {
      const when = "Just now";
      this.tasks = this.tasks.map(t => {
        if (t.id !== taskId) return t;
        return { ...t, comments: [...t.comments, { who, when, text }] };
      });
      bump();
    },
    addLink(taskId, link) {
      this.tasks = this.tasks.map(t => t.id === taskId ? { ...t, links: [...t.links, link] } : t);
      bump();
    },
    /* Phase 7 — projects */
    addProject({ name, color, owner }) {
      const id = "pj-" + Math.random().toString(36).slice(2, 7);
      const proj = { id, name: (name || "Untitled project").trim(), color: color || "#5B4B8A", system: false, owner: owner || null };
      this.projects.push(proj);
      bump();
      return proj;
    },
    setTaskProject(taskId, projectId) {
      this.tasks = this.tasks.map(t => t.id === taskId ? { ...t, projectId: projectId || null } : t);
      bump();
    },
    /* Phase 7 — manual ordering within a board column (drag-to-reorder). Assigns
       a sequential `order` to the given ids; sort comparator uses it as primary. */
    setTaskOrder(ids) {
      const pos = {}; ids.forEach((id, i) => { pos[id] = i; });
      this.tasks = this.tasks.map(t => pos[t.id] != null ? { ...t, order: pos[t.id] } : t);
      bump();
    },
    /* Phase 7 — reporting: count tasks completed by a user on/after a date (ISO). */
    tasksCompleted(roleId, sinceISO) {
      return this.tasks.filter(t =>
        t.status === "done" && t.completedISO && t.assignee === roleId &&
        (!sinceISO || t.completedISO >= sinceISO)
      );
    },

    addClient({ name, service, niche, currency, mrr, contact, brief, owners }) {
      // 1. add onboarding card at Form Received (m2/g2/s2) — assume form is in
      const stages = service === "meta" ? ONBOARD_META : service === "google" ? ONBOARD_GOOGLE : ONBOARD_SMM;
      const firstStage = stages[1]; // Form Received-ish
      const id = `c-${service}-new-${Math.random().toString(36).slice(2,6)}`;
      const card = { id, name, service, stage: firstStage.id, days: 0, niche, blocker: null, designer: null, override: null };
      ONB_CARDS.unshift(card);
      // 2. create profile
      profiles[name] = {
        status: "onboarding", services: [service], niche, currency: currency || "CAD",
        mrr: mrr || null, startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), lifetimeMos: 0,
        owners: owners || { am: "vihar", ads: service === "google" ? "harsh" : (service === "smm" ? null : "harsh"), creative: service === "google" ? null : "vanshika" },
        contact: contact || { name: "—", role: "—", email: "—", phone: "—", timezone: "—", pref: "Email" },
        brief: brief || { overview: "", audience: [], goals: [], usps: [], avoid: [], geo: "—", brandKit: "—" },
        accounts: [], findings: { keywords: [], competitors: [], audit: [], summary: "" },
        notes: [], files: [],
        activity: [{ who: "System", when: "Just now", text: `Client created. Stage: ${firstStage.name}.` }],
        performance: null
      };
      bump();
      return card;
    },

    /* ─── SMM CONTENT WORKFLOW ───────────────────────────────────── */

    /* Plan-level pipeline (whole month, per client) */
    setPlanStatus(planId, status) {
      const plan = CONTENT_PLANS.find(p => p.id === planId);
      if (!plan) return;
      plan.status = status;
      if (status === "calendar-approved") plan.calendarApprovedAt = "Just now";
      if (status === "approved")          plan.creativesApprovedAt = "Just now";
      bump();
    },
    /* Deliverable mutations */
    setDeliverableStatus(planId, delivId, status) {
      const plan = CONTENT_PLANS.find(p => p.id === planId);
      if (!plan) return;
      plan.deliverables = plan.deliverables.map(d => d.id === delivId ? { ...d, status } : d);
      // auto-advance plan status if all approved
      const allDone = plan.deliverables.every(d => d.status === "approved" || d.status === "scheduled" || d.status === "posted");
      if (allDone && plan.status === "in-production") plan.status = "creative-pending";
      bump();
    },
    assignDeliverable(planId, delivId, editorId) {
      const plan = CONTENT_PLANS.find(p => p.id === planId);
      if (!plan) return;
      plan.deliverables = plan.deliverables.map(d => d.id === delivId ? { ...d, assignee: editorId } : d);
      bump();
    },
    setDeliverableField(planId, delivId, patch) {
      const plan = CONTENT_PLANS.find(p => p.id === planId);
      if (!plan) return;
      plan.deliverables = plan.deliverables.map(d => d.id === delivId ? { ...d, ...patch } : d);
      bump();
    },

    /* ─── CLIENT BIBLE — credentials vault ─────────────────────────
       revealCredential is the only path to read the secret. Every
       reveal appends an audit row that lives forever. */
    revealCredential(client, credId, who, reason = "") {
      const vault = CLIENT_VAULTS[client] || [];
      const c = vault.find(x => x.id === credId);
      if (!c) return null;
      CRED_AUDIT.unshift({
        id: "a-" + Math.random().toString(36).slice(2, 7),
        client, credId, who,
        action: "reveal",
        when: new Date().toISOString().slice(0, 16).replace("T", " · "),
        reason: reason || "(no reason given)"
      });
      c.lastReveal = new Date().toISOString().slice(0, 10);
      const prof = profiles[client];
      if (prof) {
        prof.activity = prof.activity || [];
        prof.activity.unshift({
          who: userMap[who]?.name.split(" ")[0] || "Someone",
          when: "Just now",
          text: `Revealed credential — ${c.platform} (${c.label}). Reason: ${reason || "(none)"}`
        });
      }
      bump();
      return c.secret;
    },
    addCredential(client, cred) {
      CLIENT_VAULTS[client] = CLIENT_VAULTS[client] || [];
      const c = { id: "v-" + Math.random().toString(36).slice(2, 7),
                  status: "active", lastReveal: null, ...cred };
      CLIENT_VAULTS[client].unshift(c);
      CRED_AUDIT.unshift({
        id: "a-" + Math.random().toString(36).slice(2, 7),
        client, credId: c.id, who: cred.who || "you",
        action: "create",
        when: new Date().toISOString().slice(0, 16).replace("T", " · "),
        reason: "Credential added to vault"
      });
      bump();
      return c;
    },
    rotateCredential(client, credId, who) {
      const vault = CLIENT_VAULTS[client] || [];
      const c = vault.find(x => x.id === credId);
      if (!c) return;
      c.lastReveal = new Date().toISOString().slice(0, 10);
      c.status = "active";
      CRED_AUDIT.unshift({
        id: "a-" + Math.random().toString(36).slice(2, 7),
        client, credId, who, action: "rotate",
        when: new Date().toISOString().slice(0, 16).replace("T", " · "),
        reason: "Rotated"
      });
      bump();
    },

    /* ─── CLIENT BIBLE — transcripts ────────────────────────────── */
    addTranscript(client, transcript) {
      TRANSCRIPTS[client] = TRANSCRIPTS[client] || [];
      const t = {
        id: "tr-" + Math.random().toString(36).slice(2, 7),
        actionItems: [], keyMoments: [],
        when: new Date().toISOString().slice(0, 16).replace("T", " · "),
        source: "Manual upload",
        ...transcript
      };
      TRANSCRIPTS[client].unshift(t);
      const prof = profiles[client];
      if (prof) {
        prof.notes = prof.notes || [];
        prof.notes.unshift({
          id: "n-" + Math.random().toString(36).slice(2, 7),
          category: "meeting",
          title: t.title,
          body: t.summary || t.excerpt?.slice(0, 200) || "Transcript added.",
          who: t.uploadedBy || "you",
          when: t.when
        });
        prof.activity = prof.activity || [];
        prof.activity.unshift({
          who: userMap[t.uploadedBy]?.name.split(" ")[0] || "You",
          when: "Just now",
          text: `Added transcript: ${t.title}`
        });
      }
      bump();
      return t;
    },
    /* Drops the next pending auto-pull into the transcripts list as if
       a Meet recording just finished processing. Returns the new
       transcript (or null if nothing to pull). */
    pullNextTranscript(client, who) {
      const queue = PENDING_AUTOPULL[client] || [];
      if (queue.length === 0) return null;
      const next = queue.shift();
      const synth = AUTOPULL_SYNTH[client] || {
        summary: "Transcript auto-extracted. Add action items as needed.",
        excerpt: "(Transcript content imported from Google Meet.)",
        actionItems: [], keyMoments: []
      };
      return this.addTranscript(client, {
        title: next.title,
        when: next.when,
        duration: next.duration,
        attendees: next.attendees,
        source: "Google Meet (auto-pull)",
        ...synth,
        uploadedBy: who
      });
    },

    /* ─── PLATFORM / OPTIMIZATION ───────────────────────────────────
       Log an optimization on a Meta or Google account.
       Auto-mirrors a "optimization" note to the client's profile so
       the client portal stays in sync — per the user's spec.
       ─────────────────────────────────────────────────────────────── */
    logOptimization({ platform, account, who, action, impact = "", tags = [] }) {
      const accts = platform === "google" ? GOOG_ACCTS : META_ACCTS;
      const acct = accts.find(a => a.client === account);
      if (acct) {
        acct.lastOptISO = TODAY;
        acct.lastOptCount = (acct.lastOptCount || 0) + 1;
      }
      const entry = {
        id: "ol-" + Math.random().toString(36).slice(2, 7),
        platform, account, who, dateISO: TODAY, when: "Just now",
        action, impact, tags
      };
      OPT_LOG.unshift(entry);
      /* mirror to client profile notes */
      if (profiles[account]) {
        profiles[account].notes = profiles[account].notes || [];
        profiles[account].notes.unshift({
          id: "n-" + Math.random().toString(36).slice(2, 7),
          category: "optimization",
          title: `${platform === "google" ? "Google Ads" : "Meta"} — ${action}`,
          body: impact ? `${action}\n\nImpact: ${impact}` : action,
          who, when: "Just now"
        });
        profiles[account].activity = profiles[account].activity || [];
        profiles[account].activity.unshift({
          who: userMap[who]?.name.split(" ")[0] || "Specialist",
          when: "Just now",
          text: `Logged optimization: ${action}`
        });
      }
      bump();
      return entry;
    },

    /* Pacing settings — for "configure account" panel */
    setBudgetSettings(accountId, patch) {
      [META_ACCTS, GOOG_ACCTS].forEach(list => {
        const a = list.find(x => x.id === accountId);
        if (a) Object.assign(a, patch);
      });
      bump();
    },

    /* ─── PHASE 1: Status lifecycle ────────────────────────────────────
       Set the status of a single service contract on a client.
       Auto-mirrors the change to the profile activity log and (when
       paused) sets the auto-task pause + schedules a churn-risk
       notification 7 days from now to Vihar (the PM).            */
    setServiceStatus(clientName, service, nextStatus, reason = "") {
      const prof = getProfile(clientName);
      if (!prof) return;
      prof.serviceContracts = prof.serviceContracts || {};
      const c = prof.serviceContracts[service];
      if (!c) return;
      const prev = c.status;
      c.status = nextStatus;
      c.statusSince = TODAY;
      c.statusReason = reason;
      /* Update derived top-level status */
      prof.status = getDerivedStatus(prof);

      const who = userMap.vihar.name.split(" ")[0];
      prof.activity = prof.activity || [];
      prof.activity.unshift({
        who: "System", when: "Just now",
        text: `${SERVICE_INFO[service]?.label || service} status: ${prev} → ${nextStatus}${reason ? ` · ${reason}` : ""}`
      });

      /* Drop a profile note so the change is permanent in the client bible */
      prof.notes = prof.notes || [];
      prof.notes.unshift({
        id: "n-" + Math.random().toString(36).slice(2, 7),
        category: "internal",
        title: `${SERVICE_INFO[service]?.label || service} → ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`,
        body: reason || `Status changed from ${prev} to ${nextStatus}.`,
        who: "system", when: "Just now"
      });

      /* Churn-risk notification — schedule Vihar a flag 7d into a pause.
         (In demo: we just push a notif marked future-due.) */
      if (nextStatus === "paused" && NOTIFS) {
        NOTIFS.unshift({
          id: "n-churn-" + Math.random().toString(36).slice(2, 5),
          to: "vihar", type: "flag",
          text: `Churn-risk: ${clientName} (${service}) paused. Reach out by ${shiftDate(TODAY, 7)}.`,
          time: "Just now", read: false, ref: clientName,
          dueDate: shiftDate(TODAY, 7), kind: "churn-risk"
        });
      }

      /* Cancellation — auto-snapshot a "Final report" file */
      if (nextStatus === "cancelled") {
        prof.files = prof.files || [];
        prof.files.unshift({
          name: `Final report — ${TODAY.slice(0,7)} (${SERVICE_INFO[service]?.short || service}).pdf`,
          kind: "pdf", size: "1.2 MB", when: "Just now", who: "system"
        });
      }

      bump();
    },

    /* Record a payment received */
    recordPayment(clientName, payment) {
      const prof = getProfile(clientName);
      if (!prof) return;
      prof.payments = prof.payments || [];
      prof.payments.unshift({ ...payment, recordedAt: "Just now" });
      bump();
    },

    /* Mark a creative refresh complete (resets the cycle) */
    markCreativeRefreshed(clientName) {
      const prof = getProfile(clientName);
      if (!prof?.serviceContracts?.meta?.creativeRefresh) return;
      const cr = prof.serviceContracts.meta.creativeRefresh;
      cr.lastRefreshDate = TODAY;
      cr.nextDueDate = shiftDate(TODAY, cr.cadenceDays);
      cr.daysSinceRefresh = 0;
      prof.activity = prof.activity || [];
      prof.activity.unshift({ who: "Vanshika", when: "Just now", text: "Creative pack refreshed — cycle reset." });
      bump();
    }
  };

  root.PPC = {
    USERS, userMap,
    SERVICE_INFO,
    ONBOARD_STAGES: { meta: ONBOARD_META, google: ONBOARD_GOOGLE, smm: ONBOARD_SMM },
    ACTIVE_STAGES:  { meta: ACTIVE_META,  smm: ACTIVE_SMM },
    ONB_CARDS, ACT_CARDS,
    SALES_STAGES, LEADS,
    NOTIFS, TASKS_EXTRA, REVIEWS,
    MEETINGS_TODAY, FOCUS_BLOCKS,
    META_ACCTS, GOOG_ACCTS, OPT_LOG,
    TODAY,
    CAPACITY, MRR_TREND,
    ROLE_ACCESS,
    PROFILES_RICH, NOTE_CATEGORIES, TASKS_RICH,
    CLIENT_VAULTS, CRED_AUDIT, DRIVE_FOLDERS, TRANSCRIPTS, PENDING_AUTOPULL,
    STATUS_DEFS, COMMISSION_RULES, PRICING_GUIDE, CREATIVE_REFRESH,
    getDerivedStatus, profileMRR, creativeRefreshState, commissionEarned,
    DURATION_BUCKETS, bucketFor, dueLabelToISO,
    shiftDate, shiftMonth, daysBetween,
    PLAN_STAGES, PLAN_STAGE_INDEX, DELIV_STAGES, SMM_QUOTAS, CONTENT_PLANS,
    getPlan, planProgress, planLabel, monthLabel, monthShort, monthDaysIn, nextMonth, prevMonth,
    store, bump
  };
})(window);
