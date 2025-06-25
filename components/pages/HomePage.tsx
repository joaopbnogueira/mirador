"use client"

import React, {useCallback,  useRef, useEffect, useState} from "react"
import {Image} from "@/components/Image" // Still used for gallery, floor plans, etc.

import ImageSlideshow from "@/components/image-slideshow"
import {LightboxGallery} from "@/components/lightbox-gallery"
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
    CalendarDays,
    Euro,
    Archive,
    Video,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type {Locale, TranslationKey} from "@/lib/i18n/types";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";

const heroImages = [
    {
        src: "/media/side.webp",
        alt: "Exterior View of the Property",
    },
    {
        src: "/media/sala/sala_1.webp",
        alt: "Modern Living Room",
    },
    {
        src: "/media/sala/sala_2.webp",
        alt: "Modern Living Room",
    },
]

const galleryImages = [
    {
        src: "/media/sala/sala_1.webp",
        alt: "Detailed Living Area",
    },
    {
        src: "/media/sala/sala_2.webp",
        alt: "Detailed Living Area",
    },
    {
        src: "/media/sala/sala_3.webp",
        alt: "Detailed Living Area",
    },
    {
        src: "/media/suite/suite_1.webp",
        alt: "Main Suite Setup",
    },
    {
        src: "/media/suite/suite_2.webp",
        alt: "Main Suite Alternative View",
    },
    {
        src: "/media/wc suite/wc_suite_1.webp",
        alt: "Main Suite Bathroom Setup",
    },
    {
        src: "/media/wc suite/wc_suite_2.webp",
        alt: "Main Suite Bathroom Alternative View",
    },
    {
        src: "/media/quarto 1/quarto_1_1.webp",
        alt: "Cozy Bedroom Setup",
    },
    {
        src: "/media/quarto 1/quarto_1_2.webp",
        alt: "Cozy Bedroom Alternative View",
    },
    {
        src: "/media/quarto 2/quarto_2_1.webp",
        alt: "Second Bedroom View",
    },
    {
        src: "/media/quarto 2/quarto_2_2.webp",
        alt: "Second Bedroom Alternative View",
    },
    {
        src: "/media/varanda SE/varanda_se_1.webp",
        alt: "Southeast Balcony View",
    },
    {
        src: "/media/varanda SE/varanda_se_2.webp",
        alt: "Southeast Balcony Alternative View",
    },
    {
        src: "/media/varanda NO/varanda_no_1.webp",
        alt: "Northwest Balcony View",
    },
    {
        src: "/media/hall/ent_hall.webp",
        alt: "Entrance Hall",
    },
    {
        src: "/media/hall/dist_hall1.webp",
        alt: "Detailed Living Area",
    },
    {
        src: "/media/wc servico/wc_servico_1.webp",
        alt: "Service Bathroom",
    },
    {
        src: "/media/wc/wc_1.webp",
        alt: "Modern Bathroom",
    },
    {
        src: "/media/side.webp",
        alt: "Apartment Building Exterior",
    },
    {
        src: "/media/airview.webp",
        alt: "Apartment Building Air View",
    },
    {
        src: "/media/rear.webp",
        alt: "Apartment Building Rear View",
    },
    {
        src: "/media/planta.webp",
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
type HomePageProps = {
    translations: Record<TranslationKey, string>;
    currentLanguage: Locale
};

export const HomePage: React.FC<HomePageProps> = ({translations,currentLanguage}) => {
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
    const videoRef = useRef<HTMLElement>(null)
    const locationRef = useRef<HTMLElement>(null)
    const contactRef = useRef<HTMLElement>(null)

    const navLinks = [
        { key: "navDescription" as TranslationKey, ref: descriptionRef, id: "description" },
        { key: "navGallery" as TranslationKey, ref: galleryRef, id: "gallery" },
        { key: "navVideo" as TranslationKey, ref: videoRef, id: "video" },
        { key: "navSpecs" as TranslationKey, ref: specsRef, id: "specifications" },
        { key: "navLocation" as TranslationKey, ref: locationRef, id: "location" },
        { key: "navContact" as TranslationKey, ref: contactRef, id: "contact" },
    ]

    const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    const changeLanguage = useCallback((lang: string) => {
        // Get the current path
        const pathname = window.location.pathname;

        // Check if we're already on a locale route
        const pathParts = pathname.split('/').filter(Boolean);

        // If we're on the root path or a non-locale route, simply navigate to the new locale
        if (pathname === '/' || (pathParts[0] !== 'en' && pathParts[0] !== 'pt')) {
            window.location.href = `/${lang}/home`;
            return;
        }

        // If we're already on a locale route, replace the locale part
        const newPathname = '/' + [lang, ...pathParts.slice(1)].join('/');
        window.location.href = newPathname;
    },[]);

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
    const [videoTitleRef, videoTitleVisible] = useScrollAnimation({ threshold: 0.3 })
    const [videoCardRef, videoCardVisible] = useScrollAnimation({ threshold: 0.2 })
    const [locationTitleRef, locationTitleVisible] = useScrollAnimation({ threshold: 0.3 })
    const [locationCardRef, locationCardVisible] = useScrollAnimation({ threshold: 0.2 })
    const [contactTitleRef, contactTitleVisible] = useScrollAnimation({ threshold: 0.3 })
    const [contactCardRef, contactCardVisible] = useScrollAnimation({ threshold: 0.2 })

    const propertyAddress = t("locationAddress")
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
                T3 Mirador Aveiro
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

                <section id="description" ref={descriptionRef} className="py-16 lg:py-20 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            ref={descTitleRef}
                            className={`text-center mb-16 transition-all duration-1000 ease-out ${descTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{t("descriptionTitle")}</h2>
                        </div>
                        <Card
                            ref={descCardRef}
                            className={`max-w-4xl mx-auto bg-card shadow-2xl overflow-hidden border-none rounded-xl transition-all duration-1000 ease-out delay-200 ${descCardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        >
                            <CardContent className="p-8 md:p-12">
                                <p className="text-lg text-card-foreground/90 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: t("descriptionBody") }}>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section id="gallery" ref={galleryRef} className="bg-background">
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
                                        src={image.src}
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

                <section id="video" ref={videoRef} className="py-16 lg:py-20 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            ref={videoTitleRef}
                            className={`text-center mb-16 transition-all duration-1000 ease-out ${videoTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            <Video className="h-10 w-10 text-accent mx-auto mb-4" />
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{t("videoTitle")}</h2>
                        </div>
                        <Card
                            ref={videoCardRef}
                            className={`max-w-lg mx-auto bg-card shadow-2xl overflow-hidden border-none rounded-xl transition-all duration-1000 ease-out delay-200 ${videoCardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                            <div className="aspect-[9/16] w-full">
                                <iframe
                                    src="https://www.youtube.com/embed/NUOjbocwRa0?autoplay=1&mute=1"
                                    title="YouTube T3 Mirador Aveiro Video" frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen className="w-full h-full">
                                </iframe>
                            </div>
                        </Card>
                    </div>
                </section>

                <section id="specifications" ref={specsRef} className="py-16 lg:py-20 bg-secondary">
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
                                            icon: <Archive className="w-6 h-6 text-primary" />,
                                            labelKey: "specsStorage",
                                            valueKey: "specsValueStorage",
                                        },
                                        {
                                            icon: <Building className="w-6 h-6 text-primary" />,
                                            labelKey: "specsElevator",
                                            valueKey: "specsValueElevator",
                                        },
                                        {
                                            icon: <CalendarDays className="w-6 h-6 text-primary" />,
                                            labelKey: "specsYear",
                                            valueKey: "specsValueYear",
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
                                        {
                                            icon: <Euro className="w-6 h-6 text-primary" />,
                                            labelKey: "specsPrice" as TranslationKey,
                                            valueKey: "specsValuePrice" as TranslationKey,
                                        },
                                    ].map((spec, index) => (
                                        <div
                                            key={spec.labelKey}
                                            className={`p-8 flex items-center space-x-4 ${index < 8 ? "border-b" : ""} ${index % 2 === 0 ? "md:border-r" : ""} border-border/70`}
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

                {lightboxOpen && (
                    <LightboxGallery images={lightboxImages} startIndex={selectedImageIndex} onClose={closeLightbox} />
                )}

                <section id="location" ref={locationRef} className="py-16 lg:py-20 bg-background">
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

                <section id="contact" ref={contactRef} className="py-16 lg:py-20 bg-secondary">
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
                            <Card className="shadow-xl border-none rounded-xl bg-card">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full mt-1">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{t("contactTel")}</p>
                                            <a href="https://wa.me/351914109117" target="_blank" rel="noopener noreferrer" className="text-lg text-primary font-semibold hover:underline flex items-center">
                                                <WhatsappIcon className="w-5 h-5 mr-2" />
                                                +351 914 109 117
                                            </a>
                                            <a href="https://wa.me/351962924365" target="_blank" rel="noopener noreferrer" className="text-lg text-primary font-semibold hover:underline flex items-center mt-2">
                                                <WhatsappIcon className="w-5 h-5 mr-2" />
                                                +351 962 924 365
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
                                                href="mailto:info@t3mirador.com"
                                                className="text-lg text-primary font-semibold hover:underline"
                                            >
                                                info@t3mirador.com
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full mt-1">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
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
                                        href={`mailto:info@t3mirador.com?subject=${encodeURIComponent(t("contactMailSubject"))}&body=${encodeURIComponent(t("contactMailBody"))}`}
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
