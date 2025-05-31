"use client"
import { useEffect, useState } from "react"
import {Image} from "@/components/Image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageItem {
  src: string
  alt: string
}

interface LightboxGalleryProps {
  images: ImageItem[]
  startIndex: number
  onClose: () => void
}

export default function LightboxGallery({ images, startIndex, onClose }: LightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      } else if (event.key === "ArrowLeft") {
        goToPrevious()
      } else if (event.key === "ArrowRight") {
        goToNext()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose]) // goToPrevious and goToNext are stable if images is stable

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="relative bg-background dark:bg-neutral-900 p-4 rounded-lg shadow-2xl max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10 text-foreground hover:bg-muted"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="relative w-full h-full flex items-center justify-center max-w-[80vw] max-h-[calc(80vh-80px)] mb-4">
          {images[currentIndex] && (
            <Image
              src={images[currentIndex].src || "media/placeholder.svg"}
              alt={images[currentIndex].alt}
              width={1200} // Provide large enough base width
              height={800} // Provide large enough base height
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
              className="rounded"
              priority // Prioritize loading the visible image
            />
          )}
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-between w-full mt-auto px-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="bg-background/80 hover:bg-muted"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} / {images.length}
            </p>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="bg-background/80 hover:bg-muted"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
