import React, { useState, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import * as api from '../api/index.js';

const SettingsManager = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.getSettings();
      setSettings(response.data.data || {});
    } catch (error) {
      showToast('Error fetching settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      showToast('Settings saved successfully');
    } catch (error) {
      showToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all settings to defaults?')) return;
    try {
      await api.resetSettings();
      showToast('Settings reset to defaults');
      fetchData();
    } catch (error) {
      showToast('Error resetting settings', 'error');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {toast && <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>{toast.message}</div>}
      <p className="text-white/50">Configure site-wide settings like hero content, social links, and contact information</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Hero Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm text-white/70 mb-2">Tagline</label><input type="text" value={settings.heroTagline || ''} onChange={(e) => handleChange('heroTagline', e.target.value)} className="w-full" /></div>
            <div><label className="block text-sm text-white/70 mb-2">CTA Button Text</label><input type="text" value={settings.joinCta || ''} onChange={(e) => handleChange('joinCta', e.target.value)} className="w-full" /></div>
            <div><label className="block text-sm text-white/70 mb-2">Title Line 1</label><input type="text" value={settings.heroTitle1 || ''} onChange={(e) => handleChange('heroTitle1', e.target.value)} className="w-full" /></div>
            <div><label className="block text-sm text-white/70 mb-2">Title Line 2</label><input type="text" value={settings.heroTitle2 || ''} onChange={(e) => handleChange('heroTitle2', e.target.value)} className="w-full" /></div>
            <div className="md:col-span-2"><label className="block text-sm text-white/70 mb-2">Description</label><textarea value={settings.heroDescription || ''} onChange={(e) => handleChange('heroDescription', e.target.value)} rows={2} className="w-full" /></div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm text-white/70 mb-2">WhatsApp Group Link</label><input type="url" value={settings.whatsappLink || ''} onChange={(e) => handleChange('whatsappLink', e.target.value)} className="w-full" /></div>
            <div><label className="block text-sm text-white/70 mb-2">Instagram</label><input type="url" value={settings.instagramLink || ''} onChange={(e) => handleChange('instagramLink', e.target.value)} className="w-full" /></div>
            <div><label className="block text-sm text-white/70 mb-2">LinkedIn</label><input type="url" value={settings.linkedinLink || ''} onChange={(e) => handleChange('linkedinLink', e.target.value)} className="w-full" /></div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm text-white/70 mb-2">Email</label><input type="email" value={settings.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full" /></div>
            <div><label className="block text-sm text-white/70 mb-2">Phone</label><input type="tel" value={settings.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="w-full" /></div>
            <div className="md:col-span-2"><label className="block text-sm text-white/70 mb-2">Address</label><input type="text" value={settings.address || ''} onChange={(e) => handleChange('address', e.target.value)} className="w-full" /></div>
          </div>
        </div>

        {/* Footer */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Footer</h3>
          <div><label className="block text-sm text-white/70 mb-2">Footer Tagline</label><input type="text" value={settings.footerTagline || ''} onChange={(e) => handleChange('footerTagline', e.target.value)} className="w-full" /></div>
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={handleReset} className="btn btn-danger"><RotateCcw className="w-4 h-4" />Reset to Defaults</button>
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" />Save Settings</>}</button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
