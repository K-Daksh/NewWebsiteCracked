import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, BarChart3, MessageSquare, HelpCircle, 
  Milestone as MilestoneIcon, Settings, Zap, LogOut, User,
  ArrowLeft, Plus, Edit2, Trash2, X, Save, Eye, EyeOff, TrendingUp,
  Users, Globe, Star, Award, Target, Trophy, ExternalLink,
  Upload, Image as ImageIcon, ChevronUp, ChevronDown, GripVertical, Mail, Linkedin,
  BookOpen, Briefcase
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import * as api from '../api/index.js';
import TeamManager from './TeamManager';
import BlogManager from './BlogManager'; // Consolidated imports
import HiringRequests from './HiringRequests';
// Spinner Component
const Spinner = ({ size = 'md' }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <div className={`${sizeClasses[size]} border-2 border-purple-500 border-t-transparent rounded-full animate-spin`} />;
};

// Loading Overlay
const LoadingOverlay = ({ show }) => show && (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
    <Spinner size="lg" />
  </div>
);

// Toast Component
const Toast = ({ message, type }) => (
  <div className={`fixed bottom-4 right-4 z-[100] px-6 py-4 rounded-lg shadow-2xl animate-fadeIn ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
    {message}
  </div>
);

// Modal Wrapper
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#111] border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

// Icon mapping
const ICON_MAP = { TrendingUp, Users, Globe, Star, Award, Target, Trophy, Zap };

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
};

// Navigation items
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'stats', label: 'Impact Stats', icon: BarChart3 },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'milestones', label: 'Milestones', icon: MilestoneIcon },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'hiring', label: 'Hiring Requests', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ============ DASHBOARD ============
const DashboardPage = ({ setActiveTab }) => {
  const [stats, setStats] = useState({ events: 0, stats: 0, testimonials: 0, faqs: 0, milestones: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, statsRes, testimonialsRes, faqsRes, milestonesRes] = await Promise.all([
          api.getEvents(), api.getStats(), api.getTestimonials(), api.getFaqs(), api.getMilestones()
        ]);
        setStats({
          events: eventsRes.data?.length || 0,
          stats: statsRes.data?.length || 0,
          testimonials: testimonialsRes.data?.length || 0,
          faqs: faqsRes.data?.length || 0,
          milestones: milestonesRes.data?.length || 0,
        });
        const sortedEvents = (eventsRes.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentEvents(sortedEvents.slice(0, 5));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  const quickLinks = [
    { id: 'events', icon: Calendar, label: 'Events', count: stats.events },
    { id: 'stats', icon: BarChart3, label: 'Stats', count: stats.stats },
    { id: 'testimonials', icon: MessageSquare, label: 'Testimonials', count: stats.testimonials },
    { id: 'faqs', icon: HelpCircle, label: 'FAQs', count: stats.faqs },
    { id: 'milestones', icon: MilestoneIcon, label: 'Milestones', count: stats.milestones },
  ];

  return (
    <div className="space-y-8">
      <div><h2 className="text-3xl font-bold text-white">Welcome Back! 👋</h2><p className="text-white/50 mt-1">Here's what's happening with your website</p></div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {quickLinks.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all group">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">{item.count}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider mt-1">{item.label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Events</h3>
          <button onClick={() => setActiveTab('events')} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">View All <ExternalLink className="w-3 h-3" /></button>
        </div>
        <div className="space-y-3">
          {recentEvents.length > 0 ? recentEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                {event.images?.[0] && <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{event.title}</p>
                <p className="text-white/50 text-sm">{formatDate(event.date)}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.type === 'Ongoing' ? 'bg-green-500/20 text-green-400' : event.type === 'Upcoming' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-white/60'}`}>
                {event.type}
              </span>
            </div>
          )) : <p className="text-white/50 text-center py-8">No events yet</p>}
        </div>
      </div>
    </div>
  );
};

// ============ EVENTS MANAGER ============
const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ title: '', date: '', type: 'Upcoming', description: '', images: [], location: '', capacity: '', registrationUrl: '' });
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try { 
      const res = await api.getEvents(); 
      // Sort by date
      const sorted = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(sorted); 
    } catch (e) { showToast('Error fetching events', 'error'); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const openModal = (item = null) => {
    if (item) { 
      setEditingItem(item); 
      setFormData({ 
        title: item.title || '', 
        date: item.date || '', 
        type: item.type || 'Upcoming', 
        description: item.description || '', 
        images: item.images || [], 
        location: item.location || '',
        capacity: item.capacity || '',
        registrationUrl: item.registrationUrl || ''
      }); 
    } else { 
      setEditingItem(null); 
      setFormData({ title: '', date: '', type: 'Upcoming', description: '', images: [], location: '', capacity: '', registrationUrl: '' }); 
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setSaving(true);
    try {
      if (editingItem) { await api.updateEvent(editingItem.id, formData); showToast('Event updated'); }
      else { await api.createEvent(formData); showToast('Event created'); }
      setShowModal(false); 
      fetchData();
    } catch (e) { showToast(e.message || 'Error saving', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try { await api.deleteEvent(id); showToast('Deleted'); fetchData(); } catch (e) { showToast('Error deleting', 'error'); }
  };

  // Mark event as complete (Ongoing -> Past)
  const handleMarkComplete = async (id) => {
    try { 
      await api.updateEvent(id, { type: 'Past' }); 
      showToast('Event marked as complete'); 
      fetchData(); 
    } catch (e) { 
      showToast('Error marking complete', 'error'); 
    }
  };

  // Start registration (Upcoming -> Ongoing)
  const handleStartRegistration = async (id) => {
    try { 
      await api.updateEvent(id, { type: 'Ongoing' }); 
      showToast('Registration started! Event is now ongoing.'); 
      fetchData(); 
    } catch (e) { 
      showToast('Error starting registration', 'error'); 
    }
  };

  // Image handling
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const res = await api.uploadImage(file);
        if (res.success && res.data?.url) {
          setFormData(prev => ({ ...prev, images: [...prev.images, res.data.url] }));
        }
      }
      showToast('Image(s) uploaded');
    } catch (e) { showToast('Upload failed', 'error'); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addImageUrl = () => { 
    const url = prompt('Enter image URL:'); 
    if (url) setFormData({ ...formData, images: [...formData.images, url] }); 
  };

  const removeImage = async (index) => {
    const url = formData.images[index];
    // Try to delete from bucket if it's our URL
    if (url.includes('storage.googleapis.com')) {
      const filename = url.split('/').pop();
      try { await api.deleteImage(filename); } catch (e) { }
    }
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  // Group events by type
  const ongoingEvents = events.filter(e => e.type === 'Ongoing');
  const upcomingEvents = events.filter(e => e.type === 'Upcoming');
  const pastEvents = events.filter(e => e.type === 'Past');

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  const EventSection = ({ title, items, color, isOngoing = false, isUpcoming = false }) => items.length > 0 && (
    <div className="mb-8">
      <h3 className={`text-lg font-semibold mb-4 ${color}`}>{title} ({items.length})</h3>
      <div className="grid gap-4">
        {items.map((event) => (
          <div key={event.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4 relative">
            <div className="w-24 h-18 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
              {event.images?.[0] ? <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-white/20 m-auto mt-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold">{event.title}</h4>
              <p className="text-white/50 text-sm">{formatDate(event.date)} • {event.location || 'No location'}</p>
              <p className="text-white/40 text-sm mt-1 line-clamp-1">{event.description}</p>
              {event.capacity && <p className="text-white/30 text-xs mt-1">Capacity: {event.capacity}</p>}
            </div>
            <div className="flex items-center gap-2">
              {isUpcoming && (
                <button 
                  onClick={() => handleStartRegistration(event.id)} 
                  className="px-3 py-1.5 text-xs rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-colors"
                >
                  Start Registration
                </button>
              )}
              {isOngoing && (
                <button 
                  onClick={() => handleMarkComplete(event.id)} 
                  className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  Mark Complete
                </button>
              )}
              <button onClick={() => openModal(event)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10"><Edit2 className="w-4 h-4 text-white/50" /></button>
              <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <p className="text-white/50">Manage your events</p>
        <button onClick={() => openModal()} className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2"><Plus className="w-4 h-4" />Add Event</button>
      </div>

      <EventSection title="Ongoing" items={ongoingEvents} color="text-green-400" isOngoing={true} />
      <EventSection title="Upcoming" items={upcomingEvents} color="text-purple-400" isUpcoming={true} />
      <EventSection title="Past" items={pastEvents} color="text-white/60" />

      {events.length === 0 && <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center"><ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" /><p className="text-white/50">No events yet</p></div>}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Event' : 'Create Event'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm text-white/70 mb-2">Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Date *</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 [color-scheme:dark]" 
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Status</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})} 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Upcoming" className="bg-[#1a1a1a] text-white">Upcoming</option>
                <option value="Ongoing" className="bg-[#1a1a1a] text-white">Ongoing</option>
                <option value="Past" className="bg-[#1a1a1a] text-white">Past</option>
              </select>
            </div>
          </div>
          
          <div><label className="block text-sm text-white/70 mb-2">Description *</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-white/70 mb-2">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" /></div>
            <div><label className="block text-sm text-white/70 mb-2">Capacity *</label><input type="text" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} placeholder="e.g., 200 attendees" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" /></div>
          </div>

          {/* Registration Link - Only for Ongoing events */}
          {formData.type === 'Ongoing' && (
            <div>
              <label className="block text-sm text-white/70 mb-2">Registration Link</label>
              <input 
                type="url" 
                value={formData.registrationUrl} 
                onChange={(e) => setFormData({...formData, registrationUrl: e.target.value})} 
                placeholder="https://forms.google.com/..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" 
              />
              <p className="text-white/30 text-xs mt-1">Users will be redirected here when clicking "Register Now"</p>
            </div>
          )}
          
          {/* Images Section */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Images</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {formData.images.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-white/5 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <label className={`flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                {uploading ? <Spinner size="sm" /> : <Upload className="w-4 h-4" />}
                Upload Image
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
              <button type="button" onClick={addImageUrl} className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 flex items-center gap-2">
                <Plus className="w-4 h-4" />Add URL
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2">
              {saving ? <Spinner size="sm" /> : <><Save className="w-4 h-4" />{editingItem ? 'Update' : 'Create'}</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ============ STATS MANAGER ============
const StatsManager = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ label: '', value: '', numericValue: '', suffix: '', icon: 'TrendingUp' });

  const fetchData = async () => { setLoading(true); try { const res = await api.getStats(); setStats(res.data || []); } catch (e) { showToast('Error', 'error'); } setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const openModal = (item = null) => {
    if (item) { setEditingItem(item); setFormData({ label: item.label || '', value: item.value || '', numericValue: item.numericValue || '', suffix: item.suffix || '', icon: item.icon || 'TrendingUp' }); }
    else { setEditingItem(null); setFormData({ label: '', value: '', numericValue: '', suffix: '', icon: 'TrendingUp' }); }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editingItem) { await api.updateStat(editingItem.id, formData); showToast('Updated'); }
      else { await api.createStat(formData); showToast('Created'); }
      setShowModal(false); fetchData();
    } catch (e) { showToast('Error', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await api.deleteStat(id); showToast('Deleted'); fetchData(); } catch (e) { showToast('Error', 'error'); } };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <p className="text-white/50">Manage homepage statistics</p>
        <button onClick={() => openModal()} className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2"><Plus className="w-4 h-4" />Add Stat</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => { const IconComp = ICON_MAP[stat.icon] || TrendingUp; return (
          <div key={stat.id} className="bg-white/5 border border-white/10 rounded-xl p-6 group relative">
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(stat)} className="p-1.5 rounded hover:bg-white/10"><Edit2 className="w-3.5 h-3.5 text-white/50" /></button>
              <button onClick={() => handleDelete(stat.id)} className="p-1.5 rounded hover:bg-red-500/20"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4"><IconComp className="w-6 h-6 text-purple-400" /></div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-white/50 text-sm mt-1">{stat.label}</p>
          </div>
        ); })}
        {stats.length === 0 && <div className="col-span-full bg-white/5 border border-white/10 rounded-xl p-12 text-center"><TrendingUp className="w-12 h-12 text-white/20 mx-auto mb-4" /><p className="text-white/50">No stats yet</p></div>}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Stat' : 'Add Stat'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm text-white/70 mb-2">Label *</label><input type="text" value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})} placeholder="Active Members" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-white/70 mb-2">Display Value *</label><input type="text" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} placeholder="600+" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
            <div><label className="block text-sm text-white/70 mb-2">Numeric Value</label><input type="number" value={formData.numericValue} onChange={(e) => setFormData({...formData, numericValue: e.target.value})} placeholder="600" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-white/70 mb-2">Suffix</label><input type="text" value={formData.suffix} onChange={(e) => setFormData({...formData, suffix: e.target.value})} placeholder="+" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
            <div><label className="block text-sm text-white/70 mb-2">Icon</label><select value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white">{Object.keys(ICON_MAP).map(k => <option key={k} value={k} className="bg-[#1a1a1a]">{k}</option>)}</select></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2">{saving ? <Spinner size="sm" /> : <><Save className="w-4 h-4" />{editingItem ? 'Update' : 'Create'}</>}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ============ FAQ MANAGER WITH LOCAL BATCH UPDATES ============
const FaqsManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [originalFaqs, setOriginalFaqs] = useState([]); // Track original from server
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '', isActive: true });
  const [hasChanges, setHasChanges] = useState(false);

  const fetchData = async () => { 
    setLoading(true); 
    try { 
      const res = await api.getFaqs(); 
      const sorted = (res.data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
      setFaqs(sorted);
      setOriginalFaqs(JSON.parse(JSON.stringify(sorted))); // Deep copy
      setHasChanges(false);
    } catch (e) { showToast('Error fetching FAQs', 'error'); } 
    setLoading(false); 
  };
  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const openModal = (item = null) => {
    if (item) { setEditingItem(item); setFormData({ question: item.question || '', answer: item.answer || '', isActive: item.isActive !== false }); }
    else { setEditingItem(null); setFormData({ question: '', answer: '', isActive: true }); }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editingItem) { await api.updateFaq(editingItem.id, formData); showToast('Updated'); }
      else { await api.createFaq({ ...formData, order: faqs.length }); showToast('Created'); }
      setShowModal(false); fetchData();
    } catch (e) { showToast('Error', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await api.deleteFaq(id); showToast('Deleted'); fetchData(); } catch (e) { showToast('Error', 'error'); } };
  
  // Toggle locally first
  const handleToggleLocal = (id) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
    setHasChanges(true);
  };

  // Move FAQ up one position
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newFaqs = [...faqs];
    [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
    // Update orders
    const updatedFaqs = newFaqs.map((faq, idx) => ({ ...faq, order: idx }));
    setFaqs(updatedFaqs);
    setHasChanges(true);
  };

  // Move FAQ down one position
  const handleMoveDown = (index) => {
    if (index === faqs.length - 1) return;
    const newFaqs = [...faqs];
    [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
    // Update orders
    const updatedFaqs = newFaqs.map((faq, idx) => ({ ...faq, order: idx }));
    setFaqs(updatedFaqs);
    setHasChanges(true);
  };

  // Batch save all changes to server
  const handleSaveAllChanges = async () => {
    setSaving(true);
    try {
      // Find what changed and update
      for (const faq of faqs) {
        const original = originalFaqs.find(o => o.id === faq.id);
        if (!original || faq.order !== original.order || faq.isActive !== original.isActive) {
          await api.updateFaq(faq.id, { order: faq.order, isActive: faq.isActive });
        }
      }
      showToast('All changes saved!');
      setOriginalFaqs(JSON.parse(JSON.stringify(faqs)));
      setHasChanges(false);
    } catch (e) { 
      showToast('Failed to save changes', 'error'); 
    }
    setSaving(false);
  };

  // Reset to original
  const handleDiscardChanges = () => {
    setFaqs(JSON.parse(JSON.stringify(originalFaqs)));
    setHasChanges(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/50">Manage FAQs</p>
          <p className="text-white/30 text-sm">Use up/down arrows to reorder, then save changes</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <>
              <button onClick={handleDiscardChanges} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">Discard</button>
              <button onClick={handleSaveAllChanges} disabled={saving} className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-green-600 to-green-700 text-white flex items-center gap-2">
                {saving ? <Spinner size="sm" /> : <><Save className="w-4 h-4" />Save Changes</>}
              </button>
            </>
          )}
          <button onClick={() => openModal()} className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2"><Plus className="w-4 h-4" />Add FAQ</button>
        </div>
      </div>
      
      {hasChanges && <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 text-amber-400 text-sm">You have unsaved changes</div>}
      
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div 
            key={faq.id} 
            className={`bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3 transition-all hover:border-purple-500/30 ${faq.isActive === false ? 'opacity-50' : ''}`}
          >
            {/* Up/Down buttons */}
            <div className="flex flex-col gap-1 mt-1">
              <button 
                onClick={() => handleMoveUp(index)} 
                disabled={index === 0}
                className={`p-1 rounded transition-colors ${index === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-purple-400 hover:bg-white/10'}`}
                title="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleMoveDown(index)} 
                disabled={index === faqs.length - 1}
                className={`p-1 rounded transition-colors ${index === faqs.length - 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-purple-400 hover:bg-white/10'}`}
                title="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{faq.question}</p>
              <p className="text-white/50 text-sm mt-1 line-clamp-2">{faq.answer}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleToggleLocal(faq.id)} className="p-2 rounded-lg hover:bg-white/10">{faq.isActive !== false ? <Eye className="w-4 h-4 text-white/50" /> : <EyeOff className="w-4 h-4 text-white/50" />}</button>
              <button onClick={() => openModal(faq)} className="p-2 rounded-lg hover:bg-white/10"><Edit2 className="w-4 h-4 text-white/50" /></button>
              <button onClick={() => handleDelete(faq.id)} className="p-2 rounded-lg hover:bg-red-500/20"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center"><HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-4" /><p className="text-white/50">No FAQs yet</p></div>}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit FAQ' : 'Add FAQ'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm text-white/70 mb-2">Question *</label><input type="text" value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
          <div><label className="block text-sm text-white/70 mb-2">Answer *</label><textarea value={formData.answer} onChange={(e) => setFormData({...formData, answer: e.target.value})} required rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
          <label className="flex items-center gap-3"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded" /><span className="text-white/70">Show on website</span></label>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2">{saving ? <Spinner size="sm" /> : <><Save className="w-4 h-4" />{editingItem ? 'Update' : 'Create'}</>}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ============ SIMPLE CRUD MANAGER (Testimonials, Milestones) ============
const SimpleCrudManager = ({ type, fields, fetchFn, createFn, updateFn, deleteFn, toggleFn }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchData = async () => { setLoading(true); try { const res = await fetchFn(); setItems(res.data || []); } catch (e) { showToast('Error', 'error'); } setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const showToast = (message, t = 'success') => { setToast({ message, type: t }); setTimeout(() => setToast(null), 3000); };

  const openModal = (item = null) => {
    const initial = {};
    fields.forEach(f => { initial[f.key] = item ? (item[f.key] ?? f.default ?? '') : (f.default ?? ''); });
    setEditingItem(item);
    setFormData(initial);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editingItem) { await updateFn(editingItem.id, formData); showToast('Updated'); }
      else { await createFn(formData); showToast('Created'); }
      setShowModal(false); fetchData();
    } catch (e) { showToast('Error', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await deleteFn(id); showToast('Deleted'); fetchData(); } catch (e) { showToast('Error', 'error'); } };
  const handleToggle = toggleFn ? async (id) => { try { await toggleFn(id); showToast('Toggled'); fetchData(); } catch (e) { showToast('Error', 'error'); } } : null;

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <p className="text-white/50">Manage {type}</p>
        <button onClick={() => openModal()} className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2"><Plus className="w-4 h-4" />Add</button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className={`bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4 ${item.isActive === false ? 'opacity-50' : ''}`}>
            <div className="flex-1">
              {fields.map(f => f.display && <p key={f.key} className={f.className}>{item[f.key]}</p>)}
            </div>
            <div className="flex items-center gap-2">
              {handleToggle && <button onClick={() => handleToggle(item.id)} className="p-2 rounded-lg hover:bg-white/10">{item.isActive !== false ? <Eye className="w-4 h-4 text-white/50" /> : <EyeOff className="w-4 h-4 text-white/50" />}</button>}
              <button onClick={() => openModal(item)} className="p-2 rounded-lg hover:bg-white/10"><Edit2 className="w-4 h-4 text-white/50" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/20"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center"><p className="text-white/50">No {type} yet</p></div>}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? `Edit` : `Add`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.filter(f => f.editable !== false).map(f => (
            <div key={f.key}>
              <label className="block text-sm text-white/70 mb-2">{f.label} {f.required && '*'}</label>
              {f.type === 'textarea' ? <textarea value={formData[f.key] || ''} onChange={(e) => setFormData({...formData, [f.key]: e.target.value})} rows={f.rows || 3} required={f.required} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
               : f.type === 'checkbox' ? <label className="flex items-center gap-3"><input type="checkbox" checked={formData[f.key] || false} onChange={(e) => setFormData({...formData, [f.key]: e.target.checked})} className="w-5 h-5" /><span className="text-white/70">{f.checkLabel}</span></label>
               : <input type={f.type || 'text'} value={formData[f.key] || ''} onChange={(e) => setFormData({...formData, [f.key]: e.target.value})} required={f.required} placeholder={f.placeholder} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2">{saving ? <Spinner size="sm" /> : <><Save className="w-4 h-4" />{editingItem ? 'Update' : 'Create'}</>}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Field configs
const testimonialFields = [
  { key: 'name', label: 'Name', required: true, display: true, className: 'text-white font-medium' },
  { key: 'role', label: 'Role', required: true, display: true, className: 'text-white/50 text-sm' },
  { key: 'company', label: 'Company', display: false },
  { key: 'image', label: 'Image URL', type: 'url' },
  { key: 'text', label: 'Testimonial', type: 'textarea', required: true, display: true, className: 'text-white/40 text-sm mt-2' },
  { key: 'isActive', label: 'Visible', type: 'checkbox', checkLabel: 'Show on website', default: true },
];

const milestoneFields = [
  { key: 'year', label: 'Year/Phase', required: true, display: true, className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 mb-1' },
  { key: 'title', label: 'Title', required: true, display: true, className: 'text-white font-medium' },
  { key: 'description', label: 'Description', type: 'textarea', required: true, display: true, className: 'text-white/50 text-sm mt-1' },
];

// TeamManager is now imported from ./TeamManager

// ============ SETTINGS MANAGER ============
const SettingsManager = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchData = async () => { setLoading(true); try { const res = await api.getSettings(); setSettings(res.data || {}); } catch (e) { showToast('Error', 'error'); } setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };
  const handleChange = (key, value) => setSettings({ ...settings, [key]: value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.updateSettings(settings); showToast('Saved'); } catch (e) { showToast('Error', 'error'); }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && <Toast {...toast} />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Hero Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-white/70 mb-2">Tagline</label><input type="text" value={settings.heroTagline || ''} onChange={(e) => handleChange('heroTagline', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
            <div><label className="block text-sm text-white/70 mb-2">CTA Button</label><input type="text" value={settings.joinCta || ''} onChange={(e) => handleChange('joinCta', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm text-white/70 mb-2">WhatsApp</label><input type="url" value={settings.whatsappLink || ''} onChange={(e) => handleChange('whatsappLink', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
            <div><label className="block text-sm text-white/70 mb-2">Instagram</label><input type="url" value={settings.instagramLink || ''} onChange={(e) => handleChange('instagramLink', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
            <div><label className="block text-sm text-white/70 mb-2">LinkedIn</label><input type="url" value={settings.linkedinLink || ''} onChange={(e) => handleChange('linkedinLink', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-white/70 mb-2">Email</label><input type="email" value={settings.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
            <div><label className="block text-sm text-white/70 mb-2">Phone</label><input type="tel" value={settings.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" /></div>
          </div>
        </div>
        <button type="submit" disabled={saving} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center gap-2">{saving ? <Spinner size="sm" /> : <><Save className="w-4 h-4" />Save Settings</>}</button>
      </form>
    </div>
  );
};

// ============ MAIN ADMIN DASHBOARD ============
export const AdminDashboard = ({ onBack }) => {
  const { user, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage setActiveTab={setActiveTab} />;
      case 'events': return <EventsManager />;
      case 'stats': return <StatsManager />;
      case 'testimonials': return <SimpleCrudManager type="testimonials" fields={testimonialFields} fetchFn={api.getTestimonials} createFn={api.createTestimonial} updateFn={api.updateTestimonial} deleteFn={api.deleteTestimonial} toggleFn={api.toggleTestimonial} />;
      case 'faqs': return <FaqsManager />;
      case 'milestones': return <SimpleCrudManager type="milestones" fields={milestoneFields} fetchFn={api.getMilestones} createFn={api.createMilestone} updateFn={api.updateMilestone} deleteFn={api.deleteMilestone} />;
      case 'team': return <TeamManager />;
      case 'blog': return <BlogManager />;
      case 'hiring': return <HiringRequests />;
      case 'settings': return <SettingsManager />;
      default: return <DashboardPage setActiveTab={setActiveTab} />;
    }
  };

  const currentTitle = navItems.find(n => n.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/30"><Zap className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-lg font-bold text-white tracking-tight">Cracked</h1><p className="text-[10px] text-white/40 uppercase tracking-widest">Admin Panel</p></div>
          </div>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}><button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}><item.icon className="w-5 h-5" />{item.label}</button></li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={onBack} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white text-sm transition-all"><ArrowLeft className="w-4 h-4" />Back to Site</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white tracking-tight">{currentTitle}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><User className="w-4 h-4 text-purple-400" /></div>
                <div><p className="text-sm font-medium text-white">{user?.email || 'Admin'}</p><p className="text-[10px] text-white/40 uppercase tracking-widest">Admin</p></div>
              </div>
              <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"><LogOut className="w-4 h-4" />Logout</button>
            </div>
          </div>
        </header>
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
