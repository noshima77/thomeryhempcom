import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import LotDetail from "./pages/LotDetail";
import CreateLot from "./pages/CreateLot";
import { LotsProvider } from "./context/LotsContext";
import "./App.css";

export default function App() {
  const [page, setPage] = useState({ name: "dashboard", params: {} });

  const navigate = (name, params = {}) => setPage({ name, params });

  return (
    <LotsProvider>
      <div className="app">
        <Header navigate={navigate} currentPage={page.name} />
        <main className="main-content">
          {page.name === "dashboard" && <Dashboard navigate={navigate} />}
          {page.name === "lot" && <LotDetail id={page.params.id} navigate={navigate} />}
          {page.name === "create" && <CreateLot navigate={navigate} />}
        </main>
      </div>
    </LotsProvider>
  );
}

function Header({ navigate, currentPage }) {
  return (
    <header className="header">
      <div className="header-inner">
        <button className="logo" onClick={() => navigate("dashboard")}>
          <span className="logo-icon">🌿</span>
          <span className="logo-text">GrowTrack</span>
          <span className="logo-sub">Cherry Royale</span>
        </button>
        <nav className="header-nav">
          <button
            className={`nav-btn ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => navigate("dashboard")}
          >
            Lots
          </button>
          <button
            className="nav-btn primary"
            onClick={() => navigate("create")}
          >
            + Nouveau lot
          </button>
        </nav>
      </div>
    </header>
  );
}
