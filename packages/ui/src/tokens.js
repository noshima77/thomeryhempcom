// Design tokens — thomeryhemp.com
// Direction : artisanal, premium, accessible (lisibilité seniors prioritaire)

export const colors = {
  // Verts naturels — chanvre, feuillage
  green: {
    50: '#f2f7f0',
    100: '#dfeadb',
    300: '#9cc491',
    500: '#5a8f4d',   // vert principal
    700: '#3c6634',
    900: '#213a1c',
  },
  // Terres / beiges — artisanal
  earth: {
    50: '#faf7f2',
    100: '#f0e8d9',
    300: '#d4c1a0',
    500: '#a9835a',
    700: '#7a5c3e',
    900: '#453425',
  },
  // Neutres
  neutral: {
    0: '#ffffff',
    50: '#f9f9f7',
    200: '#e5e3de',
    500: '#78766f',
    800: '#332f28',
    900: '#1a1712',
  },
  // États
  error: '#b3432c',
  success: '#4a7c3f',
  warning: '#c78a2e',
};

export const typography = {
  fontFamily: {
    sans: "'Inter', system-ui, sans-serif",
    serif: "'Fraunces', Georgia, serif", // touche artisanale sur les titres
  },
  // Base 18px minimum — accessibilité seniors
  fontSize: {
    sm: '1rem',      // 16px — jamais en dessous
    base: '1.125rem', // 18px — taille de base
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '2.75rem', // 44px — titres hero
  },
};

export const spacing = {
  touchTarget: '3rem', // 48px minimum — boutons/liens tactiles
};