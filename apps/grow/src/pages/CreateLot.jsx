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

  return (
    <div className="create-lot">
      <button className="back-btn" onClick={() => navigate("dashboard")}>← Retour</button>
      <h1 className="page-title">Nouveau lot</h1>

      {error && <div className="alert alert-error">❌ {error}</div>}

      <form className="lot-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">Nom du lot</label>
          <input className="form-input" value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Lot A" required />
        </div>

        <div className="form-row">
          <label className="form-label">Variété</label>
          <input className="form-input" value={form.variete} onChange={e => set("variete", e.target.value)} placeholder="Cherry Royale" />
        </div>

        <div className="form-row form-row--half">
          <div>
            <label className="form-label">Date de lancement</label>
            <input className="form-input" type="date" value={form.date_lancement} onChange={e => set("date_lancement", e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Nombre de graines</label>
            <input className="form-input" type="number" min="1" max="100" value={form.nb_graines} onChange={e => set("nb_graines", parseInt(e.target.value))} />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Stade actuel</label>
          <div className="stage-picker">
            {STAGES.map(s => (
              <button
                key={s.id}
                type="button"
                className={`stage-option ${form.statut === s.id ? "active" : ""}`}
                onClick={() => set("statut", s.id)}
              >
                <span className="stage-option-icon">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Notes initiales (optionnel)</label>
          <textarea className="form-input form-textarea" value={form.notes_generales} onChange={e => set("notes_generales", e.target.value)} placeholder="Observations de départ, provenance des graines..." rows={3} />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer le lot →"}
        </button>
      </form>
    </div>
  );
}
