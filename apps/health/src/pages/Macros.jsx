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
  { key: "kcal", label: "Calories",   unit: "kcal", objectif: OBJECTIFS.kcal, color: "var(--accent-3)" },
  { key: "p",    label: "Protéines",  unit: "g",    objectif: OBJECTIFS.p,    color: "var(--accent-2)" },
  { key: "g",    label: "Glucides",   unit: "g",    objectif: OBJECTIFS.g,    color: "var(--accent)"   },
  { key: "l",    label: "Lipides",    unit: "g",    objectif: OBJECTIFS.l,    color: "#f56c42"          },
  { key: "f",    label: "Fibres",     unit: "g",    objectif: OBJECTIFS.f,    color: "#a78bfa"          },
];

const REPAS_LABELS = ["Repas 1 — 12h00", "Repas 2 — 15h00", "Repas 3 — 18h00"];

const UNITE_LABELS = { g: "g", ml: "ml", u: "×", cs: "cs", cc: "cc" };

/* ─── SOUS-COMPOSANTS ────────────────────────────────────────── */

function MacroBar({ label, val, objectif, unit, color }) {
  const p = pct(val, objectif);
  const over = val > objectif;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom: 5 }}>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"var(--text-2)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
          {label}
        </span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.8rem", color: over ? "#f87171" : color }}>
          <strong style={{ fontSize:"1rem" }}>{val}</strong>
          <span style={{ color:"var(--text-3)" }}> / {objectif} {unit}</span>
        </span>
      </div>
      <div style={{ height: 5, background:"var(--surface-2)", borderRadius: 99, overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${p}%`, background: over ? "#f87171" : color,
          borderRadius: 99, transition:"width 0.5s cubic-bezier(0.34,1.2,0.64,1)",
          boxShadow: `0 0 6px ${over ? "#f87171" : color}88`,
        }} />
      </div>
      <div style={{ textAlign:"right", fontFamily:"var(--font-mono)", fontSize:"0.6rem", color: over ? "#f87171" : "var(--text-3)", marginTop: 3 }}>
        {over ? `+${val - objectif} ${unit} dépassé` : `${objectif - val} ${unit} restants`}
      </div>
    </div>
  );
}

function QuantiteInput({ aliment, quantite, onChange }) {
  const u = UNITE_LABELS[aliment.unite] || aliment.unite;
  // Plages selon unité
  const max  = aliment.unite === "u"  ? 10
             : aliment.unite === "cs" ? 10
             : aliment.unite === "cc" ? 10
             : aliment.unite === "ml" ? 500
             : 400;
  const step = aliment.unite === "u" || aliment.unite === "cs" || aliment.unite === "cc" ? 0.5 : 10;

  return (
    <div style={{ display:"flex", alignItems:"center", gap: 8, marginTop: 8 }}>
      <input
        type="range"
        min={step}
        max={max}
        step={step}
        value={quantite}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor:"var(--accent)", cursor:"pointer" }}
      />
      <div style={{ display:"flex", alignItems:"center", gap: 3 }}>
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
          style={{
            width: 52, background:"var(--surface-2)", border:"1px solid var(--border-2)",
            borderRadius: 8, color:"var(--text)", fontFamily:"var(--font-mono)",
            fontSize:"0.82rem", padding:"4px 6px", textAlign:"center", outline:"none",
          }}
        />
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.72rem", color:"var(--text-3)", minWidth: 22 }}>{u}</span>
      </div>
    </div>
  );
}

function AlimentItem({ aliment, checked, quantite, onToggle, onQuantite }) {
  const macros = calculMacros(aliment, quantite);
  return (
    <div style={{
      background: checked ? "rgba(200,245,66,0.05)" : "transparent",
      border: `1px solid ${checked ? "rgba(200,245,66,0.2)" : "var(--border)"}`,
      borderRadius: 12, padding: "12px 14px", marginBottom: 8,
      transition:"all 0.15s",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap: 12 }}>
        {/* Checkbox */}
        <button
          onClick={onToggle}
          style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            background: checked ? "var(--accent)" : "var(--surface-2)",
            border: `1.5px solid ${checked ? "var(--accent)" : "var(--border-2)"}`,
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.15s", color:"#0a0b0d", fontSize:"0.75rem", fontWeight:"bold",
          }}
          aria-label={checked ? "Décocher" : "Cocher"}
        >
          {checked ? "✓" : ""}
        </button>

        {/* Nom + catégorie */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize:"0.9rem", fontWeight: 500, color: checked ? "var(--text)" : "var(--text-2)" }}>
            {aliment.nom}
          </div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.62rem", color:"var(--text-3)", marginTop: 1 }}>
            {aliment.categorie}
          </div>
        </div>

        {/* Macros condensées */}
        {checked && (
          <div style={{ textAlign:"right", fontFamily:"var(--font-mono)", fontSize:"0.68rem", color:"var(--text-2)", lineHeight: 1.6 }}>
            <span style={{ color:"var(--accent-3)" }}>{macros.kcal}</span> kcal<br />
            <span style={{ color:"var(--accent-2)" }}>{macros.p}g</span> prot
          </div>
        )}
        {!checked && (
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", color:"var(--text-3)" }}>
            {aliment.kcal} kcal<br />/{aliment.ref}{UNITE_LABELS[aliment.unite]}
          </div>
        )}
      </div>

      {/* Slider quantité — seulement si coché */}
      {checked && (
        <QuantiteInput
          aliment={aliment}
          quantite={quantite}
          onChange={onQuantite}
        />
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

  return (
    <div style={{
      position:"fixed", inset: 0, background:"rgba(0,0,0,0.8)", zIndex: 200,
      display:"flex", alignItems:"flex-end", padding: "0 0 0 0",
    }} onClick={onClose}>
      <div
        style={{
          background:"var(--surface)", borderRadius:"20px 20px 0 0",
          padding: "24px 20px 40px", width:"100%", maxWidth: 480, margin:"0 auto",
          borderTop:"1px solid var(--border-2)",
          animation:"fadeUp 0.25s ease both",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontFamily:"var(--font-display)", fontSize:"1.2rem", marginBottom: 20 }}>
          Ajouter un aliment
        </div>

        {/* Nom */}
        <div className="form-group">
          <label className="form-label">Nom</label>
          <input className="form-input" placeholder="Ex : Edamame" value={form.nom}
            onChange={e => set("nom", e.target.value)} />
        </div>

        {/* Catégorie */}
        <div className="form-group">
          <label className="form-label">Catégorie</label>
          <select className="form-input" value={form.categorie} onChange={e => set("categorie", e.target.value)}>
            {[...CATEGORIES, "autre"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Unité + portion de référence */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Unité</label>
            <select className="form-input" value={form.unite} onChange={e => set("unite", e.target.value)}>
              {Object.entries(UNITE_LABELS).map(([k,v]) => <option key={k} value={k}>{v} ({k})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Portion réf.</label>
            <input className="form-input" type="number" min="1" value={form.ref}
              onChange={e => set("ref", parseFloat(e.target.value))} />
          </div>
        </div>

        {/* Macros pour la portion de référence */}
        <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.62rem", color:"var(--text-3)", marginBottom: 8, letterSpacing:"0.08em" }}>
          MACROS POUR {form.ref} {UNITE_LABELS[form.unite]}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap: 8, marginBottom: 20 }}>
          {[
            { k:"kcal", label:"kcal", color:"var(--accent-3)" },
            { k:"p",    label:"prot", color:"var(--accent-2)" },
            { k:"g",    label:"gluc", color:"var(--accent)"   },
            { k:"l",    label:"lip",  color:"#f56c42"          },
            { k:"f",    label:"fib",  color:"#a78bfa"          },
          ].map(({ k, label, color }) => (
            <div key={k}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem", color, marginBottom: 4, textAlign:"center" }}>{label}</div>
              <input
                className="form-input"
                type="number" min="0" step="0.1"
                value={form[k]}
                onChange={e => set(k, parseFloat(e.target.value) || 0)}
                style={{ padding:"8px 4px", textAlign:"center", fontSize:"0.85rem" }}
              />
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          disabled={!valid}
          style={{ opacity: valid ? 1 : 0.4 }}
          onClick={() => valid && onSave(form)}
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

  // Aliments personnalisés persistants
  const [customAliments, setCustomAliments] = useStorage("hugo_custom_aliments", []);

  // Journal du jour : { repasIdx: { alimentId: { checked, quantite } } }
  const [journal, setJournal] = useStorage(`hugo_macros_${today}`, {
    0: {}, 1: {}, 2: {},
  });

  const [repasOuvert, setRepasOuvert] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter, setCatFilter] = useState("tout");
  const [showModal, setShowModal] = useState(false);

  const allAliments = useMemo(
    () => [...ALIMENTS_DB, ...customAliments.map(a => ({ ...a, id: `custom_${a.nom.toLowerCase().replace(/\s+/g,"_")}` }))],
    [customAliments]
  );

  // Macros totales de la journée
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

  // Macros du repas courant
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
    setCustomAliments(prev => [...prev, {
      ...form,
      id: `custom_${Date.now()}`,
      nom: form.nom.trim(),
    }]);
    setShowModal(false);
  };

  const checkedCount = Object.values(journal[repasOuvert] || {}).filter(v => v.checked).length;

  return (
    <div className="page">
      <p className="page-subtitle">{new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}</p>
      <h1 className="page-title">Macros<br /><span className="text-accent">du jour</span></h1>

      {/* ── Bilan journée ───────────────────────────────────────── */}
      <div className="card card-accent" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.62rem", color:"var(--text-3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom: 14 }}>
          Bilan journée complète
        </div>
        {MACRO_CONFIG.map(mc => (
          <MacroBar
            key={mc.key}
            label={mc.label}
            val={totalJour[mc.key]}
            objectif={mc.objectif}
            unit={mc.unit}
            color={mc.color}
          />
        ))}
      </div>

      {/* ── Sélecteur repas ─────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
        {[0,1,2].map(ri => {
          const nb = Object.values(journal[ri]||{}).filter(v=>v.checked).length;
          const active = repasOuvert === ri;
          return (
            <button key={ri} onClick={() => setRepasOuvert(ri)} style={{
              background: active ? "var(--accent-muted)" : "var(--surface)",
              border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 12, padding: "10px 8px", cursor:"pointer",
              transition:"all 0.15s", textAlign:"center",
            }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:"0.78rem", color: active ? "var(--accent)" : "var(--text-2)" }}>
                Repas {ri+1}
              </div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:"var(--text-3)", marginTop: 2 }}>
                {["12h00","15h00","18h00"][ri]}
              </div>
              {nb > 0 && (
                <div style={{
                  marginTop: 6, display:"inline-block",
                  background: active ? "var(--accent)" : "var(--surface-2)",
                  color: active ? "#0a0b0d" : "var(--text-2)",
                  borderRadius: 99, fontFamily:"var(--font-mono)", fontSize:"0.6rem",
                  padding:"1px 7px",
                }}>
                  {nb} aliment{nb>1?"s":""}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Macros du repas sélectionné ─────────────────────────── */}
      {checkedCount > 0 && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.62rem", color:"var(--text-3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom: 10 }}>
            Repas {repasOuvert+1} — {checkedCount} aliment{checkedCount>1?"s":""}
          </div>
          <div style={{ display:"flex", gap: 10, flexWrap:"wrap" }}>
            {MACRO_CONFIG.map(mc => (
              <div key={mc.key} style={{
                flex:"1 1 60px", background:"var(--surface-2)", borderRadius: 10,
                padding:"8px 10px", textAlign:"center",
              }}>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:"var(--text-3)", marginBottom: 3 }}>{mc.label}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:"1rem", color: mc.color }}>
                  {macrosRepas[mc.key]}
                </div>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem", color:"var(--text-3)" }}>{mc.unit}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recherche + filtre catégorie ────────────────────────── */}
      <div style={{ marginBottom: 10 }}>
        <input
          className="form-input"
          type="search"
          placeholder="Rechercher un aliment..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <div style={{ display:"flex", gap: 6, overflowX:"auto", paddingBottom: 4 }}>
          {["tout", ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{
              flexShrink: 0, background: catFilter===c ? "var(--accent)" : "var(--surface-2)",
              color: catFilter===c ? "#0a0b0d" : "var(--text-2)",
              border: `1px solid ${catFilter===c ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 99, fontFamily:"var(--font-mono)", fontSize:"0.65rem",
              padding:"4px 12px", cursor:"pointer", whiteSpace:"nowrap",
              transition:"all 0.12s",
            }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Liste aliments ──────────────────────────────────────── */}
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
          <div style={{ textAlign:"center", padding:"28px 0", color:"var(--text-3)", fontFamily:"var(--font-mono)", fontSize:"0.75rem" }}>
            Aucun aliment trouvé
          </div>
        )}
      </div>

      {/* ── Bouton ajout ────────────────────────────────────────── */}
      <button
        className="btn"
        style={{
          marginTop: 16, marginBottom: 8,
          background:"var(--surface)", border:"1px solid var(--border-2)",
          color:"var(--text)",
        }}
        onClick={() => setShowModal(true)}
      >
        + Ajouter un aliment personnalisé
      </button>

      {customAliments.length > 0 && (
        <div style={{ textAlign:"center", fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"var(--text-3)", marginBottom: 20 }}>
          {customAliments.length} aliment{customAliments.length>1?"s":""} personnalisé{customAliments.length>1?"s":""}
        </div>
      )}

      {showModal && (
        <ModalAjout onSave={handleAddCustom} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
