import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface Property {
  id: number;
  image: string;
  title: string;
  location: string;
  description: string;
}

const properties: Property[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "The Bandra Loft",
    location: "Bandra West",
    description: "You'll feel right at home with 10-foot ceilings and state-of-the-art materials.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "Andheri Solace",
    location: "Andheri East",
    description: "A bright, airy space designed for modern living in the heart of the suburbs.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "Powai Green View",
    location: "Powai",
    description: "Surrounded by nature, this apartment offers a peaceful retreat from the city noise.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "Juhu Sea Breeze",
    location: "Juhu Tara",
    description: "Luxury living with an ocean view, featuring premium finishes and spacious balconies.",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "Parel Minimalist",
    location: "Lower Parel",
    description: "Clean lines and open spaces define this modern minimalist apartment.",
  },
];

export function PropertiesGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: false,
    duration: 40,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((api: any) => {
    setSelectedIndex(api.selectedScrollSnap());
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
        <div className="lg:w-[65%] w-full relative lg:mr-[-12vw] xl:mr-[-18vw] zenant-propertiesGallery__mediaColumn">
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="zenant-propertiesGallery__track">
              {properties.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={clsx(
                      "zenant-propertiesGallery__slide relative transition-all duration-500",
                    )}
                  >
                  {/* Image Container */}
                  <div className="relative zenant-propertiesGallery__media zenant-propertiesGallery__surface group overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className={clsx(
                        "zenant-propertiesGallery__image",
                        index === selectedIndex
                          ? "zenant-propertiesGallery__image--active"
                          : "zenant-propertiesGallery__image--inactive",
                      )}
                    />
                    
                    {/* Dark Overlay for inactive slides */}
                    <div
                      className={clsx(
                        "absolute inset-0 zenant-propertiesGallery__overlay",
                        index === selectedIndex
                          ? "zenant-propertiesGallery__overlay--active"
                          : "zenant-propertiesGallery__overlay--inactive",
                      )}
                    />

                    <div
                      className={clsx(
                        "zenant-propertiesGallery__caption",
                        index === selectedIndex
                          ? "zenant-propertiesGallery__caption--active"
                          : "zenant-propertiesGallery__caption--inactive",
                      )}
                    >
                      <h3 className="font-lora text-base md:text-lg">
                        {item.title} | {item.location}
                      </h3>
                      <p className="font-lora zenant-propertiesGallery__mutedText text-sm leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </div>
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
    </section>
  );
}
