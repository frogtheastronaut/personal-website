

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
import NavBar from "@/components/NavBar";

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
    <div className="bg-[#0a0a0a] min-h-screen text-[#ededed] font-mono selection:bg-[#dd7878] selection:text-white">
      <NavBar />

      <main className="w-full pt-40 pb-20 px-8">
        <article className="max-w-3xl mx-auto">
          {/* Article Header */}
          <header className="mb-16 border-b border-white/10 pb-12">
            <div className="flex items-center gap-4 text-sm font-sans text-[#dd7878] mb-6 uppercase tracking-widest font-bold">
              <time>{new Date(post.publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 font-caveat text-xl capitalize">{post.author || "Ethan Zhang"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-sans font-bold mb-8 leading-tight text-white">
              {post.title}
            </h1>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none 
              prose-headings:font-sans prose-headings:font-bold prose-headings:text-white
              prose-p:text-gray-300 prose-p:leadingpx-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#111] prose-pre:border prose-pre:border-zinc-800 prose-pre:text-gray-300
              prose-li:text-gray-300 prose-li:marker:text-[#dd7878]"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={{
                img: ({node, ...props}) => (
                  <img className="w-full rounded-2xl my-8 border border-white/10" alt={props.alt || "Blog Image"} {...props} />
                ),
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark} // Syntax highlighting
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={`${className} font-mono text-sm`} {...props}>
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
