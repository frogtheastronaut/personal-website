"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  publishDate: string;
  category?: string;
  attributes?: {
    title: string;
    slug: string;
    description: string;
    publishDate: string;
    category?: string;
  };
}

export default function RecentPosts({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-32 px-8 bg-[#111]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-20 border-b border-zinc-800 pb-8">
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase">The Blog</h2>
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 text-xl font-bold text-zinc-500 hover:text-white transition-colors"
          >
            ALL POSTS
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-col">
          {posts.map((post, index) => {
            // Handle both flattened and nested structure
            const data = post.attributes || post;
            
            return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group border-b border-zinc-800 last:border-none"
            >
              <Link 
                href={`/blog/${data.slug}`}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 hover:bg-zinc-900/30 transition-colors px-4 -mx-4 rounded-xl"
              >
                {/* Date Column */}
                <div className="md:col-span-3 flex flex-col justify-between">
                  <span className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
                    {new Date(data.publishDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Content Column */}
                <div className="md:col-span-9">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                    {data.title}
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl group-hover:text-zinc-300 transition-colors">
                    {data.description}
                  </p>
                  <div className="mt-6 flex items-center text-emerald-400 font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    READ ARTICLE <ArrowRight className="ml-2" size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
