import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
export const changePassword = (currentPassword, newPassword) =>
    api.put('/auth/password', { currentPassword, newPassword });

// Events
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const updateEventStatus = (id, type) => api.put(`/events/${id}/status`, { type });
export const reorderEvents = (order) => api.put('/events/bulk/reorder', { order });

// Stats
export const getStats = () => api.get('/stats');
export const getStat = (id) => api.get(`/stats/${id}`);
export const createStat = (data) => api.post('/stats', data);
export const updateStat = (id, data) => api.put(`/stats/${id}`, data);
export const deleteStat = (id) => api.delete(`/stats/${id}`);
export const reorderStats = (order) => api.put('/stats/bulk/reorder', { order });

// Testimonials
export const getTestimonials = () => api.get('/testimonials?all=true');
export const getTestimonial = (id) => api.get(`/testimonials/${id}`);
export const createTestimonial = (data) => api.post('/testimonials', data);
export const updateTestimonial = (id, data) => api.put(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);
export const toggleTestimonial = (id) => api.put(`/testimonials/${id}/toggle`);

// FAQs
export const getFaqs = () => api.get('/faqs?all=true');
export const getFaq = (id) => api.get(`/faqs/${id}`);
export const createFaq = (data) => api.post('/faqs', data);
export const updateFaq = (id, data) => api.put(`/faqs/${id}`, data);
export const deleteFaq = (id) => api.delete(`/faqs/${id}`);
export const toggleFaq = (id) => api.put(`/faqs/${id}/toggle`);
export const reorderFaqs = (order) => api.put('/faqs/bulk/reorder', { order });

// Milestones
export const getMilestones = () => api.get('/milestones');
export const getMilestone = (id) => api.get(`/milestones/${id}`);
export const createMilestone = (data) => api.post('/milestones', data);
export const updateMilestone = (id, data) => api.put(`/milestones/${id}`, data);
export const deleteMilestone = (id) => api.delete(`/milestones/${id}`);
export const reorderMilestones = (order) => api.put('/milestones/bulk/reorder', { order });

// Team
export const getTeam = () => api.get('/team');
export const getTeamMember = (id) => api.get(`/team/${id}`);
export const createTeamMember = (data) => api.post('/team', data);
export const updateTeamMember = (id, data) => api.put(`/team/${id}`, data);
export const deleteTeamMember = (id) => api.delete(`/team/${id}`);
export const reorderTeam = (order) => api.put('/team/bulk/reorder', { order });

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);
export const resetSettings = () => api.post('/settings/reset');

// Upload
export const uploadImage = (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const uploadImages = (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteImage = (filename) => api.delete(`/upload/${filename}`);
export const listImages = () => api.get('/upload/list');

export default api;
