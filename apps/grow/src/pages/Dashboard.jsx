import { useLotsContext } from "../context/LotsContext";
import LotCard from "../components/LotCard";
import LoginForm from "../components/LoginForm";

export default function Dashboard({ navigate }) {
  const { lots, loading, error, isAuthenticated, isOnline } = useLotsContext();

  if (!isAuthenticated) return <LoginForm />;

  const activeLots = lots.filter(l => l.statut !== "terminé");
  const archivedLots = lots.filter(l => l.statut === "terminé");

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-green-900 tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {activeLots.length} lot{activeLots.length > 1 ? "s" : ""} en cours
          </p>
        </div>
        <span className={`text-xs font-medium ${isOnline ? "text-green-500" : "text-neutral-500"}`}>
          {isOnline ? "● En ligne" : "○ Hors ligne"}
        </span>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3.5 py-3 text-sm mb-4">
          ⚠️ Données depuis le cache local — {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl h-[140px] skeleton-shimmer" />
          ))}
        </div>
      ) : (
        <>
          {activeLots.length === 0 ? (
            <div className="text-center py-16 px-5 bg-neutral-0 border-[1.5px] border-dashed border-neutral-200 rounded-2xl">
              <div className="text-5xl mb-3">🌱</div>
              <h3 className="font-serif text-lg font-bold mb-1.5">Aucun lot actif</h3>
              <p className="text-neutral-500 text-sm mb-5">Commence par créer ton premier lot de culture</p>
              <button
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-300 transition-all"
                onClick={() => navigate("create")}
              >
                + Créer un lot
              </button>
            </div>
          ) : (
            <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {activeLots.map(lot => (
                <LotCard key={lot.id} lot={lot} onClick={() => navigate("lot", { id: lot.id })} />
              ))}
            </div>
          )}

          {archivedLots.length > 0 && (
            <section className="mt-8">
              <h2 className="font-serif text-base font-bold text-neutral-500 mb-3.5">Archives</h2>
              <div className="grid gap-3.5 opacity-70" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                {archivedLots.map(lot => (
                  <LotCard key={lot.id} lot={lot} onClick={() => navigate("lot", { id: lot.id })} archived />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}