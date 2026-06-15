const reviewImages = [
  "/reviews/dev.png",
  "/reviews/ilakiya.png",
  "/reviews/saurav.png",
  "/reviews/shivani.png"
];

export function Testimonials() {
  return (
    <section id="about" className="py-12 lg:py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-heading-78 text-4xl md:text-5xl text-[#3B2F2F] text-center mb-4">
          What Our Users Say
        </h2>
        <p className="font-lora text-lg text-[#3B2F2F]/70 text-center mb-8 max-w-2xl mx-auto">
          Real Stories from Happy Tenants
        </p>

        <div className="testimonials-grid gap-4 lg:gap-6 px-4 lg:px-0">
          {reviewImages.map((img, index) => (
            <div
              key={index}
              className="w-full transition-all hover:-translate-y-1 rounded-3xl overflow-hidden shadow-sm hover:shadow-md"
              style={{ minWidth: '0' }}
            >
              <img
                src={img}
                alt={`User review ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
        
        {/* Mobile override via inline style block to ensure it stacks on small screens */}
        <style dangerouslySetInnerHTML={{__html: `
          .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
          }
          @media (max-width: 768px) {
            .testimonials-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}} />

        <p className="font-lora text-lg text-[#3B2F2F]/50 text-center italic" style={{ marginTop: '2.5rem' }}>
          We're still improving — every piece of feedback helps us serve you better.
        </p>
      </div>
    </section>
  );
}
