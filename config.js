// Everything study-specific lives here. All values are a made-up demo: replace them for your study.
(() => {
  const rect = (x, y, w, h) => [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
  const line = (name, type, ax, ay, bx, by, from, to) =>
    ({ id: "L-" + name, name, type, a: { x: ax, y: ay }, b: { x: bx, y: by }, zones: ["Z-" + from, "Z-" + to] });

  window.FIELD_LOGGER_CONFIG = {
    DISPLAY_NAMES: {}, // shown name per stored area name; exports keep the stored one
    LABEL_HINTS: {}, // "top" or "top-right", per lower-case area name

    ROLES: [{ id: "member", label: "Team member" }, { id: "lead", label: "Team lead" }],
    TASKS: {
      member: [
        { id: "prepare", label: "Prepare" }, { id: "write", label: "Write or record" },
        { id: "discuss", label: "Discuss" }, { id: "search", label: "Search" },
        { id: "wait", label: "Wait" }, { id: "break", label: "Break" },
      ],
      lead: [
        { id: "plan", label: "Plan", grp: "Coordination" }, { id: "assign", label: "Assign work", grp: "Coordination" },
        { id: "advise", label: "Advise", grp: "Communication" }, { id: "discuss", label: "Discuss", grp: "Communication" },
        { id: "write", label: "Write or record", grp: "Records" }, { id: "break", label: "Break", grp: "Other" },
      ],
    },
    TASK_NONE: { id: "unclear", label: "Unclear / between tasks" },
    INITIATORS: [
      { id: "colleague", label: "Colleague" }, { id: "visitor", label: "Visitor" }, { id: "phone", label: "Phone" },
      { id: "alert", label: "Alert / device" }, { id: "self", label: "Self-initiated" }, { id: "unclear", label: "Unclear" },
    ],
    PLACES: [
      { id: "outdoors", label: "Outdoors" }, { id: "kitchen", label: "Kitchen" },
      { id: "elsewhere", label: "Elsewhere in the building" }, { id: "unknown", label: "Unknown" },
    ],

    SESSION_NUMBERS: ["1", "2"],
    SHIFTS: [
      { id: "am", label: "Morning", stratum: "day" }, { id: "pm", label: "Afternoon", stratum: "day" },
      { id: "eve", label: "Evening", stratum: "evening" },
    ],
    SHIFT_PHASES: ["start of shift", "middle of shift", "end of shift"],
    NO_AREA: { id: "none", label: "None (moves between areas)" },
    CODE_PATTERN: "^DEMO\\d{2}$",
    CODE_EXAMPLE: "DEMO01",
    EXPECTED_EXPOSURE: "", // set a value to be warned when the camera differs

    ACCLIM_MIN: 5,
    PROBE_MINS: [30, 60, 90], // minutes of natural work, time outside the mapped areas excluded
    PROBE_GAP_MIN: 20,
    PROBE_OVERDUE_MIN: 10,
    // Types: tlx (0-100 in fives), l7 (1-7), labelled (named levels), choice. observer: true is asked of the researcher.
    PROBE_ITEMS: [
      { id: "demand", label: "Demand", type: "tlx", q_first: "How demanding has the session been so far?", q: "How demanding has it been lately?", lo: "Easy", hi: "Demanding" },
      { id: "pace", label: "Pace", type: "tlx", q: "What was the pace like?", lo: "Slow", hi: "Fast" },
      { id: "focus", label: "Focus", type: "l7", q: "Could you stay focused?", lo: "Easily", hi: "With difficulty" },
      { id: "energy", label: "Energy", type: "labelled", q: "How do you feel right now?", levels: { 1: "Full of energy", 2: "Fine", 3: "A little tired", 4: "Tired", 5: "Worn out" } },
      { id: "place_busy", label: "Place (observer)", type: "choice", observer: true, q: "How crowded does it look?", options: ["empty", "some people", "crowded"] },
    ],
    ZONE_ITEM: { q: "Rate each area as a place to work. Use N/A where it does not apply.", lo: "Poor", hi: "Excellent" },
    FAMILIAR_ITEM: { q: "Rate your knowledge of each area.", lo: "New to me", hi: "Know it by heart" },

    CONSENT: {
      title: "Demo study",
      version: "demo-1",
      ref: "Not an approved consent form",
      items: [
        "The demo sheet was shown to me.",
        "I can end the demo whenever I like.",
        "An observer may log what I do.",
        "I may be asked short questions.",
      ],
      optional: "A screenshot of this demo may be shown.",
    },
    CHECKLIST: [
      { id: "sheet", label: "Information sheet given" },
      { id: "consent", label: "Consent signed" },
      { id: "recorders", label: "All recorders running" },
      { id: "exposure", label: "Camera exposure read" },
      { id: "briefing", label: "Briefing given: \"Say stop whenever you like.\"" },
    ],
    INVENTORY: {
      gradeLabel: "Grade", grades: ["A", "B", "C"],
      visionLabel: "Vision correction today", vision: ["none needed", "contact lenses", "glasses"],
      eligibleLabel: "Eligibility", eligible: ["confirmed", "not eligible: stop session"],
    },

    PAUSE_S: 20,
    TARGET_DIST: "1.5 m",
    // One pause point per area. Steps name areas; door: null means the open boundary between them.
    // The reverse route is worked out from the forward one.
    WALK: {
      rev: "demo-1",
      script: "Please walk this route at your usual pace. At each point, stop until I tell you to go on.",
      forward: {
        start: "Hallway",
        steps: [
          { zone: "Room A", door: "T01", pause: true },
          { zone: "Room B", door: "T04", pause: true },
          { zone: "Hallway", door: "T02", pause: false },
          { zone: "Room C", door: "T03", pause: true },
          { zone: "Room D", door: "T05", pause: true },
          { zone: "Hallway", door: null, pause: false },
        ],
        stops: [
          { zone: "Room A", x: 190, y: 115 }, { zone: "Room B", x: 600, y: 115 },
          { zone: "Room C", x: 210, y: 520 }, { zone: "Room D", x: 750, y: 530 },
        ],
      },
    },

    // Kinds: passage (walked through, cannot be allocated) and room (inside an area, not analysed on its own).
    DEFAULT_GEO: {
      schema: "field-logger-geometry/1",
      name: "Made-up demo floor plan",
      rev: 1,
      example: true,
      builtin: true,
      width: 1000,
      height: 640,
      image: null,
      zones: [
        { id: "Z-a", name: "Room A", points: rect(0, 0, 420, 250) },
        { id: "Z-b", name: "Room B", points: rect(420, 0, 580, 250) },
        { id: "Z-hall", name: "Hallway", kind: "passage", points: rect(0, 250, 1000, 120) },
        { id: "Z-c", name: "Room C", points: rect(0, 370, 420, 270) },
        { id: "Z-d", name: "Room D", points: rect(420, 370, 580, 270) },
        { id: "Z-booth", name: "Booth", kind: "room", points: rect(820, 20, 160, 90) },
      ],
      lines: [
        line("T01", "threshold", 150, 250, 270, 250, "a", "hall"),
        line("T02", "threshold", 650, 250, 770, 250, "b", "hall"),
        line("T03", "threshold", 150, 370, 270, 370, "hall", "c"),
        line("T04", "threshold", 420, 80, 420, 170, "a", "b"),
        line("T05", "threshold", 420, 460, 420, 550, "c", "d"),
        line("O01", "open", 590, 370, 910, 370, "hall", "d"),
      ],
    },
  };
})();
