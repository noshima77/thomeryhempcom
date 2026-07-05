const TYPE_ICONS = {
  observation: "🔍",
  arrosage: "💧",
  alerte: "⚠️",
  traitement: "🧪",
  emplacement: "🪴",
};

const TYPE_BORDER = {
  observation: "border-l-neutral-200",
  arrosage: "border-l-[var(--color-info-500)]",
  alerte: "border-l-amber-500 bg-amber-50/50",
  traitement: "border-l-purple-400",
};

export default function JournalEntry({ entry, onDelete }) {
  const date = new Date(entry.created);
  const dateStr = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  const timeStr = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex gap-2.5 items-start bg-neutral-0 border-[1.5px] border-neutral-200 border-l-[3px] rounded-lg p-3 ${TYPE_BORDER[entry.type] || ""}`}>
      <div className="text-lg flex-shrink-0 mt-0.5">{TYPE_ICONS[entry.type] || "📝"}</div>
      <div className="flex-1">
        <p className="text-sm leading-relaxed mb-1">{entry.contenu}</p>
        <span className="text-xs text-neutral-500">{dateStr} à {timeStr}</span>
      </div>
      <button
        className="text-lg leading-none text-neutral-500 opacity-40 hover:opacity-100 hover:text-error transition-opacity px-1 flex-shrink-0"
        onClick={onDelete}
        title="Supprimer"
      >
        ×
      </button>
    </div>
  );
}