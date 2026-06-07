/* liveData.js — REAL production data captured from the live app
 * (https://darkgoldenrod-reindeer-935702.hostingersite.com) on 2026-06-05.
 *
 * PURPOSE: reconcile the prototype with what's actually shipped. The legacy
 * seed in data.js uses fictional clients (Maritime Realty, FreshLeaf…) wired
 * across 30 files — we do NOT rip that out. Instead everything real lives here
 * under window.PPC.LIVE.* so screens (and the new Sales workspace) can read
 * the true roster, stages, statuses, team and intake without breaking Phase 1–4.
 *
 * Source of truth: the live Next.js app's /clients, /briefs, /admin/sla, /team.
 */
(function () {
  // ---------- Real team (from /dashboard/team) ----------
  const LIVE_TEAM = [
    { id: "jaydeep",   initials: "JP", name: "Jaydeep Patel",          role: "Owner" },
    { id: "dhaval",    initials: "DP", name: "Dhaval Patel",           role: "Owner" },
    { id: "shrikaanth",initials: "SS", name: "Shrikaanth Shyamsunder", role: "Admin (Dev)" },
    { id: "abhishek",  initials: "AT", name: "Abhishek Tewari",        role: "Admin / Sales" },
    { id: "harsh",     initials: "HR", name: "Harsh Rathod",           role: "Ads Manager" },
    { id: "vanshika",  initials: "VR", name: "Vanshika Raghuvanshi",   role: "Social Media Manager" },
    { id: "vihar",     initials: "VK", name: "Vihar Kalariya",         role: "Project Manager" },
    { id: "rayu",      initials: "RN", name: "Rayu Naik",              role: "Designer" },
    { id: "aadil",     initials: "AT", name: "Aadil Tauro",            role: "Designer" },
  ];

  // ---------- Real lifecycle status taxonomy (from /clients filter) ----------
  // Tokens reuse existing palette (no new colors).
  const LIVE_STATUS = {
    onboarding:  { label: "Onboarding",  color: "#B98426", tint: "#F5EAD0", inMRR: false },
    on_trial:    { label: "On Trial",    color: "#4E6FAE", tint: "#DEE5F2", inMRR: false },
    paid_client: { label: "Paid Client", color: "#2F7A57", tint: "#E1EFE6", inMRR: true  },
    on_hold:     { label: "On Hold",     color: "#B98426", tint: "#F5EAD0", inMRR: false },
    cancelled:   { label: "Cancelled",   color: "#6E665C", tint: "#EFE9DD", inMRR: false },
  };

  // ---------- Real stage pipelines (from /dashboard/admin/sla) ----------
  // owner-type: team | client | designer | multi. Default owner per stage.
  const LIVE_STAGES = {
    onboarding: {
      meta: [
        { stage: "Form Sent", type: "team", owner: "abhishek" },
        { stage: "Form Received", type: "team", owner: "abhishek" },
        { stage: "Business & Industry Research", type: "team", owner: "vanshika" },
        { stage: "Discovery Call", type: "multi", owner: null },
        { stage: "Creative Strategy Development", type: "team", owner: "vanshika" },
        { stage: "Creative Concept Approval", type: "client", owner: null },
        { stage: "Design Production", type: "designer", owner: null },
        { stage: "Creative Done", type: "designer", owner: null },
        { stage: "Final Creative Approval", type: "client", owner: null },
        { stage: "Campaign Build & Tracking", type: "team", owner: "harsh" },
        { stage: "Live + Looker Access", type: "team", owner: "harsh" },
      ],
      google: [
        { stage: "Form Sent", type: "team", owner: "abhishek" },
        { stage: "Form Received", type: "team", owner: "abhishek" },
        { stage: "Onboarding & Access", type: "team", owner: "harsh" },
        { stage: "Keyword Research & Ad Copy", type: "team", owner: "harsh" },
        { stage: "Client Approval", type: "client", owner: null },
        { stage: "Campaign Build & Tracking", type: "team", owner: "harsh" },
        { stage: "Live + Looker Access", type: "team", owner: "harsh" },
      ],
      smm: [
        { stage: "Initial Meeting & Access", type: "team", owner: "vanshika" },
        { stage: "Content Strategy & Calendar", type: "team", owner: "vanshika" },
        { stage: "Client Approval", type: "client", owner: null },
        { stage: "Production", type: "designer", owner: null },
        { stage: "Production Done", type: "designer", owner: null },
        { stage: "Internal Final Review", type: "team", owner: "vanshika" },
        { stage: "Scheduling", type: "team", owner: "vanshika" },
        { stage: "Live + Recurring", type: "team", owner: "vanshika" },
      ],
      influencer: [
        { stage: "Form Sent", type: "team", owner: "abhishek" },
        { stage: "Form Received", type: "team", owner: "abhishek" },
        { stage: "Creator Research & Shortlist", type: "team", owner: "vanshika" },
        { stage: "Creator Outreach", type: "team", owner: "vanshika" },
        { stage: "Client Approval", type: "client", owner: null },
        { stage: "Content Production", type: "designer", owner: null },
        { stage: "Live + Reporting", type: "team", owner: "vanshika" },
      ],
    },
    monthly: {
      meta: [
        { stage: "Monthly Briefing Call", type: "multi", owner: null },
        { stage: "Creative Strategy Development", type: "team", owner: "vanshika" },
        { stage: "Creative Concept Approval", type: "client", owner: null },
        { stage: "Design Production", type: "designer", owner: null },
        { stage: "Creative Done", type: "designer", owner: null },
        { stage: "Final Creative Approval", type: "client", owner: null },
        { stage: "Handoff to Harsh", type: "team", owner: "vanshika" },
        { stage: "Campaign Update or New Build", type: "team", owner: "harsh" },
        { stage: "Live", type: "team", owner: "harsh" },
      ],
      smm: [
        { stage: "Monthly Briefing Call", type: "multi", owner: null },
        { stage: "Content Strategy & Calendar", type: "team", owner: "vanshika" },
        { stage: "Client Approval", type: "client", owner: null },
        { stage: "Production", type: "designer", owner: null },
        { stage: "Production Done", type: "designer", owner: null },
        { stage: "Internal Final Review", type: "team", owner: "vanshika" },
        { stage: "Scheduling", type: "team", owner: "vanshika" },
        { stage: "Live", type: "team", owner: "vanshika" },
      ],
      google: [
        { stage: "Monthly Account Review", type: "team", owner: "harsh" },
        { stage: "Optimization Plan", type: "team", owner: "harsh" },
        { stage: "Implement Optimizations", type: "team", owner: "harsh" },
        { stage: "Performance Review & Reporting", type: "team", owner: "harsh" },
        { stage: "Live", type: "team", owner: "harsh" },
      ],
    },
  };

  // ---------- Real client roster (51 rows from /dashboard/clients) ----------
  // svc codes: g=Google Ads, m=Meta Ads, s=Social Media. status keys per LIVE_STATUS.
  const C = (id, company, contact, svc, mrr, health, status) =>
    ({ id, company, contact, services: svc, mrr, health, status });
  const LIVE_CLIENTS = [
    C("PPC-018","A2Z Comfort Solutions","Hamdan Rehman",[],0,"paused","cancelled"),
    C("imp-cli-a2z","A2Z Garage Door Repairs Ltd","Jagvir Batth",[],0,"paused","onboarding"),
    C("342d265a","Accure Security Solutions","Dhrumit Shah",[],0,"paused","cancelled"),
    C("8dc4fe26","Apexshine Cleaning Inc.","Saif Hyder",[],0,"paused","onboarding"),
    C("b050566c","Apna Tiffin Service","Harsh Tailor",["m"],600,"healthy","on_trial"),
    C("PPC-008","Bindra World Immigration Terminal","Amogh Puri",["g"],600,"healthy","paid_client"),
    C("3b0775d7","Blockline Physiotherapy & Wellness Inc.","Vishal Patel",["g"],550,"healthy","on_trial"),
    C("5e824110","Bombay chaat Saskatoon","Ankita Dhameliya",[],0,"paused","cancelled"),
    C("PPC-017","BTDT (BeenThereDoneThat)","Vinit Shah",["m"],0,"healthy","cancelled"),
    C("imp-cli-cap","Captured Notions Entertainment Inc","Jashan Preet Singh",[],0,"paused","onboarding"),
    C("2b5078ed","Civia Jewels","Manav Bhadani",[],0,"paused","on_hold"),
    C("078e2109","Crafts Foreverr","Disha Jagad",[],0,"paused","on_hold"),
    C("PPC-016","Dave Financial Services","Purvi Dave",["m"],500,"healthy","paid_client"),
    C("PPC-013","Ecocare Home Comfort","Muhammad Afzal",["g","m"],1500,"healthy","paid_client"),
    C("imp-cli-elite","Elite Appliance Repairs","Sharanjit Singh",[],0,"paused","onboarding"),
    C("37584588","Eyeshield Appliances and Tech","Mike",[],0,"paused","onboarding"),
    C("C-0046","Eyeshield Appliances and Tech","Mike",[],0,"paused","onboarding"),
    C("PPC-002","GCAD Construction","Gurjot Singh",["g","m","s"],2400,"healthy","paid_client"),
    C("77089996","Gino's Pizza & Wing Machine","Ram Chandra P",[],0,"paused","cancelled"),
    C("PPC-021","Global Financial Impact","Abhinav Chohla",[],0,"paused","onboarding"),
    C("e190e2cc","Global Financial Impact","Abhinav Chohla",[],0,"paused","onboarding"),
    C("ffff6e89","Global Surface Inc.","Tanay Patel",[],0,"paused","cancelled"),
    C("4b8fc3fa","GlobalFinancials","Muzammil",[],0,"paused","onboarding"),
    C("49ad5a70","Healthy Homes Corp","Yashdeep Sandhu",[],200,"paused","on_hold"),
    C("PPC-009","JK Appliance Repair Inc","Vivek Sabhaya",["g"],400,"healthy","paid_client"),
    C("e1279d67","Loyalty Real Estate Brokerage","Imran Khan",[],0,"paused","onboarding"),
    C("PPC-006","North York Healthcare Associates","Dr. Moez Rajwani",["g"],375,"healthy","paid_client"),
    C("PPC-019","Norts Construction & Custom Build","Piyush Ranjan",["m"],0,"healthy","cancelled"),
    C("20f9f363","One Percent Sold","Rohit Yadav",[],0,"paused","on_hold"),
    C("PPC-INT","PPC Guru (Internal)","Internal",["s"],0,"healthy","paid_client"),
    C("PPC-015","Project Pioneer Construction","Chintan Lashkari",["m","s"],2400,"healthy","paid_client"),
    C("PPC-010","RCC HomeHealth (Palmdale)","Shoaib Nathani",["g"],0,"healthy","paid_client"),
    C("PPC-011","Rehab 2 Go","Senifa Rajwani",["g"],0,"healthy","paid_client"),
    C("PPC-003","Rehab Clinic Canada","Shoaib Nathani",["g"],650,"healthy","paid_client"),
    C("PPC-001","RJ CAD Solutions Inc","Hirenbhai Shah / Kruti Shah",["g"],1750,"healthy","paid_client"),
    C("bf3bfc21","Royal LePage Platinum — Vikas Sharma","Vikas Sharma",["m"],0,"healthy","onboarding"),
    C("5bbd23d7","Sahaana Samrath Real Estate Inc.","Sanyam Anand",["m"],0,"healthy","on_trial"),
    C("9b13800d","SGD Homes Inc.","Stefano Damassia",[],0,"paused","cancelled"),
    C("b4a76eb8","Sharma Mortgages (Mortgage Intelligence)","Girish Sharma",[],0,"paused","onboarding"),
    C("2d3498ee","Sold By Kaushik Real Estate","Kaushik Aslaliya",[],0,"paused","onboarding"),
    C("imp-cli-sorath","Sorath Construction","Nikunj",["s"],700,"healthy","paid_client"),
    C("PPC-014","The UPS Store","Parag Sorte",["g"],1000,"healthy","paid_client"),
    C("PPC-007","Therapyvilla Inc.","Anis Gandhi",["g"],1349,"healthy","paid_client"),
    C("a6473e1d","Three Sisters Pharmacy","Bhaumik Ruparel",[],0,"paused","cancelled"),
    C("PPC-004","True Life Wellness & Physiotherapy","Altaf Virani",["g"],1100,"healthy","paid_client"),
    C("3bbbf910","Upwell Homecare Inc.","Saif Hyder",[],0,"paused","onboarding"),
    C("imp-cli-vin","Vin Engineering INC","Vin Shah",[],0,"paused","onboarding"),
    C("PPC-005","Westway Immigration","Rohan Mody",["g"],400,"healthy","paid_client"),
    C("cb9a4419","WFG — Akthar Shaikh","Akthar Shaikh",[],0,"paused","on_hold"),
    C("9522275a","XCEED Homes Inc.","Xiaochen Ma",[],0,"paused","onboarding"),
    C("PPC-020","Xpertech Canada","Aamir Mohammed",[],700,"paused","on_hold"),
  ];

  // ---------- Real intake briefs (55 rows from /dashboard/briefs) ----------
  // Google-Form leads. linked = matched client company (or null = UNMATCHED).
  const B = (received, business, contact, email, type, budget, svc, linked) =>
    ({ received, business, contact, email, type, budget, services: svc, linked });
  const LIVE_BRIEFS = [
    B("2026-06-04","Demetrius Bridges / Zena Holland","Zena Holland","tetabojem@mailinator.com","","","Google Ads only",null),
    B("2026-06-03","Sharma Mortgages (Mortgage Intelligence)","Girish Sharma","Girish.sharma@migroup.ca","",600,"Meta Ads Mgmt.","Sharma Mortgages (Mortgage Intelligence)"),
    B("2026-06-03","Sold By Kaushik Real Estate","Kaushik Aslaliya","soldbykaushik@gmail.com","",700,"Google Ads Mgmt. + Meta Ads Mgmt.","Sold By Kaushik Real Estate"),
    B("2026-05-29","Global Financial Impact","Abhinav Chohla","abhinavchohlagfi@gmail.com","",750,"","Global Financial Impact"),
    B("2026-05-29","Global Financial Impact","Abhinav Chohla","abhinavchohlagfi@gmail.com","",750,"Meta Ads Mgmt.","Global Financial Impact"),
    B("2026-05-27","Eyeshield Appliances and Tech","Mike","maruticanada4@gmail.com","",0,"Google Ads Mgmt. + Meta Ads Mgmt.","Eyeshield Appliances and Tech"),
    B("2026-05-26","Vin Engineering INC","Vin Shah","vinshah@vingcinc.com","",1500,"Google Ads Mgmt.","Vin Engineering INC"),
    B("2026-05-26","A2z garage door repairs ltd.","jagvir batth","a2zgaragedoorrepairyvr@gmail.com","",2500,"Google Ads Mgmt. + Meta Ads Mgmt.","A2Z Garage Door Repairs Ltd"),
    B("2026-05-25","Captured Notions Entertainment Inc","Jashan Preet Singh","Captured.notions.entertainment@hotmail.com","",1600,"Google Ads Mgmt. + Meta Ads Mgmt.","Captured Notions Entertainment Inc"),
    B("2026-05-22","Sorath Inc. (marketing as SORATH CONSTRUCTION)","Bhautik Nada","info@sorath.ca","","","Meta Ads Mgmt.",null),
    B("2026-05-22","Elite appliance repairs","Sharanjit Singh","Eliteappliance14@gmail.com","",1000,"Google Ads Mgmt.","Elite Appliance Repairs"),
    B("2026-05-19","Maplewood Coffee Roasters Inc.","Jordan Avery Mitchell","jordan@maplewoodroasters.com","",5000,"Google Ads Mgmt. + Meta Ads Mgmt.",null),
    B("2026-05-14","Loyalty Real Estate Brokerage","Imran Khan","acedevgrp@gmail.com","Real estate brokerage",2000,"Google Ads Mgmt. + Meta Ads Mgmt.","Loyalty Real Estate Brokerage"),
    B("2026-05-12","Wiring Test Inc","Test User","test@example.com","",1500,"",null),
    B("2026-05-11","Apexshine Cleaning Inc.","Saif Hyder","saif.hyder@apexshine.com","Commercial & residential cleaning",2000,"Google Ads Mgmt.","Apexshine Cleaning Inc."),
    B("2026-05-11","Upwell Homecare Inc.","Saif Hyder","saif.hyder@qualicare.com","In-home senior care / PSW services",1500,"Google Ads Mgmt.","Upwell Homecare Inc."),
    B("2026-05-08","Dave Financial Services Inc.","Purvi Dave","insuredwithdave@gmail.com","Insurance & investments brokerage",750,"Meta Ads Mgmt.","Dave Financial Services"),
    B("2026-05-05","Apna Tiffin Service","Harsh Tailor","apnatiffinservice6@gmail.com","Tiffin / meal delivery service",750,"Meta Ads Mgmt.","Apna Tiffin Service"),
    B("2026-05-02","Test Acme HVAC","Jane Doe","jane@acme-test.com","HVAC",2500,"Google Ads Mgmt. + Meta Ads Mgmt.",null),
    B("2026-04-30","GlobalFinancials — Muzammil","Muzammil","zehngfi@gmail.com","Insurance & investment advisory",2500,"Google Ads Mgmt. + Meta Ads Mgmt.","GlobalFinancials"),
    B("2026-04-30","Royal LePage Platinum — Vikas Sharma","Vikas Sharma","v.sharma@royallepage.ca","Real estate agent",750,"Meta Ads Mgmt.","Royal LePage Platinum — Vikas Sharma"),
    B("2026-04-29","WFG — Akthar Shaikh","Akthar Shaikh","akthar.cisco@gmail.com","Financial services (World Financial Group)",500,"Meta Ads Mgmt.","WFG — Akthar Shaikh"),
    B("2026-04-27","Crafts Foreverr","Disha Jagad","dishajagad1808@gmail.com","Event & wedding décor",1000,"Google Ads Mgmt. + Meta Ads Mgmt.","Crafts Foreverr"),
    B("2026-04-24","True Life Wellness and Physiotherapy","Altaf Virani","tlwp@truelifewellnessphysio.ca","Multi-disciplinary physiotherapy clinic","","Google Ads Mgmt.","True Life Wellness & Physiotherapy"),
    B("2026-04-22","XCEED Homes Inc.","Xiaochen Ma","xiaochen941227@gmail.com","Home renovation & custom builds","","Google Ads Mgmt.","XCEED Homes Inc."),
    B("2026-04-22","One Percent Sold","Rohit Yadav","info1persold@gmail.com","Discount real estate brokerage","","Google Ads Mgmt.","One Percent Sold"),
    B("2026-04-20","The UPS Store","Parag Sorte","604ups@gmail.com","Print, shipping & business services","","Google Ads Mgmt.","The UPS Store"),
    B("2026-04-17","Xpertech Mississauga","aamir mohammed","xpertechmississauga@gmail.com","","","Meta Ads Mgmt.",null),
    B("2026-04-17","Xpertech Mississauga","Aamir Mohammed","amir@experimaxcanada.ca","Electronics repair","","Google Ads Mgmt.","Xpertech Canada"),
    B("2026-04-16","Blockline Physiotherapy & Wellness Inc.","Vishal Patel","blocklinephysio@gmail.com","Physiotherapy & wellness clinic","","Google Ads Mgmt.","Blockline Physiotherapy & Wellness Inc."),
    B("2026-04-10","Sahaana Samrath Real Estate Inc.","Sanyam Anand","anandsanyamrealtor@gmail.com","Real estate (leasing focus)","","Google Ads Mgmt.","Sahaana Samrath Real Estate Inc."),
    B("2026-04-10","Gino's Pizza & Wing Machine","Ram Chandra P","ram8893@gmail.com","Pizza & wings restaurant","","Google Ads Mgmt.","Gino's Pizza & Wing Machine"),
    B("2026-04-09","Healthy Homes Corp","Yashdeep Sandhu","healthyhomes.inc99@gmail.com","Home renovation — ceilings & cabinets","","Google Ads Mgmt.","Healthy Homes Corp"),
    B("2026-04-08","Ecocare Home Comfort","Muhammad Afzal","info@ecocarehomecomfort.ca","HVAC — furnace & heat pump","","Google Ads Mgmt.","Ecocare Home Comfort"),
    B("2026-04-08","A2Z Comfort Solutions Inc.","Hamdan Rehman","info@a2zcomfort.ca","HVAC & home comfort","","Google Ads Mgmt.","A2Z Comfort Solutions"),
    B("2026-04-01","Norts Construction & Custom Build Inc.","Piyush Ranjan","northsconstruction.build@gmail.com","Construction — flooring & renovation","","Google Ads Mgmt.","Norts Construction & Custom Build"),
    B("2026-04-01","N&N Brothers Moving Company","Nazeer Ahmad","nmoving.toronto@gmail.com","Moving & packing services","","Google Ads Mgmt.",null),
    B("2026-02-25","Bindra World Immigration Terminal Inc.","Amogh Puri","bwit.ca@gmail.com","","","Google Ads Mgmt.","Bindra World Immigration Terminal"),
    B("2026-02-25","Bindra World Immigration Terminal Inc.","Amogh Puri","amoghpuri@hotmail.com","Immigration consultancy","","Google Ads Mgmt.","Bindra World Immigration Terminal"),
    B("2026-02-20","BTDT Store Apparel","Vinit Shah","vinitbusinessglobal@gmail.com","Streetwear apparel (e-commerce)","","Google Ads Mgmt.","BTDT (BeenThereDoneThat)"),
    B("2026-01-31","SGD Homes Inc.","Stefano Damassia","info@sgdhomes.ca","Construction — basement renovation","","Google Ads Mgmt.","SGD Homes Inc."),
    B("2026-01-31","SGD Homes Inc.","Stefano Damassia","stefano@sgdhomes.ca","","","Meta Ads Mgmt.","SGD Homes Inc."),
    B("2026-01-30","Civia Jewels","Manav Bhadani","civiajewels@gmail.com","Lab-grown diamond jewellery (e-commerce)","","Google Ads Mgmt.","Civia Jewels"),
    B("2026-01-21","Therapy Villa Inc.","Anis Gandhi","anis@therapyvilla.com","Psychology & psychotherapy clinic","","Google Ads Mgmt.","Therapyvilla Inc."),
    B("2025-12-18","JK Appliance Repair Inc.","Vivek Sabhaya","vr60089@gmail.com","Appliance repair","","Google Ads Mgmt.","JK Appliance Repair Inc"),
    B("2025-12-03","Accure Security Solutions","Dhrumit Shah","accuresec@gmail.com","","","Google Ads Mgmt.","Accure Security Solutions"),
    B("2025-12-03","Accure Security Solutions","Dhrumit Shah","Dhrumit.shah@accuresec.com","Security guard & monitoring services","","Google Ads Mgmt.","Accure Security Solutions"),
    B("2025-12-03","Gokaddal Inc","Ravinder Singh","rps@gokaddal.com","Technology consulting (digital transformation)","","Google Ads Mgmt.",null),
    B("2025-10-29","GCAD Construction Inc.","Gurjot Singh","gcadconstruction1@gmail.com","Construction — basement renovation","","Google Ads Mgmt.","GCAD Construction"),
    B("2025-10-27","Bombay Chaat (13874273 Canada Inc)","Ankita Dhameliya","ankitadhameliya098@gmail.com","Indian street-food restaurant","","Google Ads Mgmt.",null),
    B("2025-08-07","Westway Immigration Services Inc.","Rohan Mody","rohan@westwayimmigration.com","Immigration consultancy","","Google Ads Mgmt.","Westway Immigration"),
    B("2025-08-07","Westway Immigration Services Inc.","Rohan Mody","westwayimmigration88@gmail.com","","","Google Ads Mgmt.","Westway Immigration"),
    B("2025-08-05","Wecare Pharmacy Services Ltd.","Bhaumik Ruparel","threesistersrx@gmail.com","Pharmacy & walk-in clinic","","Google Ads Mgmt.",null),
    B("2025-07-21","testing","testing forms form testing","test2323@gmail.com","","","Google Ads Mgmt.",null),
    B("2022-11-01","Global Surface Inc.","Tanay Patel","Info@globalsurfaces.ca","Tile, flooring & countertop retail","","Google Ads Mgmt.","Global Surface Inc."),
  ];

  // ---------- Derived helpers ----------
  const LIVE = {
    capturedAt: "2026-06-05",
    source: "darkgoldenrod-reindeer-935702.hostingersite.com",
    TEAM: LIVE_TEAM,
    STATUS: LIVE_STATUS,
    STAGES: LIVE_STAGES,
    CLIENTS: LIVE_CLIENTS,
    BRIEFS: LIVE_BRIEFS,
    serviceLabel: (code) => ({ g: "Google Ads", m: "Meta Ads", s: "Social Media" }[code] || code),
    paidClients: () => LIVE_CLIENTS.filter((c) => c.status === "paid_client"),
    activeMRR: () => LIVE_CLIENTS.filter((c) => LIVE_STATUS[c.status]?.inMRR).reduce((s, c) => s + (c.mrr || 0), 0),
    unmatchedBriefs: () => LIVE_BRIEFS.filter((b) => !b.linked),
    teamById: (id) => LIVE_TEAM.find((t) => t.id === id) || null,
  };

  window.PPC = window.PPC || {};
  window.PPC.LIVE = LIVE;
})();
