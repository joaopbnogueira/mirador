import process from 'process';

const isDev = process.env.IS_DEV === 'true';

const runsOnServerSide = typeof window === 'undefined';

export const AppConstants = {
  APP_NAME_SUFFIX: 'app.nameSuffix',
  APP_DESCRIPTION: 'app.description',
  IS_DEV: isDev,
  IMAGE_LOADER: process.env.IMAGE_LOADER,
  PORT: process.env.PORT,
  SITE_URL: 'https://www.t3mirador.com',
  IS_PRODUCTION: process.env.IS_PRODUCTION === 'true',
} as const;
