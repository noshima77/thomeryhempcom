/**
 * Base d'aliments — extraite du plan alimentaire Hugo
 * Structure par portion de référence (quantité par défaut dans le plan)
 * Macros : kcal, proteines (g), glucides (g), lipides (g), fibres (g)
 *
 * Pour ajouter un aliment manuellement : même structure, id unique.
 */

export const ALIMENTS_DB = [
  // ─── PROTÉINES ────────────────────────────────────────────────
  { id: "poulet_emince",     nom: "Poulet émincé",          categorie: "protéines",   unite: "g",  ref: 150, kcal: 165, p: 31,  g: 0,   l: 3.5, f: 0   },
  { id: "oeuf_entier",       nom: "Œuf entier",             categorie: "protéines",   unite: "u",  ref: 2,   kcal: 140, p: 12,  g: 1,   l: 9.5, f: 0   },
  { id: "blanc_oeuf",        nom: "Blanc d'œuf",            categorie: "protéines",   unite: "u",  ref: 3,   kcal: 51,  p: 11,  g: 0.9, l: 0.2, f: 0   },
  { id: "thon_boite",        nom: "Thon en boîte (nat.)",   categorie: "protéines",   unite: "g",  ref: 120, kcal: 132, p: 28,  g: 0,   l: 1.5, f: 0   },
  { id: "sardine",           nom: "Sardines à l'huile",     categorie: "protéines",   unite: "g",  ref: 100, kcal: 208, p: 25,  g: 0,   l: 12,  f: 0   },
  { id: "boeuf_hache",       nom: "Bœuf haché 5%",          categorie: "protéines",   unite: "g",  ref: 130, kcal: 169, p: 28,  g: 0,   l: 6,   f: 0   },
  { id: "fromage_blanc",     nom: "Fromage blanc 0%",       categorie: "protéines",   unite: "g",  ref: 200, kcal: 74,  p: 14,  g: 5.4, l: 0.2, f: 0   },
  { id: "skyr",              nom: "Skyr nature",            categorie: "protéines",   unite: "g",  ref: 170, kcal: 100, p: 17,  g: 6,   l: 0.3, f: 0   },
  { id: "jambon_blanc",      nom: "Jambon blanc (2 tr.)",   categorie: "protéines",   unite: "g",  ref: 80,  kcal: 87,  p: 16,  g: 1,   l: 2,   f: 0   },
  { id: "saumon",            nom: "Saumon pavé",            categorie: "protéines",   unite: "g",  ref: 130, kcal: 260, p: 26,  g: 0,   l: 17,  f: 0   },
  { id: "proteines_whey",    nom: "Whey protéine (1 dose)", categorie: "protéines",   unite: "g",  ref: 30,  kcal: 114, p: 24,  g: 2,   l: 1.5, f: 0   },

  // ─── FÉCULENTS ────────────────────────────────────────────────
  { id: "riz_basmati",       nom: "Riz basmati cuit",       categorie: "féculents",   unite: "g",  ref: 200, kcal: 260, p: 5.4, g: 57,  l: 0.5, f: 1   },
  { id: "patate_douce",      nom: "Patate douce cuite",     categorie: "féculents",   unite: "g",  ref: 200, kcal: 180, p: 2.4, g: 42,  l: 0.2, f: 3.6 },
  { id: "flocons_avoine",    nom: "Flocons d'avoine",       categorie: "féculents",   unite: "g",  ref: 80,  kcal: 302, p: 10,  g: 53,  l: 5.5, f: 6.4 },
  { id: "pain_complet",      nom: "Pain complet (2 tr.)",   categorie: "féculents",   unite: "g",  ref: 70,  kcal: 168, p: 6,   g: 32,  l: 1.5, f: 3.5 },
  { id: "pates_completes",   nom: "Pâtes complètes cuites", categorie: "féculents",   unite: "g",  ref: 200, kcal: 282, p: 10,  g: 56,  l: 1.6, f: 4.8 },
  { id: "lentilles",         nom: "Lentilles cuites",       categorie: "féculents",   unite: "g",  ref: 150, kcal: 165, p: 12,  g: 28,  l: 0.8, f: 6   },
  { id: "pois_chiche",       nom: "Pois chiches cuits",     categorie: "féculents",   unite: "g",  ref: 150, kcal: 231, p: 12,  g: 38,  l: 3,   f: 7.5 },
  { id: "quinoa",            nom: "Quinoa cuit",            categorie: "féculents",   unite: "g",  ref: 180, kcal: 222, p: 8,   g: 40,  l: 3.5, f: 3.6 },
  { id: "banane",            nom: "Banane",                 categorie: "féculents",   unite: "u",  ref: 1,   kcal: 89,  p: 1.1, g: 23,  l: 0.3, f: 2.6 },

  // ─── LIPIDES ──────────────────────────────────────────────────
  { id: "huile_olive",       nom: "Huile d'olive",          categorie: "lipides",     unite: "cs", ref: 1,   kcal: 90,  p: 0,   g: 0,   l: 10,  f: 0   },
  { id: "avocat",            nom: "Avocat (½)",             categorie: "lipides",     unite: "u",  ref: 0.5, kcal: 120, p: 1.5, g: 4,   l: 11,  f: 5   },
  { id: "amandes",           nom: "Amandes",                categorie: "lipides",     unite: "g",  ref: 30,  kcal: 174, p: 6,   g: 5,   l: 15,  f: 3   },
  { id: "beurre_cacahuete",  nom: "Beurre de cacahuète",    categorie: "lipides",     unite: "cs", ref: 1,   kcal: 95,  p: 4,   g: 3,   l: 8,   f: 0.8 },
  { id: "graines_chia",      nom: "Graines de chia",        categorie: "lipides",     unite: "g",  ref: 20,  kcal: 97,  p: 3.3, g: 4,   l: 6,   f: 6.8 },
  { id: "noix",              nom: "Noix (4-5)",             categorie: "lipides",     unite: "g",  ref: 30,  kcal: 196, p: 4.6, g: 2.8, l: 19,  f: 2   },

  // ─── LÉGUMES ──────────────────────────────────────────────────
  { id: "brocoli",           nom: "Brocoli",                categorie: "légumes",     unite: "g",  ref: 150, kcal: 51,  p: 4,   g: 7,   l: 0.5, f: 3.8 },
  { id: "epinards",          nom: "Épinards cuits",         categorie: "légumes",     unite: "g",  ref: 150, kcal: 35,  p: 3.6, g: 3,   l: 0.5, f: 2.4 },
  { id: "courgette",         nom: "Courgette",              categorie: "légumes",     unite: "g",  ref: 150, kcal: 26,  p: 1.7, g: 4.3, l: 0.3, f: 1.4 },
  { id: "tomate",            nom: "Tomate",                 categorie: "légumes",     unite: "u",  ref: 1,   kcal: 22,  p: 1,   g: 4.8, l: 0.2, f: 1.5 },
  { id: "concombre",         nom: "Concombre",              categorie: "légumes",     unite: "g",  ref: 150, kcal: 23,  p: 1,   g: 4,   l: 0.2, f: 1   },
  { id: "poivron",           nom: "Poivron",                categorie: "légumes",     unite: "u",  ref: 1,   kcal: 31,  p: 1,   g: 6,   l: 0.3, f: 2.1 },
  { id: "haricots_verts",    nom: "Haricots verts",         categorie: "légumes",     unite: "g",  ref: 150, kcal: 38,  p: 2.4, g: 6.6, l: 0.3, f: 3   },
  { id: "chou_kale",         nom: "Kale / Chou frisé",      categorie: "légumes",     unite: "g",  ref: 80,  kcal: 41,  p: 2.9, g: 7,   l: 0.5, f: 2   },

  // ─── FRUITS ───────────────────────────────────────────────────
  { id: "pomme",             nom: "Pomme",                  categorie: "fruits",      unite: "u",  ref: 1,   kcal: 72,  p: 0.4, g: 19,  l: 0.2, f: 2.4 },
  { id: "fruits_rouges",     nom: "Fruits rouges",          categorie: "fruits",      unite: "g",  ref: 100, kcal: 50,  p: 1,   g: 11,  l: 0.3, f: 3   },
  { id: "kiwi",              nom: "Kiwi",                   categorie: "fruits",      unite: "u",  ref: 1,   kcal: 42,  p: 0.8, g: 10,  l: 0.4, f: 2.1 },
  { id: "orange",            nom: "Orange",                 categorie: "fruits",      unite: "u",  ref: 1,   kcal: 62,  p: 1.2, g: 15,  l: 0.2, f: 3.1 },

  // ─── LAITIERS / DIVERS ────────────────────────────────────────
  { id: "lait_vegetal",      nom: "Lait végétal non sucré", categorie: "divers",      unite: "ml", ref: 200, kcal: 30,  p: 0.4, g: 3,   l: 1.5, f: 0.5 },
  { id: "cafe",              nom: "Café noir",              categorie: "divers",      unite: "ml", ref: 250, kcal: 5,   p: 0.3, g: 0.5, l: 0,   f: 0   },
  { id: "miel",              nom: "Miel",                   categorie: "divers",      unite: "cc", ref: 1,   kcal: 21,  p: 0,   g: 5.7, l: 0,   f: 0   },
];

export const CATEGORIES = [...new Set(ALIMENTS_DB.map(a => a.categorie))];

export const OBJECTIFS = {
  kcal: 2350,
  p: 160,
  g: 280,
  l: 72,
  f: 30,
};

/** Calcule les macros pour une quantité donnée vs portion de référence */
export function calculMacros(aliment, quantite) {
  const ratio = quantite / aliment.ref;
  return {
    kcal: Math.round(aliment.kcal * ratio),
    p:    Math.round(aliment.p    * ratio * 10) / 10,
    g:    Math.round(aliment.g    * ratio * 10) / 10,
    l:    Math.round(aliment.l    * ratio * 10) / 10,
    f:    Math.round(aliment.f    * ratio * 10) / 10,
  };
}

/** Somme les macros d'un tableau de { aliment, quantite } */
export function sommeMacros(items) {
  return items.reduce(
    (acc, { aliment, quantite }) => {
      const m = calculMacros(aliment, quantite);
      return {
        kcal: acc.kcal + m.kcal,
        p:    Math.round((acc.p + m.p) * 10) / 10,
        g:    Math.round((acc.g + m.g) * 10) / 10,
        l:    Math.round((acc.l + m.l) * 10) / 10,
        f:    Math.round((acc.f + m.f) * 10) / 10,
      };
    },
    { kcal: 0, p: 0, g: 0, l: 0, f: 0 }
  );
}
