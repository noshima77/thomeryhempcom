import PocketBase from 'pocketbase';

let pbInstance = null;

/**
 * Retourne l'instance PocketBase unique (singleton).
 * L'URL vient de la variable d'env VITE_POCKETBASE_URL de chaque app,
 * avec un fallback local pour le dev.
 */
export function getPocketBase() {
  if (!pbInstance) {
    const url =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_POCKETBASE_URL) ||
      'http://127.0.0.1:8090';
    pbInstance = new PocketBase(url);
  }
  return pbInstance;
}