import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { apiResponse, asyncHandler, docToObject, docsToArray, validateRequired } from '../utils/helpers.js';
import { bumpCacheVersion } from '../middleware/versionMiddleware.js';

const router = Router();

/**
 * GET /api/stats
 * Get all stats (public)
 */
router.get('/', asyncHandler(async (req, res) => {
    const snapshot = await collections.stats.orderBy('order', 'asc').get();
    const stats = docsToArray(snapshot);

    return apiResponse(res, {
        success: true,
        data: stats,
    });
}));

/**
 * GET /api/stats/:id
 * Get single stat by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const doc = await collections.stats.doc(req.params.id).get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Stat not found',
            statusCode: 404,
        });
    }

    return apiResponse(res, {
        success: true,
        data: docToObject(doc),
    });
}));

/**
 * POST /api/stats
 * Create new stat (protected)
 */
router.post('/', authenticate, bumpCacheVersion('stats'), asyncHandler(async (req, res) => {
    const validation = validateRequired(req.body, ['label', 'value', 'icon']);
    if (!validation.valid) {
        return apiResponse(res, {
            success: false,
            error: validation.error,
            statusCode: 400,
        });
    }

    const { label, value, numericValue, suffix, icon, order } = req.body;

    // Get max order if not provided
    let statOrder = order;
    if (statOrder === undefined) {
        const lastStat = await collections.stats.orderBy('order', 'desc').limit(1).get();
        statOrder = lastStat.empty ? 0 : (lastStat.docs[0].data().order || 0) + 1;
    }

    const statData = {
        label,
        value,
        numericValue: numericValue ? parseInt(numericValue) : parseInt(value) || 0,
        suffix: suffix || '',
        icon,
        order: statOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const docRef = await collections.stats.add(statData);
    const newDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(newDoc),
        statusCode: 201,
    });
}));

/**
 * PUT /api/stats/:id
 * Update stat (protected)
 */
router.put('/:id', authenticate, bumpCacheVersion('stats'), asyncHandler(async (req, res) => {
    const docRef = collections.stats.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Stat not found',
            statusCode: 404,
        });
    }

    const { label, value, numericValue, suffix, icon, order } = req.body;

    const updateData = {
        updatedAt: new Date(),
    };

    if (label !== undefined) updateData.label = label;
    if (value !== undefined) updateData.value = value;
    if (numericValue !== undefined) updateData.numericValue = parseInt(numericValue);
    if (suffix !== undefined) updateData.suffix = suffix;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc),
    });
}));

/**
 * DELETE /api/stats/:id
 * Delete stat (protected)
 */
router.delete('/:id', authenticate, bumpCacheVersion('stats'), asyncHandler(async (req, res) => {
    const docRef = collections.stats.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Stat not found',
            statusCode: 404,
        });
    }

    await docRef.delete();

    return apiResponse(res, {
        success: true,
        data: { message: 'Stat deleted successfully', id: req.params.id },
    });
}));

/**
 * PUT /api/stats/bulk/reorder
 * Reorder stats (protected)
 */
router.put('/bulk/reorder', authenticate, bumpCacheVersion('stats'), asyncHandler(async (req, res) => {
    const { order } = req.body;

    if (!Array.isArray(order)) {
        return apiResponse(res, {
            success: false,
            error: 'Order must be an array of { id, order } objects',
            statusCode: 400,
        });
    }

    const batch = collections.stats.firestore.batch();

    for (const item of order) {
        if (item.id && typeof item.order === 'number') {
            const docRef = collections.stats.doc(item.id);
            batch.update(docRef, { order: item.order, updatedAt: new Date() });
        }
    }

    await batch.commit();

    return apiResponse(res, {
        success: true,
        data: { message: 'Stats reordered successfully' },
    });
}));

export default router;
