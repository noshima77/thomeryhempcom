// src/pages/Protocole.jsx
// Wrapper pour ton fichier existant protocole-training-hugo.jsx
import ProtocoleTrainingHugo from "../existing/protocole-training-hugo";

export default function Protocole() {
  return (
    <div className="page" style={{ paddingTop: 24 }}>
      <p className="page-subtitle">12 mois · 3 phases</p>
      <h1 className="page-title" style={{ marginBottom: 24 }}>
        Protocole<br /><span className="text-accent">training</span>
      </h1>
      <ProtocoleTrainingHugo />
    </div>
  );
}
