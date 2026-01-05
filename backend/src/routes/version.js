import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { apiResponse, asyncHandler, docToObject } from '../utils/helpers.js';

const router = Router();

/**
 * GET /api/version
 * Get current cache version (lightweight endpoint for version checking)
 */
router.get('/', asyncHandler(async (req, res) => {
    const versionDoc = await collections.settings.doc('cache_version').get();

    if (!versionDoc.exists) {
        // Initialize version if it doesn't exist
        const initialVersion = {
            versionId: Date.now().toString(),
            lastUpdated: new Date(),
            updatedBy: 'system',
            changeType: 'initialize',
            description: 'Initial cache version created'
        };

        await collections.settings.doc('cache_version').set(initialVersion);

        return apiResponse(res, {
            success: true,
            versionId: initialVersion.versionId,
            lastUpdated: initialVersion.lastUpdated,
        });
    }

    const versionData = docToObject(versionDoc);

    return apiResponse(res, {
        success: true,
        versionId: versionData.versionId,
        lastUpdated: versionData.lastUpdated,
        changeType: versionData.changeType,
    });
}));

/**
 * POST /api/version/bump
 * Manually bump cache version (admin only)
 */
router.post('/bump', authenticate, asyncHandler(async (req, res) => {
    const { changeType = 'manual', description = 'Manual cache invalidation' } = req.body;

    const newVersion = {
        versionId: Date.now().toString(),
        lastUpdated: new Date(),
        updatedBy: req.user?.email || 'admin',
        changeType,
        description,
    };

    await collections.settings.doc('cache_version').set(newVersion);

    return apiResponse(res, {
        success: true,
        message: 'Cache version bumped successfully',
        data: newVersion,
    });
}));

export default router;
