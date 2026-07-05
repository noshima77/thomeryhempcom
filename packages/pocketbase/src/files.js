import { getPocketBase } from './client.js';

/**
 * Génère l'URL publique d'un fichier attaché à un enregistrement PocketBase.
 */
export function getFileUrl(record, filename, queryParams = {}) {
  const pb = getPocketBase();
  return pb.files.getURL(record, filename, queryParams);
}