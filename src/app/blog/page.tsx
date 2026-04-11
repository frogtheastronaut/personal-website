import BlogList from "@/components/BlogList";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const metadata = {
  title: "Journal | Ethan Zhang",
  description: "Thoughts on code, design, and the spaces in between.",
};

export default async function Blog() {
  let posts: any[] = [];

  if (STRAPI_URL) {
      try {
        const res = await fetch(`${STRAPI_URL}/api/posts?sort=publishDate:desc`, { next: { revalidate: 60 } });
        if (res.ok) {
            const data = await res.json();
            posts = data.data || [];
        }
      } catch (error: any) {
        console.error("Failed to fetch posts", error);
      }
  }

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-[#ededed] font-mono selection:bg-[#2d2d2d] selection:text-[#ededed]">
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-20">
         <div className="flex flex-col gap-12">
            {/* Header */}
            <div className="border-b border-white/10 pb-8">
               <h1 className="text-6xl md:text-8xl font-caveat text-white mb-4">
                 Journal
               </h1>
               <p className="max-w-xl text-gray-400 font-sans text-lg">
                 Thoughts on code, design, and the spaces in between.
               </p>
            </div>

            {/* Posts Grid */}
            <BlogList posts={posts} />
         </div>
      </div>
    </main>
  );
}
