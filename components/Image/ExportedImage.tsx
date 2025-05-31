'use client';

import { forwardRef, useMemo, useState } from 'react';

import type { ImageLoader, ImageProps, StaticImageData } from 'next/image';
import Image from 'next/image';

import { AppConstants } from '@/lib/constants';

import OptimizedLoader from './optimizedLoader';

class ImageLoaderFactory {
  public static create(fallback: boolean, src: string | StaticImageData): ImageLoader {
    const sourceUrl = typeof src === 'object' ? src.src : src;
    const isRemote = sourceUrl.startsWith('http');
    if (fallback || AppConstants.IS_DEV) {
      return (e) => {
        if (AppConstants.IS_DEV) {
          // This doesn't bother optimizing in the dev environment. Next complains if the
          // returned URL doesn't have a width in it, so adding it as a throwaway
          return `${sourceUrl}?width=${e.width}`;
        }
        // if the sourceUrl does not start with a slash, then we add one as long as it is not a remote image
        if (!isRemote && sourceUrl.charAt(0) !== '/') {
          return `/${sourceUrl}`;
        }
        return sourceUrl;
      };
    }
    return (e) => new OptimizedLoader(sourceUrl, e.width, isRemote).run();
  }
}

export interface ExportedImageProps extends Omit<ImageProps, 'src' | 'loader' | 'quality'> {
  src: string | StaticImageData;
  defaultPlaceholder: boolean | undefined;
}

const ExportedImage = forwardRef<HTMLImageElement | null, ExportedImageProps>(
  (
    {
      src,
      priority = false,
      loading,
      className,
      width,
      height,
      onLoad,
      unoptimized,
      placeholder = 'blur',
      blurDataURL,
      style,
      onError,
      defaultPlaceholder = false,
      alt = '',
      ...rest
    },
    ref,
  ) => {
    const [imageError, setImageError] = useState(false);
    const loader = useMemo(
      () => ImageLoaderFactory.create(imageError || unoptimized === true, src),
      [imageError, src, unoptimized],
    );
    const automaticallyCalculatedBlurDataURL = useMemo(() => {
      if (blurDataURL) {
        // use the user provided blurDataURL if present
        return blurDataURL;
      }

      const isStaticImage = typeof src === 'object';
      if (isStaticImage && src.blurDataURL) {
        return src.blurDataURL;
      }

      const sourceUrl = isStaticImage ? src.src : src;
      if (unoptimized === true || defaultPlaceholder) {
        // return the src image when unoptimized
        return sourceUrl;
      }

      return loader({ src: sourceUrl, width: 16 });
    }, [blurDataURL, defaultPlaceholder, loader, src, unoptimized]);

    // check if the src is an SVG image -> then we should not use the blurDataURL and use unoptimized
    const isSVG = typeof src === 'object' ? src.src.endsWith('.svg') : src.endsWith('.svg');

    const [blurComplete, setBlurComplete] = useState(false);

    // Currently, we have to handle the blurDataURL ourselves as the new Image component
    // is expecting a base64 encoded string, but the generated blurDataURL is a normal URL
    const blurStyle =
      placeholder === 'blur' &&
      !isSVG &&
      automaticallyCalculatedBlurDataURL &&
      automaticallyCalculatedBlurDataURL.startsWith('/') &&
      !blurComplete
        ? {
            backgroundSize: style?.objectFit || 'cover',
            backgroundPosition: style?.objectPosition || '50% 50%',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${automaticallyCalculatedBlurDataURL})`,
            filter: 'url(#sharpBlur)',
          }
        : undefined;

    const ImageElement = (
      <Image
        ref={ref}
        alt={alt}
        {...rest}
        {...(width && { width })}
        {...(height && { height })}
        {...(loading && { loading })}
        {...(className && { className })}
        {...(onLoad && { onLoad })}
        // if the blurStyle is not "empty", then we take care of the blur behavior ourselves
        // if the blur is complete, we also set the placeholder to empty as it otherwise shows
        // the background image on transparent images
        {...(placeholder && {
          placeholder: blurStyle || blurComplete ? 'empty' : placeholder,
        })}
        {...(unoptimized && { unoptimized })}
        {...(priority && { priority })}
        style={{ ...style, ...blurStyle }}
        loader={loader}
        blurDataURL={automaticallyCalculatedBlurDataURL}
        onError={(error) => {
          setImageError(true);
          setBlurComplete(true);
          // execute the onError function if provided
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          onError && onError(error);
        }}
        onLoad={(result) => {
          // for some configurations, the onError handler is not called on an error occurrence
          // we need to check if the image is loaded correctly
          if (result.currentTarget.naturalWidth === 0) {
            // Broken image, fall back to unoptimized (meaning the original image src)
            setImageError(true);
          }
          setBlurComplete(true);

          // execute the onLoadingComplete callback if present
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          onLoad && onLoad(result);
        }}
        src={src}
      />
    );

    // When we present a placeholder, we add a svg filter to the image and remove it after either
    // the image is loaded or an error occurred
    return blurStyle ? (
      <>
        {/* In case javascript is disabled, we show a fallback without blurry placeholder */}
        <noscript>
          <Image
            {...rest}
            {...(width && { width })}
            {...(height && { height })}
            {...(loading && { loading })}
            {...(className && { className })}
            placeholder="empty"
            {...(unoptimized && { unoptimized })}
            {...(priority && { priority })}
            alt={alt}
            style={style}
            loader={loader}
            src={src}
          />
        </noscript>
        {ImageElement}
        <svg
          style={{
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 0,
            margin: '-1px',
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            width: '1px',
          }}
        >
          <filter id="sharpBlur">
            <feGaussianBlur stdDeviation="20" colorInterpolationFilters="sRGB" />
            <feColorMatrix
              type="matrix"
              colorInterpolationFilters="sRGB"
              values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 9 0"
            />

            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </svg>
      </>
    ) : (
      ImageElement
    );
  },
);

ExportedImage.displayName = 'ExportedImage';

export default ExportedImage;
