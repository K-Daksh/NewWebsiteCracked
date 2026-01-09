import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Upload, GripVertical, Linkedin, Mail } from 'lucide-react';
import * as api from '../api/index.js';

const TeamManager = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    email: '',
    linkedin: '',
  });

  const fetchData = async () => {
    try {
      const response = await api.getTeam();
      setTeam(response.data.data || []);
    } catch (error) {
      showToast('Error fetching team members', 'error');
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
        image: item.image || '',
        email: item.email || '',
        linkedin: item.linkedin || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        role: '',
        image: '',
        email: '',
        linkedin: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedUrl = await api.uploadImage(file);
      setFormData({ ...formData, image: uploadedUrl });
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
      if (editingItem) {
        await api.updateTeamMember(editingItem.id, formData);
        showToast('Team member updated successfully');
      } else {
        await api.createTeamMember(formData);
        showToast('Team member created successfully');
      }
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
    
    try {
      await api.deleteTeamMember(id);
      showToast('Team member deleted successfully');
      fetchData();
    } catch (error) {
      showToast('Error deleting team member', 'error');
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetItem) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = team.findIndex(t => t.id === draggedItem.id);
    const targetIndex = team.findIndex(t => t.id === targetItem.id);

    const newTeam = [...team];
    newTeam.splice(draggedIndex, 1);
    newTeam.splice(targetIndex, 0, draggedItem);

    const updatedOrder = newTeam.map((item, index) => ({
      id: item.id,
      order: index
    }));

    setTeam(newTeam);
    setDraggedItem(null);

    try {
      await api.reorderTeam(updatedOrder);
      showToast('Order updated successfully');
    } catch (error) {
      showToast('Error updating order', 'error');
      fetchData();
    }
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const newTeam = [...team];
    [newTeam[index - 1], newTeam[index]] = [newTeam[index], newTeam[index - 1]];
    
    const updatedOrder = newTeam.map((item, idx) => ({
      id: item.id,
      order: idx
    }));

    setTeam(newTeam);

    try {
      await api.reorderTeam(updatedOrder);
      showToast('Order updated successfully');
    } catch (error) {
      showToast('Error updating order', 'error');
      fetchData();
    }
  };

  const moveDown = async (index) => {
    if (index === team.length - 1) return;
    const newTeam = [...team];
    [newTeam[index], newTeam[index + 1]] = [newTeam[index + 1], newTeam[index]];
    
    const updatedOrder = newTeam.map((item, idx) => ({
      id: item.id,
      order: idx
    }));

    setTeam(newTeam);

    try {
      await api.reorderTeam(updatedOrder);
      showToast('Order updated successfully');
    } catch (error) {
      showToast('Error updating order', 'error');
      fetchData();
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
          <p className="text-white/50">Manage team members displayed on About page</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Team List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member, index) => (
          <div
            key={member.id}
            draggable
            onDragStart={(e) => handleDragStart(e, member)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, member)}
            className="card cursor-move hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <GripVertical className="w-5 h-5 text-white/30 flex-shrink-0 mt-1" />
              
              {member.image && (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{member.name}</h3>
                <p className="text-white/50 text-sm truncate">{member.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/70">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-white/40 hover:text-white/70">
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
              <div className="flex gap-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="px-2 py-1 text-xs rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/70"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === team.length - 1}
                  className="px-2 py-1 text-xs rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/70"
                >
                  ↓
                </button>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => openModal(member)}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <Edit2 className="w-4 h-4 text-white/50" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {team.length === 0 && (
          <div className="card text-center py-12 md:col-span-2 lg:col-span-3">
            <p className="text-white/50">No team members yet. Add your first member!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingItem ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button onClick={closeModal} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
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
                  placeholder="CEO & Founder"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">LinkedIn URL *</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/johndoe"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Profile Image</label>
                <div className="space-y-2">
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                  )}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg or upload below"
                      className="flex-1"
                    />
                    <label className="btn btn-secondary cursor-pointer">
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
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

export default TeamManager;
