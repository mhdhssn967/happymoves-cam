import type { RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { SectionPage } from '@/pages/SectionPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ModulePage } from '@/pages/ModulePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Route table. Routes are fixed: new categories and modules come from the
 * catalog and the module registry, so this file rarely changes.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'section/:sectionId', element: <SectionPage /> },
      { path: 'section/:sectionId/:categoryId', element: <CategoryPage /> },
      { path: 'section/:sectionId/:categoryId/:moduleSlug', element: <ModulePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
