import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { apiResponse, asyncHandler, docToObject, docsToArray, validateRequired } from '../utils/helpers.js';
import { bumpCacheVersion } from '../middleware/versionMiddleware.js';

const router = Router();

/**
 * GET /api/milestones
 * Get all milestones (public)
 */
router.get('/', asyncHandler(async (req, res) => {
    const snapshot = await collections.milestones.orderBy('order', 'asc').get();
    const milestones = docsToArray(snapshot);

    return apiResponse(res, {
        success: true,
        data: milestones,
    });
}));

/**
 * GET /api/milestones/:id
 * Get single milestone by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const doc = await collections.milestones.doc(req.params.id).get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Milestone not found',
            statusCode: 404,
        });
    }

    return apiResponse(res, {
        success: true,
        data: docToObject(doc),
    });
}));

/**
 * POST /api/milestones
 * Create new milestone (protected)
 */
router.post('/', authenticate, bumpCacheVersion('milestones'), asyncHandler(async (req, res) => {
    const validation = validateRequired(req.body, ['year', 'title', 'description']);
    if (!validation.valid) {
        return apiResponse(res, {
            success: false,
            error: validation.error,
            statusCode: 400,
        });
    }

    const { year, title, description, order } = req.body;

    // Get max order if not provided
    let milestoneOrder = order;
    if (milestoneOrder === undefined) {
        const lastMilestone = await collections.milestones.orderBy('order', 'desc').limit(1).get();
        milestoneOrder = lastMilestone.empty ? 0 : (lastMilestone.docs[0].data().order || 0) + 1;
    }

    const milestoneData = {
        year,
        title,
        description,
        order: milestoneOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const docRef = await collections.milestones.add(milestoneData);
    const newDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(newDoc),
        statusCode: 201,
    });
}));

/**
 * PUT /api/milestones/:id
 * Update milestone (protected)
 */
router.put('/:id', authenticate, bumpCacheVersion('milestones'), asyncHandler(async (req, res) => {
    const docRef = collections.milestones.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Milestone not found',
            statusCode: 404,
        });
    }

    const { year, title, description, order } = req.body;

    const updateData = {
        updatedAt: new Date(),
    };

    if (year !== undefined) updateData.year = year;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc),
    });
}));

/**
 * DELETE /api/milestones/:id
 * Delete milestone (protected)
 */
router.delete('/:id', authenticate, bumpCacheVersion('milestones'), asyncHandler(async (req, res) => {
    const docRef = collections.milestones.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Milestone not found',
            statusCode: 404,
        });
    }

    await docRef.delete();

    return apiResponse(res, {
        success: true,
        data: { message: 'Milestone deleted successfully', id: req.params.id },
    });
}));

/**
 * PUT /api/milestones/bulk/reorder
 * Reorder milestones (protected)
 */
router.put('/bulk/reorder', authenticate, bumpCacheVersion('milestones'), asyncHandler(async (req, res) => {
    const { order } = req.body;

    if (!Array.isArray(order)) {
        return apiResponse(res, {
            success: false,
            error: 'Order must be an array of { id, order } objects',
            statusCode: 400,
        });
    }

    const batch = collections.milestones.firestore.batch();

    for (const item of order) {
        if (item.id && typeof item.order === 'number') {
            const docRef = collections.milestones.doc(item.id);
            batch.update(docRef, { order: item.order, updatedAt: new Date() });
        }
    }

    await batch.commit();

    return apiResponse(res, {
        success: true,
        data: { message: 'Milestones reordered successfully' },
    });
}));

export default router;
