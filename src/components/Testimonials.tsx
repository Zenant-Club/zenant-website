// Screenshots of tenants' WhatsApp messages. The text is repeated in `text` because search
// engines and screen readers can't read text inside an image.
const reviews = [
  {
    image: "/reviews/dev.webp",
    width: 626,
    height: 432,
    name: "Dev",
    text: "I had a wonderful experience with Zenant. The team was extremely helpful and guided me at every step of the process. They understood my requirements well and showed me the best options within my budget. The paperwork and agreement process were smooth and hassle-free. I highly recommend Zenant to anyone looking for a reliable and professional property service!",
  },
  {
    image: "/reviews/ilakiya.webp",
    width: 627,
    height: 422,
    name: "Ilakiya",
    text: "Thank you for your excellent support in finding our new home. Your assistance, quick response, and professionalism are greatly appreciated. We are very happy with your service.",
  },
  {
    image: "/reviews/saurav.webp",
    width: 617,
    height: 437,
    name: "Saurav",
    text: "My overall experience with Zenant was very positive. The entire process from the initial contact through Instagram, property visits, agreement discussions, and move in was smooth and professionally managed.",
  },
  {
    image: "/reviews/shivani.webp",
    width: 622,
    height: 432,
    name: "Shivani",
    text: "I had a very good experience with Zenant Club. The team was supportive, professional, and the overall service met my expectations. I truly appreciate the effort they put into ensuring customer satisfaction. However, I would like to mention one concern. I was promised a microwave oven as part of the offer, but it has been more than 25 days and I have still not received it. I would appreciate it if the team could look into this and arrange the delivery at the earliest. Overall, I am happy with the service and look forward to a positive resolution. Thank you!",
  },
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
          {reviews.map((review) => (
            <div
              key={review.image}
              className="w-full transition-all hover:-translate-y-1 rounded-3xl overflow-hidden shadow-sm hover:shadow-md"
              style={{ minWidth: '0' }}
            >
              <img
                src={review.image}
                alt={`WhatsApp message from ${review.name}: "${review.text}"`}
                width={review.width}
                height={review.height}
                loading="lazy"
                decoding="async"
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
