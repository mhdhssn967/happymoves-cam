/** App-wide constants. Keep environment-specific values in `.env` (VITE_*). */
export const APP_NAME = 'Happy Moves Cam';
export const APP_TAGLINE = 'Camera-based rehabilitation module library';
export const APP_ORG = 'Oqulix Technologies';

export const ROUTES = {
  home: '/',
  section: (sectionId: string) => `/section/${sectionId}`,
  category: (sectionId: string, categoryId: string) => `/section/${sectionId}/${categoryId}`,
  module: (sectionId: string, categoryId: string, slug: string) =>
    `/section/${sectionId}/${categoryId}/${slug}`,
} as const;
