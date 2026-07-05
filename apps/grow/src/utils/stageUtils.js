export const STAGES = [
  { id: "germination",  label: "Germination",   icon: "🥚", progress: 2  },
  { id: "papier-humide",label: "Papier humide", icon: "💧", progress: 4 },
  { id: "godet",        label: "Godet",         icon: "🪴", progress: 15 },
  { id: "croissance",   label: "Croissance",    icon: "🌱", progress: 22 },
  { id: "Stretch",      label: "Stretch",       icon: "🌿", progress: 35 },
  { id: "pré-flo",      label: "Pré-floraison", icon: "🌿", progress: 50 },
  { id: "floraison",    label: "Floraison",     icon: "🌸", progress: 75 },
  { id: "maturation",   label: "Maturation",    icon: "🌾", progress: 88 },
  { id: "séchage",      label: "Séchage",       icon: "🍂", progress: 95 },
  { id: "terminé",      label: "Terminé",       icon: "✅", progress: 100 },
];

export function getDaysElapsed(dateStr) {
  if (!dateStr) return 0;
  const start = new Date(dateStr);
  const now = new Date();
  const diff = now - start;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function getStageProgress(statut) {
  const stage = STAGES.find(s => s.id === statut);
  return stage ? stage.progress : 0;
}

export function getNextStage(statut) {
  const idx = STAGES.findIndex(s => s.id === statut);
  if (idx === -1 || idx >= STAGES.length - 1) return null;
  return `${STAGES[idx + 1].icon} ${STAGES[idx + 1].label}`;
}
