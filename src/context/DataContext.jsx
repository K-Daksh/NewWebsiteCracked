import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCache, setCache } from '../utils/cacheService';

const DataContext = createContext(null);

// API Base URL - defaults to localhost:5000 for development, relative /api for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    events: [],
    stats: [],
    testimonials: [],
    faqs: [],
    milestones: [],
    settings: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async (forceRefresh = false) => {
    try {
      setError(null);
      
      // 1. Try to load from cache first
      if (!forceRefresh) {
        const cached = getCache();
        if (cached) {
          console.log('[DataContext] Loaded data from cache');
          setData(cached.data);
          setLoading(false); // Process immediately with cached data
          
          // Background validation: Check if version changed
          checkVersionAndRevalidate(cached.versionId);
          return;
        }
      }
      
      // If no cache or forced refresh, fetch fresh data
      setLoading(true);
      await fetchFreshData();
      
    } catch (err) {
      console.error('[DataContext] Error in data flow:', err);
      setError(err.message);
      handleFallback();
    } finally {
      setLoading(false);
    }
  };

  // Helper to check version and revalidate if needed
  const checkVersionAndRevalidate = async (currentVersionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/version`);
      if (response.ok) {
        const { versionId } = await response.json();
        
        if (versionId && versionId !== currentVersionId) {
          console.log(`[DataContext] Version mismatch (Cache: ${currentVersionId}, Server: ${versionId}). Fetching fresh data...`);
          await fetchFreshData();
        } else {
          console.log('[DataContext] Cache version matches server. No update needed.');
        }
      }
    } catch (err) {
      console.warn('[DataContext] Background version check failed:', err);
    }
  };

  // Helper to fetch fresh data from API
  const fetchFreshData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        const newData = {
          events: result.data.events || [],
          stats: result.data.stats || [],
          testimonials: result.data.testimonials || [],
          faqs: result.data.faqs || [],
          milestones: result.data.milestones || [],
          settings: result.data.settings || {},
        };
        
        setData(newData);
        
        // Update cache with new version
        if (result.versionId) {
          setCache(result.versionId, newData);
        }
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      throw err; // Propagate to main handler
    }
  };

  const handleFallback = async () => {
    // Fallback to static data if API fails (for development)
    try {
      const { EVENTS_DATA, STATS_DATA, TESTIMONIALS_DATA, FAQ_DATA, MILESTONES_DATA } = await import('../data/constants.js');
      setData({
        events: EVENTS_DATA || [],
        stats: STATS_DATA || [],
        testimonials: TESTIMONIALS_DATA || [],
        faqs: FAQ_DATA || [],
        milestones: MILESTONES_DATA || [],
        settings: {},
      });
      console.log('[DataContext] Loaded fallback static data');
    } catch (fallbackErr) {
      console.error('[DataContext] Fallback data also failed:', fallbackErr);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Helper function to refresh data
  const refresh = () => {
    fetchAllData(true);
  };

  // Derived data helpers - sort by date within each category
  const sortByDate = (events, newestFirst = true) => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return newestFirst ? dateB - dateA : dateA - dateB;
    });
  };
  
  const getEventsByType = (type) => sortByDate(data.events.filter(e => e.type === type));
  const ongoingEvents = sortByDate(data.events.filter(e => e.type === 'Ongoing'));
  const upcomingEvents = sortByDate(data.events.filter(e => e.type === 'Upcoming'), false); // Soonest first
  const pastEvents = sortByDate(data.events.filter(e => e.type === 'Past')); // Most recent first

  const value = {
    ...data,
    loading,
    error,
    refresh,
    getEventsByType,
    ongoingEvents,
    upcomingEvents,
    pastEvents,
    isReady: !loading && !error,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
