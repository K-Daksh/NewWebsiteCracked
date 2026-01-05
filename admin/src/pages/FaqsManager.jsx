import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Eye, EyeOff, HelpCircle } from 'lucide-react';
import * as api from '../api/index.js';

const FaqsManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isActive: true,
  });

  const fetchData = async () => {
    try {
      const response = await api.getFaqs();
      setFaqs(response.data.data || []);
    } catch (error) {
      showToast('Error fetching FAQs', 'error');
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
        question: item.question || '',
        answer: item.answer || '',
        isActive: item.isActive !== false,
      });
    } else {
      setEditingItem(null);
      setFormData({
        question: '',
        answer: '',
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
        await api.updateFaq(editingItem.id, formData);
        showToast('FAQ updated successfully');
      } else {
        await api.createFaq(formData);
        showToast('FAQ created successfully');
      }
      closeModal();
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Error saving FAQ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      await api.deleteFaq(id);
      showToast('FAQ deleted successfully');
      fetchData();
    } catch (error) {
      showToast('Error deleting FAQ', 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.toggleFaq(id);
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
          <p className="text-white/50">Manage frequently asked questions</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((item, index) => (
          <div 
            key={item.id} 
            className={`card ${!item.isActive ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold text-sm">{index + 1}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white mb-2">{item.question}</h3>
                <p className="text-white/50 text-sm">{item.answer}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!item.isActive && (
                  <span className="badge badge-gray">Hidden</span>
                )}
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
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="card text-center py-12">
            <HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No FAQs yet. Add your first question!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingItem ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button onClick={closeModal} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Question *</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="What is Cracked Digital?"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Answer *</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="The answer to this question..."
                  required
                  rows={4}
                  className="w-full"
                />
              </div>

              <div>
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

export default FaqsManager;
