import 'server-only';
import { AppConstants } from '@/lib/constants';

import type { Body } from './http';

export type HttpFetchOptions<TBody extends Body> = {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: TBody;
};

const useCache = !AppConstants.IS_DEV;

export const httpFetch = async <TBody extends Body>(url: string, options?: HttpFetchOptions<TBody>) => {
  const method = options?.method || 'GET';

  try {
    const { body, ...otherOptions } = options ?? {};

    const params: RequestInit = { ...otherOptions };

    if (body) {
      params.body = JSON.stringify(body);
    }

    return await fetch(url, {
      method,
      ...params,
      next: {
        revalidate: useCache ? 3600 : undefined,
      },
      headers: new Headers({
        ...(options?.headers || {}),
      }),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to fetch (${url}) - `, error);
    return null;
  }
};
