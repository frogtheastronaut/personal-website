"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Post {
  id: number;
  attributes?: {
    title: string;
    slug: string;
    excerpt: string;
    publishDate: string;
    description?: string;
  };
  // Flattened fallback
  title?: string;
  slug?: string;
  excerpt?: string;
  publishDate?: string;
  description?: string;
}

export default function BlogList({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) {
    return (
        <div className="py-20 text-center border border-white/10 border-dashed rounded-2xl">
            <p className="text-xl text-gray-500">No posts found.</p>
        </div>
    );
  }

  return (
    <div className="grid gap-8">
      {posts.map((post, i) => {
        // Handle both Strapi v4 (attributes nested) and v5/flattened responses
        const data = post.attributes || post;
        // Skip if invalid
        if (!data.slug) return null;

        return (
        <motion.div 
          key={post.id || i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <Link href={`/blog/${data.slug}`} className="group block space-y-3 p-6 -mx-6 rounded-2xl hover:bg-white/5 transition-colors duration-300">
            <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-widest font-mono">
              <span>
                  {data.publishDate ? new Date(data.publishDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                  }) : ''}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#dd7878]">Read Article →</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-sans font-medium text-white group-hover:text-[#dd7878] transition-colors duration-300">
              {data.title}
            </h2>
            
            <p className="text-gray-400 font-sans leading-relaxed max-w-2xl">
              {data.excerpt || data.description}
            </p>
          </Link>
        </motion.div>
      )})}
    </div>
  );
}
