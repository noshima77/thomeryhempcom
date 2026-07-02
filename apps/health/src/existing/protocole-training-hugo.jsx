import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const phases = [
  {
    id: 0,
    label: "PHASE 1",
    name: "Activation",
    months: "Mois 1–2",
    monthRange: [1, 2],
    color: "#4a7c59",
    accent: "#7ab893",
    goal: "Réveiller le système neuromusculaire, construire les patterns de mouvement, corriger la posture (scoliose).",
    targetWeight: "55–56 kg",
    expectedGain: "+1 à +2 kg",
    cals: "2 350 kcal",
    keyFocus: ["Technique avant tout", "Contrôle excentrique", "Jamais aller à l'échec"],
    days: [
      {
        label: "Jour A", name: "Push — Poussée",
        exercises: [
          { name: "Pompes standards", sets: "3", reps: "6–8", rest: "90s", note: "Mains à largeur d'épaules, gainage strict", progression: "Ajouter 1 rép/semaine" },
          { name: "Pompes inclinées (mains surélevées)", sets: "3", reps: "8–10", rest: "90s", note: "Sollicite la partie haute des pectoraux", progression: "Baisser l'appui progressivement" },
          { name: "Dips sur chaise", sets: "3", reps: "8–10", rest: "90s", note: "Dos proche de la chaise, descendre lentement", progression: "Descendre plus bas chaque semaine" },
          { name: "Pompes diamant (triceps)", sets: "2", reps: "6–8", rest: "90s", note: "Mains proches, coudes le long du corps", progression: "+1 rép/semaine" },
          { name: "Élastique — Presse épaules", sets: "3", reps: "10–12", rest: "60s", note: "Élastique sous les pieds, pousser vers le haut", progression: "Élastique plus résistant" },
        ]
      },
      {
        label: "Jour B", name: "Pull — Tirage",
        exercises: [
          { name: "Traction assistée élastique", sets: "4", reps: "4–6", rest: "2 min", note: "Élastique réduit le poids — focus sur la rétraction des omoplates", progression: "Élastique moins résistant chaque mois" },
          { name: "Australian pull-up (barre basse)", sets: "3", reps: "8–10", rest: "90s", note: "Corps incliné, tirer la poitrine vers la barre", progression: "Corps plus horizontal" },
          { name: "Curl biceps élastique", sets: "3", reps: "10–12", rest: "60s", note: "Élastique sous les pieds, coudes fixes", progression: "+résistance élastique" },
          { name: "Face pull élastique (posture)", sets: "3", reps: "15", rest: "60s", note: "PRIORITAIRE pour la scoliose — tirer vers le visage", progression: "Volume avant intensité" },
          { name: "Shrugs élastique (trapèzes)", sets: "3", reps: "12–15", rest: "60s", note: "Haussements d'épaules contrôlés", progression: "+résistance" },
        ]
      },
      {
        label: "Jour C", name: "Legs + Core",
        exercises: [
          { name: "Squat poids de corps", sets: "4", reps: "10–12", rest: "90s", note: "Descendre jusqu'à parallèle, genoux dans l'axe des pieds", progression: "Tempo 3-1-1 puis Bulgarian" },
          { name: "Fentes alternées", sets: "3", reps: "8/jambe", rest: "90s", note: "Genou arrière proche du sol", progression: "Fentes marchées" },
          { name: "Hip thrust (sol ou canapé)", sets: "3", reps: "12–15", rest: "90s", note: "Fessiers — squeeze en haut 2 secondes", progression: "Ajouter sac leste ou élastique" },
          { name: "Gainage planche", sets: "3", reps: "20–30s", rest: "60s", note: "Corps droit de la tête aux talons", progression: "+5s chaque semaine" },
          { name: "Crunch vélo (obliques)", sets: "3", reps: "12/côté", rest: "60s", note: "Lent et contrôlé — pas de coup de reins", progression: "+rép" },
        ]
      },
      {
        label: "Jour D", name: "Full Body léger + mobilité",
        exercises: [
          { name: "Pompes — variation libre", sets: "2", reps: "Max –2", rest: "2 min", note: "S'arrêter avant l'échec complet", progression: "— (jour de consolid.)" },
          { name: "Traction assistée", sets: "3", reps: "3–4", rest: "2 min", note: "Travail qualité uniquement", progression: "—" },
          { name: "Squat pause en bas (3s)", sets: "3", reps: "8", rest: "90s", note: "Mobilité de hanche et cheville", progression: "—" },
          { name: "Mobilité épaules (cercles, rotations)", sets: "—", reps: "3 min", rest: "—", note: "PRIORITAIRE scoliose — sans douleur", progression: "—" },
          { name: "Étirements dos / chaîne post.", sets: "—", reps: "5 min", rest: "—", note: "Cat-cow, child's pose, pigeon", progression: "—" },
        ]
      },
    ]
  },
  {
    id: 1,
    label: "PHASE 2",
    name: "Construction",
    months: "Mois 3–5",
    monthRange: [3, 5],
    color: "#7a5c2e",
    accent: "#c8933a",
    goal: "Augmenter le volume et la densité d'entraînement. Débuter les vraies tractions. Ancrer les habitudes.",
    targetWeight: "57–58 kg",
    expectedGain: "+1,5 à +2 kg",
    cals: "2 400–2 450 kcal",
    keyFocus: ["Surcharge progressive stricte", "Premières tractions propres", "+200 kcal/jour"],
    days: [
      {
        label: "Jour A", name: "Push — Volume",
        exercises: [
          { name: "Pompes lestées (sac à dos)", sets: "4", reps: "8–10", rest: "2 min", note: "Ajouter 2–5 kg progressivement", progression: "+1 kg chaque semaine si 10 reps propres" },
          { name: "Pompes déclinées (pieds surélevés)", sets: "3", reps: "8–10", rest: "90s", note: "Partie haute des pectoraux + deltoïdes antérieurs", progression: "Surélever davantage" },
          { name: "Dips lestés (sac à dos)", sets: "3", reps: "8–10", rest: "2 min", note: "Descendre jusqu'à 90° coude", progression: "+lest progressif" },
          { name: "Pike push-up (épaules)", sets: "3", reps: "8–10", rest: "90s", note: "Corps en V inversé, descendre la tête vers le sol", progression: "Vers handstand push-up mur" },
          { name: "Élastique — Latéral épaules", sets: "3", reps: "12", rest: "60s", note: "Bras tendus, monter jusqu'à épaule", progression: "+résistance" },
        ]
      },
      {
        label: "Jour B", name: "Pull — Force",
        exercises: [
          { name: "Tractions prise large (pronation)", sets: "4", reps: "3–5", rest: "3 min", note: "Mouvement complet — bras tendus en bas", progression: "Le mouvement clé de cette phase" },
          { name: "Tractions prise neutre ou supination", sets: "3", reps: "3–5", rest: "2 min", note: "Plus facile — alterner avec prise large", progression: "+1 rép/semaine" },
          { name: "Australian pull-up lestés", sets: "3", reps: "10–12", rest: "90s", note: "Sac à dos ou élastique de résistance", progression: "+lest" },
          { name: "Curl marteau élastique", sets: "3", reps: "10–12", rest: "60s", note: "Prise neutre, isole long biceps", progression: "+résistance" },
          { name: "Face pull + rétraction élastique", sets: "4", reps: "15", rest: "60s", note: "Double du volume Phase 1 — essentiel scoliose", progression: "Volume prioritaire" },
        ]
      },
      {
        label: "Jour C", name: "Legs — Force",
        exercises: [
          { name: "Bulgarian split squat", sets: "4", reps: "8/jambe", rest: "2 min", note: "Pied arrière sur chaise — travail unilatéral intense", progression: "Ajouter sac leste ou élastique" },
          { name: "Romanian deadlift (élastique)", sets: "4", reps: "10", rest: "90s", note: "Ischios-jambiers — dos droit, descendre lentement", progression: "+résistance élastique" },
          { name: "Step-up sur chaise", sets: "3", reps: "10/jambe", rest: "90s", note: "Monter en poussant sur le talon", progression: "+lest" },
          { name: "Mollets debout (marche)", sets: "4", reps: "15–20", rest: "60s", note: "Montée sur pointe de pied, lent", progression: "+volume" },
          { name: "Dragon flag négatif (abdos)", sets: "3", reps: "4–5", rest: "2 min", note: "Descendre lentement depuis horizontal — très avancé", progression: "Genoux fléchis d'abord" },
        ]
      },
      {
        label: "Jour D", name: "Full Body — Densité",
        exercises: [
          { name: "Circuit : Pompes + Tractions + Squat", sets: "4 tours", reps: "6 / 3 / 10", rest: "2 min", note: "Enchaîner sans pause entre les exercices", progression: "+1 rép/tour chaque semaine" },
          { name: "Gainage dynamique (planche latérale)", sets: "3", reps: "20–30s/côté", rest: "60s", note: "Pieds empilés, corps aligné", progression: "+5s" },
          { name: "Mobilité thoracique (foam roller ou sol)", sets: "—", reps: "5 min", rest: "—", note: "Zone clé pour la scoliose — thoracique souvent bloqué", progression: "—" },
        ]
      },
    ]
  },
  {
    id: 2,
    label: "PHASE 3",
    name: "Consolidation",
    months: "Mois 6+",
    monthRange: [6, 12],
    color: "#3a4a7a",
    accent: "#6a8acf",
    goal: "Ancrer les gains, atteindre les 58–60 kg, maîtriser les tractions et envisager la salle si budget disponible.",
    targetWeight: "58–60 kg",
    expectedGain: "+1 à +2 kg",
    cals: "2 450–2 500 kcal",
    keyFocus: ["Tractions ×8+ propres", "Pompes ×20+ lestées", "Évaluer passage salle"],
    days: [
      {
        label: "Objectifs M6", name: "Milestones à atteindre",
        exercises: [
          { name: "Tractions strictes", sets: "—", reps: "5–8 consécutives", rest: "—", note: "Prise large, mouvement complet, sans balancement", progression: "Objectif M6" },
          { name: "Pompes lestées", sets: "—", reps: "15 avec 5–10 kg", rest: "—", note: "Technique impeccable", progression: "Objectif M6" },
          { name: "Bulgarian split squat", sets: "—", reps: "12/jambe avec lest", rest: "—", note: "Contrôle total, pas de compensation lombaire", progression: "Objectif M6" },
          { name: "Poids de corps", sets: "—", reps: "58 kg stabilisés", rest: "—", note: "3 semaines consécutives", progression: "Objectif M6" },
          { name: "Hydratation & peau", sets: "—", reps: "Hyperkératose réduite", rest: "—", note: "Résultat visible de l'alimentation ciblée", progression: "Objectif M6" },
        ]
      },
    ]
  }
];

const progressionData = [
  { month: "M0", weight: 54, kcal: 2350, label: "Départ" },
  { month: "M1", weight: 54.8, kcal: 2350, label: "Adaptation" },
  { month: "M2", weight: 55.5, kcal: 2350, label: "Phase 1" },
  { month: "M3", weight: 56.2, kcal: 2400, label: "Construction" },
  { month: "M4", weight: 57.0, kcal: 2420, label: "Momentum" },
  { month: "M5", weight: 57.8, kcal: 2450, label: "Phase 2" },
  { month: "M6", weight: 58.5, kcal: 2450, label: "Bilan 6 mois" },
  { month: "M9", weight: 59.5, kcal: 2480, label: "Consolidation" },
  { month: "M12", weight: 60.5, kcal: 2500, label: "Objectif 1 an" },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function TrainingPlan() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [activeTab, setActiveTab] = useState("training"); // training | progression | rules

  const phase = phases[activePhase];
  const day = phase.days[Math.min(activeDay, phase.days.length - 1)];

  // simple SVG line chart
  const chartW = 320, chartH = 110;
  const minW = 53.5, maxW = 61.5;
  const pts = progressionData.map((d, i) => {
    const x = 20 + (i / (progressionData.length - 1)) * (chartW - 40);
    const y = chartH - 20 - ((d.weight - minW) / (maxW - minW)) * (chartH - 35);
    return { x, y, ...d };
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const fill = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") +
    ` L${pts[pts.length-1].x},${chartH} L${pts[0].x},${chartH} Z`;

  return (
    <div style={{ fontFamily: "'Trebuchet MS', sans-serif", background: "#0d0f14", minHeight: "100vh", color: "#e8e2d6" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1a1f2e 0%, #0d1520 100%)", padding: "22px 16px 16px", borderBottom: "1px solid #2a3040" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: "#6a8acf", marginBottom: 6, textTransform: "uppercase" }}>Hugo · Débutant · Barre + Élastiques · 4j/sem</div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: -0.5, color: "#e8e2d6" }}>
          PROTOCOLE MASSE<span style={{ color: "#c8933a" }}> LEAN</span>
        </h1>
        <div style={{ fontSize: 11, color: "#8a9ab0", marginTop: 6 }}>54 kg → 60 kg · Horizon 12 mois · Sans salle</div>
      </div>

      {/* Main tabs */}
      <div style={{ display: "flex", background: "#111318", borderBottom: "1px solid #2a3040" }}>
        {[["training", "⚡ Entraînement"], ["progression", "📈 Progression"], ["rules", "📋 Règles"]].map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)} style={{
            flex: 1, padding: "12px 6px", border: "none",
            background: activeTab === k ? "#1a1f2e" : "transparent",
            color: activeTab === k ? "#c8933a" : "#6a7a90",
            fontFamily: "'Trebuchet MS', sans-serif", fontSize: 12, fontWeight: 700,
            cursor: "pointer", borderBottom: activeTab === k ? "2px solid #c8933a" : "2px solid transparent",
            letterSpacing: 0.3
          }}>{l}</button>
        ))}
      </div>

      {/* ── TAB: TRAINING ── */}
      {activeTab === "training" && (
        <div>
          {/* Phase selector */}
          <div style={{ padding: "14px 16px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
            {phases.map((p, i) => (
              <button key={i} onClick={() => { setActivePhase(i); setActiveDay(0); }} style={{
                background: activePhase === i ? p.color + "33" : "#1a1f2e",
                border: `1px solid ${activePhase === i ? p.color : "#2a3040"}`,
                borderLeft: `4px solid ${activePhase === i ? p.accent : "#2a3040"}`,
                borderRadius: 8, padding: "10px 14px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left"
              }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: p.accent, textTransform: "uppercase", marginBottom: 2 }}>{p.label} · {p.months}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#e8e2d6" }}>{p.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: p.accent, fontWeight: 700 }}>{p.expectedGain}</div>
                  <div style={{ fontSize: 10, color: "#6a7a90" }}>{p.targetWeight}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Phase goal */}
          <div style={{ margin: "0 16px 12px", background: "#1a1f2e", border: `1px solid ${phase.color}40`, borderRadius: 9, padding: "11px 14px", fontSize: 12, color: "#a0afc0", lineHeight: 1.6 }}>
            <span style={{ color: phase.accent, fontWeight: 700 }}>Objectif · </span>{phase.goal}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 9 }}>
              {phase.keyFocus.map((f, i) => (
                <span key={i} style={{ background: phase.color + "33", color: phase.accent, fontSize: 10, padding: "3px 9px", borderRadius: 20, border: `1px solid ${phase.color}60` }}>✓ {f}</span>
              ))}
            </div>
          </div>

          {/* Day tabs */}
          <div style={{ display: "flex", gap: 6, padding: "0 16px 12px", overflowX: "auto" }}>
            {phase.days.map((d, i) => (
              <button key={i} onClick={() => setActiveDay(i)} style={{
                flexShrink: 0, padding: "8px 12px", borderRadius: 8,
                border: `1px solid ${activeDay === i ? phase.accent : "#2a3040"}`,
                background: activeDay === i ? phase.accent + "22" : "#1a1f2e",
                color: activeDay === i ? phase.accent : "#6a7a90",
                fontFamily: "'Trebuchet MS', sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer"
              }}>
                <div>{d.label}</div>
                <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2, fontWeight: 400 }}>{d.name}</div>
              </button>
            ))}
          </div>

          {/* Exercises */}
          <div style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {day.exercises.map((ex, i) => (
              <div key={i} style={{ background: "#1a1f2e", border: "1px solid #2a3040", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid #2a3040", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 9, color: phase.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>Ex {i + 1}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#e8e2d6", lineHeight: 1.3 }}>{ex.name}</div>
                  </div>
                  {ex.sets !== "—" && (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 10 }}>
                      <div style={{ textAlign: "center", background: "#0d0f14", borderRadius: 6, padding: "4px 8px" }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: phase.accent }}>{ex.sets}</div>
                        <div style={{ fontSize: 8, color: "#6a7a90", letterSpacing: 0.8 }}>SÉRIES</div>
                      </div>
                      <div style={{ textAlign: "center", background: "#0d0f14", borderRadius: 6, padding: "4px 8px" }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: "#e8e2d6" }}>{ex.reps}</div>
                        <div style={{ fontSize: 8, color: "#6a7a90", letterSpacing: 0.8 }}>REPS</div>
                      </div>
                      {ex.rest !== "—" && (
                        <div style={{ textAlign: "center", background: "#0d0f14", borderRadius: 6, padding: "4px 8px" }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: "#6a8acf" }}>{ex.rest}</div>
                          <div style={{ fontSize: 8, color: "#6a7a90", letterSpacing: 0.8 }}>REPOS</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ padding: "9px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ fontSize: 12, color: "#8a9ab0", lineHeight: 1.5 }}>📌 {ex.note}</div>
                  {ex.progression !== "—" && (
                    <div style={{ fontSize: 11, color: "#4a7c59", fontStyle: "italic" }}>↗ {ex.progression}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: PROGRESSION ── */}
      {activeTab === "progression" && (
        <div style={{ padding: "16px" }}>
          <div style={{ background: "#1a1f2e", borderRadius: 12, padding: "16px", marginBottom: 14, border: "1px solid #2a3040" }}>
            <div style={{ fontSize: 11, color: "#c8933a", fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>COURBE DE PRISE DE MASSE — 12 MOIS</div>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} style={{ display: "block" }}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8933a" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#c8933a" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Grid */}
              {[54, 56, 58, 60].map(w => {
                const y = chartH - 20 - ((w - minW) / (maxW - minW)) * (chartH - 35);
                return <g key={w}>
                  <line x1="20" y1={y} x2={chartW - 10} y2={y} stroke="#2a3040" strokeWidth="1"/>
                  <text x="16" y={y + 4} fill="#4a5a6a" fontSize="8" textAnchor="end">{w}</text>
                </g>;
              })}
              {/* Fill */}
              <path d={fill} fill="url(#wGrad)"/>
              {/* Line */}
              <path d={path} fill="none" stroke="#c8933a" strokeWidth="2.5" strokeLinejoin="round"/>
              {/* Points */}
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#c8933a" stroke="#0d0f14" strokeWidth="2"/>
                  <text x={p.x} y={chartH - 4} fill="#6a7a90" fontSize="7.5" textAnchor="middle">{p.month}</text>
                </g>
              ))}
            </svg>
          </div>

          {/* Monthly breakdown */}
          {progressionData.map((d, i) => (
            <div key={i} style={{ background: "#1a1f2e", border: "1px solid #2a3040", borderRadius: 9, padding: "11px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#c8933a" }}>{d.month}</div>
                <div style={{ fontSize: 13, color: "#e8e2d6", marginTop: 2 }}>{d.label}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#e8e2d6" }}>{d.weight} <span style={{ fontSize: 11, color: "#6a7a90" }}>kg</span></div>
                <div style={{ fontSize: 10, color: "#4a7c59" }}>{d.kcal} kcal/j</div>
              </div>
            </div>
          ))}

          <div style={{ background: "#1a2a1a", border: "1px solid #4a7c59", borderRadius: 10, padding: "14px", marginTop: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#7ab893", marginBottom: 8 }}>⚠️ Réalisme ectomorphe</div>
            <div style={{ fontSize: 12, color: "#8a9ab0", lineHeight: 1.65 }}>
              En tant qu'ectomorphe naturel, viser +0,5 à +1 kg/mois est réaliste et sain. Dépasser ce rythme sur la durée crée surtout de la masse grasse. La patience est ta principale arme.
              <br/><br/>
              Si le poids stagne 3 semaines : ajouter +150–200 kcal/jour (flocons d'avoine, lait, huile). Si le poids monte trop vite : réduire légèrement les lipides.
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: RULES ── */}
      {activeTab === "rules" && (
        <div style={{ padding: "16px" }}>
          {[
            {
              icon: "🔁", title: "Principe de surcharge progressive",
              color: "#c8933a",
              body: "Chaque semaine, ajoute 1 répétition OU 1 kg OU 5 secondes de moins de repos. Si tu fais exactement la même chose qu'il y a 7 jours, tu ne progresses pas. Note tout dans un carnet.",
            },
            {
              icon: "🚫", title: "Ne jamais aller à l'échec",
              color: "#7a3a3a",
              body: "Surtout en Phase 1. L'échec musculaire au poids de corps n'est pas un signal de progression — c'est un signal de blessure et de surmenage du SNC. Arrête-toi 2 reps avant l'échec.",
            },
            {
              icon: "💤", title: "Le muscle se construit la nuit",
              color: "#3a4a7a",
              body: "Viser 7h30–8h de sommeil. Avec l'IF et un déficit de récupération, le cortisol monte et détruit du muscle. Le sommeil est ta première supplémentation.",
            },
            {
              icon: "🦴", title: "Scoliose — mouvements à surveiller",
              color: "#5a4a7a",
              body: "Face pull et rétraction scapulaire (Jour B/D) sont OBLIGATOIRES chaque semaine — pas optionnels. Évite les mouvements asymétriques lourds. Pas de flexion lombaire chargée (Good morning, Jefferson curl) avant Phase 3.",
            },
            {
              icon: "📅", title: "Planning hebdomadaire suggéré",
              color: "#4a7c59",
              body: "Lundi : Jour A (Push) — Mardi : Repos — Mercredi : Jour B (Pull) — Jeudi : Jour C (Legs) — Vendredi : Repos — Samedi : Jour D (Full/Mobilité) — Dimanche : Repos total.",
            },
            {
              icon: "📊", title: "Quand passer à la salle ?",
              color: "#3a6a7a",
              body: "Critères objectifs : tractions ×8 propres + pompes lestées ×15 + poids stabilisé à 58 kg. À ce stade, la salle te donnera 30–40% de gains en plus via la surcharge mécanique. Pas avant — les bases doivent être solides.",
            },
          ].map((r, i) => (
            <div key={i} style={{ background: "#1a1f2e", border: `1px solid ${r.color}40`, borderLeft: `4px solid ${r.color}`, borderRadius: 9, padding: "13px 14px", marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#e8e2d6", marginBottom: 7 }}>{r.icon} {r.title}</div>
              <div style={{ fontSize: 12, color: "#8a9ab0", lineHeight: 1.65 }}>{r.body}</div>
            </div>
          ))}
          <div style={{ height: 20 }} />
        </div>
      )}
    </div>
  );
}
