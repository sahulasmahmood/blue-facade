import { notFound } from "next/navigation";
import { Header } from "@/components/Blufacade/Header";
import { Footer } from "@/components/Blufacade/Footer";
import { DynamicPageBanner } from "@/components/DynamicPageBanner";
import { PortfolioDetailContent } from "@/components/Blufacade/pages/PortfolioDetailContent";
import { cache } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Base fetcher to be deduplicated
const getPortfolioBase = cache(async (slug: string) => {
  const connectDB = (await import("@/config/models/connectDB")).default;
  const Portfolio = (
    await import("@/config/utils/admin/portfolio/portfolioSchema")
  ).default;

  await connectDB();

  const portfolio = await Portfolio.findOne({
    slug,
    status: "active",
    $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
  })
    .select("-isDeleted -__v")
    .lean();

  return portfolio ? JSON.parse(JSON.stringify(portfolio)) : null;
});

// Fetch single portfolio by slug
async function getPortfolioBySlug(slug: string, increment = false) {
  try {
    const portfolio = await getPortfolioBase(slug);

    if (portfolio && increment) {
      const Portfolio = (
        await import("@/config/utils/admin/portfolio/portfolioSchema")
      ).default;
      // Increment view count separately from fetch
      await Portfolio.findByIdAndUpdate(portfolio._id, {
        $inc: { views: 1 },
      });
    }

    return portfolio;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const portfolioData = await getPortfolioBySlug(resolvedParams.slug);

  if (!portfolioData) {
    return {
      title: "Project Not Found - Blufacade",
      description: "The requested project could not be found.",
    };
  }

  return {
    title:
      portfolioData.seoTitle ||
      `${portfolioData.projectName} - Blufacade Portfolio`,
    description: portfolioData.seoDescription || portfolioData.description.substring(0, 160),
    keywords:
      portfolioData.seoKeywords ||
      `${portfolioData.projectName}, facade project, ${portfolioData.location}, Blufacade projects`,
    alternates: {
      canonical: `/portfolio/${resolvedParams.slug}`,
    },
    openGraph: {
      title: portfolioData.seoTitle || portfolioData.projectName,
      description:
        portfolioData.seoDescription ||
        portfolioData.description.substring(0, 160),
      type: "website",
      ...(portfolioData.image ? { images: [portfolioData.image] } : {}),
    },
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const portfolioData = await getPortfolioBySlug(resolvedParams.slug, true);

  if (!portfolioData) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />
      <DynamicPageBanner
        pageKey="portfolio"
        title=""
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Portfolio", href: "/portfolio" },
          { label: portfolioData.projectName, href: `/portfolio/${resolvedParams.slug}` },
        ]}
      />
      <PortfolioDetailContent portfolioData={portfolioData} />
      <Footer />
    </main>
  );
}
