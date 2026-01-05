import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import * as api from '../api/index.js';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'Upcoming',
    description: '',
    images: [],
    location: '',
    capacity: '',
    registrationUrl: '',
  });

  const fetchEvents = async () => {
    try {
      const response = await api.getEvents();
      setEvents(response.data.data || []);
    } catch (error) {
      showToast('Error fetching events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title || '',
        date: event.date || '',
        type: event.type || 'Upcoming',
        description: event.description || '',
        images: event.images || [],
        location: event.location || '',
        capacity: event.capacity || '',
        registrationUrl: event.registrationUrl || '',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        date: '',
        type: 'Upcoming',
        description: '',
        images: [],
        location: '',
        capacity: '',
        registrationUrl: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, formData);
        showToast('Event updated successfully');
      } else {
        await api.createEvent(formData);
        showToast('Event created successfully');
      }
      closeModal();
      fetchEvents();
    } catch (error) {
      showToast(error.response?.data?.error || 'Error saving event', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.deleteEvent(id);
      showToast('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      showToast('Error deleting event', 'error');
    }
  };

  const handleStatusChange = async (id, type) => {
    try {
      await api.updateEventStatus(id, type);
      showToast('Status updated');
      fetchEvents();
    } catch (error) {
      showToast('Error updating status', 'error');
    }
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
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
          <p className="text-white/50">Manage your events - create, edit, or delete</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="card flex items-start gap-6">
              {/* Thumbnail */}
              <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                {event.images?.[0] ? (
                  <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white/20" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <p className="text-white/50 text-sm mt-1">{event.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={event.type}
                      onChange={(e) => handleStatusChange(event.id, e.target.value)}
                      className="text-sm py-1.5 px-3"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Past">Past</option>
                    </select>
                  </div>
                </div>
                <p className="text-white/40 text-sm mt-2 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className={`badge ${
                    event.type === 'Ongoing' ? 'badge-green' :
                    event.type === 'Upcoming' ? 'badge-purple' :
                    'badge-gray'
                  }`}>
                    {event.type}
                  </span>
                  {event.location && (
                    <span className="text-white/40 text-xs">{event.location}</span>
                  )}
                  {event.images?.length > 0 && (
                    <span className="text-white/40 text-xs">{event.images.length} images</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(event)}
                  className="btn btn-secondary p-2"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="btn btn-danger p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No events yet. Create your first event!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#111] border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingEvent ? 'Edit Event' : 'Create Event'}
              </h2>
              <button onClick={closeModal} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event title"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Date *</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g., Oct 2024, Coming Soon"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Status *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Past">Past</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event description..."
                    required
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Event location"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Max attendees"
                    className="w-full"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Registration URL</label>
                  <input
                    type="url"
                    value={formData.registrationUrl}
                    onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Images</label>
                  <div className="space-y-3">
                    {formData.images.map((url, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <img src={url} alt="" className="w-16 h-12 object-cover rounded" />
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index] = e.target.value;
                            setFormData({ ...formData, images: newImages });
                          }}
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="btn btn-danger p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="btn btn-secondary w-full"
                    >
                      <Plus className="w-4 h-4" />
                      Add Image URL
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingEvent ? 'Update' : 'Create'}
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

export default EventsManager;
