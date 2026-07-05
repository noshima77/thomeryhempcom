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

/**
 * Authentification superuser/admin PocketBase (ex-"admins", renommé _superusers depuis PB 0.23+).
 * Utilisé par les apps qui gèrent des données globales (ex: grow) plutôt que des comptes utilisateurs.
 */
export async function loginSuperuser(email, password) {
  const pb = getPocketBase();
  return pb.collection('_superusers').authWithPassword(email, password);
}