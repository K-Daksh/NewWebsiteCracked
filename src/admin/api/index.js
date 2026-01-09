// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// Generic fetch wrapper
const apiCall = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.reload();
    }

    return response.json();
};

// Auth
export const login = (email, password) =>
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const getMe = () => apiCall('/auth/me');

export const changePassword = (currentPassword, newPassword) =>
    apiCall('/auth/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) });

// Events
export const getEvents = () => apiCall('/events');
export const getEvent = (id) => apiCall(`/events/${id}`);
export const createEvent = (data) => apiCall('/events', { method: 'POST', body: JSON.stringify(data) });
export const updateEvent = (id, data) => apiCall(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEvent = (id) => apiCall(`/events/${id}`, { method: 'DELETE' });
export const updateEventStatus = (id, type) => apiCall(`/events/${id}/status`, { method: 'PUT', body: JSON.stringify({ type }) });

// Stats
export const getStats = () => apiCall('/stats');
export const createStat = (data) => apiCall('/stats', { method: 'POST', body: JSON.stringify(data) });
export const updateStat = (id, data) => apiCall(`/stats/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteStat = (id) => apiCall(`/stats/${id}`, { method: 'DELETE' });

// Testimonials
export const getTestimonials = () => apiCall('/testimonials?all=true');
export const createTestimonial = (data) => apiCall('/testimonials', { method: 'POST', body: JSON.stringify(data) });
export const updateTestimonial = (id, data) => apiCall(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTestimonial = (id) => apiCall(`/testimonials/${id}`, { method: 'DELETE' });
export const toggleTestimonial = (id) => apiCall(`/testimonials/${id}/toggle`, { method: 'PUT' });

// FAQs
export const getFaqs = () => apiCall('/faqs?all=true');
export const createFaq = (data) => apiCall('/faqs', { method: 'POST', body: JSON.stringify(data) });
export const updateFaq = (id, data) => apiCall(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteFaq = (id) => apiCall(`/faqs/${id}`, { method: 'DELETE' });
export const toggleFaq = (id) => apiCall(`/faqs/${id}/toggle`, { method: 'PUT' });

// Milestones
export const getMilestones = () => apiCall('/milestones');
export const createMilestone = (data) => apiCall('/milestones', { method: 'POST', body: JSON.stringify(data) });
export const updateMilestone = (id, data) => apiCall(`/milestones/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMilestone = (id) => apiCall(`/milestones/${id}`, { method: 'DELETE' });
export const reorderMilestones = (order) => apiCall('/milestones/bulk/reorder', { method: 'PUT', body: JSON.stringify({ order }) });

// Blog
export const getBlogs = (page = 1, limit = 100) => apiCall(`/blog?page=${page}&limit=${limit}`);
export const createBlog = (data) => apiCall('/blog', { method: 'POST', body: JSON.stringify(data) });
export const updateBlog = (id, data) => apiCall(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBlog = (id) => apiCall(`/blog/${id}`, { method: 'DELETE' });

// Team
export const getTeam = () => apiCall('/team');
export const getTeamMember = (id) => apiCall(`/team/${id}`);
export const createTeamMember = (data) => apiCall('/team', { method: 'POST', body: JSON.stringify(data) });
export const updateTeamMember = (id, data) => apiCall(`/team/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTeamMember = (id) => apiCall(`/team/${id}`, { method: 'DELETE' });
export const reorderTeam = (order) => apiCall('/team/bulk/reorder', { method: 'PUT', body: JSON.stringify({ order }) });

// Settings
export const getSettings = () => apiCall('/settings');
export const updateSettings = (data) => apiCall('/settings', { method: 'PUT', body: JSON.stringify(data) });
export const resetSettings = () => apiCall('/settings/reset', { method: 'POST' });

// Upload
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
    });
    return response.json();
};

export const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
    });
    return response.json();
};

export const deleteImage = (filename) => apiCall(`/upload/${filename}`, { method: 'DELETE' });
export const listImages = () => apiCall('/upload/list');

// Hiring Requests
export const getHiringRequests = () => apiCall('/hiring');
export const updateHiringRequestStatus = (id, status) => apiCall(`/hiring/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
export const deleteHiringRequest = (id) => apiCall(`/hiring/${id}`, { method: 'DELETE' });
