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
    team: [],
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

          
          // Check version BEFORE using cached data
          const versionValid = await validateCacheVersion(cached.versionId);
          
          if (versionValid) {
            setData(cached.data);
            setLoading(false);
            return;
          } else {
          }
        }
      }
      
      // If no cache or forced refresh, fetch fresh data
      setLoading(true);
      await fetchFreshData();
      
    } catch (err) {
      setError(err.message);
      handleFallback();
    } finally {
      setLoading(false);
    }
  };


  // Helper to validate if cached version matches server
  const validateCacheVersion = async (cachedVersionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/version`, {
        cache: 'no-cache'  // Bypass browser cache to get latest version
      });
      if (response.ok) {
        const { versionId } = await response.json();
        return versionId === cachedVersionId;
      }
      return false;
    } catch (err) {
      return false; // Assume stale on error
    }
  };

  // Helper to fetch fresh data from API
  const fetchFreshData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/all`, {
        cache: 'no-cache'  // Bypass browser cache to get latest data
      });
      
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
          team: result.data.team || [],
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

  /* Fallback logic removed as per cleanup requirements */
  const handleFallback = async () => {
    setError('Failed to load content. Please check your connection.');
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
