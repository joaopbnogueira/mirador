import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === "development";

// Note: these are going to be injected into the client side as well, so don't put any server secrets here
const envVars = {
  IS_DEV: isDev.toString(),
  IMAGE_LOADER: isDev ? "default": "custom",
  IS_PRODUCTION: (!!process.env.IS_PRODUCTION || false).toString(),
  SITE_URL: process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://www.t3mirador.com',
};

/** @type {import("next").NextConfig} */
const nextConfig = {
  distDir: "build",
  output: "export",
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  staticPageGenerationTimeout: 600, // needed because we optimize images during generation
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    loader: envVars.IMAGE_LOADER,
    dangerouslyAllowSVG: true,
    // smaller than the smallest device size - for small images two layouts: fixed and instrisic.
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // same as tailwind breakpoints - for large images and two layouts: fill and responsive
    deviceSizes: [380, 460, 640, 800, 980, 1140, 1280, 1500, 1920]
  },
  env: {
    ...envVars
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compiler: {
    removeConsole: isDev ? false : {
      exclude: ['error'],
    },
  },
};

const withNextIntl = createNextIntlPlugin(__dirname+'/lib/i18n/i18n.tsx');

export default withNextIntl(nextConfig);
