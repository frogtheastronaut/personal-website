import Link from "next/link";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const metadata = {
  title: "Ethan's Blog",
  description: "Ethan Zhang's personal blog about coding and technology.",
};

export default async function Blog() {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL not defined");

  let posts: any[] = [];

  try {
    const res = await fetch(`${STRAPI_URL}/api/posts?sort=publishDate:desc`, { next: { revalidate: 60 } });
    const data = await res.json();
    posts = data.data || [];
  } catch (error: any) {
    console.error("Failed to fetch posts", error);
  }

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity">
            ETHAN ZHANG
          </Link>
          <Link 
            href="/" 
            className="text-sm tracking-wider hover:opacity-70 transition-opacity"
          >
            HOME
          </Link>
        </div>
      </nav>

      <main className="min-h-screen w-full bg-white pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-8">
          {/* Header */}
          <header className="mb-16">
            <h1 className="text-6xl font-bold mb-6 tracking-tight">Blog</h1>
            <p className="text-xl opacity-70 leading-relaxed max-w-2xl">
              Welcome to my blog! Here you'll find posts about my coding journey, projects, and thoughts on technology.
            </p>
          </header>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <p className="text-xl opacity-60 text-center py-20">No posts found.</p>
          ) : (
            <div className="grid gap-12">
              {posts.map((post: any) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="flex flex-col gap-4">
                      <h2 className="text-3xl font-bold group-hover:opacity-70 transition-opacity leading-tight">
                        {post.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm opacity-60">
                        <span>{post.author}</span>
                        <span>•</span>
                        <time>{new Date(post.publishDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</time>
                      </div>
                      {post.excerpt && (
                        <p className="text-lg opacity-70 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="text-sm font-semibold group-hover:underline">
                        Read more →
                      </div>
                    </div>
                  </Link>
                  <div className="mt-8 border-b border-gray-200"></div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* KaTeX CSS for math rendering */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        crossOrigin="anonymous"
      />
    </>
  );
}
