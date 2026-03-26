import { Metadata } from "next";
import BlogContent from "@/components/Blog/BlogContent";
import { Header } from "@/components/Blufacade/Header";
import { Footer } from "@/components/Blufacade/Footer";
import { DynamicPageBanner } from "@/components/DynamicPageBanner";

export const metadata: Metadata = {
  title: "Blog | Blufacade - Facade Industry Insights & News",
  description: "Stay updated with the latest facade design trends, construction tips, industry news, and case studies from Blufacade experts.",
  keywords: "facade blog, construction news, design trends, building facade, ACP cladding, architectural insights",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <DynamicPageBanner
          pageKey="blog"
          title="Insights & Updates"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
          ]}
        />
        <BlogContent />
      </main>
      <Footer />
    </>
  );
}
