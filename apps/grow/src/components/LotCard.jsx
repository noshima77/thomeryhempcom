import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import { getDaysElapsed, getStageProgress } from "../utils/stageUtils";

export default function LotCard({ lot, onClick, archived }) {
  const days = getDaysElapsed(lot.date_lancement);
  const progress = getStageProgress(lot.statut);

  return (
    <div className={`lot-card ${archived ? "lot-card--archived" : ""}`} onClick={onClick}>
      <div className="lot-card-header">
        <div className="lot-card-title">
          <h3>{lot.nom}</h3>
          <span className="lot-card-variete">{lot.variete}</span>
        </div>
        <div className="lot-card-day">
          <span className="day-counter">J+{days}</span>
        </div>
      </div>

      <div className="lot-card-body">
        <StatusBadge statut={lot.statut} />
        <ProgressBar value={progress} small />
      </div>

      <div className="lot-card-footer">
        <span className="lot-card-meta">🌱 {lot.nb_graines} graine{lot.nb_graines > 1 ? "s" : ""}</span>
        <span className="lot-card-meta">📅 {new Date(lot.date_lancement).toLocaleDateString("fr-FR")}</span>
        <span className="lot-card-arrow">→</span>
      </div>
    </div>
  );
}
