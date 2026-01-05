import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Milestone as MilestoneIcon } from 'lucide-react';
import * as api from '../api/index.js';

const MilestonesManager = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ year: '', title: '', description: '' });

  const fetchData = async () => {
    try {
      const response = await api.getMilestones();
      setMilestones(response.data.data || []);
    } catch (error) {
      showToast('Error fetching milestones', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ year: item.year || '', title: item.title || '', description: item.description || '' });
    } else {
      setEditingItem(null);
      setFormData({ year: '', title: '', description: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingItem(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await api.updateMilestone(editingItem.id, formData);
        showToast('Milestone updated');
      } else {
        await api.createMilestone(formData);
        showToast('Milestone created');
      }
      closeModal();
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Error saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this milestone?')) return;
    try {
      await api.deleteMilestone(id);
      showToast('Deleted');
      fetchData();
    } catch (error) {
      showToast('Error deleting', 'error');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast && <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>{toast.message}</div>}
      <div className="flex items-center justify-between">
        <p className="text-white/50">Manage timeline milestones</p>
        <button onClick={() => openModal()} className="btn btn-primary"><Plus className="w-4 h-4" />Add</button>
      </div>
      <div className="space-y-4">
        {milestones.map((item) => (
          <div key={item.id} className="card flex items-start justify-between group">
            <div>
              <span className="badge badge-purple mb-2">{item.year}</span>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-white/50 text-sm mt-1">{item.description}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(item)} className="p-2 hover:bg-white/10 rounded-lg"><Edit2 className="w-4 h-4 text-white/50" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {milestones.length === 0 && <div className="card text-center py-12"><MilestoneIcon className="w-12 h-12 text-white/20 mx-auto mb-4" /><p className="text-white/50">No milestones yet</p></div>}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md">
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{editingItem ? 'Edit' : 'Add'} Milestone</h2>
              <button onClick={closeModal}><X className="w-6 h-6 text-white/50" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm text-white/70 mb-2">Year/Phase *</label><input type="text" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required className="w-full" /></div>
              <div><label className="block text-sm text-white/70 mb-2">Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full" /></div>
              <div><label className="block text-sm text-white/70 mb-2">Description *</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required rows={3} className="w-full" /></div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary">{saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" />{editingItem ? 'Update' : 'Create'}</>}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestonesManager;
