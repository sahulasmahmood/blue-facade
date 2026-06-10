import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import connectDB from "@/config/models/connectDB";
import Blog from "@/config/utils/admin/blog/blogSchema";
import Portfolio from "@/config/utils/admin/portfolio/portfolioSchema";
import Service from "@/config/utils/admin/services/serviceSchema";

// Always render fresh so newly published content is reflected.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = siteConfig.url;

// Static, publicly indexable pages.
const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about/team", changeFrequency: "monthly", priority: 0.6 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/support-model", changeFrequency: "monthly", priority: 0.6 },
  { path: "/ndis", changeFrequency: "monthly", priority: 0.6 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-conditions", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    const notDeleted = {
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    };

    const [blogs, portfolios, services] = await Promise.all([
      Blog.find({ published: true })
        .select("slug updatedAt")
        .lean(),
      Portfolio.find({ status: "active", ...notDeleted })
        .select("slug updatedAt")
        .lean(),
      Service.find({ status: "active", ...notDeleted })
        .select("slug updatedAt")
        .lean(),
    ]);

    const toEntries = (
      docs: Array<{ slug?: string; updatedAt?: Date }>,
      prefix: string,
      priority: number
    ): MetadataRoute.Sitemap =>
      docs
        .filter((doc) => Boolean(doc.slug))
        .map((doc) => ({
          url: `${baseUrl}${prefix}/${doc.slug}`,
          lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
          changeFrequency: "weekly",
          priority,
        }));

    dynamicEntries = [
      ...toEntries(services as any[], "/services", 0.8),
      ...toEntries(portfolios as any[], "/portfolio", 0.7),
      ...toEntries(blogs as any[], "/blog", 0.7),
    ];
  } catch (error) {
    // If the database is unreachable, still serve the static sitemap
    // rather than failing the whole route.
    console.error("[sitemap] Failed to load dynamic routes:", error);
  }

  return [...staticEntries, ...dynamicEntries];
}
