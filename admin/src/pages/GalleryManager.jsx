import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Copy, Image as ImageIcon, X, Check } from 'lucide-react';
import * as api from '../api/index.js';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await api.listImages();
      setImages(response.data.data || []);
    } catch (error) {
      console.log('Gallery not available yet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      if (files.length === 1) {
        await api.uploadImage(files[0]);
      } else {
        await api.uploadImages(files);
      }
      showToast(`${files.length} image(s) uploaded`);
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.deleteImage(filename);
      showToast('Image deleted');
      fetchData();
    } catch (error) {
      showToast('Error deleting', 'error');
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast && <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>{toast.message}</div>}
      
      <div className="flex items-center justify-between">
        <p className="text-white/50">Upload and manage images for your events and content</p>
        <div className="relative">
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          <button className="btn btn-primary" disabled={uploading}>
            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload Images
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        className="card border-2 border-dashed border-white/20 hover:border-purple-500/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center py-8">
          <Upload className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">Drop images here or click to upload</p>
          <p className="text-white/30 text-sm mt-1">Supports JPEG, PNG, GIF, WebP (max 10MB each)</p>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image) => (
          <div key={image.name} className="group relative aspect-square rounded-xl overflow-hidden bg-white/5">
            <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => copyUrl(image.url)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20" title="Copy URL">
                <Copy className="w-4 h-4 text-white" />
              </button>
              <button onClick={() => handleDelete(image.name)} className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40" title="Delete">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="card text-center py-12">
          <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
