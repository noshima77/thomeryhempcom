import { useState, useEffect, useRef } from "react";
import { useLotsContext } from "../context/LotsContext";
import StatusBadge from "../components/StatusBadge";
import JournalEntry from "../components/JournalEntry";
import PhotoGallery from "../components/PhotoGallery";
import ProgressBar from "../components/ProgressBar";
import { getDaysElapsed, STAGES, getStageProgress, getNextStage } from "../utils/stageUtils";
import { exportLotPDF, exportLotCSV } from "../utils/exportUtils";

export default function LotDetail({ id, navigate }) {
  const { lots, updateLot, deleteLot, getJournal, addJournalEntry, deleteJournalEntry, getPhotos, addPhoto, deletePhoto, getPhotoUrl } = useLotsContext();
  const lot = lots.find(l => l.id === id);

  const [journal, setJournal] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [entryType, setEntryType] = useState("observation");
  const [activeTab, setActiveTab] = useState("journal");
  const [editingStatut, setEditingStatut] = useState(false);
  const [loadingJournal, setLoadingJournal] = useState(true);
  const fileInputRef = useRef();

  useEffect(() => {
    if (!lot) return;
    setLoadingJournal(true);
    getJournal(id).then(entries => { setJournal(entries); setLoadingJournal(false); });
    getPhotos(id).then(setPhotos);
  }, [id]);

  if (!lot) return (
    <div className="not-found">
      <p>Lot introuvable.</p>
      <button className="btn" onClick={() => navigate("dashboard")}>← Retour</button>
    </div>
  );

  const days = getDaysElapsed(lot.date_lancement);
  const progress = getStageProgress(lot.statut);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    const entry = await addJournalEntry(id, newEntry.trim(), entryType);
    setJournal(prev => [entry, ...prev]);
    setNewEntry("");
  };

  const handleDeleteEntry = async (entryId) => {
    await deleteJournalEntry(entryId);
    setJournal(prev => prev.filter(e => e.id !== entryId));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const photo = await addPhoto(id, file, "");
    setPhotos(prev => [photo, ...prev]);
  };

  const handleDeletePhoto = async (photoId) => {
    await deletePhoto(photoId);
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const handleStatutChange = async (newStatut) => {
    await updateLot(id, { statut: newStatut });
    setEditingStatut(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer définitivement le ${lot.nom} ?`)) return;
    await deleteLot(id);
    navigate("dashboard");
  };

  return (
    <div className="lot-detail">
      {/* Header */}
      <div className="lot-header">
        <button className="back-btn" onClick={() => navigate("dashboard")}>← Retour</button>
        <div className="lot-title-row">
          <div>
            <h1 className="lot-name">{lot.nom}</h1>
            <p className="lot-meta">{lot.variete} · {lot.nb_graines} graine{lot.nb_graines > 1 ? "s" : ""} · Lancé le {new Date(lot.date_lancement).toLocaleDateString("fr-FR")}</p>
          </div>
          <div className="lot-actions">
            <button className="btn btn-sm" onClick={() => exportLotCSV(lot, journal)}>↓ CSV</button>
            <button className="btn btn-sm" onClick={() => exportLotPDF(lot, journal, photos)}>↓ PDF</button>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>Supprimer</button>
          </div>
        </div>

        {/* Day counter + progress */}
        <div className="lot-stats">
          <div className="day-badge">
            <span className="day-number">J+{days}</span>
            <span className="day-label">jours</span>
          </div>
          <div className="stage-info">
            <div className="stage-top">
              <span className="stage-current">
                {editingStatut ? (
                  <select autoFocus className="stage-select" value={lot.statut} onChange={e => handleStatutChange(e.target.value)} onBlur={() => setEditingStatut(false)}>
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                ) : (
                  <button className="stage-btn" onClick={() => setEditingStatut(true)}>
                    <StatusBadge statut={lot.statut} /> ✎
                  </button>
                )}
              </span>
              {getNextStage(lot.statut) && (
                <span className="stage-next">→ {getNextStage(lot.statut)}</span>
              )}
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: "journal", label: `Journal (${journal.length})` },
          { id: "photos", label: `Photos (${photos.length})` },
          { id: "rappels", label: "Rappels" },
        ].map(tab => (
          <button key={tab.id} className={`tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Journal Tab */}
      {activeTab === "journal" && (
        <div className="tab-content">
          <form className="entry-form" onSubmit={handleAddEntry}>
            <div className="entry-type-row">
              {["observation", "arrosage", "alerte", "traitement"].map(t => (
                <button key={t} type="button" className={`type-chip ${entryType === t ? "active" : ""}`} onClick={() => setEntryType(t)}>
                  {t === "observation" ? "🔍" : t === "arrosage" ? "💧" : t === "alerte" ? "⚠️" : "🧪"} {t}
                </button>
              ))}
            </div>
            <div className="entry-input-row">
              <textarea
                className="entry-input"
                value={newEntry}
                onChange={e => setNewEntry(e.target.value)}
                placeholder="Note libre... (ex: premières racines visibles, pH 6.2, arrosage 200ml)"
                rows={2}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddEntry(e); } }}
              />
              <button className="btn btn-primary" type="submit">Ajouter</button>
            </div>
          </form>

          {loadingJournal ? (
            <div className="loading-list">{[1,2,3].map(i => <div key={i} className="skeleton skeleton-entry" />)}</div>
          ) : journal.length === 0 ? (
            <div className="empty-journal">
              <p>Aucune entrée pour l'instant. Commence à noter !</p>
            </div>
          ) : (
            <div className="journal-list">
              {journal.map(entry => (
                <JournalEntry key={entry.id} entry={entry} onDelete={() => handleDeleteEntry(entry.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === "photos" && (
        <div className="tab-content">
          <div className="photo-upload-area" onClick={() => fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" hidden onChange={handlePhotoUpload} />
            <span className="upload-icon">📷</span>
            <span>Ajouter une photo</span>
          </div>
          <PhotoGallery photos={photos} getPhotoUrl={getPhotoUrl} onDelete={handleDeletePhoto} />
        </div>
      )}

      {/* Rappels Tab */}
      {activeTab === "rappels" && (
        <RappelsTab lotId={id} statut={lot.statut} days={days} />
      )}
    </div>
  );
}

function RappelsTab({ lotId, statut, days }) {
  const suggestions = getStageSuggestions(statut, days);
  return (
    <div className="tab-content">
      <div className="rappels-section">
        <h3 className="section-label">Conseils pour ce stade</h3>
        <ul className="suggestions-list">
          {suggestions.map((s, i) => (
            <li key={i} className="suggestion-item">
              <span className="suggestion-icon">{s.icon}</span>
              <div>
                <strong>{s.titre}</strong>
                <p>{s.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getStageSuggestions(statut, days) {
  const map = {
    germination: [
      { icon: "💧", titre: "Humidité constante", detail: "Maintenir le papier humide sans excès d'eau. Vérifier toutes les 12h." },
      { icon: "🌡️", titre: "Température 22–26°C", detail: "Éviter les écarts thermiques. Germe en 24–72h généralement." },
      { icon: "🌑", titre: "Obscurité totale", detail: "Les graines germent dans le noir. Ne pas exposer à la lumière." },
    ],
    godet: [
      { icon: "🪴", titre: "Premier arrosage léger", detail: "Sol légèrement humide, pas détrempé. ~50ml par arrosage." },
      { icon: "💡", titre: "18h de lumière / 6h de nuit", detail: "Phase végétative : cycle 18/6 recommandé." },
      { icon: "🌱", titre: "Premières feuilles", detail: "Les cotylédon apparaissent en J+3 à J+7. Surveiller la croissance." },
    ],
    croissance: [
      { icon: "💡", titre: "Lumière 18/6", detail: "Maintenir le cycle végétatif. Augmenter progressivement l'intensité." },
      { icon: "💧", titre: "Arrosage selon le sol", detail: "Attendre que le dessus du sol soit sec avant d'arroser à nouveau." },
      { icon: "✂️", titre: "LST possible dès J+20", detail: "Low Stress Training pour maximiser la surface exposée à la lumière." },
    ],
    floraison: [
      { icon: "🌸", titre: "Passer en 12/12", detail: "Réduire à 12h de lumière pour déclencher la floraison." },
      { icon: "🧪", titre: "Adapter les nutriments", detail: "Réduire l'azote, augmenter le phosphore et le potassium." },
      { icon: "📅", titre: `Floraison en cours (J+${days})`, detail: "Cherry Royale : floraison typique 8–10 semaines. Surveiller les trichomes." },
    ],
    séchage: [
      { icon: "💨", titre: "Ventilation douce", detail: "Air en circulation sans flux direct sur les fleurs. 50–60% HR." },
      { icon: "🌡️", titre: "18–22°C, obscurité", detail: "Séchage lent = meilleure qualité. Éviter >65% HR (moisissures)." },
      { icon: "⏱️", titre: "7–14 jours en moyenne", detail: "Vérifier quand les petites tiges cassent nettement." },
    ],
  };
  return map[statut] || [{ icon: "📋", titre: "Suivi en cours", detail: "Continue à noter tes observations dans le journal." }];
}
