import 'server-only';

import { httpFetch } from './httpFetch';

export const getSvgUrl = async (sourceUrl: string | null): Promise<string | null> => {
  if (sourceUrl === null || !sourceUrl.toLowerCase().endsWith('.svg')) {
    return sourceUrl;
  }

  const response = await httpFetch(sourceUrl);
  if (response === null) {
    return null;
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString('base64');

  return `data:image/svg+xml;base64,${base64String}`;
};
