import { Metadata } from "next";
import BlogDetailClient from "@/components/Blog/BlogDetailClient";
import { Header } from "@/components/Blufacade/Header";
import { Footer } from "@/components/Blufacade/Footer";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        title: "Blog Post | Blufacade",
        description: "Read our latest blog post about facade design and construction.",
      };
    }

    const data = await response.json();
    const blog = data.blog;

    return {
      title: blog.seoTitle || `${blog.title} | Blufacade Blog`,
      description: blog.seoDescription || blog.excerpt,
      keywords: blog.seoKeywords || blog.tags?.join(", "),
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: blog.seoTitle || blog.title,
        description: blog.seoDescription || blog.excerpt,
        images: [blog.image],
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "Blog Post | Blufacade",
      description: "Read our latest blog post about facade design and construction.",
    };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <BlogDetailClient slug={slug} />
      </main>
      <Footer />
    </>
  );
}
