/* Shared primitives + design tokens reference (rendered inline in each screen header where helpful) */

const Avatar = ({ user, size = "md", title }) => {
  if (!user) {
    return <span className={`avatar empty ${size === "sm" ? "sm" : size === "lg" ? "lg" : ""}`} title="Unassigned">?</span>;
  }
  const cls = `avatar ${size === "sm" ? "sm" : size === "lg" ? "lg" : size === "xl" ? "xl" : ""}`;
  const initials = user.initials || (user.name || "?").split(" ").map(s => s[0]).join("").slice(0, 2);
  return (
    <span
      className={cls}
      style={{ background: user.color ? hexA(user.color, 0.18) : undefined, color: user.color }}
      title={title || user.name}
    >
      {initials}
    </span>
  );
};

function hexA(hex, a) {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const Pill = ({ kind = "", children, dot }) => (
  <span className={`pill ${kind}`}>
    {dot && <span className="dot" />}
    {children}
  </span>
);

const Stat = ({ label, value, sub, delta, deltaDir, money }) => (
  <div className="stat">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {(delta || sub) && (
      <div className={`stat-delta ${deltaDir || ""}`}>
        {delta && <span>{deltaDir === "up" ? "▲" : deltaDir === "down" ? "▼" : ""} {delta}</span>}
        {sub && <span className="muted-2">{sub}</span>}
      </div>
    )}
  </div>
);

/* Sparkline */
const Spark = ({ data, color = "var(--accent)", w = 100, h = 28, fill = true }) => {
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const step = w / (data.length - 1 || 1);
  const pts = data.map((d, i) => [i * step, h - 4 - ((d - min) / span) * (h - 8)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {fill && (
        <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={color} opacity="0.10" />
      )}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.2" fill={color} />
    </svg>
  );
};

/* Bar chart */
const Bars = ({ data, w = 320, h = 80, color = "var(--accent)" }) => {
  const max = Math.max(...data.map(d => d.v));
  const bw = (w - (data.length - 1) * 6) / data.length;
  return (
    <svg width={w} height={h + 16} viewBox={`0 0 ${w} ${h + 16}`}>
      {data.map((d, i) => {
        const bh = (d.v / max) * h;
        return (
          <g key={i}>
            <rect x={i * (bw + 6)} y={h - bh} width={bw} height={bh} rx="3" fill={color} opacity={i === data.length - 1 ? 1 : 0.45} />
            <text x={i * (bw + 6) + bw / 2} y={h + 12} textAnchor="middle" fontSize="9.5" fill="var(--ink-4)" fontFamily="var(--mono)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* Toast manager (very simple, exposed globally) */
function ToastHost() {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    window.toast = (msg, opts = {}) => {
      const id = Math.random().toString(36).slice(2);
      setToasts(t => [...t, { id, msg, icon: opts.icon || "✓" }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts.ttl || 3400);
    };
  }, []);
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span className="toast-icon">{t.icon}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* Money formatter — respects currency, hides money for non-money roles */
function fmtMoney(amt, currency = "CAD", showCurrency = true) {
  const f = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 });
  let s = f.format(amt);
  if (!showCurrency) s = s.replace(/^[A-Z]{2,3}/, "").trim();
  return s;
}

/* Age coloring */
function ageClass(days, type) {
  if (type === "client") {
    if (days >= 5) return "hot";
    if (days >= 3) return "warm";
    return "";
  }
  if (days >= 7) return "hot";
  if (days >= 4) return "warm";
  return "";
}

/* useStore — re-renders any screen that mutates PPC.store */
function useStore() {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const fn = () => setTick(t => t + 1);
    window.addEventListener("ppc:update", fn);
    return () => window.removeEventListener("ppc:update", fn);
  }, []);
  return window.PPC.store;
}

/* Form primitives */
function Field({ label, hint, children, full }) {
  return (
    <div className="field" style={full ? { gridColumn: "1 / -1" } : null}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
function TextInput(props) { return <input className="input" {...props} />; }
function Textarea(props) { return <textarea className="textarea" {...props} />; }
function SelectInput({ value, onChange, children, ...rest }) {
  return <select className="select-input" value={value} onChange={onChange} {...rest}>{children}</select>;
}

function UserSelect({ value, onChange, users, allowNone, placeholder }) {
  const { USERS } = window.PPC;
  const list = users || USERS.filter(u => u.id !== "client");
  return (
    <SelectInput value={value || ""} onChange={e => onChange(e.target.value || null)}>
      {allowNone && <option value="">{placeholder || "— Unassigned —"}</option>}
      {list.map(u => <option key={u.id} value={u.id}>{u.name} · {u.role}</option>)}
    </SelectInput>
  );
}

function PriorityPick({ value, onChange }) {
  return (
    <div className="row gap-2">
      {["low","med","high"].map(p => (
        <span key={p} className={`chip-pick ${value===p?"on":""} ${value===p && p==="high"?"accent":""}`} onClick={() => onChange(p)}>
          {p === "high" ? "High" : p === "med" ? "Medium" : "Low"}
        </span>
      ))}
    </div>
  );
}
function DuePick({ value, onChange }) {
  const opts = ["Today","Tomorrow","Thu","Fri","Next Mon","No date"];
  return (
    <div className="row gap-2" style={{ flexWrap: "wrap" }}>
      {opts.map(o => (
        <span key={o} className={`chip-pick ${value===o?"on":""}`} onClick={() => onChange(o)}>{o}</span>
      ))}
    </div>
  );
}

/* DurationPick — estimate chips driven by DURATION_BUCKETS (Phase 6).
   value is minutes (number) or null. Maps to the bucket midpoint so the
   board can group by bucket while we keep a concrete minute estimate. */
const DURATION_PICK_OPTS = [
  { min: 1,   label: "1 min"   },
  { min: 5,   label: "5 min"   },
  { min: 10,  label: "5–10 min"},
  { min: 30,  label: "10–30 min"},
  { min: 60,  label: "30–60 min"},
  { min: 120, label: "60 min+" }
];
function DurationPick({ value, onChange }) {
  const bf = window.PPC && window.PPC.bucketFor;
  const curBucket = (value != null && bf) ? bf(value) : null;
  return (
    <div className="row gap-2" style={{ flexWrap: "wrap" }}>
      {DURATION_PICK_OPTS.map(o => {
        const ob = bf ? bf(o.min) : null;
        const on = curBucket && ob && curBucket.id === ob.id;
        return <span key={o.min} className={`chip-pick ${on ? "on" : ""}`} onClick={() => onChange(on ? null : o.min)}>{o.label}</span>;
      })}
    </div>
  );
}
/* minutes → "45m" / "1h 30m" */
function fmtDur(min) {
  if (min == null) return "—";
  min = Math.round(min);
  if (min < 60) return min + "m";
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

Object.assign(window, { Avatar, Pill, Stat, Spark, Bars, ToastHost, fmtMoney, ageClass, hexA, useStore, Field, TextInput, Textarea, SelectInput, UserSelect, PriorityPick, DuePick, DurationPick, fmtDur });
