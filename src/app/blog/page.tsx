import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div className="bg-[#111] min-h-screen text-white selection:bg-yellow-400 selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111]/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter hover:text-zinc-400 transition-colors">
            ETHAN ZHANG
          </Link>
          <Link 
            href="/" 
            className="text-sm font-bold tracking-widest hover:text-yellow-400 transition-colors"
          >
            HOME
          </Link>
        </div>
      </nav>

      <main className="w-full pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-24 border-b border-zinc-800 pb-12">
            <h1 className="text-8xl font-black mb-8 tracking-tighter uppercase">The Blog</h1>
            <p className="text-2xl text-zinc-400 leading-relaxed max-w-3xl font-medium">
              My thoughts on code, design, and the internet.
            </p>
          </header>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="py-20 text-center border border-zinc-800 border-dashed rounded-2xl">
              <p className="text-2xl text-zinc-500 font-bold">No posts found.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {posts.map((post: any) => (
                <article key={post.id} className="group border-b border-zinc-800 last:border-none">
                  <Link href={`/blog/${post.slug}`} className="grid grid-cols-1 md:grid-cols-12 gap-8 py-16 hover:bg-zinc-900/30 transition-colors px-4 -mx-4 rounded-xl">
                    {/* Date Column */}
                    <div className="md:col-span-3 flex flex-col justify-between">
                      <span className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
                        {new Date(post.publishDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Content Column */}
                    <div className="md:col-span-9">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 group-hover:text-yellow-400 transition-colors leading-tight">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p className="text-zinc-400 text-xl leading-relaxed max-w-4xl group-hover:text-zinc-300 transition-colors mb-8">
                          {post.description}
                        </p>
                      )}
                      <div className="flex items-center text-emerald-400 font-bold text-lg opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        READ ARTICLE <ArrowRight className="ml-2" size={24} />
                      </div>
                    </div>
                  </Link>
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
    </div>
  );
}
