

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
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity">
            ETHAN ZHANG
          </Link>
          <Link 
            href="/blog" 
            className="text-sm tracking-wider hover:opacity-70 transition-opacity"
          >
            BLOG
          </Link>
        </div>
      </nav>

      <main className="min-h-screen w-full bg-white pt-32 pb-20">
        <article className="max-w-4xl mx-auto px-8">
          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-base opacity-60">
              <span className="font-medium">{post.author}</span>
              <span>•</span>
              <time>{new Date(post.publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark as any}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl !bg-gray-900 my-6"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                h1({ children }) {
                  return <h1 className="text-4xl font-bold mt-12 mb-6 leading-tight">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-3xl font-bold mt-10 mb-5 leading-tight">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-2xl font-bold mt-8 mb-4 leading-tight">{children}</h3>;
                },
                p({ children }) {
                  return <p className="mb-6 text-lg leading-relaxed opacity-90">{children}</p>;
                },
                a({ href, children }) {
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline font-medium">
                      {children}
                    </a>
                  );
                },
                img({ src, alt }) {
                  return <img src={src} alt={alt} className="w-full rounded-xl my-8 shadow-lg" />;
                },
                ul({ children }) {
                  return <ul className="list-disc list-outside mb-6 pl-6 space-y-2 text-lg leading-relaxed opacity-90">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal list-outside mb-6 pl-6 space-y-2 text-lg leading-relaxed opacity-90">{children}</ol>;
                },
                li({ children }) {
                  return <li className="mb-2">{children}</li>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-gray-300 pl-6 py-2 my-6 italic text-gray-700">
                      {children}
                    </blockquote>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Back to Blog Link */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-lg font-medium hover:opacity-70 transition-opacity"
            >
              ← Back to all posts
            </Link>
          </div>
        </article>
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
