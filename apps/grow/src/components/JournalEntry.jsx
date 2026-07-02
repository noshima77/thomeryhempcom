const TYPE_ICONS = {
  observation: "🔍",
  arrosage: "💧",
  alerte: "⚠️",
  traitement: "🧪",
};

export default function JournalEntry({ entry, onDelete }) {
  const date = new Date(entry.created);
  const dateStr = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  const timeStr = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`journal-entry journal-entry--${entry.type}`}>
      <div className="entry-icon">{TYPE_ICONS[entry.type] || "📝"}</div>
      <div className="entry-body">
        <p className="entry-text">{entry.contenu}</p>
        <span className="entry-date">{dateStr} à {timeStr}</span>
      </div>
      <button className="entry-delete" onClick={onDelete} title="Supprimer">×</button>
    </div>
  );
}
