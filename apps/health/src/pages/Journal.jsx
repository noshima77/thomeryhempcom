import { useState } from "react";
import { useStorage } from "../hooks/useStorage";

const EXERCISES = [
  { id: "tractions", label: "Tractions" },
  { id: "pompes",    label: "Pompes" },
  { id: "dips",      label: "Dips" },
  { id: "rowing",    label: "Rowing élastique" },
  { id: "squat",     label: "Squat poids de corps" },
  { id: "gainage",   label: "Gainage (sec)" },
];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function Journal() {
  const [entries, setEntries] = useStorage("hugo_journal", []);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState(() => {
    const today = todayStr();
    const existing = entries.find(e => e.date === today);
    return existing || {
      date: today,
      weight: "",
      energy: 0,
      notes: "",
      reps: Object.fromEntries(EXERCISES.map(e => [e.id, ""])),
    };
  });

  const setField = (k, v) =>
    setForm(f => ({ ...f, [k]: v }));

  const setRep = (id, v) =>
    setForm(f => ({ ...f, reps: { ...f.reps, [id]: v } }));

  const handleSave = () => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e.date === form.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = form;
        return next;
      }
      return [...prev, form].sort((a, b) => a.date.localeCompare(b.date));
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page">
      <p className="page-subtitle">Suivi personnel</p>
      <h1 className="page-title">Journal<br /><span className="text-accent">de bord</span></h1>

      {/* Date */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Date de saisie</label>
          <input
            type="date"
            className="form-input"
            value={form.date}
            onChange={e => setField("date", e.target.value)}
          />
        </div>
      </div>

      {/* Poids */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-label">Poids à jeun</div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Poids lundi matin (kg)</label>
          <input
            type="number"
            step="0.1"
            min="40"
            max="100"
            placeholder="54.0"
            className="form-input"
            value={form.weight}
            onChange={e => setField("weight", e.target.value)}
          />
        </div>
      </div>

      {/* Reps */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-label">Répétitions réalisées</div>
        {EXERCISES.map(ex => (
          <div className="form-group" key={ex.id}>
            <label className="form-label">{ex.label}</label>
            <input
              type="text"
              placeholder="ex: 8 / 7 / 6"
              className="form-input"
              value={form.reps[ex.id]}
              onChange={e => setRep(ex.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Énergie */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-label">Énergie subjective</div>
        <div className="rating-row">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              className={`rating-btn ${form.energy === n ? "selected" : ""}`}
              onClick={() => setField("energy", n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="text-muted" style={{ marginTop: 8, fontSize:"0.75rem" }}>
          1 = épuisé · 5 = au top
        </div>
      </div>

      {/* Notes */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-label">Notes libres</div>
        <textarea
          className="form-input form-textarea"
          placeholder="Ressenti, douleurs, variations, qualité du sommeil..."
          value={form.notes}
          onChange={e => setField("notes", e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        {saved ? "✓ Sauvegardé !" : "Enregistrer la séance"}
      </button>

      {/* Historique court */}
      {entries.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div className="section-label">Dernières entrées</div>
          {[...entries].reverse().slice(0, 4).map(e => (
            <div
              key={e.date}
              className="card"
              style={{ marginTop: 8, cursor:"pointer" }}
              onClick={() => setForm(e)}
            >
              <div className="flex items-center justify-between">
                <span className="text-mono" style={{ fontSize:"0.78rem", color:"var(--text-2)" }}>
                  {new Date(e.date + "T12:00:00").toLocaleDateString("fr-FR", { weekday:"short", day:"numeric", month:"short" })}
                </span>
                {e.weight && (
                  <span className="text-accent text-mono" style={{ fontSize:"0.88rem" }}>
                    {e.weight} kg
                  </span>
                )}
                {e.energy > 0 && (
                  <span style={{ color:"var(--accent-3)", fontSize:"0.8rem", fontFamily:"var(--font-mono)" }}>
                    énergie {e.energy}/5
                  </span>
                )}
              </div>
              {e.notes && (
                <p className="text-muted" style={{ marginTop: 5, fontSize:"0.78rem" }}>
                  {e.notes.slice(0, 80)}{e.notes.length > 80 ? "…" : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
