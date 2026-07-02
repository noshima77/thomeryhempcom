import { createContext, useContext, useState, useEffect, useCallback } from "react";

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || "http://localhost:8090";
const LotsContext = createContext(null);

export function useLotsContext() {
  return useContext(LotsContext);
}

// Simple PocketBase API client
const pb = {
  async getList(collection, options = {}) {
    const params = new URLSearchParams({
      page: 1, perPage: 200, sort: "-created",
      ...(options.filter && { filter: options.filter }),
      ...(options.expand && { expand: options.expand }),
    });
    const res = await fetch(`${POCKETBASE_URL}/api/collections/${collection}/records?${params}`, {
      headers: await pb._authHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()).items;
  },
  async create(collection, data) {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${POCKETBASE_URL}/api/collections/${collection}/records`, {
      method: "POST",
      headers: isFormData ? await pb._authHeaders() : { "Content-Type": "application/json", ...(await pb._authHeaders()) },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async update(collection, id, data) {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${POCKETBASE_URL}/api/collections/${collection}/records/${id}`, {
      method: "PATCH",
      headers: isFormData ? await pb._authHeaders() : { "Content-Type": "application/json", ...(await pb._authHeaders()) },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async delete(collection, id) {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/${collection}/records/${id}`, {
      method: "DELETE",
      headers: await pb._authHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },
  async login(email, password) {
    const res = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: email, password }),
    });
    if (!res.ok) throw new Error("Identifiants invalides");
    const data = await res.json();
    localStorage.setItem("pb_token", data.token);
    return data;
  },
  logout() {
    localStorage.removeItem("pb_token");
  },
  async _authHeaders() {
    const token = localStorage.getItem("pb_token");
    return token ? { Authorization: token } : {};
  },
  fileUrl(record, filename) {
    return `${POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${filename}`;
  },
};

export function LotsProvider({ children }) {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("pb_token"));

  // Online/offline detection
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const loadLots = useCallback(async () => {
    setLoading(true);
    try {
      if (isOnline && isAuthenticated) {
        const data = await pb.getList("lots", { sort: "-created" });
        setLots(data);
        localStorage.setItem("lots_cache", JSON.stringify(data));
      } else {
        const cached = localStorage.getItem("lots_cache");
        if (cached) setLots(JSON.parse(cached));
      }
      setError(null);
    } catch (e) {
      const cached = localStorage.getItem("lots_cache");
      if (cached) setLots(JSON.parse(cached));
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isOnline, isAuthenticated]);

  useEffect(() => { loadLots(); }, [loadLots]);

  const login = async (email, password) => {
    await pb.login(email, password);
    setIsAuthenticated(true);
    await loadLots();
  };

  const logout = () => {
    pb.logout();
    setIsAuthenticated(false);
    setLots([]);
  };

  const createLot = async (data) => {
    const record = await pb.create("lots", data);
    setLots(prev => [record, ...prev]);
    return record;
  };

  const updateLot = async (id, data) => {
    const record = await pb.update("lots", id, data);
    setLots(prev => prev.map(l => l.id === id ? record : l));
    return record;
  };

  const deleteLot = async (id) => {
    await pb.delete("lots", id);
    setLots(prev => prev.filter(l => l.id !== id));
  };

  const getJournal = async (lotId) => {
    return pb.getList("journal_entries", { filter: `lot_id='${lotId}'`, sort: "-created" });
  };

  const addJournalEntry = async (lotId, contenu, type = "observation") => {
    return pb.create("journal_entries", { lot_id: lotId, contenu, type });
  };

  const deleteJournalEntry = async (id) => {
    return pb.delete("journal_entries", id);
  };

  const getPhotos = async (lotId) => {
    return pb.getList("photos", { filter: `lot_id='${lotId}'`, sort: "-created" });
  };

  const addPhoto = async (lotId, file, legende = "") => {
    const fd = new FormData();
    fd.append("lot_id", lotId);
    fd.append("fichier", file);
    fd.append("legende", legende);
    return pb.create("photos", fd);
  };

  const deletePhoto = async (id) => {
    return pb.delete("photos", id);
  };

  const getPhotoUrl = (record) => pb.fileUrl(record, record.fichier);

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
