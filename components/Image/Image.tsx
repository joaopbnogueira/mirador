// https://nextjs.org/docs/api-reference/next/image
import {CSSProperties, forwardRef} from 'react';

import NextImage from 'next/image';

import { AppConstants } from '@/lib/constants';

import type { ExportedImageProps } from './ExportedImage';
import ExportedImage from './ExportedImage';

export type ImageProps = {
  className?: string;
  src: ExportedImageProps['src'];
  alt: ExportedImageProps['alt'];
  width?: ExportedImageProps['width'];
  height?: ExportedImageProps['height'];
  priority?: ExportedImageProps['priority'];
  loading?: ExportedImageProps['loading'];
  onClick?: ExportedImageProps['onClick'];
  defaultPlaceholder?: ExportedImageProps['defaultPlaceholder'];
  placeholder?: ExportedImageProps['placeholder'];
  blurDataURL?: ExportedImageProps['blurDataURL'];
  fill?: ExportedImageProps['fill'];
  hidden?: boolean;
};

const isDefaultLoaderEnabled = AppConstants.IMAGE_LOADER === 'default';

const dummyLoader = () => {
  return '';
};

const shouldOptimize = (src: ExportedImageProps['src']): boolean | null => {
  let result: boolean | null;
  try {
    const sourceUrl = typeof src === 'string' ? src : src.src;
    if (sourceUrl.startsWith('data:')) {
      result = false;
    } else if (sourceUrl.startsWith('http')) {
      result = true;
    } else {
      result = !sourceUrl.endsWith('.svg');
    }
  } catch (e) {
    console.error(e, src);
    result = null;
  }
  if (result === null) {
    return result;
  }
  return isDefaultLoaderEnabled ? false : result;
};

type ExtraProps = {
    style?: CSSProperties | undefined;
}

type ImageOverridProps = ImageProps & ExtraProps

export const Image = forwardRef<HTMLImageElement | null, ImageOverridProps>(
  (
    {
      src,
      alt,
      width,
      height,
      priority,
      loading,
      className,
      onClick,
      defaultPlaceholder,
      placeholder,
      blurDataURL,
      fill,
      hidden,
        style,
    }: ImageOverridProps,
    ref,
  ) => {
    const shouldOptimizeImage = shouldOptimize(src);

    if (shouldOptimizeImage === null) {
      return <div />;
    }

    return shouldOptimizeImage ? (
      <ExportedImage
        style={{ display: hidden ? 'none' : 'block', ...(style||{}) }}
        className={className}
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={loading}
        onClick={onClick}
        defaultPlaceholder={defaultPlaceholder}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        fill={fill}
        ref={ref}
      />
    ) : (
      <NextImage
        style={{ display: hidden ? 'none' : 'block' , ...(style||{})}}
        unoptimized
        loader={isDefaultLoaderEnabled ? undefined : dummyLoader}
        className={className}
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={loading}
        onClick={onClick}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        fill={fill}
        ref={ref}
      />
    );
  },
);

Image.displayName = 'Image';
