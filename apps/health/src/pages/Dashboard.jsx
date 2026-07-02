import { useState, useEffect } from "react";
import { useStorage } from "../hooks/useStorage";

/* ─── CONSTANTES ──────────────────────────────────────────────── */
const TARGET_KG    = 60;
const START_KG     = 54;
const IF_START     = 12;
const IF_END       = 18;
const HYDRO_GOAL   = 8;
const WEEK_DAYS    = ["L", "M", "M", "J", "V", "S", "D"];
const TRAINING_DAYS = [0, 1, 3, 4];

/* ─── HELPERS (inchangés) ────────────────────────────────────── */
function getIFStatus() {
  const now  = new Date();
  const h    = now.getHours() + now.getMinutes() / 60;
  const inWindow = h >= IF_START && h < IF_END;
  const remaining = inWindow
    ? IF_END - h
    : h < IF_START
      ? IF_START - h
      : 24 - h + IF_START;
  const remH = Math.floor(remaining);
  const remM = Math.round((remaining - remH) * 60);
  return { inWindow, remH, remM, h };
}

function getWeekNumber() {
  const now  = new Date();
  const start = new Date(2025, 0, 6);
  const diff  = Math.floor((now - start) / (7 * 24 * 3600 * 1000));
  return Math.max(1, Math.min(52, diff + 1));
}

function getTodayIdx() {
  return (new Date().getDay() + 6) % 7;
}

function todayLabel(idx) {
  const labels = ["Push", "Pull", "—", "Legs", "Full B.", "—", "—"];
  return labels[idx] || "—";
}

function progressPct(current, start, target) {
  return Math.min(100, Math.round(((current - start) / (target - start)) * 100));
}

/* ─── SPARKLINE ───────────────────────────────────────────────── */
function Sparkline({ data, color = "var(--color-green-500)", target }) {
  if (!data || data.length < 2) {
    return (
      <div className="w-full h-[130px] flex items-center justify-center">
        <span className="font-mono text-xs text-neutral-500">
          — données insuffisantes —
        </span>
      </div>
    );
  }

  const W = 300, H = 130;
  const vals = data.map(d => d.v);
  const allVals = target ? [...vals, target] : vals;
  const min = Math.min(...allVals) - 0.5;
  const max = Math.max(...allVals) + 0.5;
  const toX = (i) => (i / (data.length - 1)) * W;
  const toY = (v) => H - ((v - min) / (max - min)) * H;

  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(d.v).toFixed(1)}`)
    .join(" ");

  const area = `${path} L ${toX(data.length-1).toFixed(1)} ${H} L 0 ${H} Z`;
  const targetY = target ? toY(target).toFixed(1) : null;

  return (
    <div className="w-full h-[130px]">
      <svg className="w-full h-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sg)" />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {targetY && (
          <line x1="0" y1={targetY} x2={W} y2={targetY} stroke="var(--color-neutral-500)" strokeWidth="1" strokeDasharray="4 4" />
        )}
        {data.map((d, i) => (
          <circle key={i} cx={toX(i).toFixed(1)} cy={toY(d.v).toFixed(1)} r="3.5" fill={color} stroke="var(--color-neutral-50)" strokeWidth="1.5" />
        ))}
        <text x={toX(data.length-1) - 4} y={toY(data[data.length-1].v) - 8} fill={color} fontSize="10" fontFamily="DM Mono, monospace" textAnchor="end">
          {data[data.length-1].v} kg
        </text>
        {targetY && (
          <text x={W - 2} y={parseFloat(targetY) - 4} fill="var(--color-neutral-500)" fontSize="9" fontFamily="DM Mono, monospace" textAnchor="end">
            objectif {target}kg
          </text>
        )}
      </svg>
    </div>
  );
}

/* ─── COMPOSANT PRINCIPAL ────────────────────────────────────── */
export default function Dashboard({ onNavigate }) {
  const [journal] = useStorage("hugo_journal", []);
  const [hydro, setHydro] = useStorage("hugo_hydro_today", {
    date: new Date().toDateString(),
    count: 0,
  });
  const [ifStatus, setIfStatus] = useState(getIFStatus());

  useEffect(() => {
    const today = new Date().toDateString();
    if (hydro.date !== today) {
      setHydro({ date: today, count: 0 });
    }
    const tid = setInterval(() => setIfStatus(getIFStatus()), 60_000);
    return () => clearInterval(tid);
  }, []);

  const weightData = journal
    .filter(e => e.weight)
    .slice(-8)
    .map(e => ({ v: parseFloat(e.weight), label: e.date }));

  const lastWeight = weightData.length ? weightData[weightData.length - 1].v : START_KG;
  const pct = progressPct(lastWeight, START_KG, TARGET_KG);
  const weekNum = getWeekNumber();
  const todayIdx = getTodayIdx();
  const isTrainingDay = TRAINING_DAYS.includes(todayIdx);

  const toggleHydro = (idx) => {
    setHydro(prev => ({
      ...prev,
      count: prev.count === idx + 1 ? idx : idx + 1,
    }));
  };

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-6 pb-24 animate-fade-up">
      {/* Header */}
      <div className="mb-7">
        <p className="font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1">
          Semaine {weekNum} · {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}
        </p>
        <h1 className="font-serif text-3xl leading-none tracking-tight">
          Bonjour,<br /><span className="text-green-500">Hugo.</span>
        </h1>
      </div>

      {/* Poids + objectif */}
      <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2">Prise de masse</div>
      <div className="bg-neutral-0 border-2 border-green-500 rounded-2xl p-4 shadow-[0_0_24px_rgba(90,143,77,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-wide mb-1.5">Poids actuel</div>
            <div className="font-serif text-4xl leading-none tracking-tight text-green-500">
              {lastWeight}
              <span className="font-mono text-sm text-neutral-500 ml-1">kg</span>
            </div>
            <div className="text-sm text-neutral-500 mt-1">
              + {(lastWeight - START_KG).toFixed(1)} kg depuis le début
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-wide mb-1.5">Objectif</div>
            <div className="font-serif text-2xl">
              {TARGET_KG}
              <span className="font-mono text-sm text-neutral-500 ml-1">kg</span>
            </div>
            <div className="text-sm text-neutral-500 mt-1">dans 12 mois</div>
          </div>
        </div>

        <div className="h-1 bg-neutral-200 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-xs text-neutral-500">54 kg</span>
          <span className="font-mono text-xs text-green-500">{pct}% atteint</span>
          <span className="font-mono text-xs text-neutral-500">60 kg</span>
        </div>

        {weightData.length >= 2 && (
          <div className="mt-4">
            <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-1.5">Courbe réelle</div>
            <Sparkline data={weightData} target={TARGET_KG} />
          </div>
        )}

        <button
          className="w-full flex items-center justify-center gap-2 min-h-touch px-6 rounded-lg font-serif text-sm tracking-wide bg-green-500 text-white active:scale-[0.97] active:bg-green-700 transition-all mt-4"
          onClick={() => onNavigate("journal")}
        >
          + Saisir le poids du jour
        </button>
      </div>

      {/* Fenêtre IF */}
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mt-3">
        <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2">Jeûne intermittent</div>
        <div className="flex items-center gap-3.5">
          <div className="font-serif text-4xl leading-none text-amber-500 flex-shrink-0">
            {ifStatus.inWindow ? "▶" : "◷"}
          </div>
          <div className="flex-1">
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-wide mb-0.5">
              {ifStatus.inWindow ? "Fenêtre alimentaire ouverte" : "Phase de jeûne"}
            </div>
            <div className="text-base font-medium">
              {ifStatus.inWindow
                ? `Ferme dans ${ifStatus.remH}h${ifStatus.remM.toString().padStart(2,"0")}`
                : `Ouvre dans ${ifStatus.remH}h${ifStatus.remM.toString().padStart(2,"0")}`
              }
            </div>
            <div className="text-sm text-neutral-500 mt-0.5">
              Fenêtre : 12h00 – 18h00 · 2 350 kcal
            </div>
          </div>
        </div>
        <div className="h-1 bg-neutral-200 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, ((ifStatus.h - IF_START) / (IF_END - IF_START)) * 100)}%`,
              opacity: ifStatus.inWindow ? 1 : 0.3,
            }}
          />
        </div>
      </div>

      {/* Hydratation */}
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mt-3">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase">Hydratation</div>
          <span className="font-serif text-2xl" style={{ color: "var(--color-info-500)" }}>
            {hydro.count}
            <span className="font-mono text-sm text-neutral-500 ml-1">/ {HYDRO_GOAL}</span>
          </span>
        </div>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {Array.from({ length: HYDRO_GOAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => toggleHydro(i)}
              aria-label={`Verre ${i + 1}`}
              className={`w-7 h-7 rounded-full border-[1.5px] transition-all active:scale-90 ${
                i < hydro.count
                  ? "border-transparent"
                  : "border-neutral-200 bg-transparent"
              }`}
              style={i < hydro.count ? { background: "var(--color-info-500)", borderColor: "var(--color-info-500)" } : undefined}
            />
          ))}
        </div>
        <div className="h-1 bg-neutral-200 rounded-full overflow-hidden mt-2.5">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(hydro.count / HYDRO_GOAL) * 100}%`, background: "var(--color-info-500)" }} />
        </div>
        <div className="text-sm text-neutral-500 mt-1.5">
          {hydro.count * 250} ml · objectif 2 000 ml
        </div>
      </div>

      {/* Semaine d'entraînement */}
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase">Semaine d'entraînement</div>
          <span className={`rounded-md px-2 py-0.5 font-mono text-xs tracking-wide border ${
            isTrainingDay
              ? "bg-green-50 text-green-500 border-green-500"
              : "bg-neutral-100 text-neutral-500 border-neutral-200"
          }`}>
            {isTrainingDay ? `▶ ${todayLabel(todayIdx)}` : "REPOS"}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEK_DAYS.map((day, i) => {
            const isTrain = TRAINING_DAYS.includes(i);
            const isToday = i === todayIdx;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="font-mono text-[0.58rem] text-neutral-500 uppercase tracking-wide">{day}</span>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs transition-all ${
                  isTrain
                    ? "bg-green-50 border-green-500 text-green-500 font-bold"
                    : "bg-neutral-100 border-neutral-200 text-neutral-500"
                } ${isToday ? "ring-2 ring-green-500" : ""}`}>
                  {isTrain ? ["P", "T", "—", "L", "F", "—", "—"][i] : "·"}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2.5">
          <span className="font-mono text-xs text-neutral-500">P=Push T=Pull L=Legs F=Full Body</span>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 min-h-touch px-6 rounded-lg font-serif text-sm tracking-wide bg-neutral-100 text-neutral-900 border border-neutral-200 active:scale-[0.97] transition-all mt-3"
          onClick={() => onNavigate("training")}
        >
          Voir le protocole complet →
        </button>
      </div>

      {/* Calories macro rapide */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4">
          <div className="font-mono text-xs text-neutral-500 uppercase tracking-wide mb-1.5">Calories</div>
          <div className="font-serif text-2xl text-amber-500">2 350</div>
          <div className="text-sm text-neutral-500 mt-1">kcal / jour</div>
        </div>
        <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4">
          <div className="font-mono text-xs text-neutral-500 uppercase tracking-wide mb-1.5">Protéines</div>
          <div className="font-serif text-2xl" style={{ color: "var(--color-info-500)" }}>160</div>
          <div className="text-sm text-neutral-500 mt-1">g / jour · 3g/kg</div>
        </div>
      </div>

      <div className="mt-3 mb-6 flex flex-col gap-2">
        <button
          className="w-full flex items-center justify-center gap-2 min-h-touch px-6 rounded-lg font-serif text-sm tracking-wide bg-green-500 text-white active:scale-[0.97] active:bg-green-700 transition-all"
          onClick={() => onNavigate("macros")}
        >
          ◈ Macros du jour — cocher mes repas
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 min-h-touch px-6 rounded-lg font-serif text-sm tracking-wide bg-neutral-0 border border-neutral-200 text-neutral-900 active:scale-[0.97] transition-all"
          onClick={() => onNavigate("food")}
        >
          Voir le plan alimentaire →
        </button>
      </div>
    </div>
  );
}