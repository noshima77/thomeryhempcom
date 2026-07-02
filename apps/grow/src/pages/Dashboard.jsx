import { useLotsContext } from "../context/LotsContext";
import LotCard from "../components/LotCard";
import LoginForm from "../components/LoginForm";
import StatusBadge from "../components/StatusBadge";
import { getDaysElapsed, getStageProgress } from "../utils/stageUtils";

export default function Dashboard({ navigate }) {
  const { lots, loading, error, isAuthenticated, isOnline } = useLotsContext();

  if (!isAuthenticated) return <LoginForm />;

  const activeLots = lots.filter(l => l.statut !== "terminé");
  const archivedLots = lots.filter(l => l.statut === "terminé");

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Tableau de bord</h1>
          <p className="page-sub">{activeLots.length} lot{activeLots.length > 1 ? "s" : ""} en cours</p>
        </div>
        <div className="status-indicators">
          <span className={`online-dot ${isOnline ? "online" : "offline"}`}>
            {isOnline ? "● En ligne" : "○ Hors ligne"}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning">
          ⚠️ Données depuis le cache local — {error}
        </div>
      )}

      {loading ? (
        <div className="loading-grid">
          {[1,2,3].map(i => <div key={i} className="card skeleton" />)}
        </div>
      ) : (
        <>
          {activeLots.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌱</div>
              <h3>Aucun lot actif</h3>
              <p>Commence par créer ton premier lot de culture</p>
              <button className="btn btn-primary" onClick={() => navigate("create")}>
                + Créer un lot
              </button>
            </div>
          ) : (
            <div className="lots-grid">
              {activeLots.map(lot => (
                <LotCard key={lot.id} lot={lot} onClick={() => navigate("lot", { id: lot.id })} />
              ))}
            </div>
          )}

          {archivedLots.length > 0 && (
            <section className="archived-section">
              <h2 className="section-title">Archives</h2>
              <div className="lots-grid lots-grid--small">
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
