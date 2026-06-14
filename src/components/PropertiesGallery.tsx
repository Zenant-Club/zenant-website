import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface Property {
  id: number;
  image: string;
  title: string;
  location: string;
  description: string;
}

export function PropertiesGallery() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch("/gallery/properties.json")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Failed to load properties:", err));
  }, []);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: true,
    dragFree: true,
    duration: 40,
  }, [ClassNames({ snapped: 'is-snapped' })]);

  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((api: any) => {
    setCanScrollNext(api.canScrollNext());
    setCanScrollPrev(api.canScrollPrev());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Re-initialize embla when properties load
  useEffect(() => {
    if (emblaApi && properties.length > 0) {
      emblaApi.reInit();
    }
  }, [emblaApi, properties]);

  return (
    <section className="zenant-propertiesGallery py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-10 lg:gap-12 items-start lg:items-stretch h-full">
        
        {/* Left Column: Static Info */}
        <div className="lg:w-[35%] flex flex-col pt-2 lg:pt-4 z-10">
          <h2 className="font-heading-78 text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] mb-6">
            A view of <br /> Zenant Living
          </h2>
          <p className="font-lora zenant-propertiesGallery__mutedText text-base leading-relaxed max-w-sm">
             Zenant Living is made up of diverse rental units of various sizes and layouts. The units are located in distinct buildings separated by a public square.
          </p>

          {/* Slide counter intentionally removed per request. */}
          <div className="hidden lg:block mt-auto" />
        </div>

        {/* Right Column: Gallery Carousel */}
        <div className="lg:w-[65%] w-full relative xl:mr-[-18vw] zenant-propertiesGallery__mediaColumn">
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="zenant-propertiesGallery__track">
              {properties.map((item) => (
                  <div 
                    key={item.id} 
                    className="zenant-propertiesGallery__slide relative transition-all duration-500"
                  >
                  {/* Image Container */}
                  <div 
                    className="relative zenant-propertiesGallery__media zenant-propertiesGallery__surface group overflow-hidden cursor-zoom-in"
                    onClick={() => setPreviewImage(item.image)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="zenant-propertiesGallery__image"
                    />
                    
                    {/* Dark Overlay for inactive slides */}
                    <div className="absolute inset-0 zenant-propertiesGallery__overlay" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="zenant-propertiesGallery__controls">
            <button 
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={clsx(
                "zenant-propertiesGallery__controlButton zenant-propertiesGallery__control"
              )}
              aria-label="Next property"
            >
              <ArrowRight className="zenant-propertiesGallery__controlIcon" strokeWidth={1.5} />
            </button>
            <button 
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={clsx(
                "zenant-propertiesGallery__controlButton zenant-propertiesGallery__control"
              )}
              aria-label="Previous property"
            >
              <ArrowLeft className="zenant-propertiesGallery__controlIcon" strokeWidth={1.5} />
            </button>
          </div>

        </div>
      </div>

      {/* Lightbox Preview Mode */}
      {previewImage && typeof document !== 'undefined' && createPortal(
        <div 
          className="zenant-lightbox-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="zenant-lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewImage(null);
            }}
            aria-label="Close preview"
          >
            <X size={40} strokeWidth={1.5} />
          </button>
          <img 
            src={previewImage} 
            alt="Preview" 
            className="zenant-lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </section>
  );
}
