/**
 * Simple In-Memory Cache Singleton
 * Stores built JSON payloads to avoid DB reads on every request.
 * Includes safety limits to prevent memory overflow.
 */
class ServerCache {
    constructor() {
        this.cache = {
            data: null,
            versionId: null,
            timestamp: 0,
        };
        this.MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB Limit
    }

    /**
     * Get cached data
     * @returns {object|null} Cached data or null
     */
    get() {
        if (this.cache.data) {
            return this.cache;
        }
        return null;
    }

    /**
     * Set cache data
     * @param {string} versionId - Version ID
     * @param {object} data - Data to cache
     */
    set(versionId, data) {
        try {
            // Rough size estimation (fast)
            const jsonString = JSON.stringify(data);
            const size = Buffer.byteLength(jsonString);

            if (size > this.MAX_SIZE_BYTES) {
                console.warn(`[ServerCache] Cache payload larger than 50MB (${(size / 1024 / 1024).toFixed(2)}MB). Skipping cache.`);
                this.clear(); // Safety clear
                return;
            }

            this.cache = {
                data,
                versionId,
                timestamp: Date.now(),
            };

            console.log(`[ServerCache] Cached payload version ${versionId} (${(size / 1024).toFixed(2)}KB)`);
        } catch (error) {
            console.error('[ServerCache] Error setting cache:', error);
            this.clear();
        }
    }

    /**
     * Clear the cache
     */
    clear() {
        this.cache = {
            data: null,
            versionId: null,
            timestamp: 0,
        };
        console.log('[ServerCache] Cache cleared');
    }
}

// Export singleton instance
export const serverCache = new ServerCache();
