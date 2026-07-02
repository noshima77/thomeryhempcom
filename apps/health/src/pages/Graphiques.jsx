import { useStorage } from "../hooks/useStorage";

const START_KG = 54;
const TARGET_KG = 60;

function buildProjection() {
  return Array.from({ length: 13 }, (_, i) => ({
    label: `M${i}`,
    v: parseFloat((START_KG + (i * (TARGET_KG - START_KG)) / 12).toFixed(2)),
  }));
}

function Sparkline({ data, target, color = "var(--color-green-500)" }) {
  if (!data || data.length < 2) return (
    <div className="text-center py-8 text-neutral-500 font-mono text-xs">
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
  const gradId = `g-${color.replace(/[^a-z]/gi,'')}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      {target && (
        <line x1="0" y1={toY(target)} x2={W} y2={toY(target)} stroke="var(--color-neutral-500)" strokeWidth="1" strokeDasharray="4 4" />
      )}
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d,i) => (
        <circle key={i} cx={toX(i)} cy={toY(d.v)} r="4" fill={color} stroke="var(--color-neutral-50)" strokeWidth="1.5" />
      ))}
      {data.map((d,i) => i % Math.max(1,Math.floor(data.length/6)) === 0 && (
        <text key={`x${i}`} x={toX(i)} y={H-2} fill="var(--color-neutral-500)" fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">
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
      const first = parseInt(e.reps[exId].split(/[/,\s]+/)[0]);
      return { v: isNaN(first) ? 0 : first, label: e.date?.slice(5) || "" };
    })
    .filter(d => d.v > 0);

  return (
    <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mt-3">
      <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2">{label} — série 1 (reps)</div>
      <Sparkline data={data} color={color} />
    </div>
  );
}

export default function Graphiques() {
  const [entries] = useStorage("hugo_journal", []);

  const weightData = entries
    .filter(e => e.weight)
    .slice(-12)
    .map(e => ({ v: parseFloat(e.weight), label: e.date?.slice(5) || "" }));

  const projection = buildProjection();

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-6 pb-24 animate-fade-up">
      <p className="font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1">Visualisation</p>
      <h1 className="font-serif text-3xl leading-none tracking-tight mb-6">
        Courbes de<br /><span className="text-green-500">progression</span>
      </h1>

      <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2">Poids réel (kg)</div>
      <div className="bg-neutral-0 border-2 border-green-500 rounded-2xl p-4">
        <Sparkline data={weightData} target={TARGET_KG} />
        <div className="flex justify-between mt-2">
          <span className="font-mono text-xs text-neutral-500">Début : 54 kg</span>
          <span className="font-mono text-xs text-green-500">Objectif : 60 kg</span>
        </div>
      </div>

      <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2 mt-6">Projection théorique 12 mois</div>
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4">
        <Sparkline data={projection} color="var(--color-neutral-500)" />
        <div className="text-sm text-neutral-500 mt-2">+500g / mois en prise de masse lean</div>
      </div>

      <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2 mt-6">Exercices clés</div>
      <ExerciseChart entries={entries} exId="tractions" label="Tractions" color="var(--color-green-500)" />
      <ExerciseChart entries={entries} exId="pompes" label="Pompes" color="var(--color-info-500)" />
      <ExerciseChart entries={entries} exId="dips" label="Dips" color="var(--color-earth-500)" />

      {entries.length === 0 && (
        <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-7 text-center mt-4">
          <div className="text-3xl mb-2">◎</div>
          <div className="text-neutral-500">
            Commence à remplir ton journal pour voir<br />les graphiques apparaître ici.
          </div>
        </div>
      )}
    </div>
  );
}