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

export default function MealPlan() {
  const [activeDay, setActiveDay] = useState(0);
  const [showBudget, setShowBudget] = useState(false);
  const day = days[activeDay];
  const total = budgetItems.reduce((s, i) => s + i.price, 0);

  return (
    <div>
      {/* Header info rapide */}
      <div className="bg-green-500 rounded-2xl px-4 py-4 text-white mb-4">
        <div className="font-mono text-[0.6rem] tracking-widest opacity-70 uppercase mb-1">
          Hugo · 32 ans · 54 kg · IF 18:6
        </div>
        <div className="flex gap-3.5 text-sm opacity-90 flex-wrap">
          <span>🎯 ~2 350 kcal / jour</span>
          <span>💪 ~110 g protéines</span>
          <span>🕑 Fenêtre 12h – 18h</span>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex bg-neutral-900 rounded-xl overflow-x-auto mb-4">
        {days.map((d, i) => {
          const active = activeDay === i;
          return (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`flex-shrink-0 px-3.5 py-2.5 font-serif text-sm transition-all border-b-[3px] ${
                active
                  ? "bg-earth-500 text-white font-semibold border-earth-300"
                  : "text-neutral-500 border-transparent"
              }`}
            >
              {d.short}
            </button>
          );
        })}
      </div>

      {/* Day header + macros */}
      <div className="mb-5">
        <h2 className="font-serif text-xl text-green-700 font-semibold">{day.name}</h2>
        <div className="text-sm text-earth-500 mt-0.5 italic">{day.theme}</div>
        <div className="flex gap-2.5 mt-3.5 flex-wrap">
          {[
            { label: "kcal", value: day.dailyKcal, cls: "border-t-earth-500 text-earth-500" },
            { label: "Protéines", value: day.dailyP + "g", cls: "border-t-green-700 text-green-700" },
            { label: "Glucides", value: day.dailyC + "g", cls: "border-t-earth-700 text-earth-700" },
            { label: "Lipides", value: day.dailyL + "g", cls: "border-t-[var(--color-info-500)] text-[var(--color-info-500)]" },
          ].map(m => (
            <div key={m.label} className={`bg-neutral-0 border border-neutral-200 border-t-[3px] rounded-lg px-3 py-1.5 text-center min-w-[58px] ${m.cls}`}>
              <div className="text-base font-bold">{m.value}</div>
              <div className="text-[0.56rem] text-earth-500 tracking-wide uppercase mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div className="flex flex-col gap-3">
        {day.meals.map((meal, i) => {
          const headerColors = ["bg-green-700", "bg-earth-700", "bg-neutral-800"];
          return (
            <div key={i} className="bg-neutral-0 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
              <div className={`${headerColors[i]} px-4 py-2.5 flex justify-between items-center`}>
                <div className="text-white">
                  <span className="text-[0.6rem] opacity-70 tracking-wide uppercase">{meal.label}</span>
                  <span className="ml-2.5 text-sm font-semibold">{meal.time}</span>
                </div>
                <div className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full">
                  ~{meal.kcal} kcal
                </div>
              </div>
              <div className="px-4 py-3.5">
                {meal.items.map((item, j) => (
                  <div key={j} className={`flex items-start gap-2 text-sm leading-relaxed ${j < meal.items.length - 1 ? "mb-1.5" : ""}`}>
                    <span className="text-earth-500 mt-0.5 flex-shrink-0">▸</span>
                    <span>{item}</span>
                  </div>
                ))}
                <div className="mt-2.5 flex gap-2 flex-wrap">
                  {[["P", meal.p + "g", "text-green-700 bg-green-50"], ["G", meal.c + "g", "text-earth-700 bg-earth-100"], ["L", meal.l + "g", "text-[var(--color-info-500)] bg-[var(--color-info-100)]"]].map(([l, v, cls]) => (
                    <span key={l} className={`text-xs font-bold px-2 py-0.5 rounded ${cls}`}>{l} {v}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip */}
      <div className="mt-3.5 bg-earth-50 border border-earth-300 border-l-4 border-l-earth-500 rounded-lg px-3.5 py-2.5 text-sm text-earth-700 leading-relaxed">
        💡 {day.tip}
      </div>

      {/* Hydration */}
      <div className="mt-3 bg-[var(--color-info-100)] border rounded-xl px-4 py-3.5 text-sm text-neutral-800" style={{ borderColor: "var(--color-info-500)" }}>
        <div className="font-bold mb-1.5">💧 Protocole hydratation (hors fenêtre)</div>
        <div className="leading-loose">
          <div>▸ <strong>Réveil :</strong> 500 ml eau + pincée sel + jus de citron</div>
          <div>▸ <strong>Matin (jeûne) :</strong> eau plate, thé ou café noir</div>
          <div>▸ <strong>Pendant la fenêtre :</strong> 1,5 L supplémentaire minimum</div>
          <div>▸ <strong>Soir :</strong> tisane ou eau si soif</div>
        </div>
      </div>

      {/* Budget toggle */}
      <button
        onClick={() => setShowBudget(!showBudget)}
        className={`mt-4.5 w-full min-h-touch px-4 rounded-lg font-serif text-sm font-bold border-2 border-neutral-900 transition-all ${
          showBudget ? "bg-neutral-900 text-white" : "bg-neutral-0 text-neutral-900"
        }`}
      >
        {showBudget ? "▲" : "▼"} Liste de courses semaine — ~{total.toFixed(2)} €
      </button>

      {showBudget && (
        <div className="bg-neutral-0 border border-neutral-200 rounded-xl p-4 mt-1.5 shadow-sm">
          <div className="text-xs text-earth-500 mb-2.5 italic">
            Prix estimés grandes surfaces — légumes du jardin non comptés
          </div>
          {budgetItems.map((item, i) => (
            <div key={i} className={`flex justify-between py-1.5 text-sm ${i < budgetItems.length - 1 ? "border-b border-neutral-100" : ""}`}>
              <span>{item.name}</span>
              <span className="text-earth-500 font-bold">{item.price.toFixed(2)} €</span>
            </div>
          ))}
          <div className="mt-3.5 px-3.5 py-2.5 bg-green-700 rounded-lg flex justify-between text-white">
            <span className="font-bold">TOTAL SEMAINE</span>
            <span className="font-bold text-lg">{total.toFixed(2)} €</span>
          </div>
          <div className="text-xs text-earth-500 mt-2 italic">
            * Épices et condiments basiques (sel, moutarde, etc.) considérés en stock
          </div>
        </div>
      )}

      <div className="h-7" />
    </div>
  );
}