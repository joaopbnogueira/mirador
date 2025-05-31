import { isEmpty } from 'lodash';

import type { Metadata, ResolvingMetadata } from 'next';
import type { AlternateURLs, ResolvedAlternateURLs } from 'next/dist/lib/metadata/types/alternative-urls-types';
import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

import { AppConstants } from './constants';
import { DEFAULT_LOCALE } from './i18n/constants';
import type { Locale } from './i18n/types';

export type Alternate = { href: string; hrefLang: Locale };

type MetadataProps = {
  description: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  keywords?: string[];
  openGraphOverride?: OpenGraph;
  alternates?: Alternate[];
};

const generateAlternates = (
  alternates: Alternate[],
  parentAlternates: ResolvedAlternateURLs | null,
): AlternateURLs | null => {
  const base: AlternateURLs = {
    canonical: parentAlternates?.canonical,
    languages: parentAlternates?.languages ? { ...parentAlternates.languages } : {},
    media: parentAlternates?.media ? { ...parentAlternates.media } : undefined,
    types: parentAlternates?.types ? { ...parentAlternates.types } : undefined,
  };

  if (isEmpty(alternates)) {
    return base;
  }

  base.canonical = alternates.find((alternate) => alternate.hrefLang === DEFAULT_LOCALE)?.href;
  base.languages = alternates.reduce((acc, alternate) => {
    acc[alternate.hrefLang] = alternate.href;
    return acc;
  }, {} as Record<Locale, string>);

  base.languages['x-default'] = base.canonical;

  return base;
};

export const generatePageMetadata = async (
  { keywords, description, title, imageSrc, imageAlt, openGraphOverride, alternates }: MetadataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const parentMetadata = await parent;
  const titleWithFallback = title ? `${title} - ${AppConstants.APP_NAME}` : parentMetadata.title;
  const descriptionWithFallback = `${description}` || parentMetadata.description;
  const openGraph = {
    ...(parentMetadata.openGraph ?? ({} as any)),
    ...(openGraphOverride ?? ({} as any)),
    title: titleWithFallback,
    description: descriptionWithFallback,
  };
  const twitter = {
    ...(parentMetadata.twitter ?? ({} as any)),
    title: titleWithFallback,
    description: descriptionWithFallback,
  };
  if (imageSrc) {
    openGraph.images = [
      {
        url: imageSrc,
        alt: imageAlt,
      },
    ];
    twitter.images = [
      {
        url: imageSrc,
        alt: imageAlt,
      },
    ];
  }

  return {
    keywords: keywords || [],
    title: titleWithFallback,
    description: descriptionWithFallback,
    openGraph: openGraph,
    twitter: twitter,
    alternates: generateAlternates(alternates || [], parentMetadata.alternates),
  };
};
