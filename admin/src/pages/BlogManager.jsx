import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Loader2, BookOpen, ExternalLink } from 'lucide-react';
import * as api from '../api';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    coverImage: '',
    author: 'Cracked Digital Team',
    tags: '', // comma separated string for input
    isPublished: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getBlogs();
      // Backend returns { success: true, data: [...], meta: {...} } or just data depending on implementation
      // Our implementation returns paginated data in data, but let's be safe
      setBlogs(response.data || []); 
    } catch (error) {
      console.error('Fetch error:', error);
      showToast('Error fetching blog posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-generate slug from title if not manually edited
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !editingItem ? title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') : prev.slug
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      // Fix for upload response structure: { success: true, data: { url: "..." } }
      const imageUrl = res.data?.url || res.url || (typeof res === 'string' ? res : '');
      setFormData({ ...formData, coverImage: imageUrl });
      showToast('Cover image uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Error uploading image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Process tags from string to array
    const dataToSubmit = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      if (editingItem) {
        await api.updateBlog(editingItem.id, dataToSubmit);
        showToast('Blog post updated');
      } else {
        await api.createBlog(dataToSubmit);
        showToast('Blog post created');
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Save error:', error);
      showToast(error.response?.data?.error || 'Error saving post', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.deleteBlog(id);
      showToast('Post deleted');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Error deleting post', 'error');
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        content: item.content,
        coverImage: item.coverImage,
        author: item.author,
        tags: item.tags ? item.tags.join(', ') : '',
        isPublished: item.isPublished
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        summary: '',
        content: '',
        coverImage: '',
        author: 'Cracked Digital Team',
        tags: '',
        isPublished: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (loading) return <div className="text-white/50 p-8 text-center">Loading posts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Blog Posts</h2>
          <p className="text-white/50">Manage your blog content and articles</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus size={20} /> New Post
        </button>
      </div>

      {/* Blog List */}
      <div className="grid gap-4">
        {blogs.map((post) => (
          <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-24 h-24 shrink-0 rounded-lg bg-white/5 overflow-hidden">
               {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20"><BookOpen size={24} /></div>
               )}
            </div>
            
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium truncate text-lg">{post.title}</h3>
                  {!post.isPublished && <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/20">Draft</span>}
               </div>
               <p className="text-white/50 text-sm line-clamp-2 mb-2">{post.summary}</p>
               <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>/{post.slug}</span>
               </div>
            </div>

            <div className="flex items-center gap-2">
               <button onClick={() => openModal(post)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition">
                  <Edit2 size={18} />
               </button>
               <button onClick={() => handleDelete(post.id)} className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition">
                  <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}

        {blogs.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No blog posts yet. Create your first one!</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Edit Blog Post' : 'New Blog Post'}
              </h3>
              <button onClick={closeModal} className="text-white/50 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Title & Slug */}
                 <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        placeholder="Post Title"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Slug (URL)</label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/50 focus:outline-none focus:border-purple-500 font-mono text-sm"
                        placeholder="post-url-slug"
                    />
                    </div>
                 </div>

                 {/* Cover Image */}
                 <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70 mb-1">Cover Image</label>
                    <div className="relative aspect-video rounded-lg bg-white/5 border border-white/10 overflow-hidden group">
                       {formData.coverImage ? (
                          <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                       )}
                       <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                          <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                          <div className="flex items-center gap-2 text-white font-medium">
                             <Upload size={20} /> {uploading ? 'Uploading...' : 'Change Image'}
                          </div>
                       </label>
                    </div>
                 </div>
              </div>

               {/* Meta Info */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-white/70 mb-1">Author</label>
                     <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-white/70 mb-1">Tags (comma separated)</label>
                     <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        placeholder="Technology, Design, News"
                     />
                  </div>
                  <div className="flex items-end pb-2">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input
                           type="checkbox"
                           checked={formData.isPublished}
                           onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                           className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                        />
                        <span className="text-white font-medium">Published</span>
                     </label>
                  </div>
               </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Summary (Short Description)</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 h-20"
                  placeholder="Brief summary for list view and SEO..."
                />
              </div>

              {/* Content Editor (Simple Textarea for now, Rich Text later) */}
              <div className="flex-1 flex flex-col min-h-[300px]">
                <label className="block text-sm font-medium text-white/70 mb-1">Content (HTML supported)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white font-mono text-sm focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="<p>Write your blog post content here...</p>"
                />
                <p className="text-xs text-white/30 mt-2">✨ Tip: You can paste HTML directly or use simple text. We'll add a rich text editor soon.</p>
              </div>

            </div>

            <div className="p-6 border-t border-white/10 bg-[#111] flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || uploading}
                className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl border font-medium z-[100] animate-fade-in-up ${
          toast.type === 'error' 
            ? 'bg-red-500/10 border-red-500/20 text-red-500' 
            : 'bg-green-500/10 border-green-500/20 text-green-500'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
