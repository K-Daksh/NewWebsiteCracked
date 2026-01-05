/**
 * Cache Service - LocalStorage Management
 * Handles caching of website data with version control
 */

const CACHE_KEY = 'cracked_digital_cache';
const META_KEY = 'cracked_digital_meta';

/**
 * Get cached data if available and valid
 * @returns {object|null} Cached data object or null if cache doesn't exist
 */
export const getCache = () => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            console.warn('[Cache] localStorage not available');
            return null;
        }

        const cacheStr = localStorage.getItem(CACHE_KEY);
        if (!cacheStr) {
            console.log('[Cache] No cache found');
            return null;
        }

        const cache = JSON.parse(cacheStr);

        // Validate cache structure
        if (!cache.versionId || !cache.data) {
            console.warn('[Cache] Invalid cache structure');
            clearCache();
            return null;
        }

        console.log(`[Cache] Retrieved cache - Version: ${cache.versionId}`);
        return cache;
    } catch (error) {
        console.error('[Cache] Error reading cache:', error);
        clearCache(); // Clear corrupted cache
        return null;
    }
};

/**
 * Store data in cache with version ID
 * @param {string} versionId - Cache version identifier
 * @param {object} data - Data to cache
 * @returns {boolean} Success status
 */
export const setCache = (versionId, data) => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            console.warn('[Cache] localStorage not available');
            return false;
        }

        const cache = {
            versionId,
            timestamp: Date.now(),
            data,
        };

        const cacheStr = JSON.stringify(cache);

        // Check if we're approaching quota (5MB typical limit)
        if (cacheStr.length > 4 * 1024 * 1024) { // 4MB warning threshold
            console.warn('[Cache] Cache payload is large (>4MB), approaching localStorage limit');
        }

        localStorage.setItem(CACHE_KEY, cacheStr);

        // Update metadata
        updateMeta('cacheHits', 0);
        updateMeta('cacheMisses', 0);
        updateMeta('lastUpdated', Date.now());

        console.log(`[Cache] Stored cache - Version: ${versionId}, Size: ${(cacheStr.length / 1024).toFixed(2)}KB`);
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('[Cache] localStorage quota exceeded');
            clearCache(); // Try to free up space
        } else {
            console.error('[Cache] Error storing cache:', error);
        }
        return false;
    }
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem(CACHE_KEY);
            console.log('[Cache] Cache cleared');
        }
    } catch (error) {
        console.error('[Cache] Error clearing cache:', error);
    }
};

/**
 * Get cache metadata
 * @returns {object} Cache statistics
 */
export const getCacheMeta = () => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return null;
        }

        const metaStr = localStorage.getItem(META_KEY);
        if (!metaStr) {
            return {
                cacheHits: 0,
                cacheMisses: 0,
                lastUpdated: null,
                lastChecked: null,
            };
        }

        return JSON.parse(metaStr);
    } catch (error) {
        console.error('[Cache] Error reading metadata:', error);
        return null;
    }
};

/**
 * Update cache metadata
 * @param {string} key - Metadata key
 * @param {any} value - Value to set
 */
const updateMeta = (key, value) => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }

        const meta = getCacheMeta() || {};
        meta[key] = value;
        localStorage.setItem(META_KEY, JSON.stringify(meta));
    } catch (error) {
        console.error('[Cache] Error updating metadata:', error);
    }
};

/**
 * Increment cache hit counter
 */
export const incrementCacheHits = () => {
    const meta = getCacheMeta() || {};
    updateMeta('cacheHits', (meta.cacheHits || 0) + 1);
    updateMeta('lastChecked', Date.now());
    console.log(`[Cache] Hit count: ${(meta.cacheHits || 0) + 1}`);
};

/**
 * Increment cache miss counter
 */
export const incrementCacheMisses = () => {
    const meta = getCacheMeta() || {};
    updateMeta('cacheMisses', (meta.cacheMisses || 0) + 1);
    updateMeta('lastChecked', Date.now());
    console.log(`[Cache] Miss count: ${(meta.cacheMisses || 0) + 1}`);
};

/**
 * Check if localStorage is available
 * @returns {boolean} True if available
 */
export const isLocalStorageAvailable = () => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return false;
        }

        // Test write/read
        const testKey = '__test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Get cache size in bytes
 * @returns {number} Cache size in bytes
 */
export const getCacheSize = () => {
    try {
        const cache = localStorage.getItem(CACHE_KEY);
        return cache ? cache.length : 0;
    } catch (error) {
        return 0;
    }
};

/**
 * Get cache info for debugging
 * @returns {object} Cache information
 */
export const getCacheInfo = () => {
    const cache = getCache();
    const meta = getCacheMeta();
    const size = getCacheSize();

    return {
        exists: !!cache,
        versionId: cache?.versionId || null,
        timestamp: cache?.timestamp || null,
        age: cache ? Date.now() - cache.timestamp : null,
        sizeKB: (size / 1024).toFixed(2),
        hits: meta?.cacheHits || 0,
        misses: meta?.cacheMisses || 0,
        hitRate: meta ? ((meta.cacheHits / (meta.cacheHits + meta.cacheMisses || 1)) * 100).toFixed(1) + '%' : 'N/A',
    };
};

// Expose cache info to window for debugging
if (typeof window !== 'undefined') {
    window.getCacheInfo = getCacheInfo;
    window.clearCrackedCache = clearCache;
}
