"use client"

import React, {useCallback,  useRef, useEffect, useState} from "react"
import {Image} from "@/components/Image" // Still used for gallery, floor plans, etc.

import ImageSlideshow from "@/components/image-slideshow"
import LightboxGallery from "@/components/lightbox-gallery"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Building,
    BedDouble,
    Bath,
    Car,
    CheckCircle,
    BarChart,
    Menu,
    Home,
    Sparkles,
    LayoutGrid,
    CalendarDays,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type {TranslationKey} from "@/lib/i18n/types";

const heroImages = [
    {
        src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=1000&fit=crop&q=85",
        alt: "Modern Living Room with City View",
    },
    {
        src: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1600&h=1000&fit=crop&q=85",
        alt: "Bright and Spacious Bedroom",
    },
    {
        src: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=1600&h=1000&fit=crop&q=85",
        alt: "Sleek Modern Kitchen with Island",
    },
    {
        src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=1000&fit=crop&q=85",
        alt: "Exterior View of the Property",
    },
]

const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&q=80",
        alt: "Apartment Building Exterior",
    },
    {
        src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&q=80",
        alt: "Detailed Living Area",
    },
    {
        src: "https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1200&h=800&fit=crop&q=80",
        alt: "Modern Bathroom Fixtures",
    },
    {
        src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&h=800&fit=crop&q=80",
        alt: "Cozy Bedroom Setup",
    },
    {
        src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop&q=80",
        alt: "Alternate Bedroom View",
    },
    {
        src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&h=800&fit=crop&q=80",
        alt: "Stylish Interior Design Element",
    },
]

const floorPlanImages = [
    {
        src: "/placeholder.svg?width=1200&height=900&text=Main+Floor+Plan&bgColor=f0f0f0&textColor=333",
        alt: "floorPlanMainAlt",
    },
    {
        src: "/placeholder.svg?width=1200&height=900&text=Bedroom+Detail+Plan&bgColor=f0f0f0&textColor=333",
        alt: "floorPlanBedroomAlt",
    },
    {
        src: "/placeholder.svg?width=1200&height=900&text=Overall+Layout&bgColor=f0f0f0&textColor=333",
        alt: "floorPlanMainAlt",
    },
]

const useScrollAnimation = (options?: IntersectionObserverInit) => {
    const [element, setElement] = useState<HTMLElement | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const observer = useRef<IntersectionObserver | null>(null)
    useEffect(() => {
        if (element) {
            observer.current = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (observer.current) observer.current.unobserve(element)
                }
            }, options)
            observer.current.observe(element)
        }
        return () => {
            if (observer.current && element) observer.current.unobserve(element)
        }
    }, [element, options])
    return [setElement, isVisible] as const
}
type HomePagProps = {
    translations: Record<TranslationKey, string>;
};

export const HomePage: React.FC<HomePagProps> = ({translations}) => {
    const t = useCallback((key: TranslationKey) => translations[key] || key,[translations]);
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxImages, setLightboxImages] = useState<{ src: string; alt: string }[]>([])
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const openLightbox = (images: { src: string; alt: string }[], index: number) => {
        setLightboxImages(images.map((img) => ({ ...img, alt: t(img.alt as TranslationKey) || img.alt })))
        setSelectedImageIndex(index)
        setLightboxOpen(true)
    }
    const closeLightbox = () => setLightboxOpen(false)

    const descriptionRef = useRef<HTMLElement>(null)
    const specsRef = useRef<HTMLElement>(null)
    const galleryRef = useRef<HTMLElement>(null)
    const floorPlansRef = useRef<HTMLElement>(null)
    const locationRef = useRef<HTMLElement>(null)
    const contactRef = useRef<HTMLElement>(null)

    const navLinks = [
        { key: "navDescription" as TranslationKey, ref: descriptionRef, id: "description" },
        { key: "navSpecs" as TranslationKey, ref: specsRef, id: "specifications" },
        { key: "navGallery" as TranslationKey, ref: galleryRef, id: "gallery" },
        { key: "navFloorPlans" as TranslationKey, ref: floorPlansRef, id: "floor-plans" },
        { key: "navLocation" as TranslationKey, ref: locationRef, id: "location" },
        { key: "navContact" as TranslationKey, ref: contactRef, id: "contact" },
    ]

    const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    const changeLanguage = (lang: string) => {
        console.log('change', lang);
    }

    const [isSticky, setIsSticky] = useState(false)
    const headerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setIsSticky(!entry.isIntersecting), {
            rootMargin: "-1px 0px 0px 0px",
            threshold: [0.99],
        })
        const currentHeaderRef = headerRef.current
        if (currentHeaderRef) observer.observe(currentHeaderRef)
        return () => {
            if (currentHeaderRef) observer.unobserve(currentHeaderRef)
        }
    }, [])

    const [descTitleRef, descTitleVisible] = useScrollAnimation({ threshold: 0.3 })
    const [descCardRef, descCardVisible] = useScrollAnimation({ threshold: 0.2 })
    const [specsTitleRef, specsTitleVisible] = useScrollAnimation({ threshold: 0.3 })
    const [specsCardRef, specsCardVisible] = useScrollAnimation({ threshold: 0.2 })
    const [galleryTitleRef, galleryTitleVisible] = useScrollAnimation({ threshold: 0.3 })
    const [galleryGridRef, galleryGridVisible] = useScrollAnimation({ threshold: 0.1 })
    const [floorPlansTitleRef, floorPlansTitleVisible] = useScrollAnimation({ threshold: 0.3 })
    const [floorPlansGridRef, floorPlansGridVisible] = useScrollAnimation({ threshold: 0.1 })
    const [locationTitleRef, locationTitleVisible] = useScrollAnimation({ threshold: 0.3 })
    const [locationCardRef, locationCardVisible] = useScrollAnimation({ threshold: 0.2 })
    const [contactTitleRef, contactTitleVisible] = useScrollAnimation({ threshold: 0.3 })
    const [contactCardRef, contactCardVisible] = useScrollAnimation({ threshold: 0.2 })

    //const currentLanguage = getLocale();
    const currentLanguage = 'pt';
    const propertyAddress = t("locationAddress").split(": ")[1] || "Rua Cristovão pinho queimado n64, aveiro, portugal"
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(propertyAddress)}&hl=${currentLanguage.split("-")[0]}&z=15&ie=UTF8&iwloc=B&output=embed`

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
            <header
                ref={headerRef}
                className={`transition-all duration-300 ease-in-out ${
                    isSticky
                        ? "fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md shadow-lg"
                        : "relative bg-transparent" // Header is transparent when at top
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-2">
                            <Home
                                className={`h-7 w-7 transition-colors ${isSticky ? "text-primary" : "text-white md:text-primary"}`}
                            />
                            <span
                                className={`text-xl font-bold transition-colors ${isSticky ? "text-foreground" : "text-white md:text-foreground"}`}
                            >
                Mirador Business Center
              </span>
                        </div>
                        <nav className="hidden md:flex space-x-1 items-center">
                            {navLinks.map((link) => (
                                <Button
                                    key={link.key}
                                    variant="ghost"
                                    onClick={() => scrollToSection(link.ref)}
                                    className={`px-4 py-2 rounded-md transition-colors ${isSticky ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white md:text-foreground md:hover:text-primary"}`}
                                >
                                    {t(link.key)}
                                </Button>
                            ))}
                        </nav>
                        <div className="hidden md:flex items-center space-x-2">
                            <Button
                                variant={currentLanguage.startsWith("en") ? "default" : "outline"}
                                size="sm"
                                onClick={() => changeLanguage("en")}
                                className={`text-xs rounded-full transition-colors ${!isSticky && "border-white/50 text-white hover:bg-white/10 md:border-muted-foreground/30 md:text-foreground md:hover:bg-muted/50"}`}
                            >
                                EN
                            </Button>
                            <Button
                                variant={currentLanguage.startsWith("pt") ? "default" : "outline"}
                                size="sm"
                                onClick={() => changeLanguage("pt")}
                                className={`text-xs rounded-full transition-colors ${!isSticky && "border-white/50 text-white hover:bg-white/10 md:border-muted-foreground/30 md:text-foreground md:hover:bg-muted/50"}`}
                            >
                                PT
                            </Button>
                        </div>
                        <div className="md:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`transition-colors ${isSticky ? "text-foreground" : "text-white"}`}
                                    >
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card border-border shadow-xl">
                                    {navLinks.map((link) => (
                                        <DropdownMenuItem
                                            key={link.key}
                                            onClick={() => scrollToSection(link.ref)}
                                            className="hover:bg-muted focus:bg-muted"
                                        >
                                            {t(link.key)}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem onClick={() => changeLanguage("en")} className="hover:bg-muted focus:bg-muted">
                                        {t("langSwitchEN")} {currentLanguage.startsWith("en") && "✓"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => changeLanguage("pt")} className="hover:bg-muted focus:bg-muted">
                                        {t("langSwitchPT")} {currentLanguage.startsWith("pt") && "✓"}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>
            {isSticky && <div style={{ height: headerRef.current?.offsetHeight }} />}

            <main className="flex-grow">
                <section id="home" className="relative">
                    <ImageSlideshow images={heroImages} translations={translations} />
                </section>

                <section id="description" ref={descriptionRef} className="py-20 lg:py-28 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            ref={descTitleRef}
                            className={`text-center mb-16 transition-all duration-1000 ease-out ${descTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            <Sparkles className="h-10 w-10 text-accent mx-auto mb-4" />
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{t("descriptionTitle")}</h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                {t("descriptionBody").substring(0, 150)}...
                            </p>
                        </div>
                        <Card
                            ref={descCardRef}
                            className={`max-w-4xl mx-auto bg-card shadow-2xl overflow-hidden border-none rounded-xl transition-all duration-1000 ease-out delay-200 ${descCardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        >
                            <CardContent className="p-8 md:p-12">
                                <p className="text-lg text-card-foreground/90 leading-relaxed whitespace-pre-line">
                                    {t("descriptionBody")}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section id="specifications" ref={specsRef} className="py-20 lg:py-28 bg-secondary">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            ref={specsTitleRef}
                            className={`text-center mb-16 transition-all duration-1000 ease-out ${specsTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            <Building className="h-10 w-10 text-accent mx-auto mb-4" />
                            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-foreground mb-4">{t("specsTitle")}</h2>
                        </div>
                        <Card
                            ref={specsCardRef}
                            className={`max-w-4xl mx-auto bg-card shadow-2xl overflow-hidden border-none rounded-xl transition-all duration-1000 ease-out delay-200 ${specsCardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        >
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {[
                                        {
                                            icon: <MapPin className="w-6 h-6 text-primary" />,
                                            labelKey: "specsArea",
                                            valueKey: "specsValueArea",
                                        },
                                        {
                                            icon: <BedDouble className="w-6 h-6 text-primary" />,
                                            labelKey: "specsBedrooms",
                                            valueKey: "specsValueBedrooms",
                                        },
                                        {
                                            icon: <Bath className="w-6 h-6 text-primary" />,
                                            labelKey: "specsBathrooms",
                                            valueKey: "specsValueBathrooms",
                                        },
                                        {
                                            icon: <Car className="w-6 h-6 text-primary" />,
                                            labelKey: "specsParking",
                                            valueKey: "specsValueParking",
                                        },
                                        {
                                            icon: <Building className="w-6 h-6 text-primary" />,
                                            labelKey: "specsElevator",
                                            valueKey: "specsValueElevator",
                                        },
                                        {
                                            icon: <CheckCircle className="w-6 h-6 text-primary" />,
                                            labelKey: "specsCondition",
                                            valueKey: "specsValueCondition",
                                        },
                                        {
                                            icon: <BarChart className="w-6 h-6 text-primary" />,
                                            labelKey: "specsEnergyRating",
                                            valueKey: "specsValueEnergyRating",
                                        },
                                        {
                                            icon: <Home className="w-6 h-6 text-primary" />,
                                            labelKey: "specsFloor",
                                            valueKey: "specsValueFloor",
                                        },
                                    ].map((spec, index) => (
                                        <div
                                            key={spec.labelKey}
                                            className={`p-8 flex items-center space-x-4 ${index < 6 ? "border-b" : ""} ${index % 2 === 0 ? "md:border-r" : ""} border-border/70`}
                                        >
                                            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">{spec.icon}</div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                                    {t(spec.labelKey as TranslationKey)}
                                                </p>
                                                <p className="text-lg text-card-foreground font-semibold">
                                                    {t(spec.valueKey as TranslationKey)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-8 border-t border-border/70 bg-primary/5">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                                            <CheckCircle className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("specsFeatures")}
                                            </p>
                                            <p className="text-lg text-card-foreground font-semibold whitespace-pre-line">
                                                {t("specsValueFeatures")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section id="gallery" ref={galleryRef} className="py-20 lg:py-28 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            ref={galleryTitleRef}
                            className={`text-center mb-16 transition-all duration-1000 ease-out ${galleryTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            <Sparkles className="h-10 w-10 text-accent mx-auto mb-4" />
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{t("galleryTitle")}</h2>
                        </div>
                        <div
                            ref={galleryGridRef}
                            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 transition-all duration-1000 ease-out delay-200 ${galleryGridVisible ? "opacity-100" : "opacity-0"}`}
                        >
                            {galleryImages.map((image, index) => (
                                <div
                                    key={`gallery-${index}`}
                                    className={`aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer ${galleryGridVisible ? "animate-zoom-in" : "opacity-0"}`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    onClick={() => openLightbox(galleryImages, index)}
                                >
                                    <Image
                                        src={image.src || "/placeholder.svg"}
                                        alt={t(image.alt as TranslationKey) || image.alt}
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="floor-plans" ref={floorPlansRef} className="py-20 lg:py-28 bg-secondary">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            ref={floorPlansTitleRef}
                            className={`text-center mb-16 transition-all duration-1000 ease-out ${floorPlansTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            <LayoutGrid className="h-10 w-10 text-accent mx-auto mb-4" />
                            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-foreground mb-4">{t("floorPlansTitle")}</h2>
                        </div>
                        <div
                            ref={floorPlansGridRef}
                            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-1000 ease-out delay-200 ${floorPlansGridVisible ? "opacity-100" : "opacity-0"}`}
                        >
                            {floorPlanImages.map((image, index) => (
                                <Card
                                    key={`floorplan-${index}`}
                                    className={`bg-card overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border-none rounded-xl ${floorPlansGridVisible ? "animate-zoom-in" : "opacity-0"}`}
                                    style={{ animationDelay: `${index * 150}ms` }}
                                    onClick={() => openLightbox(floorPlanImages, index)}
                                >
                                    <div className="aspect-[4/3] relative bg-muted/30">
                                        <Image
                                            src={image.src || "/placeholder.svg"}
                                            alt={t(image.alt as TranslationKey)}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <p className="text-center py-4 bg-card-foreground/5 text-sm text-card-foreground/80 font-medium">
                                        {t(image.alt as TranslationKey)}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {lightboxOpen && (
                    <LightboxGallery images={lightboxImages} startIndex={selectedImageIndex} onClose={closeLightbox} />
                )}

                <section id="location" ref={locationRef} className="py-20 lg:py-28 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            ref={locationTitleRef}
                            className={`text-center mb-16 transition-all duration-1000 ease-out ${locationTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            <MapPin className="h-10 w-10 text-accent mx-auto mb-4" />
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{t("locationTitle")}</h2>
                        </div>
                        <Card
                            ref={locationCardRef}
                            className={`max-w-5xl mx-auto bg-card shadow-2xl overflow-hidden border-none rounded-xl transition-all duration-1000 ease-out delay-200 ${locationCardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        >
                            <div className="aspect-w-16 aspect-h-9 md:aspect-h-7 rounded-t-xl overflow-hidden">
                                <iframe
                                    src={mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={"Map showing property location in Aveiro"}
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                            <CardContent className="p-8 md:p-12 text-center">
                                <p className="text-xl text-card-foreground/90 mb-4 flex items-center justify-center">
                                    <MapPin className="inline-block w-6 h-6 mr-3 text-primary" />
                                    {propertyAddress}
                                </p>
                                <p className="text-md text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                                    {t("locationDescription")}
                                </p>
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-full px-8 py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    <a
                                        href={`https://www.google.com/maps?q=${encodeURIComponent(propertyAddress)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Globe className="mr-2 h-5 w-5" /> {t("locationViewMap")}
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section id="contact" ref={contactRef} className="py-20 lg:py-28 bg-secondary">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            ref={contactTitleRef}
                            className={`text-center mb-16 transition-all duration-1000 ease-out ${contactTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            <Mail className="h-10 w-10 text-accent mx-auto mb-4" />
                            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-foreground mb-4">{t("contactTitle")}</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("contactSubtitle")}</p>
                        </div>
                        <div
                            ref={contactCardRef}
                            className={`max-w-md mx-auto w-full transition-all duration-1000 ease-out delay-200 ${contactCardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        >
                            <h3 className="text-2xl font-semibold text-secondary-foreground text-center mb-6">
                                {t("contactOrCall")}
                            </h3>
                            <Card className="shadow-xl border-none rounded-xl bg-card">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full mt-1">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{t("contactTel")}</p>
                                            <a href="tel:+351123456789" className="text-lg text-primary font-semibold hover:underline">
                                                +351 123 456 789
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full mt-1">
                                            <Mail className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{t("contactEmailLabel")}</p>
                                            <a
                                                href="mailto:info@miradoraveiro.pt"
                                                className="text-lg text-primary font-semibold hover:underline"
                                            >
                                                info@miradoraveiro.pt
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full mt-1">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{t("locationAddress").split(": ")[0]}</p>
                                            <p className="text-lg text-card-foreground/90">{propertyAddress}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="mt-10 text-center">
                                <Button
                                    size="lg"
                                    className="rounded-full px-10 py-4 text-lg bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                                    asChild
                                >
                                    <a
                                        href={`mailto:info@miradoraveiro.pt?subject=${encodeURIComponent(t("contactScheduleVisit"))}%20for%20Mirador%20Residence&body=I%20would%20like%20to%20schedule%20a%20visit%20for%20the%20property%20at%20Mirador%20Business%20Center.%0D%0APlease%20let%20me%20know%20your%20availability.%0D%0A%0D%0AThank%20you,`}
                                    >
                                        <CalendarDays className="mr-3 h-6 w-6" />
                                        {t("contactScheduleVisit")}
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
};
