import 'server-only';
import { isEmpty } from 'lodash';

export const getRoutePath = (dirname: string, params?: any): string => {
  // break path in parts and reverse walk until app dir is found and remove parts before app dir
  const routeParts = dirname.split('/').slice(dirname.split('/').lastIndexOf('app') + 1);
  // make sure to replace dynamic parts with actual values and ignore Next.js route groups
  const finalParts = routeParts
    .map((part) => {
      if (part.startsWith('(') && part.endsWith(')')) {
        return null;
      }
      if (part.startsWith('[') && part.endsWith(']')) {
        const param = part.slice(1, -1).replace('...', '');
        const paramValue = params ? params[param] : null;
        if (isEmpty(paramValue)) {
          throw new Error(`Missing param ${param} for route ${routeParts.join('/')}`);
        }
        return paramValue;
      }
      return part;
    })
    .filter(Boolean);
  return finalParts.join('/');
};
