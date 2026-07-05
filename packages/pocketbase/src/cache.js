import { getPocketBase } from './client.js';

/**
 * Récupère une liste avec repli automatique sur un cache localStorage.
 * En ligne : interroge PocketBase et rafraîchit le cache.
 * Hors ligne (ou erreur réseau) : retombe sur la dernière copie locale connue.
 */
export async function getListWithCache(collection, { filter, sort = '-created', cacheKey } = {}) {
  const key = cacheKey || `pb_cache_${collection}`;
  const pb = getPocketBase();
  try {
    const items = await pb.collection(collection).getFullList({ filter, sort });
    try { localStorage.setItem(key, JSON.stringify(items)); } catch {}
    return { items, fromCache: false };
  } catch (err) {
    const cached = localStorage.getItem(key);
    if (cached) {
      return { items: JSON.parse(cached), fromCache: true, error: err };
    }
    throw err;
  }
}