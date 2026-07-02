import { useState, useMemo } from "react";
import { useStorage } from "../hooks/useStorage";
import {
  ALIMENTS_DB, CATEGORIES, OBJECTIFS, calculMacros, sommeMacros,
} from "../data/aliments";

/* ─── HELPERS ────────────────────────────────────────────────── */
function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function pct(val, max) {
  return Math.min(100, Math.round((val / max) * 100));
}

const MACRO_CONFIG = [
  { key: "kcal", label: "Calories",  unit: "kcal", objectif: OBJECTIFS.kcal, color: "var(--color-warning)" },
  { key: "p",    label: "Protéines", unit: "g",    objectif: OBJECTIFS.p,    color: "var(--color-info-500)" },
  { key: "g",    label: "Glucides",  unit: "g",    objectif: OBJECTIFS.g,    color: "var(--color-green-500)" },
  { key: "l",    label: "Lipides",   unit: "g",    objectif: OBJECTIFS.l,    color: "var(--color-earth-500)" },
  { key: "f",    label: "Fibres",    unit: "g",    objectif: OBJECTIFS.f,    color: "#a78bfa" },
];

const UNITE_LABELS = { g: "g", ml: "ml", u: "×", cs: "cs", cc: "cc" };

/* ─── SOUS-COMPOSANTS ────────────────────────────────────────── */

function MacroBar({ label, val, objectif, unit, color }) {
  const p = pct(val, objectif);
  const over = val > objectif;
  const barColor = over ? "#f87171" : color;
  return (
    <div className="mb-3.5">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="font-mono text-xs text-neutral-500 tracking-wide uppercase">{label}</span>
        <span className="font-mono text-sm" style={{ color: barColor }}>
          <strong className="text-base">{val}</strong>
          <span className="text-neutral-500"> / {objectif} {unit}</span>
        </span>
      </div>
      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${p}%`, background: barColor }}
        />
      </div>
      <div className="text-right font-mono text-[0.6rem] mt-0.5" style={{ color: over ? "#f87171" : "var(--color-neutral-500)" }}>
        {over ? `+${val - objectif} ${unit} dépassé` : `${objectif - val} ${unit} restants`}
      </div>
    </div>
  );
}

function QuantiteInput({ aliment, quantite, onChange }) {
  const u = UNITE_LABELS[aliment.unite] || aliment.unite;
  const max  = aliment.unite === "u"  ? 10
             : aliment.unite === "cs" ? 10
             : aliment.unite === "cc" ? 10
             : aliment.unite === "ml" ? 500
             : 400;
  const step = aliment.unite === "u" || aliment.unite === "cs" || aliment.unite === "cc" ? 0.5 : 10;

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="range"
        min={step}
        max={max}
        step={step}
        value={quantite}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="flex-1 cursor-pointer accent-green-500"
      />
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={step}
          max={max}
          step={step}
          value={quantite}
          onChange={e => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v > 0) onChange(v);
          }}
          className="w-13 bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-900 font-mono text-sm px-1.5 py-1 text-center outline-none focus:border-green-500"
        />
        <span className="font-mono text-xs text-neutral-500 min-w-[22px]">{u}</span>
      </div>
    </div>
  );
}

function AlimentItem({ aliment, checked, quantite, onToggle, onQuantite }) {
  const macros = calculMacros(aliment, quantite);
  return (
    <div className={`rounded-xl px-3.5 py-3 mb-2 border transition-all ${
      checked ? "bg-green-50 border-green-300" : "bg-transparent border-neutral-200"
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          aria-label={checked ? "Décocher" : "Cocher"}
          className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all border-[1.5px] ${
            checked
              ? "bg-green-500 border-green-500 text-white"
              : "bg-neutral-100 border-neutral-200 text-transparent"
          }`}
        >
          {checked ? "✓" : ""}
        </button>

        <div className="flex-1">
          <div className={`text-sm font-medium ${checked ? "text-neutral-900" : "text-neutral-500"}`}>
            {aliment.nom}
          </div>
          <div className="font-mono text-[0.62rem] text-neutral-400 mt-0.5">
            {aliment.categorie}
          </div>
        </div>

        {checked ? (
          <div className="text-right font-mono text-xs text-neutral-500 leading-relaxed">
            <span style={{ color: "var(--color-warning)" }}>{macros.kcal}</span> kcal<br />
            <span style={{ color: "var(--color-info-500)" }}>{macros.p}g</span> prot
          </div>
        ) : (
          <div className="font-mono text-xs text-neutral-400 text-right">
            {aliment.kcal} kcal<br />/{aliment.ref}{UNITE_LABELS[aliment.unite]}
          </div>
        )}
      </div>

      {checked && (
        <QuantiteInput aliment={aliment} quantite={quantite} onChange={onQuantite} />
      )}
    </div>
  );
}

/* ─── MODAL AJOUT ALIMENT ────────────────────────────────────── */
function ModalAjout({ onSave, onClose }) {
  const [form, setForm] = useState({
    nom: "", categorie: "protéines", unite: "g",
    ref: 100, kcal: 0, p: 0, g: 0, l: 0, f: 0,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.nom.trim().length > 1 && form.kcal >= 0;

  const macroFields = [
    { k: "kcal", label: "kcal", color: "var(--color-warning)" },
    { k: "p",    label: "prot", color: "var(--color-info-500)" },
    { k: "g",    label: "gluc", color: "var(--color-green-500)" },
    { k: "l",    label: "lip",  color: "var(--color-earth-500)" },
    { k: "f",    label: "fib",  color: "#a78bfa" },
  ];

  return (
    <div
z-      className="fixed inset-0 bg-black/50 60 flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-neutral-0 rounded-t-2xl px-5 pt-6 pb-20 w-full max-w-[480px] mx-auto border-t border-neutral-200 animate-fade-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="font-serif text-xl mb-5">Ajouter un aliment</div>

        <div className="mb-4">
          <label className="block font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1.5">Nom</label>
          <input
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono text-base px-3.5 py-3 outline-none focus:border-green-500"
            placeholder="Ex : Edamame"
            value={form.nom}
            onChange={e => set("nom", e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1.5">Catégorie</label>
          <select
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono text-base px-3.5 py-3 outline-none focus:border-green-500"
            value={form.categorie}
            onChange={e => set("categorie", e.target.value)}
          >
            {[...CATEGORIES, "autre"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1.5">Unité</label>
            <select
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono text-base px-3.5 py-3 outline-none focus:border-green-500"
              value={form.unite}
              onChange={e => set("unite", e.target.value)}
            >
              {Object.entries(UNITE_LABELS).map(([k,v]) => <option key={k} value={k}>{v} ({k})</option>)}
            </select>
          </div>
          <div>
            <label className="block font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1.5">Portion réf.</label>
            <input
              type="number" min="1"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono text-base px-3.5 py-3 outline-none focus:border-green-500"
              value={form.ref}
              onChange={e => set("ref", parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="font-mono text-[0.62rem] text-neutral-400 mb-2 mt-4 tracking-wide">
          MACROS POUR {form.ref} {UNITE_LABELS[form.unite]}
        </div>
        <div className="grid grid-cols-5 gap-2 mb-5">
          {macroFields.map(({ k, label, color }) => (
            <div key={k}>
              <div className="font-mono text-[0.58rem] mb-1 text-center" style={{ color }}>{label}</div>
              <input
                type="number" min="0" step="0.1"
                value={form[k]}
                onChange={e => set(k, parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono text-sm px-1 py-2 text-center outline-none focus:border-green-500"
              />
            </div>
          ))}
        </div>

        <button
          disabled={!valid}
          onClick={() => valid && onSave(form)}
          className={`w-full flex items-center justify-center gap-2 min-h-touch px-6 rounded-lg font-serif text-sm tracking-wide bg-green-500 text-white transition-all ${
            valid ? "active:scale-[0.97] active:bg-green-700" : "opacity-40"
          }`}
        >
          Ajouter à ma base
        </button>
      </div>
    </div>
  );
}

/* ─── COMPOSANT PRINCIPAL ────────────────────────────────────── */
export default function Macros() {
  const today = todayKey();
  const [customAliments, setCustomAliments] = useStorage("hugo_custom_aliments", []);
  const [journal, setJournal] = useStorage(`hugo_macros_${today}`, { 0: {}, 1: {}, 2: {} });

  const [repasOuvert, setRepasOuvert] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter, setCatFilter] = useState("tout");
  const [showModal, setShowModal] = useState(false);

  const allAliments = useMemo(
    () => [...ALIMENTS_DB, ...customAliments.map(a => ({ ...a, id: `custom_${a.nom.toLowerCase().replace(/\s+/g,"_")}` }))],
    [customAliments]
  );

  const totalJour = useMemo(() => {
    const items = [];
    [0, 1, 2].forEach(ri => {
      Object.entries(journal[ri] || {}).forEach(([aid, { checked, quantite }]) => {
        if (!checked) return;
        const a = allAliments.find(x => x.id === aid);
        if (a) items.push({ aliment: a, quantite });
      });
    });
    return sommeMacros(items);
  }, [journal, allAliments]);

  const macrosRepas = useMemo(() => {
    const items = Object.entries(journal[repasOuvert] || {})
      .filter(([, v]) => v.checked)
      .map(([aid, { quantite }]) => {
        const a = allAliments.find(x => x.id === aid);
        return a ? { aliment: a, quantite } : null;
      })
      .filter(Boolean);
    return sommeMacros(items);
  }, [journal, repasOuvert, allAliments]);

  const alimentsFiltres = useMemo(() => {
    return allAliments.filter(a => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || a.nom.toLowerCase().includes(q) || a.categorie.includes(q);
      const matchCat = catFilter === "tout" || a.categorie === catFilter;
      return matchSearch && matchCat;
    });
  }, [allAliments, searchQuery, catFilter]);

  const setAliment = (repasIdx, alimentId, patch) => {
    setJournal(prev => {
      const repas = { ...(prev[repasIdx] || {}) };
      repas[alimentId] = { ...(repas[alimentId] || { checked: false, quantite: allAliments.find(a=>a.id===alimentId)?.ref || 100 }), ...patch };
      return { ...prev, [repasIdx]: repas };
    });
  };

  const handleToggle = (alimentId) => {
    const current = journal[repasOuvert]?.[alimentId];
    const aliment  = allAliments.find(a => a.id === alimentId);
    setAliment(repasOuvert, alimentId, {
      checked:  !(current?.checked),
      quantite: current?.quantite ?? aliment?.ref ?? 100,
    });
  };

  const handleQuantite = (alimentId, quantite) => {
    setAliment(repasOuvert, alimentId, { quantite });
  };

  const handleAddCustom = (form) => {
    setCustomAliments(prev => [...prev, { ...form, id: `custom_${Date.now()}`, nom: form.nom.trim() }]);
    setShowModal(false);
  };

  const checkedCount = Object.values(journal[repasOuvert] || {}).filter(v => v.checked).length;

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-6 pb-24 animate-fade-up">
      <p className="font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1">
        {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}
      </p>
      <h1 className="font-serif text-3xl leading-none tracking-tight mb-6">
        Macros<br /><span className="text-green-500">du jour</span>
      </h1>

      {/* Bilan journée */}
      <div className="bg-neutral-0 border-2 border-green-500 rounded-2xl p-4 mb-4">
        <div className="font-mono text-[0.62rem] text-neutral-400 tracking-wide uppercase mb-3.5">
          Bilan journée complète
        </div>
        {MACRO_CONFIG.map(mc => (
          <MacroBar key={mc.key} label={mc.label} val={totalJour[mc.key]} objectif={mc.objectif} unit={mc.unit} color={mc.color} />
        ))}
      </div>

      {/* Sélecteur repas */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[0,1,2].map(ri => {
          const nb = Object.values(journal[ri]||{}).filter(v=>v.checked).length;
          const active = repasOuvert === ri;
          return (
            <button
              key={ri}
              onClick={() => setRepasOuvert(ri)}
              className={`rounded-xl px-2 py-2.5 text-center border transition-all ${
                active ? "bg-green-50 border-green-500" : "bg-neutral-0 border-neutral-200"
              }`}
            >
              <div className={`font-serif text-sm ${active ? "text-green-500" : "text-neutral-500"}`}>
                Repas {ri+1}
              </div>
              <div className="font-mono text-[0.6rem] text-neutral-400 mt-0.5">
                {["12h00","15h00","18h00"][ri]}
              </div>
              {nb > 0 && (
                <div className={`mt-1.5 inline-block rounded-full font-mono text-[0.6rem] px-2 py-0.5 ${
                  active ? "bg-green-500 text-white" : "bg-neutral-100 text-neutral-500"
                }`}>
                  {nb} aliment{nb>1?"s":""}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Macros du repas sélectionné */}
      {checkedCount > 0 && (
        <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mb-3">
          <div className="font-mono text-[0.62rem] text-neutral-400 tracking-wide uppercase mb-2.5">
            Repas {repasOuvert+1} — {checkedCount} aliment{checkedCount>1?"s":""}
          </div>
          <div className="flex gap-2.5 flex-wrap">
            {MACRO_CONFIG.map(mc => (
              <div key={mc.key} className="flex-1 min-w-[60px] bg-neutral-100 rounded-lg px-2.5 py-2 text-center">
                <div className="font-mono text-[0.6rem] text-neutral-400 mb-0.5">{mc.label}</div>
                <div className="font-serif text-base" style={{ color: mc.color }}>{macrosRepas[mc.key]}</div>
                <div className="font-mono text-[0.58rem] text-neutral-400">{mc.unit}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recherche + filtre catégorie */}
      <div className="mb-2.5">
        <input
          type="search"
          placeholder="Rechercher un aliment..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono text-base px-3.5 py-3 outline-none focus:border-green-500 mb-2"
        />
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["tout", ...CATEGORIES].map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`flex-shrink-0 rounded-full font-mono text-xs px-3 py-1 whitespace-nowrap border transition-all ${
                catFilter===c ? "bg-green-500 text-white border-green-500" : "bg-neutral-100 text-neutral-500 border-neutral-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Liste aliments */}
      <div>
        {alimentsFiltres.map(a => {
          const state = journal[repasOuvert]?.[a.id];
          return (
            <AlimentItem
              key={a.id}
              aliment={a}
              checked={state?.checked || false}
              quantite={state?.quantite ?? a.ref}
              onToggle={() => handleToggle(a.id)}
              onQuantite={q => handleQuantite(a.id, q)}
            />
          );
        })}

        {alimentsFiltres.length === 0 && (
          <div className="text-center py-7 text-neutral-400 font-mono text-xs">
            Aucun aliment trouvé
          </div>
        )}
      </div>

      {/* Bouton ajout */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 min-h-touch px-6 rounded-lg font-serif text-sm tracking-wide bg-neutral-0 border border-neutral-200 text-neutral-900 active:scale-[0.97] transition-all mt-4 mb-2"
      >
        + Ajouter un aliment personnalisé
      </button>

      {customAliments.length > 0 && (
        <div className="text-center font-mono text-xs text-neutral-400 mb-5">
          {customAliments.length} aliment{customAliments.length>1?"s":""} personnalisé{customAliments.length>1?"s":""}
        </div>
      )}

      {showModal && (
        <ModalAjout onSave={handleAddCustom} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}