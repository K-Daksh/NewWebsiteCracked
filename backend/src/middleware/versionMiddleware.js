import { collections } from '../config/firebase.js';
import { serverCache } from '../utils/serverCache.js';

/**
 * Middleware to automatically bump cache version when data is modified
 * This ensures client caches are invalidated when admin makes changes
 * 
 * @param {string} collectionName - Name of the collection being modified (e.g., 'events', 'faqs')
 * @returns {Function} Express middleware function
 */
export const bumpCacheVersion = (collectionName) => {
    return async (req, res, next) => {
        // Store original res.json to intercept successful responses
        const originalJson = res.json.bind(res);

        res.json = async (body) => {
            // Only bump version if the operation was successful
            if (body && body.success) {
                try {
                    const newVersion = {
                        versionId: Date.now().toString(),
                        lastUpdated: new Date(),
                        updatedBy: req.user?.email || 'admin',
                        changeType: collectionName,
                        description: `${collectionName} collection modified via ${req.method} ${req.path}`,
                    };

                    // Update cache version document
                    await collections.settings.doc('cache_version').set(newVersion);

                    // Clear hot cache so next request fetches fresh data
                    serverCache.clear();

                    console.log(`[Cache Version] Bumped to ${newVersion.versionId} - ${newVersion.description}`);
                } catch (error) {
                    // Log error but don't fail the request
                    console.error('[Cache Version] Failed to bump version:', error);
                }
            }

            // Call original json method
            return originalJson(body);
        };

        next();
    };
};

/**
 * Helper function to manually bump cache version
 * Can be called directly in route handlers if needed
 */
export const manualBumpVersion = async (changeType, description, userEmail = 'system') => {
    try {
        const newVersion = {
            versionId: Date.now().toString(),
            lastUpdated: new Date(),
            updatedBy: userEmail,
            changeType,
            description,
        };

        await collections.settings.doc('cache_version').set(newVersion);

        // Clear hot cache
        serverCache.clear();

        console.log(`[Cache Version] Manual bump to ${newVersion.versionId} - ${description}`);
        return newVersion;
    } catch (error) {
        console.error('[Cache Version] Failed to manually bump version:', error);
        throw error;
    }
};
