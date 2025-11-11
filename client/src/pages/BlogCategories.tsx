import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { FileText, Calendar, Eye } from "lucide-react";

export default function BlogCategories() {
  const { data: posts, isLoading } = trpc.blog.getAll.useQuery();

  // Group posts by category
  const categoriesMap = new Map<string, any[]>();
  posts?.forEach((post) => {
    const category = post.category || "Uncategorized";
    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, []);
    }
    categoriesMap.get(category)?.push(post);
  });

  const categories = Array.from(categoriesMap.entries()).map(([name, posts]) => ({
    name,
    count: posts.length,
    posts,
  }));

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = selectedCategory
    ? posts?.filter((post) => (post.category || "Uncategorized") === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4 glow-text">
            Blog <span className="text-primary">Categories</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our content by category and discover insights on fashion, style, and culture
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card
            className={`p-6 border-primary/20 glow-box cursor-pointer transition-all hover:border-primary/50 ${
              selectedCategory === null ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">All Posts</h3>
                <p className="text-sm text-muted-foreground">View all blog posts</p>
              </div>
              <div className="text-3xl font-bold text-primary">{posts?.length || 0}</div>
            </div>
          </Card>

          {categories.map((category) => (
            <Card
              key={category.name}
              className={`p-6 border-primary/20 glow-box cursor-pointer transition-all hover:border-primary/50 ${
                selectedCategory === category.name ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} {category.count === 1 ? "post" : "posts"}
                  </p>
                </div>
                <div className="text-3xl font-bold text-primary">{category.count}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory ? `${selectedCategory} Posts` : "All Posts"}
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts?.length || 0} {filteredPosts?.length === 1 ? "post" : "posts"}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="p-6 border-primary/20 glow-box hover:border-primary/50 transition-all">
                  <div className="flex gap-6">
                    {post.coverImage && (
                      <Link href={`/blog/${post.slug}`}>
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-48 h-32 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </Link>
                    )}
                    <div className="flex-1">
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-2xl font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt || "No excerpt available"}
                      </p>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{post.category || "Uncategorized"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString()
                              : "Not published"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount} views</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {selectedCategory
                  ? `No posts found in "${selectedCategory}" category`
                  : "No blog posts available"}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
