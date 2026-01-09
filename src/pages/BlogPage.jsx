import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

const BlogCard = ({ post, onClick }) => {
  return (
    <motion.div
      layoutId={`blog-card-${post.id}`}
      onClick={() => onClick(post.slug)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors"
    >
        <div className="aspect-video relative overflow-hidden bg-white/5">
            {post.coverImage ? (
                <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl font-bold bg-white/5">
                    {post.title.charAt(0)}
                </div>
            )}
            <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                    {post.tags && post.tags.length > 0 ? post.tags[0] : 'Article'}
                </span>
            </div>
        </div>

        <div className="p-6">
            <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                {post.title}
            </h3>
            
            <p className="text-white/60 text-xs md:text-sm line-clamp-2 mb-4 font-medium">
                {post.summary}
            </p>
            
            <div className="flex items-center gap-2 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </motion.div>
  );
};

import { Helmet } from 'react-helmet-async';

import BrandedSpinner from '../components/common/BrandedSpinner';

export const BlogPage = ({ onNavigate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Base URL for API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog?limit=100`);
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <BrandedSpinner size={40} />
            <p className="text-white/50 text-sm animate-pulse">Loading articles...</p>
        </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | Cracked Digital - Tech Insights & Community Stories</title>
        <meta name="description" content="Read the latest insights into technology, design, and digital innovation from Central India's premier tech community." />
        <meta property="og:title" content="Blog | Cracked Digital" />
        <meta property="og:description" content="Deep dives into technology, design, and the future of digital innovation." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-16">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-6xl font-bold text-white mb-6"
            >
                Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Insights</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/50 text-lg max-w-2xl mx-auto"
            >
                Deep dives into technology, design, and the future of digital innovation.
            </motion.p>
        </div>

        {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <BlogCard 
                        key={post.id} 
                        post={post} 
                        onClick={(slug) => onNavigate(`blog/${slug}`)} 
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-white/50 text-lg">No articles published yet. Stay tuned!</p>
            </div>
        )}
    </div>
    </>
  );
};

export default BlogPage;
