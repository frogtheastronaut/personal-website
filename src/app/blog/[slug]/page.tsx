

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import { notFound } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import ScrollProgressNav from "@/components/ScrollProgressNav";

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

  const post = postData;
  return (
    <div className="bg-[#111] min-h-screen text-white selection:bg-yellow-400 selection:text-black">
      <ScrollProgressNav />

      <main className="w-full pt-40 pb-20 px-8">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-20 border-b border-zinc-800 pb-12">
            <div className="flex items-center gap-4 text-sm font-mono text-emerald-400 mb-6 uppercase tracking-widest">
              <time>{new Date(post.publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
              <span className="text-zinc-500">{post.author || "Ethan Zhang"}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-white">
              {post.title}
            </h1>
          </header>

          {/* Article Content */}
          <div className="prose prose-xl prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:underline prose-code:text-emerald-400 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={{
                img: ({node, ...props}) => (
                  <img className="w-full rounded-xl my-8 shadow-lg" {...props} />
                ),
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark as any}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        background: 'transparent',
                        padding: 0,
                        margin: 0,
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
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
