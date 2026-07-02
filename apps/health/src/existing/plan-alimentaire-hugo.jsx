import { useState } from "react";

const days = [
  {
    id: 0, name: "Lundi", short: "Lun",
    theme: "Légumineuses & Œufs",
    meals: [
      {
        time: "12h00", label: "Repas 1",
        items: ["Porridge : flocons d'avoine 80g + lait entier 200ml","3 œufs brouillés à l'huile de colza","1 banane mûre","1 cs huile de colza en finition"],
        kcal: 920, p: 38, c: 105, l: 32
      },
      {
        time: "15h00", label: "Collation",
        items: ["2 tranches pain complet + 2 cs beurre de cacahuète","1 pomme","1 verre lait entier 200ml"],
        kcal: 580, p: 22, c: 70, l: 24
      },
      {
        time: "17h30", label: "Repas 2",
        items: ["Riz blanc 130g (sec) cuit","Lentilles vertes 100g (cuites)","1 œuf dur","Carottes râpées + vinaigrette huile colza"],
        kcal: 680, p: 30, c: 105, l: 14
      }
    ],
    tip: "Lentilles + riz = protéine complète sans viande. Combo idéal pour le budget et la prise de masse.",
    dailyKcal: 2180, dailyP: 90, dailyC: 280, dailyL: 70
  },
  {
    id: 1, name: "Mardi", short: "Mar",
    theme: "Sardines & Pommes de terre",
    meals: [
      {
        time: "12h00", label: "Repas 1",
        items: ["Pâtes complètes 150g (sec)","1 boîte sardines à la tomate","Tomates + oignons sautés à l'huile d'olive","1 cs huile d'olive en finition"],
        kcal: 880, p: 42, c: 110, l: 22
      },
      {
        time: "15h00", label: "Collation",
        items: ["2 yaourts entiers nature","Flocons d'avoine 40g","Raisins secs 30g + 1 cs miel"],
        kcal: 520, p: 18, c: 75, l: 14
      },
      {
        time: "17h30", label: "Repas 2",
        items: ["Pommes de terre 300g (vapeur ou four)","Omelette 3 œufs + oignons","30g fromage (gruyère) fondu","Salade verte + huile olive"],
        kcal: 780, p: 38, c: 80, l: 32
      }
    ],
    tip: "Les sardines = oméga-3 + vitamine D + protéines pour ~1€. Arme principale contre l'hyperkératose.",
    dailyKcal: 2180, dailyP: 98, dailyC: 265, dailyL: 68
  },
  {
    id: 2, name: "Mercredi", short: "Mer",
    theme: "Riz, haricots & chocolat noir",
    meals: [
      {
        time: "12h00", label: "Repas 1",
        items: ["Riz blanc 150g (sec)","Haricots rouges 150g (boîte ou secs trempés)","1 grande boîte thon en eau","Légumes sautés (courgette, oignon) + huile colza"],
        kcal: 920, p: 52, c: 120, l: 16
      },
      {
        time: "15h00", label: "Collation",
        items: ["2 tranches pain complet + beurre","30g chocolat noir 70%+","Noix 20g + raisins secs 20g"],
        kcal: 560, p: 10, c: 60, l: 28
      },
      {
        time: "17h30", label: "Repas 2",
        items: ["Soupe lentilles corail épaisse (100g sec)","2 tranches pain complet","30g comté ou gruyère","1 cs huile colza en finition"],
        kcal: 740, p: 34, c: 95, l: 22
      }
    ],
    tip: "Le chocolat noir 70%+ est riche en zinc et magnésium — minéraux clés pour l'énergie stable et la qualité de peau.",
    dailyKcal: 2220, dailyP: 96, dailyC: 275, dailyL: 66
  },
  {
    id: 3, name: "Jeudi", short: "Jeu",
    theme: "Foie de volaille — boost fer & vitamine A",
    meals: [
      {
        time: "12h00", label: "Repas 1",
        items: ["Foie de volaille 150g sauté (beurre + oignons)","Riz 130g (sec)","Carottes cuites 150g","1 cs huile colza"],
        kcal: 820, p: 45, c: 95, l: 24
      },
      {
        time: "15h00", label: "Collation",
        items: ["Flocons d'avoine 80g","Lait entier 300ml (tiède)","1 banane","1 cs huile colza (se fond dans le lait tiède)"],
        kcal: 680, p: 22, c: 95, l: 20
      },
      {
        time: "17h30", label: "Repas 2",
        items: ["3 œufs cocotte (four 180° ou poêle couverte)","Pommes de terre 200g","Légumes du jardin (selon saison)","Huile olive + herbes fraîches"],
        kcal: 680, p: 30, c: 65, l: 28
      }
    ],
    tip: "Le foie = aliment le + dense en nutriments pour le budget. Vitamine A (anti-hyperkératose), fer, B12. Max 2×/semaine.",
    dailyKcal: 2180, dailyP: 97, dailyC: 255, dailyL: 72
  },
  {
    id: 4, name: "Vendredi", short: "Ven",
    theme: "Pâtes & Pois chiches épicés",
    meals: [
      {
        time: "12h00", label: "Repas 1",
        items: ["Pâtes 150g (sec)","2 œufs entiers + 30g parmesan râpé","Légumes sautés (poivron, oignon)","1 cs huile d'olive"],
        kcal: 860, p: 38, c: 115, l: 24
      },
      {
        time: "15h00", label: "Collation",
        items: ["2 tranches pain complet + beurre","2 œufs durs","1 fruit de saison"],
        kcal: 520, p: 24, c: 50, l: 22
      },
      {
        time: "17h30", label: "Repas 2",
        items: ["Pois chiches 150g cuits","Riz 100g (sec)","Épices : cumin, paprika, curcuma, poivre","Salade verte + huile colza 1,5 cs"],
        kcal: 720, p: 28, c: 110, l: 14
      }
    ],
    tip: "Pois chiches + curcuma = combo anti-inflammatoire. Soutient la qualité de peau et la récupération musculaire.",
    dailyKcal: 2100, dailyP: 90, dailyC: 275, dailyL: 60
  },
  {
    id: 5, name: "Samedi", short: "Sam",
    theme: "Sardines & repas familial",
    meals: [
      {
        time: "12h00", label: "Repas 1",
        items: ["Riz 150g (sec)","2 boîtes sardines (sauce tomate ou huile)","Salade niçoise maison : tomates, oignons, olives","Vinaigrette huile d'olive + moutarde"],
        kcal: 880, p: 46, c: 100, l: 26
      },
      {
        time: "15h00", label: "Collation",
        items: ["2 yaourts entiers","Noix 25g + amandes 15g","1 cs miel + flocons d'avoine 30g"],
        kcal: 560, p: 18, c: 55, l: 26
      },
      {
        time: "17h30", label: "Repas 2 (familial)",
        items: ["Adapter le repas familial : prioriser protéines + féculents","Si repas léger : ajouter 2 œufs durs","Compléter avec pain + fromage si besoin","Viser 700–800 kcal total"],
        kcal: 750, p: 35, c: 80, l: 25
      }
    ],
    tip: "Samedi = repas en famille. Profite-en sans stress — l'équilibre se fait sur la semaine, pas sur le repas.",
    dailyKcal: 2190, dailyP: 99, dailyC: 235, dailyL: 77
  },
  {
    id: 6, name: "Dimanche", short: "Dim",
    theme: "Récupération & repas familial",
    meals: [
      {
        time: "12h00", label: "Repas 1 (familial)",
        items: ["Repas familial complet — sans contrainte","Prioriser viande ou poisson + féculents","Ajouter huile si plat léger en lipides","Viser 900–1000 kcal"],
        kcal: 950, p: 45, c: 110, l: 28
      },
      {
        time: "15h00", label: "Collation",
        items: ["Fruits frais de saison 200–300g","Fruits secs 30g (abricots, dattes)","Noix ou amandes 25g"],
        kcal: 480, p: 8, c: 70, l: 18
      },
      {
        time: "17h30", label: "Repas 2",
        items: ["Haricots blancs 150g (boîte)","Pomme de terre 200g cuite","Carottes cuites 100g","Huile colza 1,5 cs + herbes"],
        kcal: 680, p: 22, c: 105, l: 18
      }
    ],
    tip: "Dimanche = récupération maximale. Hydratation prioritaire + profiter du repas familial sans culpabilité.",
    dailyKcal: 2110, dailyP: 75, dailyC: 285, dailyL: 64
  }
];

const budgetItems = [
  { name: "Œufs ×18", price: 2.80 },
  { name: "Flocons d'avoine 1kg", price: 1.20 },
  { name: "Riz blanc 2kg", price: 2.40 },
  { name: "Pâtes complètes 2kg", price: 2.80 },
  { name: "Lentilles vertes 500g", price: 1.10 },
  { name: "Lentilles corail 500g", price: 1.20 },
  { name: "Haricots rouges boîte ×2", price: 1.60 },
  { name: "Pois chiches boîte ×2", price: 1.60 },
  { name: "Haricots blancs boîte ×1", price: 0.80 },
  { name: "Sardines en boîte ×5", price: 4.50 },
  { name: "Thon en boîte ×2", price: 3.20 },
  { name: "Foie de volaille 300g", price: 2.50 },
  { name: "Beurre de cacahuète 340g", price: 2.80 },
  { name: "Lait entier 3L", price: 3.00 },
  { name: "Yaourts entiers ×8", price: 2.40 },
  { name: "Fromage (gruyère) 200g", price: 2.20 },
  { name: "Pain complet ×2", price: 2.40 },
  { name: "Bananes ×6", price: 1.50 },
  { name: "Pommes ×6", price: 1.80 },
  { name: "Carottes 1kg", price: 1.00 },
  { name: "Pommes de terre 2kg", price: 1.80 },
  { name: "Tomates ×6", price: 2.20 },
  { name: "Huile de colza 1L", price: 2.50 },
  { name: "Huile d'olive 50cl", price: 2.80 },
  { name: "Noix / amandes 200g", price: 2.80 },
  { name: "Chocolat noir 70% 100g", price: 1.50 },
  { name: "Raisins secs 200g", price: 1.20 },
];

const mealColors = ["#3d5a3e", "#8c6a2e", "#5a4a3a"];

export default function MealPlan() {
  const [activeDay, setActiveDay] = useState(0);
  const [showBudget, setShowBudget] = useState(false);
  const day = days[activeDay];
  const total = budgetItems.reduce((s, i) => s + i.price, 0);

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f7f3ee", minHeight: "100vh", color: "#2c2416" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #3d5a3e 0%, #5c7a5d 100%)", padding: "22px 18px 18px", color: "white" }}>
        <div style={{ fontSize: 10, letterSpacing: 3, opacity: 0.65, marginBottom: 5, textTransform: "uppercase" }}>Hugo · 32 ans · 54 kg · IF 18:6</div>
        <h1 style={{ margin: 0, fontSize: 21, fontWeight: 700, letterSpacing: -0.3 }}>Plan Alimentaire Semaine</h1>
        <div style={{ marginTop: 10, display: "flex", gap: 14, fontSize: 12, opacity: 0.85, flexWrap: "wrap" }}>
          <span>🎯 ~2 350 kcal / jour</span>
          <span>💪 ~110 g protéines</span>
          <span>🕑 Fenêtre 12h – 18h</span>
        </div>
      </div>

      {/* Day tabs */}
      <div style={{ display: "flex", background: "#2c2416", overflowX: "auto" }}>
        {days.map((d, i) => (
          <button key={i} onClick={() => setActiveDay(i)} style={{
            flex: "0 0 auto", padding: "11px 13px", border: "none",
            background: activeDay === i ? "#c8733a" : "transparent",
            color: activeDay === i ? "white" : "#a89880",
            fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer",
            fontWeight: activeDay === i ? 700 : 400,
            borderBottom: activeDay === i ? "3px solid #e8935a" : "3px solid transparent",
            transition: "all 0.15s"
          }}>{d.short}</button>
        ))}
      </div>

      <div style={{ padding: "18px 15px" }}>

        {/* Day header + macros */}
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 19, color: "#3d5a3e", fontWeight: 700 }}>{day.name}</h2>
          <div style={{ fontSize: 12, color: "#8c7355", marginTop: 3, fontStyle: "italic" }}>{day.theme}</div>
          <div style={{ display: "flex", gap: 9, marginTop: 13, flexWrap: "wrap" }}>
            {[
              { label: "kcal", value: day.dailyKcal, color: "#c8733a" },
              { label: "Protéines", value: day.dailyP + "g", color: "#3d5a3e" },
              { label: "Glucides", value: day.dailyC + "g", color: "#8c6a2e" },
              { label: "Lipides", value: day.dailyL + "g", color: "#5a7a8c" },
            ].map(m => (
              <div key={m.label} style={{
                background: "white", border: `1px solid ${m.color}30`,
                borderTop: `3px solid ${m.color}`, borderRadius: 8,
                padding: "7px 12px", textAlign: "center", minWidth: 58
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 9, color: "#8c7355", letterSpacing: 0.8, textTransform: "uppercase", marginTop: 1 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Meals */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {day.meals.map((meal, i) => (
            <div key={i} style={{ background: "white", borderRadius: 11, overflow: "hidden", boxShadow: "0 2px 8px rgba(44,36,22,0.07)" }}>
              <div style={{
                background: mealColors[i], padding: "9px 15px",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ color: "white" }}>
                  <span style={{ fontSize: 10, opacity: 0.65, letterSpacing: 1.2, textTransform: "uppercase" }}>{meal.label}</span>
                  <span style={{ marginLeft: 10, fontSize: 14, fontWeight: 600 }}>{meal.time}</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.18)", color: "white", fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>
                  ~{meal.kcal} kcal
                </div>
              </div>
              <div style={{ padding: "13px 15px" }}>
                {meal.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: j < meal.items.length - 1 ? 7 : 0, fontSize: 14, lineHeight: 1.45 }}>
                    <span style={{ color: "#c8733a", marginTop: 2, flexShrink: 0 }}>▸</span>
                    <span>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: 11, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[["P", meal.p + "g", "#3d5a3e"], ["G", meal.c + "g", "#8c6a2e"], ["L", meal.l + "g", "#5a7a8c"]].map(([l, v, c]) => (
                    <span key={l} style={{ fontSize: 11, color: c, background: c + "18", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{l} {v}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div style={{ marginTop: 14, background: "#fffbf0", border: "1px solid #e8d5a0", borderLeft: "4px solid #c8733a", borderRadius: 8, padding: "11px 14px", fontSize: 13, color: "#5a4020", lineHeight: 1.55 }}>
          💡 {day.tip}
        </div>

        {/* Hydration */}
        <div style={{ marginTop: 12, background: "#eef4f8", border: "1px solid #b8d4e8", borderRadius: 10, padding: "13px 15px", fontSize: 13, color: "#2a4a5a" }}>
          <div style={{ fontWeight: 700, marginBottom: 7 }}>💧 Protocole hydratation (hors fenêtre)</div>
          <div style={{ lineHeight: 1.7 }}>
            <div>▸ <strong>Réveil :</strong> 500 ml eau + pincée sel + jus de citron</div>
            <div>▸ <strong>Matin (jeûne) :</strong> eau plate, thé ou café noir</div>
            <div>▸ <strong>Pendant la fenêtre :</strong> 1,5 L supplémentaire minimum</div>
            <div>▸ <strong>Soir :</strong> tisane ou eau si soif</div>
          </div>
        </div>

        {/* Budget toggle */}
        <button onClick={() => setShowBudget(!showBudget)} style={{
          marginTop: 18, width: "100%", padding: "13px",
          background: showBudget ? "#2c2416" : "white",
          color: showBudget ? "white" : "#2c2416",
          border: "2px solid #2c2416", borderRadius: 10,
          fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700,
          cursor: "pointer", transition: "all 0.2s"
        }}>
          {showBudget ? "▲" : "▼"} Liste de courses semaine — ~{total.toFixed(2)} €
        </button>

        {showBudget && (
          <div style={{ background: "white", borderRadius: 10, padding: 15, marginTop: 6, boxShadow: "0 2px 8px rgba(44,36,22,0.07)" }}>
            <div style={{ fontSize: 11, color: "#8c7355", marginBottom: 11, fontStyle: "italic" }}>Prix estimés grandes surfaces — légumes du jardin non comptés</div>
            {budgetItems.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < budgetItems.length - 1 ? "1px solid #f0e8dc" : "none", fontSize: 13 }}>
                <span>{item.name}</span>
                <span style={{ color: "#c8733a", fontWeight: 700 }}>{item.price.toFixed(2)} €</span>
              </div>
            ))}
            <div style={{ marginTop: 13, padding: "11px 14px", background: "#3d5a3e", borderRadius: 8, display: "flex", justifyContent: "space-between", color: "white" }}>
              <span style={{ fontWeight: 700 }}>TOTAL SEMAINE</span>
              <span style={{ fontWeight: 700, fontSize: 17 }}>{total.toFixed(2)} €</span>
            </div>
            <div style={{ fontSize: 11, color: "#8c7355", marginTop: 8, fontStyle: "italic" }}>
              * Épices et condiments basiques (sel, moutarde, etc.) considérés en stock
            </div>
          </div>
        )}

        <div style={{ height: 30 }} />
      </div>
    </div>
  );
}
