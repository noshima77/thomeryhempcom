import { useState, useEffect } from "react";
import { useStorage } from "../hooks/useStorage";

/* ─── CONSTANTES ──────────────────────────────────────────────── */
const TARGET_KG    = 60;
const START_KG     = 54;
const IF_START     = 12; // 12h00
const IF_END       = 18; // 18h00
const HYDRO_GOAL   = 8;  // verres de 250ml = 2L
const WEEK_DAYS    = ["L", "M", "M", "J", "V", "S", "D"];
// Semaine type : Lundi Push, Mardi Pull, Jeudi Legs, Vendredi Full Body
const TRAINING_DAYS = [0, 1, 3, 4]; // indices lundi=0

/* ─── HELPERS ────────────────────────────────────────────────── */
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
  const start = new Date(2025, 0, 6); // semaine 1 = 6 jan 2025
  const diff  = Math.floor((now - start) / (7 * 24 * 3600 * 1000));
  return Math.max(1, Math.min(52, diff + 1));
}

function getTodayIdx() {
  // 0=Lundi … 6=Dimanche
  return (new Date().getDay() + 6) % 7;
}

function todayLabel(idx) {
  const labels = ["Push", "Pull", "—", "Legs", "Full B.", "—", "—"];
  return labels[idx] || "—";
}

function progressPct(current, start, target) {
  return Math.min(100, Math.round(((current - start) / (target - start)) * 100));
}

/* ─── MINI SVG SPARKLINE ─────────────────────────────────────── */
function Sparkline({ data, color = "var(--accent)", target }) {
  if (!data || data.length < 2) {
    return (
      <div className="chart-area" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span className="text-muted text-mono" style={{ fontSize:"0.72rem" }}>
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
    <div className="chart-area">
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Zone remplie */}
        <path d={area} fill="url(#sg)" />
        {/* Ligne */}
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Objectif */}
        {targetY && (
          <line
            x1="0" y1={targetY}
            x2={W} y2={targetY}
            stroke="var(--text-3)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        )}
        {/* Points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={toX(i).toFixed(1)}
            cy={toY(d.v).toFixed(1)}
            r="3.5"
            fill={color}
            stroke="var(--bg)"
            strokeWidth="1.5"
          />
        ))}
        {/* Dernier label */}
        <text
          x={toX(data.length-1) - 4}
          y={toY(data[data.length-1].v) - 8}
          fill={color}
          fontSize="10"
          fontFamily="DM Mono, monospace"
          textAnchor="end"
        >
          {data[data.length-1].v} kg
        </text>
        {targetY && (
          <text
            x={W - 2}
            y={parseFloat(targetY) - 4}
            fill="var(--text-3)"
            fontSize="9"
            fontFamily="DM Mono, monospace"
            textAnchor="end"
          >
            objectif {target}kg
          </text>
        )}
      </svg>
    </div>
  );
}

/* ─── COMPOSANT PRINCIPAL ────────────────────────────────────── */
export default function Dashboard({ onNavigate }) {
  const [journal]       = useStorage("hugo_journal", []);
  const [hydro, setHydro] = useStorage("hugo_hydro_today", {
    date: new Date().toDateString(),
    count: 0,
  });
  const [ifStatus, setIfStatus] = useState(getIFStatus());

  /* Réinitialise hydratation chaque nouveau jour */
  useEffect(() => {
    const today = new Date().toDateString();
    if (hydro.date !== today) {
      setHydro({ date: today, count: 0 });
    }
    // Refresh IF status chaque minute
    const tid = setInterval(() => setIfStatus(getIFStatus()), 60_000);
    return () => clearInterval(tid);
  }, []);

  /* Données poids depuis le journal */
  const weightData = journal
    .filter(e => e.weight)
    .slice(-8)
    .map(e => ({ v: parseFloat(e.weight), label: e.date }));

  const lastWeight = weightData.length
    ? weightData[weightData.length - 1].v
    : START_KG;

  const pct     = progressPct(lastWeight, START_KG, TARGET_KG);
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
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p className="page-subtitle">Semaine {weekNum} · {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}</p>
        <h1 className="page-title">Bonjour,<br /><span className="text-accent">Hugo.</span></h1>
      </div>

      {/* Poids + objectif */}
      <div className="section-label">Prise de masse</div>
      <div className="card card-accent">
        <div className="flex items-center justify-between">
          <div>
            <div className="stat-label">Poids actuel</div>
            <div className="stat-value accent">
              {lastWeight}
              <span className="stat-unit">kg</span>
            </div>
            <div className="stat-sub text-muted">
              + {(lastWeight - START_KG).toFixed(1)} kg depuis le début
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div className="stat-label">Objectif</div>
            <div className="stat-value" style={{ fontSize:"1.5rem" }}>
              {TARGET_KG}
              <span className="stat-unit">kg</span>
            </div>
            <div className="stat-sub text-muted">dans 12 mois</div>
          </div>
        </div>
        <div className="progress-track" style={{ marginTop: 14 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-sm">
          <span className="text-mono text-muted" style={{ fontSize:"0.65rem" }}>54 kg</span>
          <span className="text-mono text-accent" style={{ fontSize:"0.65rem" }}>{pct}% atteint</span>
          <span className="text-mono text-muted" style={{ fontSize:"0.65rem" }}>60 kg</span>
        </div>

        {/* Mini sparkline */}
        {weightData.length >= 2 && (
          <div style={{ marginTop: 16 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Courbe réelle</div>
            <Sparkline data={weightData} target={TARGET_KG} />
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ marginTop: 14 }}
          onClick={() => onNavigate("journal")}
        >
          + Saisir le poids du jour
        </button>
      </div>

      {/* Fenêtre IF */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-label">Jeûne intermittent</div>
        <div className="if-block">
          <div className="if-clock">
            {ifStatus.inWindow ? "▶" : "◷"}
          </div>
          <div className="if-info">
            <div className="if-status">
              {ifStatus.inWindow ? "Fenêtre alimentaire ouverte" : "Phase de jeûne"}
            </div>
            <div className="if-window">
              {ifStatus.inWindow
                ? `Ferme dans ${ifStatus.remH}h${ifStatus.remM.toString().padStart(2,"0")}`
                : `Ouvre dans ${ifStatus.remH}h${ifStatus.remM.toString().padStart(2,"0")}`
              }
            </div>
            <div className="stat-sub text-muted" style={{ marginTop: 2 }}>
              Fenêtre : 12h00 – 18h00 · 2 350 kcal
            </div>
          </div>
        </div>
        <div className="progress-track" style={{ marginTop: 12 }}>
          <div
            className="progress-fill amber"
            style={{
              width: `${Math.min(100, ((ifStatus.h - IF_START) / (IF_END - IF_START)) * 100)}%`,
              opacity: ifStatus.inWindow ? 1 : 0.3,
            }}
          />
        </div>
      </div>

      {/* Hydratation */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="flex items-center justify-between">
          <div className="section-label" style={{ marginBottom: 0 }}>Hydratation</div>
          <span className="stat-value cyan" style={{ fontSize:"1.4rem" }}>
            {hydro.count}
            <span className="stat-unit">/ {HYDRO_GOAL}</span>
          </span>
        </div>
        <div className="hydro-dots">
          {Array.from({ length: HYDRO_GOAL }).map((_, i) => (
            <button
              key={i}
              className={`hydro-dot ${i < hydro.count ? "filled" : ""}`}
              onClick={() => toggleHydro(i)}
              aria-label={`Verre ${i + 1}`}
            />
          ))}
        </div>
        <div className="progress-track" style={{ marginTop: 10 }}>
          <div className="progress-fill cyan" style={{ width: `${(hydro.count / HYDRO_GOAL) * 100}%` }} />
        </div>
        <div className="text-muted" style={{ marginTop: 6, fontSize:"0.75rem" }}>
          {hydro.count * 250} ml · objectif 2 000 ml
        </div>
      </div>

      {/* Semaine d'entraînement */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Semaine d'entraînement</div>
          <span
            style={{
              background: isTrainingDay ? "var(--accent-muted)" : "var(--surface-2)",
              color: isTrainingDay ? "var(--accent)" : "var(--text-3)",
              border: `1px solid ${isTrainingDay ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 6,
              padding: "2px 8px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.06em",
            }}
          >
            {isTrainingDay ? `▶ ${todayLabel(todayIdx)}` : "REPOS"}
          </span>
        </div>
        <div className="week-grid">
          {WEEK_DAYS.map((day, i) => {
            const isTrain = TRAINING_DAYS.includes(i);
            const isToday = i === todayIdx;
            return (
              <div key={i} className="week-day">
                <span className="week-day-label">{day}</span>
                <div
                  className={`week-day-dot ${isTrain ? "training" : "rest"} ${isToday ? "today" : ""}`}
                >
                  {isTrain
                    ? ["P", "T", "—", "L", "F", "—", "—"][i]
                    : "·"
                  }
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-sm" style={{ marginTop: 10 }}>
          <span className="text-muted text-mono" style={{ fontSize:"0.65rem" }}>P=Push T=Pull L=Legs F=Full Body</span>
        </div>
        <button
          className="btn"
          style={{
            marginTop: 12,
            background: "var(--surface-2)",
            color: "var(--text)",
            border: "1px solid var(--border-2)",
          }}
          onClick={() => onNavigate("training")}
        >
          Voir le protocole complet →
        </button>
      </div>

      {/* Calories macro rapide */}
      <div className="card-row" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="stat-label">Calories</div>
          <div className="stat-value amber" style={{ fontSize:"1.5rem" }}>2 350</div>
          <div className="stat-sub text-muted">kcal / jour</div>
        </div>
        <div className="card">
          <div className="stat-label">Protéines</div>
          <div className="stat-value" style={{ fontSize:"1.5rem", color:"var(--accent-2)" }}>160</div>
          <div className="stat-sub text-muted">g / jour · 3g/kg</div>
        </div>
      </div>

      <div style={{ marginTop: 12, marginBottom: 24, display:"flex", flexDirection:"column", gap: 8 }}>
        <button
          className="btn btn-primary"
          onClick={() => onNavigate("macros")}
        >
          ◈ Macros du jour — cocher mes repas
        </button>
        <button
          className="btn"
          style={{ background: "var(--surface)", border: "1px solid var(--border-2)", color: "var(--text)" }}
          onClick={() => onNavigate("food")}
        >
          Voir le plan alimentaire →
        </button>
      </div>
    </div>
  );
}
