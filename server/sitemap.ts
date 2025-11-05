import { Request, Response } from "express";
import { getAllProducts } from "./db";

export async function generateSitemap(req: Request, res: Response) {
  try {
    const products = await getAllProducts();
    const baseUrl = "https://infiniteclothingstore.co.uk";
    const currentDate = new Date().toISOString().split("T")[0];

    const staticPages = [
      { url: "", priority: "1.0", changefreq: "daily" },
      { url: "/men", priority: "0.9", changefreq: "daily" },
      { url: "/women", priority: "0.9", changefreq: "daily" },
      { url: "/unisex", priority: "0.9", changefreq: "daily" },
      { url: "/kids", priority: "0.8", changefreq: "weekly" },
      { url: "/about", priority: "0.7", changefreq: "monthly" },
    ];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach((page) => {
      sitemap += "  <url>\n";
      sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += "  </url>\n";
    });

    // Add product pages
    products.forEach((product) => {
      sitemap += "  <url>\n";
      sitemap += `    <loc>${baseUrl}/product/${product.id}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += "  </url>\n";
    });

    sitemap += "</urlset>";

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
}
