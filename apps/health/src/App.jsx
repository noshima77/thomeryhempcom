import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Graphiques from "./pages/Graphiques";
import Macros from "./pages/Macros";
import PlanAlimentaire from "./pages/PlanAlimentaire";
import Protocole from "./pages/Protocole";
import NavBar from "./components/NavBar";
import "./index.css";

export const PAGES = [
  { id: "dashboard", label: "Accueil",  icon: "⬡" },
  { id: "macros",    label: "Macros",   icon: "◈" },
  { id: "journal",   label: "Journal",  icon: "◎" },
  { id: "graphs",    label: "Courbes",  icon: "↗" },
  { id: "training",  label: "Training", icon: "◉" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":  return <Dashboard onNavigate={setPage} />;
      case "macros":     return <Macros />;
      case "journal":    return <Journal />;
      case "graphs":     return <Graphiques />;
      case "food":       return <PlanAlimentaire />;
      case "training":   return <Protocole />;
      default:           return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div className="app-root">
      <main className="app-main">
        {renderPage()}
      </main>
      <NavBar current={page} onNavigate={setPage} pages={PAGES} />
    </div>
  );
}
