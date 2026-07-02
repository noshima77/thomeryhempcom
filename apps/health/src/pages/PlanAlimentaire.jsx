// src/pages/PlanAlimentaire.jsx
// Wrapper pour ton fichier existant plan-alimentaire-hugo.jsx
import PlanAlimentaireHugo from "../existing/plan-alimentaire-hugo";

export default function PlanAlimentaire() {
  return (
    <div className="page" style={{ paddingTop: 24 }}>
      <p className="page-subtitle">Nutrition · IF 6h</p>
      <h1 className="page-title" style={{ marginBottom: 24 }}>
        Plan<br /><span className="text-accent">alimentaire</span>
      </h1>
      <PlanAlimentaireHugo />
    </div>
  );
}
