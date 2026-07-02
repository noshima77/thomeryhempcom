import { useStorage } from "../hooks/useStorage";

const START_KG = 54;
const TARGET_KG = 60;

/* Projection linéaire 12 mois */
function buildProjection() {
  return Array.from({ length: 13 }, (_, i) => ({
    label: `M${i}`,
    v: parseFloat((START_KG + (i * (TARGET_KG - START_KG)) / 12).toFixed(2)),
  }));
}

function Sparkline({ data, target, color = "var(--accent)", label = "kg" }) {
  if (!data || data.length < 2) return (
    <div style={{ textAlign:"center", padding:"32px 0", color:"var(--text-3)", fontFamily:"var(--font-mono)", fontSize:"0.72rem" }}>
      — données insuffisantes (min. 2 entrées) —
    </div>
  );
  const W = 300, H = 140;
  const vals = data.map(d => d.v);
  const allVals = target ? [...vals, target] : vals;
  const min = Math.min(...allVals) - 0.3;
  const max = Math.max(...allVals) + 0.3;
  const toX = i => (i / (data.length - 1)) * W;
  const toY = v => H - ((v - min) / (max - min)) * H;
  const path = data.map((d,i) => `${i===0?"M":"L"} ${toX(i).toFixed(1)} ${toY(d.v).toFixed(1)}`).join(" ");
  const area = `${path} L ${toX(data.length-1)} ${H} L 0 ${H} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display:"block" }}>
      <defs>
        <linearGradient id={`g-${color.replace(/[^a-z]/gi,'')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace(/[^a-z]/gi,'')})`} />
      {target && (
        <line x1="0" y1={toY(target)} x2={W} y2={toY(target)}
          stroke="var(--text-3)" strokeWidth="1" strokeDasharray="4 4" />
      )}
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d,i) => (
        <circle key={i} cx={toX(i)} cy={toY(d.v)} r="4"
          fill={color} stroke="var(--bg)" strokeWidth="1.5" />
      ))}
      {/* Labels axe x */}
      {data.map((d,i) => i % Math.max(1,Math.floor(data.length/6)) === 0 && (
        <text key={`x${i}`} x={toX(i)} y={H-2} fill="var(--text-3)"
          fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">
          {d.label}
        </text>
      ))}
    </svg>
  );
}

function ExerciseChart({ entries, exId, label, color }) {
  const data = entries
    .filter(e => e.reps?.[exId])
    .slice(-10)
    .map(e => {
      // Prend la 1ère série : "8 / 7 / 6" → 8
      const first = parseInt(e.reps[exId].split(/[/,\s]+/)[0]);
      return {
        v: isNaN(first) ? 0 : first,
        label: e.date?.slice(5) || "",
      };
    })
    .filter(d => d.v > 0);

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="section-label">{label} — série 1 (reps)</div>
      <Sparkline data={data} color={color} label="reps" />
    </div>
  );
}

export default function Graphiques() {
  const [entries] = useStorage("hugo_journal", []);

  const weightData = entries
    .filter(e => e.weight)
    .slice(-12)
    .map(e => ({
      v: parseFloat(e.weight),
      label: e.date?.slice(5) || "",
    }));

  const projection = buildProjection();

  return (
    <div className="page">
      <p className="page-subtitle">Visualisation</p>
      <h1 className="page-title">Courbes de<br /><span className="text-accent">progression</span></h1>

      {/* Poids réel */}
      <div className="section-label">Poids réel (kg)</div>
      <div className="card card-accent">
        <Sparkline data={weightData} target={TARGET_KG} />
        <div className="flex justify-between mt-sm" style={{ marginTop: 10 }}>
          <span className="text-muted text-mono" style={{ fontSize:"0.65rem" }}>Début : 54 kg</span>
          <span className="text-accent text-mono" style={{ fontSize:"0.65rem" }}>Objectif : 60 kg</span>
        </div>
      </div>

      {/* Projection */}
      <div className="section-label" style={{ marginTop: 20 }}>Projection théorique 12 mois</div>
      <div className="card">
        <Sparkline data={projection} color="var(--text-3)" />
        <div className="text-muted" style={{ marginTop: 8, fontSize:"0.72rem" }}>
          +500g / mois en prise de masse lean
        </div>
      </div>

      {/* Exercices clés */}
      <div className="section-label" style={{ marginTop: 20 }}>Exercices clés</div>
      <ExerciseChart entries={entries} exId="tractions" label="Tractions" color="var(--accent)" />
      <ExerciseChart entries={entries} exId="pompes" label="Pompes" color="var(--accent-2)" />
      <ExerciseChart entries={entries} exId="dips" label="Dips" color="var(--accent-3)" />

      {entries.length === 0 && (
        <div className="card" style={{ marginTop: 16, textAlign:"center", padding: "28px 16px" }}>
          <div style={{ fontSize:"2rem", marginBottom: 8 }}>◎</div>
          <div className="text-muted">
            Commence à remplir ton journal pour voir<br />les graphiques apparaître ici.
          </div>
        </div>
      )}
    </div>
  );
}
