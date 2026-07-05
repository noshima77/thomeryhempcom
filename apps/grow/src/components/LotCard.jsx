import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import { getDaysElapsed, getStageProgress } from "../utils/stageUtils";

export default function LotCard({ lot, onClick, archived }) {
  const days = getDaysElapsed(lot.date_lancement);
  const progress = getStageProgress(lot.statut);

  return (
    <div
      className={`bg-neutral-0 border-[1.5px] border-neutral-200 rounded-2xl p-4 cursor-pointer transition-all shadow-sm hover:border-green-500 hover:shadow-md hover:-translate-y-0.5 ${
        archived ? "opacity-60" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-serif text-lg font-bold">{lot.nom}</h3>
          <span className="text-xs text-neutral-500">{lot.variete}</span>
        </div>
        <span className="font-serif text-sm font-extrabold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
          J+{days}
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        <StatusBadge statut={lot.statut} />
        <ProgressBar value={progress} small />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-500">🌱 {lot.nb_graines} graine{lot.nb_graines > 1 ? "s" : ""}</span>
        <span className="text-xs text-neutral-500">📅 {new Date(lot.date_lancement).toLocaleDateString("fr-FR")}</span>
        <span className="ml-auto text-green-700 text-base">→</span>
      </div>
    </div>
  );
}