
import Link from "next/link";
import Head from "next/head";
import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const metadata = {
  title: "Ethan's Blog",
  description: "Ethan Zhang's personal blog about coding and technology.",
};

export default async function Blog() {
  if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL not defined");

  let posts: any[] = [];

  try {
    const res = await axios.get(`${STRAPI_URL}/api/posts`);
    posts = res.data.data || [];
  } catch (error: any) {
    console.error("Failed to fetch posts", error.response?.data || error.message);
  }
  return (
    <>
      <main className="min-h-screen w-full bg-[#232634] flex flex-col items-center justify-center font-[Fira_Mono,Menlo,monospace] py-16">
        <h1 className="font-extrabold text-5xl drop-shadow-lg text-center mb-4" style={{ color: '#c6d0f5' }}>Ethan's Blog</h1>
        <section className="w-full max-w-3xl mb-8">
          <p className="text-blue-200 text-lg text-center font-mono">
            Welcome to my blog! Here you'll find posts about my coding journey, projects, and thoughts on technology. Feel free to explore and check back for new updates.
            <br></br><br></br>
          </p>
          <div className="mt-2 text-sm text-blue-200 opacity-70 font-mono text-center">Note: Posts may take a long time to load</div>
        </section>
        {posts.length === 0 && <p className="text-blue-200 text-xl">No posts found.</p>}
        <ul className="w-full max-w-3xl flex flex-col gap-8">
          {posts.map((post: any) => (
            <li key={post.id} className="bg-[#232634] rounded-2xl shadow-xl p-8 flex flex-col gap-2">
              <Link
                href={`/blog/${post.slug}`}
                className="text-3xl font-bold text-blue-200 hover:text-blue-400 transition-colors underline"
              >
                {post.title}
              </Link>
              <p className="text-base text-blue-200 font-mono">
                {post.author} — {new Date(post.publishDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="mt-12 px-8 py-3 rounded-full bg-gradient-to-r from-white via-white to-blue-200 text-black font-semibold shadow-xl transition-all duration-200 text-xl font-[Fira_Mono,Menlo,monospace]"
        >
          ← Back to Home
        </Link>
      </main>
    </>
  );
}
