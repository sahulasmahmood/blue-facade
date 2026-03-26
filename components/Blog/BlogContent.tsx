"use client";

import { useState } from "react";
import { useBlog } from "@/hooks/use-blog";
import { useCategories } from "@/hooks/use-categories";
import { Loader2, Calendar, Clock, ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { categories, isLoading: categoriesLoading } = useCategories(true);
  const { blogs, pagination, isLoading } = useBlog(
    page,
    9,
    selectedCategory === "All" ? undefined : selectedCategory
  );

  const allCategories = ["All", ...categories.map((cat: any) => cat.name)];

  const filteredBlogs = searchQuery
    ? blogs.filter(
        (blog: any) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : blogs;

  return (
    <div className="bg-[#fefaf6]">

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Search and Filter */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categoriesLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading categories...</span>
              </div>
            ) : (
              allCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category);
                    setPage(1);
                  }}
                  className={
                    selectedCategory === category
                      ? "bg-[#014a74] hover:bg-[#014a74]/90 text-white"
                      : "border-[#014a74] text-[#014a74] hover:bg-[#014a74] hover:text-white"
                  }
                >
                  {category}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-[#f58420] animate-spin" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No blog posts found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog: any) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#f58420] text-white">
                        {blog.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blog.readTime}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#014a74] group-hover:text-[#f58420] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 line-clamp-3">{blog.excerpt}</p>

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-[#014a74] font-semibold group-hover:gap-4 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-[#014a74] text-[#014a74]"
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        onClick={() => setPage(pageNum)}
                        className={
                          page === pageNum
                            ? "bg-[#014a74] hover:bg-[#014a74]/90"
                            : "border-[#014a74] text-[#014a74]"
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="border-[#014a74] text-[#014a74]"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
