import { useState } from "react";

// ─── DATA (inchangée) ──────────────────────────────────────────────────────

const phases = [
  {
    id: 0,
    label: "PHASE 1",
    name: "Activation",
    months: "Mois 1–2",
    color: "#4a7c59",
    accent: "#3c6634",
    goal: "Réveiller le système neuromusculaire, construire les patterns de mouvement, corriger la posture (scoliose).",
    targetWeight: "55–56 kg",
    expectedGain: "+1 à +2 kg",
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
    color: "#a9835a",
    accent: "#7a5c3e",
    goal: "Augmenter le volume et la densité d'entraînement. Débuter les vraies tractions. Ancrer les habitudes.",
    targetWeight: "57–58 kg",
    expectedGain: "+1,5 à +2 kg",
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
    color: "#5a8f4d",
    accent: "#213a1c",
    goal: "Ancrer les gains, atteindre les 58–60 kg, maîtriser les tractions et envisager la salle si budget disponible.",
    targetWeight: "58–60 kg",
    expectedGain: "+1 à +2 kg",
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

// ─── COMPONENT ────────────────────────────────────────────────────────────

export default function TrainingPlan() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [activeTab, setActiveTab] = useState("training");

  const phase = phases[activePhase];
  const day = phase.days[Math.min(activeDay, phase.days.length - 1)];

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
    <div>
      {/* Main tabs */}
      <div className="flex bg-neutral-100 rounded-xl overflow-hidden mb-4">
        {[["training", "⚡ Entraînement"], ["progression", "📈 Progression"], ["rules", "📋 Règles"]].map(([k, l]) => {
          const active = activeTab === k;
          return (
            <button
              key={k}
              onClick={() => setActiveTab(k)}
              className={`flex-1 px-1.5 py-3 font-serif text-xs font-bold tracking-wide transition-all border-b-2 ${
                active ? "bg-neutral-0 text-earth-500 border-earth-500" : "text-neutral-500 border-transparent"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>

      {/* ── TAB: TRAINING ── */}
      {activeTab === "training" && (
        <div>
          {/* Phase selector */}
          <div className="flex flex-col gap-2 mb-3">
            {phases.map((p, i) => {
              const active = activePhase === i;
              return (
                <button
                  key={i}
                  onClick={() => { setActivePhase(i); setActiveDay(0); }}
                  className="rounded-lg px-3.5 py-2.5 flex justify-between items-center text-left transition-all border"
                  style={{
                    background: active ? `${p.color}18` : "var(--color-neutral-0)",
                    borderColor: active ? p.color : "var(--color-neutral-200)",
                    borderLeft: `4px solid ${active ? p.accent : "var(--color-neutral-200)"}`,
                  }}
                >
                  <div>
                    <div className="text-[0.58rem] tracking-widest uppercase mb-0.5" style={{ color: p.accent }}>
                      {p.label} · {p.months}
                    </div>
                    <div className="font-serif text-base font-bold text-neutral-900">{p.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: p.accent }}>{p.expectedGain}</div>
                    <div className="text-xs text-neutral-500">{p.targetWeight}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Phase goal */}
          <div className="rounded-xl px-3.5 py-2.5 text-sm text-neutral-700 leading-relaxed mb-3 border" style={{ background: `${phase.color}0d`, borderColor: `${phase.color}40` }}>
            <span className="font-bold" style={{ color: phase.accent }}>Objectif · </span>{phase.goal}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {phase.keyFocus.map((f, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-0.5 rounded-full border"
                  style={{ background: `${phase.color}22`, color: phase.accent, borderColor: `${phase.color}55` }}
                >
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>

          {/* Day tabs */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
            {phase.days.map((d, i) => {
              const active = activeDay === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className="flex-shrink-0 rounded-lg px-3 py-2 text-left border transition-all"
                  style={{
                    borderColor: active ? phase.accent : "var(--color-neutral-200)",
                    background: active ? `${phase.color}18` : "var(--color-neutral-0)",
                    color: active ? phase.accent : "var(--color-neutral-500)",
                  }}
                >
                  <div className="font-serif text-xs font-bold">{d.label}</div>
                  <div className="text-[0.6rem] opacity-70 mt-0.5">{d.name}</div>
                </button>
              );
            })}
          </div>

          {/* Exercises */}
          <div className="flex flex-col gap-2.5 pb-2">
            {day.exercises.map((ex, i) => (
              <div key={i} className="bg-neutral-0 border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-neutral-200 flex justify-between items-start">
                  <div>
                    <div className="text-[0.58rem] tracking-widest uppercase mb-0.5" style={{ color: phase.accent }}>Ex {i + 1}</div>
                    <div className="font-serif text-base font-bold text-neutral-900 leading-tight">{ex.name}</div>
                  </div>
                  {ex.sets !== "—" && (
                    <div className="flex gap-1.5 flex-shrink-0 ml-2.5">
                      <div className="text-center bg-neutral-100 rounded-md px-2 py-1">
                        <div className="text-sm font-black" style={{ color: phase.accent }}>{ex.sets}</div>
                        <div className="text-[0.55rem] text-neutral-500 tracking-wide">SÉRIES</div>
                      </div>
                      <div className="text-center bg-neutral-100 rounded-md px-2 py-1">
                        <div className="text-sm font-black text-neutral-900">{ex.reps}</div>
                        <div className="text-[0.55rem] text-neutral-500 tracking-wide">REPS</div>
                      </div>
                      {ex.rest !== "—" && (
                        <div className="text-center bg-neutral-100 rounded-md px-2 py-1">
                          <div className="text-sm font-black" style={{ color: "var(--color-info-500)" }}>{ex.rest}</div>
                          <div className="text-[0.55rem] text-neutral-500 tracking-wide">REPOS</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="px-3.5 py-2.5 flex flex-col gap-1">
                  <div className="text-xs text-neutral-500 leading-relaxed">📌 {ex.note}</div>
                  {ex.progression !== "—" && (
                    <div className="text-xs italic" style={{ color: "var(--color-green-500)" }}>↗ {ex.progression}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: PROGRESSION ── */}
      {activeTab === "progression" && (
        <div>
          <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mb-3.5">
            <div className="text-xs font-bold mb-3 tracking-wide" style={{ color: "var(--color-earth-500)" }}>
              COURBE DE PRISE DE MASSE — 12 MOIS
            </div>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} className="block">
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-earth-500)" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="var(--color-earth-500)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[54, 56, 58, 60].map(w => {
                const y = chartH - 20 - ((w - minW) / (maxW - minW)) * (chartH - 35);
                return (
                  <g key={w}>
                    <line x1="20" y1={y} x2={chartW - 10} y2={y} stroke="var(--color-neutral-200)" strokeWidth="1"/>
                    <text x="16" y={y + 4} fill="var(--color-neutral-500)" fontSize="8" textAnchor="end">{w}</text>
                  </g>
                );
              })}
              <path d={fill} fill="url(#wGrad)"/>
              <path d={path} fill="none" stroke="var(--color-earth-500)" strokeWidth="2.5" strokeLinejoin="round"/>
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill="var(--color-earth-500)" stroke="var(--color-neutral-0)" strokeWidth="2"/>
                  <text x={p.x} y={chartH - 4} fill="var(--color-neutral-500)" fontSize="7.5" textAnchor="middle">{p.month}</text>
                </g>
              ))}
            </svg>
          </div>

          {progressionData.map((d, i) => (
            <div key={i} className="bg-neutral-0 border border-neutral-200 rounded-xl px-3.5 py-2.5 mb-2 flex justify-between items-center">
              <div>
                <div className="text-xs font-black" style={{ color: "var(--color-earth-500)" }}>{d.month}</div>
                <div className="text-sm text-neutral-900 mt-0.5">{d.label}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-neutral-900">
                  {d.weight} <span className="text-xs text-neutral-500">kg</span>
                </div>
                <div className="text-xs" style={{ color: "var(--color-green-500)" }}>{d.kcal} kcal/j</div>
              </div>
            </div>
          ))}

          <div className="bg-green-50 border border-green-300 rounded-xl p-3.5 mt-1.5">
            <div className="text-xs font-bold mb-2" style={{ color: "var(--color-green-700)" }}>⚠️ Réalisme ectomorphe</div>
            <div className="text-xs text-neutral-700 leading-relaxed">
              En tant qu'ectomorphe naturel, viser +0,5 à +1 kg/mois est réaliste et sain. Dépasser ce rythme sur la durée crée surtout de la masse grasse. La patience est ta principale arme.
              <br/><br/>
              Si le poids stagne 3 semaines : ajouter +150–200 kcal/jour (flocons d'avoine, lait, huile). Si le poids monte trop vite : réduire légèrement les lipides.
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: RULES ── */}
      {activeTab === "rules" && (
        <div>
          {[
            { icon: "🔁", title: "Principe de surcharge progressive", color: "var(--color-earth-500)",
              body: "Chaque semaine, ajoute 1 répétition OU 1 kg OU 5 secondes de moins de repos. Si tu fais exactement la même chose qu'il y a 7 jours, tu ne progresses pas. Note tout dans un carnet." },
            { icon: "🚫", title: "Ne jamais aller à l'échec", color: "#b3432c",
              body: "Surtout en Phase 1. L'échec musculaire au poids de corps n'est pas un signal de progression — c'est un signal de blessure et de surmenage du SNC. Arrête-toi 2 reps avant l'échec." },
            { icon: "💤", title: "Le muscle se construit la nuit", color: "var(--color-info-500)",
              body: "Viser 7h30–8h de sommeil. Avec l'IF et un déficit de récupération, le cortisol monte et détruit du muscle. Le sommeil est ta première supplémentation." },
            { icon: "🦴", title: "Scoliose — mouvements à surveiller", color: "#7a5c8c",
              body: "Face pull et rétraction scapulaire (Jour B/D) sont OBLIGATOIRES chaque semaine — pas optionnels. Évite les mouvements asymétriques lourds. Pas de flexion lombaire chargée (Good morning, Jefferson curl) avant Phase 3." },
            { icon: "📅", title: "Planning hebdomadaire suggéré", color: "var(--color-green-500)",
              body: "Lundi : Jour A (Push) — Mardi : Repos — Mercredi : Jour B (Pull) — Jeudi : Jour C (Legs) — Vendredi : Repos — Samedi : Jour D (Full/Mobilité) — Dimanche : Repos total." },
            { icon: "📊", title: "Quand passer à la salle ?", color: "#3a6a7a",
              body: "Critères objectifs : tractions ×8 propres + pompes lestées ×15 + poids stabilisé à 58 kg. À ce stade, la salle te donnera 30–40% de gains en plus via la surcharge mécanique. Pas avant — les bases doivent être solides." },
          ].map((r, i) => (
            <div key={i} className="bg-neutral-0 border rounded-xl px-3.5 py-3.5 mb-2.5" style={{ borderColor: `${r.color}40`, borderLeftWidth: 4, borderLeftColor: r.color }}>
              <div className="text-sm font-bold text-neutral-900 mb-1.5">{r.icon} {r.title}</div>
              <div className="text-xs text-neutral-500 leading-relaxed">{r.body}</div>
            </div>
          ))}
          <div className="h-5" />
        </div>
      )}
    </div>
  );
}