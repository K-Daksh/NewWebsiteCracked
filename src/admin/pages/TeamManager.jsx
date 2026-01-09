import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Upload, GripVertical, Mail, Linkedin } from 'lucide-react';
import * as api from '../api/index.js';

// Internal Components (Duplicated for standalone usage)
const Spinner = ({ size = 'md' }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <div className={`${sizeClasses[size]} border-2 border-purple-500 border-t-transparent rounded-full animate-spin`} />;
};

const Toast = ({ message, type }) => (
  <div className={`fixed bottom-4 right-4 z-[100] px-6 py-4 rounded-lg shadow-2xl animate-fadeIn ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
    {message}
  </div>
);

const TeamManager = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({ name: '', role: '', image: '', email: '', linkedin: '' });

  const fetchData = async () => {
    try {
      const response = await api.getTeam();
      setTeam(response.data || []);
    } catch (error) {
      showToast('Error fetching team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const openModal = (item = null) => {
    if (item) { setEditingItem(item); setFormData({ name: item.name || '', role: item.role || '', image: item.image || '', email: item.email || '', linkedin: item.linkedin || '' }); }
    else { setEditingItem(null); setFormData({ name: '', role: '', image: '', email: '', linkedin: '' }); }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingItem(null); };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      setFormData({ ...formData, image: res.data.url });
      showToast('Image uploaded successfully');
    } catch (error) {
      showToast('Error uploading image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) { await api.updateTeamMember(editingItem.id, formData); showToast('Team member updated successfully'); }
      else { await api.createTeamMember(formData); showToast('Team member created successfully'); }
      closeModal();
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Error saving team member', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try { await api.deleteTeamMember(id); showToast('Team member deleted successfully'); fetchData(); } catch (error) { showToast('Error deleting team member', 'error'); }
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const newTeam = [...team];
    [newTeam[index - 1], newTeam[index]] = [newTeam[index], newTeam[index - 1]];
    const updatedOrder = newTeam.map((item, idx) => ({ id: item.id, order: idx }));
    setTeam(newTeam);
    try { await api.reorderTeam(updatedOrder); showToast('Order updated'); } catch (error) { showToast('Error updating order', 'error'); fetchData(); }
  };

  const moveDown = async (index) => {
    if (index === team.length - 1) return;
    const newTeam = [...team];
    [newTeam[index], newTeam[index + 1]] = [newTeam[index + 1], newTeam[index]];
    const updatedOrder = newTeam.map((item, idx) => ({ id: item.id, order: idx }));
    setTeam(newTeam);
    try { await api.reorderTeam(updatedOrder); showToast('Order updated'); } catch (error) { showToast('Error updating order', 'error'); fetchData(); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <p className="text-white/50">Manage team members displayed on About page</p>
        <button onClick={() => openModal()} className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2"><Plus className="w-4 h-4" />Add Team Member</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member, index) => (
          <div key={member.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <GripVertical className="w-5 h-5 text-white/30 flex-shrink-0 mt-1" />
              {member.image && <img src={member.image} alt={member.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{member.name}</h3>
                <p className="text-white/50 text-sm truncate">{member.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/70"><Linkedin className="w-3.5 h-3.5" /></a>}
                  {member.email && <a href={`mailto:${member.email}`} className="text-white/40 hover:text-white/70"><Mail className="w-3.5 h-3.5" /></a>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
              <div className="flex gap-1">
                <button onClick={() => moveUp(index)} disabled={index === 0} className="px-2 py-1 text-xs rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/70">↑</button>
                <button onClick={() => moveDown(index)} disabled={index === team.length - 1} className="px-2 py-1 text-xs rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/70">↓</button>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(member)} className="p-2 rounded-lg hover:bg-white/10"><Edit2 className="w-4 h-4 text-white/50" /></button>
                <button onClick={() => handleDelete(member.id)} className="p-2 rounded-lg hover:bg-red-500/20"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          </div>
        ))}
        {team.length === 0 && <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center md:col-span-2 lg:col-span-3"><p className="text-white/50">No team members yet. Add your first member!</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{editingItem ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button onClick={closeModal} className="text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-white/70 mb-2">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
              <div><label className="block text-sm font-medium text-white/70 mb-2">Role *</label><input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="CEO & Founder" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
              <div><label className="block text-sm font-medium text-white/70 mb-2">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
              <div><label className="block text-sm font-medium text-white/70 mb-2">LinkedIn URL *</label><input type="url" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/johndoe" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Profile Image</label>
                <div className="space-y-2">
                  {formData.image && <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />}
                  <div className="flex gap-2">
                    <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/image.jpg or upload below" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                    <label className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2">
                  {saving ? <Spinner size="sm" /> : <><Save className="w-4 h-4" />{editingItem ? 'Update' : 'Create'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
