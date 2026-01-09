import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const BlogPostPage = ({ slug, onBack }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/${slug}`);
        const result = await response.json();
        
        if (result.success) {
          setPost(result.data);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  
  if (error || !post) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
        <button onClick={onBack} className="px-6 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition">Back to Blog</button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title} | Cracked Digital</title>
        <meta name="description" content={post.seoDescription || post.summary} />
        <meta property="og:title" content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.seoDescription || post.summary} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Articles
        </button>

        <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Header */}
            <header className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    {post.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium border border-purple-500/20">
                            {tag}
                        </span>
                    ))}
                </div>
                
                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-white/50 border-b border-white/10 pb-8">
                    <span className="flex items-center gap-2"><User size={16} /> {post.author}</span>
                    <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><Clock size={16} /> 5 min read</span>
                </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Content */}
            <div 
                className="prose prose-invert prose-base md:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-purple-400 prose-img:rounded-xl text-white/80"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </motion.article>
      </div>
    </>
  );
};

export default BlogPostPage;
