import { useEffect } from 'react';
import { APP_NAME } from '@/core/config/app';

/** Sets the browser tab title; helps screen-reader users and history navigation. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);
}
