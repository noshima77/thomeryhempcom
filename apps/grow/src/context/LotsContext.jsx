import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getPocketBase,
  loginSuperuser,
  logout as pbLogout,
  isAuthenticated as pbIsAuthenticated,
  onAuthChange,
  getListWithCache,
  useOnlineStatus,
  getFileUrl,
} from "@thomeryhemp/pocketbase";

const LotsContext = createContext(null);

export function useLotsContext() {
  return useContext(LotsContext);
}

export function LotsProvider({ children }) {
  const pb = getPocketBase();
  const isOnline = useOnlineStatus();

  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(pbIsAuthenticated());

  // Reste synchronisé si le token expire ou change ailleurs
  useEffect(() => {
    return onAuthChange(() => setIsAuthenticated(pbIsAuthenticated()));
  }, []);

  const loadLots = useCallback(async () => {
    if (!isAuthenticated) {
      setLots([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { items, fromCache, error: cacheErr } = await getListWithCache("lots", {
        sort: "-created",
        cacheKey: "grow_lots_cache",
      });
      setLots(items);
      setError(fromCache ? (cacheErr?.message || "Hors ligne — données en cache") : null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { loadLots(); }, [loadLots]);

  const login = async (email, password) => {
    await loginSuperuser(email, password);
    setIsAuthenticated(true);
  };

  const logout = () => {
    pbLogout();
    setIsAuthenticated(false);
    setLots([]);
  };

  const createLot = async (data) => {
    const record = await pb.collection("lots").create(data);
    setLots(prev => [record, ...prev]);
    return record;
  };

  const updateLot = async (id, data) => {
    const record = await pb.collection("lots").update(id, data);
    setLots(prev => prev.map(l => l.id === id ? record : l));
    return record;
  };

  const deleteLot = async (id) => {
    await pb.collection("lots").delete(id);
    setLots(prev => prev.filter(l => l.id !== id));
  };

  const getJournal = (lotId) =>
    pb.collection("journal_entries").getFullList({ filter: `lot_id="${lotId}"`, sort: "-created" });

  const addJournalEntry = (lotId, contenu, type = "observation") =>
    pb.collection("journal_entries").create({ lot_id: lotId, contenu, type });

  const deleteJournalEntry = (id) =>
    pb.collection("journal_entries").delete(id);

  const getPhotos = (lotId) =>
    pb.collection("photos").getFullList({ filter: `lot_id="${lotId}"`, sort: "-created" });

  const addPhoto = (lotId, photos, legende = "") => {
    const fd = new FormData();
    fd.append("lot_id", lotId);
    fd.append("photos", photos);
    fd.append("legende", legende);
    return pb.collection("photos").create(fd);
  };

  const deletePhoto = (id) => pb.collection("photos").delete(id);

  const getPhotoUrl = (record) => getFileUrl(record, record.photos);

  return (
    <LotsContext.Provider value={{
      lots, loading, error, isOnline, isAuthenticated,
      login, logout, loadLots,
      createLot, updateLot, deleteLot,
      getJournal, addJournalEntry, deleteJournalEntry,
      getPhotos, addPhoto, deletePhoto, getPhotoUrl,
    }}>
      {children}
    </LotsContext.Provider>
  );
}