"use client"

import React, { useCallback, useState, useEffect } from "react"
import {Image} from "@/components/Image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type {TranslationKey} from "@/lib/i18n/types";

interface Slide {
  src: string
  alt: string
}

interface ImageSlideshowProps {
  images: Slide[]
  translations: Record<TranslationKey, string>;
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images, translations }) => {
  const t = useCallback((key: TranslationKey) => translations[key] || key,[translations]);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  },[currentIndex, images.length])

  useEffect(() => {
    if (images.length <= 1) return // Don't auto-slide if only one image or no images
    const timer = setTimeout(() => {
      goToNext()
    }, 7000) // Slower slide transition
    return () => clearTimeout(timer)
  }, [currentIndex, images.length, goToNext])

  // reset loaded state on slide change
  useEffect(() => {
    setImageLoaded(false)
  }, [currentIndex])

  // Preload all images to avoid flickering during slide transitions
  useEffect(() => {
    images.forEach(({ src }) => {
      const img = new window.Image()
      img.src = src
    })
  }, [images])

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[70vh] md:h-[85vh] bg-muted flex items-center justify-center text-muted-foreground">
        {t("noImagesToDisplay")}
      </div>
    )
  }

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden group bg-neutral-800">
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}
      >
        <Image
          src={images[currentIndex].src}
          alt={t(images[currentIndex].alt as any) || images[currentIndex].alt}
          fill // Use fill instead of layout="fill"
          priority // always eager load slides
          loading="eager"
          className="transition-transform duration-1000 ease-in-out group-hover:scale-105" // Subtle zoom on hover
          style={{ objectFit: "cover" }} // Ensure image preserves aspect ratio while filling available space
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end text-center p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-xl animate-fade-in-up">
          {t("heroTitle")}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg animate-fade-in-up animation-delay-300">
          {t("heroSubtitle")}
        </p>
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-600"
          onClick={() => {
            const descriptionSection = document.getElementById("description")
            if (descriptionSection) {
              descriptionSection.scrollIntoView({ behavior: "smooth" })
            }
          }}
        >
          {t("heroViewDetails")}
        </Button>
      </div>
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border-none"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border-none"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7" />
          </Button>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={`${images[index].src}-${index}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={"Go to slide " + (index + 1)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Helper for animation delays in globals.css or a style tag if needed, or use Tailwind JIT
// For simplicity, I'll add a few utility classes here if not already in your setup
// Add to globals.css:
// .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
// .animation-delay-300 { animation-delay: 0.3s; }
// .animation-delay-600 { animation-delay: 0.6s; }

export default ImageSlideshow
