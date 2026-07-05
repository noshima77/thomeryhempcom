import { STAGES } from "../utils/stageUtils";

const STATUS_STYLES = {
  "germination": "bg-brown-50 text-brown-700 border-brown-200",
  "papier-humide": "bg-white-50 text-white-700 border-white-200",
  "godet": "bg-black-50 text-black-700 border-black-200",
  "croissance": "bg-pink-50 text-pink-700 border-pink-200",
  "stretch": "bg-pink-50 text-pink-700 border-pink-200",
  "pré-flo": "bg-pink-50 text-pink-700 border-pink-200",
  "floraison": "bg-pink-50 text-pink-700 border-pink-200",
  "séchage":   "bg-amber-50 text-amber-700 border-amber-200",
  "terminé":   "bg-neutral-100 text-neutral-500 border-neutral-200",
  "manucure": "bg-brown-50 text-brown-700 border-brown-200",
  "curring": "bg-white-50 text-white-700 border-white-200",
};

export default function StatusBadge({ statut }) {
  const stage = STAGES.find(s => s.id === statut) || STAGES[0];
  const styleCls = STATUS_STYLES[statut] || "bg-green-50 text-green-700 border-green-300";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styleCls}`}>
      {stage.icon} {stage.label}
    </span>
  );
}