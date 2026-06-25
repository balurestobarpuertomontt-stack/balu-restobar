import { SITE } from "@/lib/constants";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    description: SITE.description,
    slogan: SITE.slogan,
    url: SITE.url,
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Quillota 180",
      addressLocality: "Puerto Montt",
      addressRegion: "Los Lagos",
      addressCountry: "CL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.coordinates.lat,
      longitude: SITE.coordinates.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "12:00",
      closes: "01:00",
    },
    servesCuisine: ["Chilena", "Internacional", "Bar", "Hamburguesas"],
    priceRange: "$$",
    sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.tiktok],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "120",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
