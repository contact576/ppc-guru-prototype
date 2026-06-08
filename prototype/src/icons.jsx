/* Minimal hand-drawn SVG icon set (stroke-only, calm, in keeping with the type system). */
const Ic = ({ d, fill, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="ic" {...p}>
    {d}
  </svg>
);

const Icons = {
  home:    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" />,
  board:   <g><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></g>,
  cycle:   <path d="M3 12a9 9 0 0 1 15.5-6.3M21 4v5h-5M21 12a9 9 0 0 1-15.5 6.3M3 20v-5h5" />,
  check:   <path d="M5 12l4 4 10-10" />,
  bell:    <g><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z" /><path d="M10 21a2 2 0 0 0 4 0" /></g>,
  star:    <path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3z" />,
  funnel:  <path d="M3 4h18l-7 9v7l-4-2v-5L3 4z" />,
  user:    <g><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></g>,
  meta:    <path d="M3 12c2-6 8-6 9 0s7 6 9 0" />,
  google:  <g><circle cx="12" cy="12" r="9" /><path d="M21 12h-9V3" /></g>,
  insight: <g><path d="M3 20h18" /><path d="M6 16l4-5 4 3 5-8" /></g>,
  report:  <g><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></g>,
  users:   <g><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3 3-5 7-5s7 2 7 5" /><circle cx="17" cy="9" r="2.5" /><path d="M15 14c4 0 7 2 7 5" /></g>,
  catalog: <g><path d="M4 5h16M4 12h16M4 19h16" /></g>,
  search:  <g><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></g>,
  plus:    <path d="M12 5v14M5 12h14" />,
  filter:  <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" />,
  more:    <g><circle cx="6" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="18" cy="12" r="1" /></g>,
  arrow:   <path d="M5 12h14M13 6l6 6-6 6" />,
  clock:   <g><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
  alert:   <g><path d="M12 4l10 17H2L12 4z" /><path d="M12 10v5M12 18v.5" /></g>,
  flag:    <g><path d="M5 21V4M5 4h13l-2 4 2 4H5" /></g>,
  calendar:<g><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></g>,
  bolt:    <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />,
  doc:     <g><path d="M7 3h8l4 4v14H7V3z" /><path d="M14 3v5h5" /></g>,
  close:   <path d="M6 6l12 12M18 6L6 18" />,
  chevDown:<path d="M6 9l6 6 6-6" />,
  drag:    <g><circle cx="9" cy="6" r="1.2" /><circle cx="9" cy="12" r="1.2" /><circle cx="9" cy="18" r="1.2" /><circle cx="15" cy="6" r="1.2" /><circle cx="15" cy="12" r="1.2" /><circle cx="15" cy="18" r="1.2" /></g>,
  link:    <g><path d="M10 14a4 4 0 0 1 0-6l3-3a4 4 0 0 1 6 6l-1.5 1.5" /><path d="M14 10a4 4 0 0 1 0 6l-3 3a4 4 0 0 1-6-6l1.5-1.5" /></g>,
  trend:   <path d="M3 17l6-6 4 4 8-9" />,
  spark:   <path d="M3 17l4-6 4 3 4-8 6 11" />,
  sparkle: <g><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" /></g>,
  send:    <path d="M4 12l16-8-6 18-3-7-7-3z" />,
  refresh: <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />,
  phone:     <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  phoneOut:  <g><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /><path d="M16 8l5-5M21 3v4M21 3h-4" /></g>,
  phoneIn:   <g><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /><path d="M21 3l-5 5M16 4v4M16 8h4" /></g>,
  phoneMiss: <g><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /><path d="M16 3l5 5M21 3l-5 5" /></g>,
  whatsapp:  <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />,
  mail:      <g><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></g>,
  inbox:     <g><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5h13l3 7v6a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-6l3-7z" /></g>,
  pencil:    <g><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></g>,
  lines:     <g><path d="M5 7h14M5 12h14M5 17h9" /></g>,
  wave:      <g><path d="M4 12v3M8 8v8M12 5v14M16 8v8M20 11v2" /></g>
};

const Icon = ({ k, ...p }) => <Ic d={Icons[k]} {...p} />;

window.Icon = Icon;
