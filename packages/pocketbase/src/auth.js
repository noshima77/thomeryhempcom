import { getPocketBase } from './client.js';

export async function login(email, password) {
  const pb = getPocketBase();
  return pb.collection('users').authWithPassword(email, password);
}

export function logout() {
  const pb = getPocketBase();
  pb.authStore.clear();
}

export function isAuthenticated() {
  const pb = getPocketBase();
  return pb.authStore.isValid;
}

export function getCurrentUser() {
  const pb = getPocketBase();
  return pb.authStore.model;
}

/**
 * S'abonne aux changements d'état d'authentification (login/logout).
 * Retourne une fonction de désinscription à appeler au cleanup.
 */
export function onAuthChange(callback) {
  const pb = getPocketBase();
  return pb.authStore.onChange(callback, true);
}