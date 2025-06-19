"use client"
import { useCallback, useEffect, useState } from "react"
import {Image as NextImage} from "@/components/Image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageItem {
  src: string;
  alt: string;
  title?: string;
}

interface LightboxGalleryProps {
  images: ImageItem[];
  startIndex?: number;
  onClose: () => void;
  autoplay?: boolean;
  autoplayDelay?: number;
}

export const LightboxGallery: React.FC<LightboxGalleryProps> = ({
                                                           images,
                                                           startIndex = 0,
                                                           onClose,
                                                           autoplay = false,
                                                           autoplayDelay = 5000
                                                         }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Navigation ---
  const goToPrevious = useCallback(() => {
    setIsLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setIsLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  // --- Effects ---

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") goToPrevious();
      else if (event.key === "ArrowRight") goToNext();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goToPrevious, goToNext]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && images.length > 1) {
      const timer = setTimeout(goToNext, autoplayDelay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoplay, autoplayDelay, goToNext, images.length]);

  // Smart image preloading
  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentIndex + 1) % images.length;
      const prevIndex = (currentIndex - 1 + images.length) % images.length;

      const nextImg = new Image();
      nextImg.src = images[nextIndex].src;

      const prevImg = new Image();
      prevImg.src = images[prevIndex].src;
    }
  }, [currentIndex, images]);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
      <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
      >
        <div
            className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-2xl w-[95vw] h-[95vh] max-w-7xl max-h-[1200px] flex flex-col p-4"
            onClick={(e) => e.stopPropagation()}
        >
          {/* Header: Title and Close Button */}
          <header className="flex-shrink-0 flex items-center justify-between pb-3">
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {currentImage?.title || ''}
            </div>
            <button
                onClick={onClose}
                className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
          </header>

          {/* Image Display Area */}
          <div className="relative flex-grow flex items-center justify-center overflow-hidden">
            {currentImage && (
                <NextImage
                    key={currentImage.src}
                    src={currentImage.src}
                    alt={currentImage.alt}
                    width={1200} // Provide large enough base width
                    height={800} // Provide large enough base height
                    className="transition-opacity duration-500 ease-in-out rounded-md"
                    style={{
                      opacity: isLoaded ? 1 : 0,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    onLoad={() => setIsLoaded(true)}
                    priority // Prioritize loading the visible image
                />
            )}
            {/* Loading Spinner */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}
          </div>

          {/* Footer: Controls and Counter */}
          {images.length > 1 && (
              <footer className="flex-shrink-0 flex items-center justify-between pt-3">
                <button
                    onClick={goToPrevious}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200"
                    aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentIndex + 1} / {images.length}
                </p>
                <button
                    onClick={goToNext}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200"
                    aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </footer>
          )}
        </div>
      </div>
  );
}
