import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Eye, EyeOff, User } from 'lucide-react';
import * as api from '../api/index.js';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    image: '',
    text: '',
    isActive: true,
  });

  const fetchData = async () => {
    try {
      const response = await api.getTestimonials();
      setTestimonials(response.data.data || []);
    } catch (error) {
      showToast('Error fetching testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        role: item.role || '',
        company: item.company || '',
        image: item.image || '',
        text: item.text || '',
        isActive: item.isActive !== false,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        role: '',
        company: '',
        image: '',
        text: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingItem) {
        await api.updateTestimonial(editingItem.id, formData);
        showToast('Testimonial updated successfully');
      } else {
        await api.createTestimonial(formData);
        showToast('Testimonial created successfully');
      }
      closeModal();
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Error saving testimonial', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await api.deleteTestimonial(id);
      showToast('Testimonial deleted successfully');
      fetchData();
    } catch (error) {
      showToast('Error deleting testimonial', 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.toggleTestimonial(id);
      showToast('Visibility toggled');
      fetchData();
    } catch (error) {
      showToast('Error toggling visibility', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/50">Manage testimonials from your community members</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((item) => (
          <div 
            key={item.id} 
            className={`card relative ${!item.isActive ? 'opacity-50' : ''}`}
          >
            {!item.isActive && (
              <div className="absolute top-3 right-3">
                <span className="badge badge-gray">Hidden</span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white/30" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{item.name}</h3>
                <p className="text-white/50 text-sm">{item.role}</p>
                {item.company && (
                  <p className="text-purple-400 text-xs">{item.company}</p>
                )}
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed line-clamp-4">
              "{item.text}"
            </p>

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => handleToggle(item.id)}
                className="p-2 rounded-lg hover:bg-white/10"
                title={item.isActive ? 'Hide' : 'Show'}
              >
                {item.isActive ? (
                  <Eye className="w-4 h-4 text-white/50" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white/50" />
                )}
              </button>
              <button
                onClick={() => openModal(item)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <Edit2 className="w-4 h-4 text-white/50" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="col-span-full card text-center py-12">
            <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No testimonials yet. Add your first one!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#111] border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={closeModal} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Role *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Software Developer"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="TechCorp"
                    className="w-full"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Profile Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Testimonial Text *</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Their experience with Cracked Digital..."
                    required
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded bg-white/5 border-white/20 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-white/70">Visible on website</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingItem ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
