import { lazy } from 'react';
import { defineModule } from '@/core/types/module';

/**
 * Module manifest. The registry finds this file automatically.
 * Copy the folder, change `id`, `title`, `categoryId` (and `activityId`), done.
 */
export default defineModule({
  id: 'general-template',
  title: 'General Module Template',
  summary: 'Reference exercise with reps, timer, pause and summary. Copy it to build a new game.',
  categoryId: 'shoulder-mobility',
  status: 'template',
  requiresCamera: false,
  component: lazy(() => import('./GeneralTemplateModule')),
});
