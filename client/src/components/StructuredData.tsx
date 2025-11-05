import { Helmet } from "react-helmet-async";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  stock: number;
}

interface ProductStructuredDataProps {
  product: Product;
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const finalPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: `PROD-${product.id}`,
    brand: {
      "@type": "Brand",
      name: "INF!NITE C107HING",
    },
    offers: {
      "@type": "Offer",
      url: `https://infiniteclothingstore.co.uk/product/${product.id}`,
      priceCurrency: "GBP",
      price: finalPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "INF!NITE C107HING",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "INF!NITE C107HING",
    description:
      "Premium streetwear and urban fashion store offering exclusive designs and modern style.",
    url: "https://infiniteclothingstore.co.uk",
    logo: "https://infiniteclothingstore.co.uk/logo.png",
    image: "https://infiniteclothingstore.co.uk/og-image.jpg",
    telephone: "+44-800-061-2153",
    email: "info@infiniteclothingstore.co.uk",
    address: {
      "@type": "PostalAddress",
      streetAddress: "16 Gerard Street",
      addressLocality: "Derby",
      postalCode: "DE1 1NZ",
      addressCountry: "GB",
    },
    sameAs: [
      "https://www.facebook.com/infiniteclothing",
      "https://www.instagram.com/infiniteclothing",
      "https://twitter.com/infiniteclothing",
    ],
    priceRange: "££",
    openingHoursSpecification: [
      {
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
        opens: "00:00",
        closes: "23:59",
      },
    ],
    paymentAccepted: "Credit Card, Debit Card, Klarna",
    currenciesAccepted: "GBP",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
