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

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setRep = (id, v) => setForm(f => ({ ...f, reps: { ...f.reps, [id]: v } }));

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

  const inputCls = "w-full bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono text-base px-3.5 py-3 outline-none focus:border-green-500 transition-colors placeholder:text-neutral-500";
  const labelCls = "block font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1.5";

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-6 pb-24 animate-fade-up">
      <p className="font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1">Suivi personnel</p>
      <h1 className="font-serif text-3xl leading-none tracking-tight mb-6">
        Journal<br /><span className="text-green-500">de bord</span>
      </h1>

      {/* Date */}
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mb-3">
        <label className={labelCls}>Date de saisie</label>
        <input type="date" className={inputCls} value={form.date} onChange={e => setField("date", e.target.value)} />
      </div>

      {/* Poids */}
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mb-3">
        <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2.5">Poids à jeun</div>
        <label className={labelCls}>Poids lundi matin (kg)</label>
        <input
          type="number" step="0.1" min="40" max="100" placeholder="54.0"
          className={inputCls} value={form.weight} onChange={e => setField("weight", e.target.value)}
        />
      </div>

      {/* Reps */}
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mb-3">
        <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2.5">Répétitions réalisées</div>
        {EXERCISES.map(ex => (
          <div className="mb-4 last:mb-0" key={ex.id}>
            <label className={labelCls}>{ex.label}</label>
            <input
              type="text" placeholder="ex: 8 / 7 / 6" className={inputCls}
              value={form.reps[ex.id]} onChange={e => setRep(ex.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Énergie */}
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mb-3">
        <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2.5">Énergie subjective</div>
        <div className="flex gap-2.5">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setField("energy", n)}
              className={`flex-1 aspect-square rounded-lg border font-serif text-lg transition-all ${
                form.energy === n
                  ? "bg-green-50 border-green-500 text-green-500"
                  : "bg-neutral-50 border-neutral-200 text-neutral-500"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="text-sm text-neutral-500 mt-2">1 = épuisé · 5 = au top</div>
      </div>

      {/* Notes */}
      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mb-4">
        <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2.5">Notes libres</div>
        <textarea
          className={`${inputCls} resize-y min-h-[90px] font-sans text-sm leading-relaxed`}
          placeholder="Ressenti, douleurs, variations, qualité du sommeil..."
          value={form.notes}
          onChange={e => setField("notes", e.target.value)}
        />
      </div>

      <button
        className="w-full flex items-center justify-center gap-2 min-h-touch px-6 rounded-lg font-serif text-sm tracking-wide bg-green-500 text-white active:scale-[0.97] active:bg-green-700 transition-all"
        onClick={handleSave}
      >
        {saved ? "✓ Sauvegardé !" : "Enregistrer la séance"}
      </button>

      {/* Historique court */}
      {entries.length > 0 && (
        <div className="mt-7">
          <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-2">Dernières entrées</div>
          {[...entries].reverse().slice(0, 4).map(e => (
            <div
              key={e.date}
              className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 mt-2 cursor-pointer"
              onClick={() => setForm(e)}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-neutral-500">
                  {new Date(e.date + "T12:00:00").toLocaleDateString("fr-FR", { weekday:"short", day:"numeric", month:"short" })}
                </span>
                {e.weight && (
                  <span className="font-mono text-sm text-green-500">{e.weight} kg</span>
                )}
                {e.energy > 0 && (
                  <span className="font-mono text-sm text-amber-500">énergie {e.energy}/5</span>
                )}
              </div>
              {e.notes && (
                <p className="text-sm text-neutral-500 mt-1.5">
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