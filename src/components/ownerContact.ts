// The owner team's line: the same number as "For Home Owners" on the Contact page.
export const OWNER_PHONE = "+91 63613 69764";
const OWNER_WHATSAPP = "916361369764";

// A WhatsApp chat with the owner team, first message ready to send. Owners who arrive from the
// printed card (utm_source=owner_card) say so, so the team can tell which leads the card brought in.
export function ownerWhatsAppLink(fromCard = false): string {
  const text = fromCard
    ? "Hi Zenant, I got your card and would like to rent out my property in Bengaluru."
    : "Hi Zenant, I own a property in Bengaluru and would like to rent it out.";
  return `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
