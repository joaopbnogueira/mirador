import process from 'process';

const isDev = process.env.IS_DEV === 'true';

const runsOnServerSide = typeof window === 'undefined';

export const AppConstants = {
  APP_NAME: 'Mirador Business Center',
  APP_NAME_SUFFIX: 'app.nameSuffix',
  APP_DESCRIPTION: 'app.description',
  IS_DEV: isDev,
  IMAGE_LOADER: process.env.IMAGE_LOADER,
  PORT: process.env.PORT,
  SITE_URL: process.env.SITE_URL || '',
  IS_PRODUCTION: process.env.IS_PRODUCTION === 'true',
} as const;
