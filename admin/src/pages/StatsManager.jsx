import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, TrendingUp, Users, Globe, Star, Award, Target } from 'lucide-react';
import * as api from '../api/index.js';

const ICON_OPTIONS = [
  { value: 'TrendingUp', label: 'Trending Up', Icon: TrendingUp },
  { value: 'Users', label: 'Users', Icon: Users },
  { value: 'Globe', label: 'Globe', Icon: Globe },
  { value: 'Star', label: 'Star', Icon: Star },
  { value: 'Award', label: 'Award', Icon: Award },
  { value: 'Target', label: 'Target', Icon: Target },
];

const StatsManager = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    label: '',
    value: '',
    numericValue: '',
    suffix: '',
    icon: 'TrendingUp',
  });

  const fetchStats = async () => {
    try {
      const response = await api.getStats();
      setStats(response.data.data || []);
    } catch (error) {
      showToast('Error fetching stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (stat = null) => {
    if (stat) {
      setEditingStat(stat);
      setFormData({
        label: stat.label || '',
        value: stat.value || '',
        numericValue: stat.numericValue || '',
        suffix: stat.suffix || '',
        icon: stat.icon || 'TrendingUp',
      });
    } else {
      setEditingStat(null);
      setFormData({
        label: '',
        value: '',
        numericValue: '',
        suffix: '',
        icon: 'TrendingUp',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStat(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingStat) {
        await api.updateStat(editingStat.id, formData);
        showToast('Stat updated successfully');
      } else {
        await api.createStat(formData);
        showToast('Stat created successfully');
      }
      closeModal();
      fetchStats();
    } catch (error) {
      showToast(error.response?.data?.error || 'Error saving stat', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    
    try {
      await api.deleteStat(id);
      showToast('Stat deleted successfully');
      fetchStats();
    } catch (error) {
      showToast('Error deleting stat', 'error');
    }
  };

  const getIconComponent = (iconName) => {
    const icon = ICON_OPTIONS.find(i => i.value === iconName);
    return icon ? icon.Icon : TrendingUp;
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
          <p className="text-white/50">Manage the statistics displayed on your homepage</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add Stat
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = getIconComponent(stat.icon);
          return (
            <div key={stat.id} className="card group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(stat)}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    <Edit2 className="w-4 h-4 text-white/50" />
                  </button>
                  <button
                    onClick={() => handleDelete(stat.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-white/50 text-sm mt-1">{stat.label}</p>
            </div>
          );
        })}

        {stats.length === 0 && (
          <div className="col-span-full card text-center py-12">
            <TrendingUp className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No stats yet. Add your first stat!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md">
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingStat ? 'Edit Stat' : 'Add Stat'}
              </h2>
              <button onClick={closeModal} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Label *</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Active Members"
                  required
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Display Value *</label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g., 600+"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Numeric Value</label>
                  <input
                    type="number"
                    value={formData.numericValue}
                    onChange={(e) => setFormData({ ...formData, numericValue: e.target.value })}
                    placeholder="600"
                    className="w-full"
                  />
                  <p className="text-xs text-white/30 mt-1">For count-up animation</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Suffix</label>
                  <input
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    placeholder="e.g., +, %, k+"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Icon *</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full"
                  >
                    {ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                      {editingStat ? 'Update' : 'Create'}
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

export default StatsManager;
