// StatusBadge.jsx
import { STAGES } from "../utils/stageUtils";

export default function StatusBadge({ statut }) {
  const stage = STAGES.find(s => s.id === statut) || STAGES[0];
  return (
    <span className={`status-badge status-badge--${statut}`}>
      {stage.icon} {stage.label}
    </span>
  );
}
