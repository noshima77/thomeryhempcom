import { useState } from "react";
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
      <div className="min-h-screen flex flex-col">
        <Header navigate={navigate} currentPage={page.name} />
        <main className="flex-1 max-w-[700px] w-full mx-auto px-4 pt-6 pb-10">
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
    <header className="bg-green-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-[700px] mx-auto flex items-center justify-between px-4 h-[60px]">
        <button className="flex items-center gap-2 text-white" onClick={() => navigate("dashboard")}>
          <span className="text-xl">🌿</span>
          <span className="font-serif text-lg font-extrabold tracking-tight">GrowTrack</span>
          <span className="text-[0.68rem] text-green-300 opacity-70 tracking-wide hidden sm:inline">Cherry Royale</span>
        </button>
        <nav className="flex gap-2 items-center">
          <button
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentPage === "dashboard" ? "text-white bg-white/15" : "text-white/75 hover:text-white hover:bg-white/10"
            }`}
            onClick={() => navigate("dashboard")}
          >
            Lots
          </button>
          <button
            className="px-3.5 py-1.5 rounded-full text-sm font-semibold bg-green-500 text-white hover:bg-green-300 transition-all"
            onClick={() => navigate("create")}
          >
            + Nouveau lot
          </button>
        </nav>
      </div>
    </header>
  );
}