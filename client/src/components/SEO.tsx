import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  price?: string;
  currency?: string;
  availability?: string;
}

export default function SEO({
  title = "INF!NITE C107HING - Modern Streetwear & Urban Fashion",
  description = "Discover premium streetwear and urban fashion at INF!NITE C107HING. Shop exclusive t-shirts, hoodies, and accessories with bold designs. Free UK shipping on orders over £50.",
  keywords = "streetwear, urban fashion, clothing store, t-shirts, hoodies, UK fashion, modern streetwear, infinite clothing, street style",
  image = "https://infiniteclothingstore.co.uk/og-image.jpg",
  url = "https://infiniteclothingstore.co.uk",
  type = "website",
  price,
  currency = "GBP",
  availability = "in stock",
}: SEOProps) {
  const fullTitle = title.includes("INF!NITE") ? title : `${title} | INF!NITE C107HING`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="INF!NITE C107HING" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="INF!NITE C107HING" />
      <meta property="og:locale" content="en_GB" />

      {/* Product specific OG tags */}
      {type === "product" && price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability} />
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#0a0a0a" />
      <meta name="msapplication-TileColor" content="#0a0a0a" />
    </Helmet>
  );
}
