import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Priya Sharma",
    location: "Marketing Professional, Bandra",
    rating: 5,
    quote: "Found my dream flat in 2 days without paying any brokerage. Zenant is a lifesaver!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
  {
    name: "Ankit Mehta",
    location: "Software Engineer, Powai",
    rating: 5,
    quote: "Directly spoke to the owner — no middleman drama. Highly recommend.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit",
  },
  {
    name: "Sneha R.",
    location: "Content Creator, Andheri",
    rating: 4.5,
    quote: "Super responsive team on WhatsApp. Got multiple good options quickly.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
  },
  {
    name: "Rahul Verma",
    location: "Teacher, Worli",
    rating: 5,
    quote: "The entire process was so smooth. No hidden charges, no fake listings. Thank you Zenant!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
  },
];

export function Testimonials() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-heading-78 text-4xl md:text-5xl text-[#3B2F2F] text-center mb-4">
          What Our Users Say
        </h2>
        <p className="font-lora text-lg text-[#3B2F2F]/70 text-center mb-16 max-w-2xl mx-auto">
          Real Stories from Happy Tenants
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#FEF2E2] rounded-2xl p-6 border-2 border-[#A04E3C]/10 hover:border-[#A04E3C]/30 transition-all hover:shadow-lg relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-[#A04E3C]/20" />
              
              {/* Profile */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#A04E3C]/10 flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-[#3B2F2F]">
                    {testimonial.name}
                  </h3>
                  <p className="font-lora text-sm text-[#3B2F2F]/60">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(testimonial.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < testimonial.rating
                        ? "fill-yellow-400/50 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-lora text-[#3B2F2F]/80 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* WhatsApp Badge */}
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-lora text-[#3B2F2F]/60">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>via WhatsApp</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
