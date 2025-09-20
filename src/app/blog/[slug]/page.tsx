

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import { notFound } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

async function getPost(slug: string) {
  try {
    const res = await axios.get(
      `${STRAPI_URL}/api/posts?filters[slug][$eq]=${slug}`
    );
    return res.data.data?.[0] || null;
  } catch (error) {
    console.error("Failed to fetch post", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  params = await params;
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  let postTitle = "Blog Post";
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/posts?filters[slug][$eq]=${params.slug}`
    );
    const data = await res.json();
    const post = data.data?.[0];
    if (post && post.title) postTitle = post.title;
  } catch (e) {}
  return {
    title: postTitle,
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  params = await params;
  const postData = await getPost(params.slug);

  if (!postData) return notFound();

  const post = postData; // title, content, author, etc.
  return (

    <>
      <main className="min-h-screen w-full bg-[#232634] flex flex-col items-center justify-center font-[Fira_Mono,Menlo,monospace] py-16">
        <h1 className="font-extrabold text-5xl drop-shadow-lg text-center mb-4" style={{ color: '#c6d0f5' }}>{post.title}</h1>
        <p className="text-base text-blue-200 font-mono mb-8">
          {post.author} — {new Date(post.publishDate).toLocaleDateString()}
        </p>
        <article className="w-full max-w-3xl bg-[#232634] p-8 mb-8 text-blue-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className + " bg-[#232634] text-blue-200 px-1 rounded"} {...props}>
                    {children}
                  </code>
                );
              },
              h1({ children }) {
                return <h1 className="font-extrabold text-4xl mb-4" style={{ color: '#c6d0f5' }}>{children}</h1>;
              },
              h2({ children }) {
                return <h2 className="font-bold text-3xl mb-3" style={{ color: '#c6d0f5' }}>{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="font-bold text-2xl mb-2" style={{ color: '#c6d0f5' }}>{children}</h3>;
              },
              p({ children }) {
                return <p className="mb-4 text-blue-200 font-mono text-lg">{children}</p>;
              },
              a({ href, children }) {
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-blue-300 hover:text-blue-400">
                    {children}
                  </a>
                );
              },
              img({ src, alt }) {
                return <img src={src} alt={alt} className="w-full rounded-2xl my-4" />;
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
        <Link
          href="/blog"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-white via-white to-blue-200 text-black font-semibold shadow-xl transition-all duration-200 text-xl font-[Fira_Mono,Menlo,monospace]"
        >
          ← See all Blogs
        </Link>
      </main>
    </>
  );
}
