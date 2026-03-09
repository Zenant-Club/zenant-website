interface Property {
  image: string;
  title: string;
  price: string;
}

const properties: Property[] = [
  {
    image: "https://images.unsplash.com/photo-1676818038224-263ff678a70c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwTXVtYmFpJTIwSW5kaWF8ZW58MXx8fHwxNzcwMzc1ODQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Spacious 2BHK in Bandra West",
    price: "₹45k",
  },
  {
    image: "https://images.unsplash.com/photo-1702014861449-202805baa272?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGlvJTIwYXBhcnRtZW50JTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzAzNzU4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Cozy 1RK in Andheri East",
    price: "₹18k",
  },
  {
    image: "https://images.unsplash.com/photo-1718066236079-9085195c389e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MDM3NTg0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Bright 1BHK in Powai",
    price: "₹28k",
  },
  {
    image: "https://images.unsplash.com/photo-1762320562033-d0a58fb2609f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYXBhcnRtZW50JTIwYmFsY29ueSUyMHZpZXd8ZW58MXx8fHwxNzcwMjkwNzkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Elegant 3BHK with Balcony View",
    price: "₹65k",
  },
  {
    image: "https://images.unsplash.com/photo-1501876725168-00c445821c9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcwMjgzNDUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Minimalist 1BHK in Lower Parel",
    price: "₹38k",
  },
  {
    image: "https://images.unsplash.com/photo-1761658644899-d1754c05c4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjaW91cyUyMGFwYXJ0bWVudCUyMGRpbmluZyUyMHJvb218ZW58MXx8fHwxNzcwMzc1ODQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Spacious 2BHK in Worli",
    price: "₹52k",
  },
];

export function PropertyShowcase() {
  return (
    <section className="py-20 lg:py-28 bg-[#FEF2E2]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-heading-78 text-4xl md:text-5xl text-[#3B2F2F] text-center mb-4">
          Properties Our Users Loved
        </h2>
        <p className="font-lora text-lg text-[#3B2F2F]/70 text-center mb-16 max-w-2xl mx-auto">
          Real homes, happy tenants
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((property, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-[#A04E3C]/30"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-lora text-lg text-[#3B2F2F] mb-1">
                  {property.title}
                </h3>
                <p className="font-heading text-xl text-[#A04E3C]">
                  {property.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
