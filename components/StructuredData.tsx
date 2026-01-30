import { Product } from "@/data/products";

interface StructuredDataProps {
  type: "Organization" | "LocalBusiness" | "Product" | "BreadcrumbList";
  product?: Product;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function StructuredData({ type, product, breadcrumbs }: StructuredDataProps) {
  const baseUrl = "https://aboufamily.com";

  const getOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Abou Family",
    url: baseUrl,
    logo: `${baseUrl}/logo.jpeg`,
    description: "Boutique en ligne de chocolats premium et confiseries de luxe à Dakar, Sénégal",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+221-78-013-26-28",
      contactType: "customer service",
      areaServed: "SN",
      availableLanguage: ["fr", "en"],
    },
    sameAs: [
      // Ajoutez vos liens réseaux sociaux ici
    ],
  });

  const getLocalBusinessSchema = () => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Abou Family",
    image: `${baseUrl}/logo.jpeg`,
    "@id": baseUrl,
    url: baseUrl,
    telephone: "+221-78-013-26-28",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dakar",
      addressCountry: "SN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "14.7167",
      longitude: "-17.4677",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
  });

  const getProductSchema = () => {
    if (!product) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: `${baseUrl}${product.image}`,
      description: product.description,
      brand: {
        "@type": "Brand",
        name: "Abou Family",
      },
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/produit/${product.id}`,
        priceCurrency: "XOF",
        price: product.price,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        priceValidUntil: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString().split("T")[0],
        seller: {
          "@type": "Organization",
          name: "Abou Family",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "127",
      },
    };
  };

  const getBreadcrumbSchema = () => {
    if (!breadcrumbs) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${baseUrl}${crumb.url}`,
      })),
    };
  };

  const getSchema = () => {
    switch (type) {
      case "Organization":
        return getOrganizationSchema();
      case "LocalBusiness":
        return getLocalBusinessSchema();
      case "Product":
        return getProductSchema();
      case "BreadcrumbList":
        return getBreadcrumbSchema();
      default:
        return null;
    }
  };

  const schema = getSchema();
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
