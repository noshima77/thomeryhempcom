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
    <div className="text-center py-16">
      <p className="text-neutral-500 mb-4">Lot introuvable.</p>
      <button className="px-4 py-2 rounded-lg border-[1.5px] border-neutral-200 text-sm" onClick={() => navigate("dashboard")}>← Retour</button>
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

  const btnSm = "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-0 border-[1.5px] border-neutral-200 hover:border-green-500 hover:bg-green-50 transition-all";

  return (
    <div>
      {/* Header */}
      <div className="bg-neutral-0 border-[1.5px] border-neutral-200 rounded-2xl p-5 mb-5 shadow-sm">
        <button className="text-sm text-neutral-500 hover:text-green-700 mb-3 inline-flex items-center gap-1 py-1.5" onClick={() => navigate("dashboard")}>
          ← Retour
        </button>
        <div className="flex justify-between items-start gap-3 mb-4 flex-wrap">
          <div>
            <h1 className="font-serif text-2xl font-extrabold">{lot.nom}</h1>
            <p className="text-[0.8rem] text-neutral-500 mt-0.5">
              {lot.variete} · {lot.nb_graines} graine{lot.nb_graines > 1 ? "s" : ""} · Lancé le {new Date(lot.date_lancement).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            <button className={btnSm} onClick={() => exportLotCSV(lot, journal)}>↓ CSV</button>
            <button className={btnSm} onClick={() => exportLotPDF(lot, journal, photos)}>↓ PDF</button>
            <button className={`${btnSm} text-error border-red-200 hover:bg-red-50 hover:border-red-200`} onClick={handleDelete}>Supprimer</button>
          </div>
        </div>

        {/* Day counter + progress */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-0 bg-green-900 text-white rounded-lg px-4 py-2.5 min-w-16 flex-shrink-0">
            <span className="font-serif text-xl font-extrabold leading-none">J+{days}</span>
            <span className="text-[0.68rem] opacity-70 tracking-wide">jours</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2.5 flex-wrap">
              {editingStatut ? (
                <select
                  autoFocus
                  className="text-sm px-2 py-1 rounded-md border-[1.5px] border-green-500"
                  value={lot.statut}
                  onChange={e => handleStatutChange(e.target.value)}
                  onBlur={() => setEditingStatut(false)}
                >
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              ) : (
                <button className="flex items-center gap-1.5" onClick={() => setEditingStatut(true)}>
                  <StatusBadge statut={lot.statut} /> <span className="text-neutral-500 text-sm">✎</span>
                </button>
              )}
              {getNextStage(lot.statut) && (
                <span className="text-xs text-neutral-500">→ {getNextStage(lot.statut)}</span>
              )}
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 mb-4 bg-neutral-0 border-[1.5px] border-neutral-200 rounded-2xl p-1">
        {[
          { id: "journal", label: `Journal (${journal.length})` },
          { id: "photos", label: `Photos (${photos.length})` },
          { id: "rappels", label: "Rappels" },
        ].map(tab => (
          <button
            key={tab.id}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? "bg-green-900 text-white" : "text-neutral-500 hover:bg-green-50 hover:text-neutral-900"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Journal Tab */}
      {activeTab === "journal" && (
        <div className="flex flex-col gap-3">
          <form className="bg-neutral-0 border-[1.5px] border-neutral-200 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-sm" onSubmit={handleAddEntry}>
            <div className="flex gap-1.5 flex-wrap">
              {["observation", "arrosage", "alerte", "traitement", "emplacement"].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-[1.5px] transition-all ${
                    entryType === t ? "bg-green-900 text-white border-green-900" : "bg-neutral-50 border-neutral-200 text-neutral-500"
                  }`}
                  onClick={() => setEntryType(t)}
                >
                  {t === "observation" ? "🔍" : t === "arrosage" ? "💧" : t === "alerte" ? "⚠️" : t === "traitement" ? "🧪" : "🪴"} {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-end">
              <textarea
                className="flex-1 px-3 py-2.5 border-[1.5px] border-neutral-200 rounded-lg text-sm resize-none focus:outline-none focus:border-green-500 transition-colors"
                value={newEntry}
                onChange={e => setNewEntry(e.target.value)}
                placeholder="Note libre... (ex: premières racines visibles, pH 6.2, arrosage 200ml)"
                rows={2}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddEntry(e); } }}
              />
              <button className="min-h-touch px-4 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-300 transition-all" type="submit">
                Ajouter
              </button>
            </div>
          </form>

          {loadingJournal ? (
            <div className="flex flex-col gap-2">
              {[1,2,3].map(i => <div key={i} className="rounded-lg h-[72px] skeleton-shimmer" />)}
            </div>
          ) : journal.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">
              <p>Aucune entrée pour l'instant. Commence à noter !</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {journal.map(entry => (
                <JournalEntry key={entry.id} entry={entry} onDelete={() => handleDeleteEntry(entry.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === "photos" && (
        <div className="flex flex-col gap-3">
          <div
            className="flex items-center justify-center gap-2.5 bg-neutral-0 border-2 border-dashed border-neutral-200 rounded-2xl p-6 cursor-pointer text-neutral-500 text-sm hover:border-green-500 hover:bg-green-50 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" hidden onChange={handlePhotoUpload} />
            <span className="text-2xl">📷</span>
            <span>Ajouter une photo</span>
          </div>
          <PhotoGallery photos={photos} getPhotoUrl={getPhotoUrl} onDelete={handleDeletePhoto} />
        </div>
      )}

      {/* Rappels Tab */}
      {activeTab === "rappels" && (
        <RappelsTab statut={lot.statut} days={days} />
      )}
    </div>
  );
}

function RappelsTab({ statut, days }) {
  const suggestions = getStageSuggestions(statut, days);
  return (
    <div>
      <h3 className="font-serif text-base font-bold mb-3">Conseils pour ce stade</h3>
      <ul className="flex flex-col gap-2.5 list-none">
        {suggestions.map((s, i) => (
          <li key={i} className="flex gap-3 bg-neutral-0 border-[1.5px] border-neutral-200 rounded-lg p-3.5">
            <span className="text-xl flex-shrink-0">{s.icon}</span>
            <div>
              <strong className="text-sm block mb-0.5">{s.titre}</strong>
              <p className="text-[0.8rem] text-neutral-500">{s.detail}</p>
            </div>
          </li>
        ))}
      </ul>
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