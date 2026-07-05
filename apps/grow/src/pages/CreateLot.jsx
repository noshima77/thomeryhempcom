import { useState } from "react";
import { useLotsContext } from "../context/LotsContext";
import { STAGES } from "../utils/stageUtils";

export default function CreateLot({ navigate }) {
  const { createLot, lots } = useLotsContext();
  const [form, setForm] = useState({
    nom: `Lot ${String.fromCharCode(65 + lots.length)}`,
    variete: "Cherry Royale",
    date_lancement: new Date().toISOString().split("T")[0],
    nb_graines: 1,
    statut: "germination",
    notes_generales: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const lot = await createLot(form);
      navigate("lot", { id: lot.id });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 border-[1.5px] border-neutral-200 rounded-lg text-sm bg-neutral-0 focus:outline-none focus:border-green-500 transition-colors";
  const labelCls = "text-sm font-semibold text-neutral-900";

  return (
    <div className="max-w-[500px] mx-auto">
      <button className="text-sm text-neutral-500 hover:text-green-700 mb-3 inline-flex items-center gap-1 py-1.5" onClick={() => navigate("dashboard")}>
        ← Retour
      </button>
      <h1 className="font-serif text-2xl font-extrabold text-green-900 tracking-tight mb-5">Nouveau lot</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-error rounded-lg px-3.5 py-3 text-sm mb-4">
          ❌ {error}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Nom du lot</label>
          <input className={inputCls} value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Lot A" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Variété</label>
          <input className={inputCls} value={form.variete} onChange={e => set("variete", e.target.value)} placeholder="Cherry Royale" />
        </div>

        <div className="flex flex-row gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className={labelCls}>Date de lancement</label>
            <input className={inputCls} type="date" value={form.date_lancement} onChange={e => set("date_lancement", e.target.value)} required />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className={labelCls}>Nombre de graines</label>
            <input className={inputCls} type="number" min="1" max="100" value={form.nb_graines} onChange={e => set("nb_graines", parseInt(e.target.value))} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Stade actuel</label>
          <div className="grid grid-cols-3 gap-2">
            {STAGES.map(s => {
              const active = form.statut === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => set("statut", s.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg border-[1.5px] text-xs font-medium transition-all ${
                    active
                      ? "border-green-500 bg-green-50 text-green-900 font-bold"
                      : "border-neutral-200 text-neutral-500 hover:border-green-500 hover:bg-green-50"
                  }`}
                >
                  <span className="text-xl">{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Notes initiales (optionnel)</label>
          <textarea
            className={`${inputCls} resize-y`}
            value={form.notes_generales}
            onChange={e => set("notes_generales", e.target.value)}
            placeholder="Observations de départ, provenance des graines..."
            rows={3}
          />
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 min-h-touch px-4 rounded-lg font-medium text-[15px] bg-green-500 text-white hover:bg-green-300 transition-all disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Création..." : "Créer le lot →"}
        </button>
      </form>
    </div>
  );
}