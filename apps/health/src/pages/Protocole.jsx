// src/pages/Protocole.jsx
// Wrapper pour ton fichier existant protocole-training-hugo.jsx
import ProtocoleTrainingHugo from "../existing/protocole-training-hugo";

export default function Protocole() {
  return (
    <div className="max-w-[480px] mx-auto px-4 pt-6 pb-24 animate-fade-up">
      <p className="font-mono text-xs text-neutral-500 tracking-wide uppercase mb-1">12 mois · 3 phases</p>
      <h1 className="font-serif text-3xl leading-none tracking-tight mb-6">
        Protocole<br /><span className="text-green-500">training</span>
      </h1>
      <ProtocoleTrainingHugo />
    </div>
  );
}