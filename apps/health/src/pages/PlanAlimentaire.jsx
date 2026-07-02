// src/pages/PlanAlimentaire.jsx
// Wrapper pour ton fichier existant plan-alimentaire-hugo.jsx
import PlanAlimentaireHugo from "../existing/plan-alimentaire-hugo";

export default function PlanAlimentaire() {
  return (
    <div className="max-w-[480px] mx-auto px-4 pt-6 pb-24 animate-fade-up">
      <p className="font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1">Nutrition · IF 6h</p>
      <h1 className="font-serif text-3xl leading-none tracking-tight mb-6">
        Plan<br /><span className="text-green-500">alimentaire</span>
      </h1>
      <PlanAlimentaireHugo />
    </div>
  );
}