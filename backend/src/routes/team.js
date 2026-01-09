import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { apiResponse, asyncHandler, docToObject, docsToArray, validateRequired } from '../utils/helpers.js';
import { bumpCacheVersion } from '../middleware/versionMiddleware.js';

const router = Router();

/**
 * GET /api/team
 * Get all team members (public)
 */
router.get('/', asyncHandler(async (req, res) => {
    const snapshot = await collections.team.orderBy('order', 'asc').get();
    const team = docsToArray(snapshot);

    return apiResponse(res, {
        success: true,
        data: team,
    });
}));

/**
 * GET /api/team/:id
 * Get single team member by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const doc = await collections.team.doc(req.params.id).get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Team member not found',
            statusCode: 404,
        });
    }

    return apiResponse(res, {
        success: true,
        data: docToObject(doc),
    });
}));

/**
 * POST /api/team
 * Create new team member (protected)
 */
router.post('/', authenticate, bumpCacheVersion('team'), asyncHandler(async (req, res) => {
    const validation = validateRequired(req.body, ['name', 'role', 'image', 'email', 'linkedin']);
    if (!validation.valid) {
        return apiResponse(res, {
            success: false,
            error: validation.error,
            statusCode: 400,
        });
    }

    const { name, role, image, email, linkedin, order } = req.body;

    // Get max order if not provided
    let memberOrder = order;
    if (memberOrder === undefined) {
        const lastMember = await collections.team.orderBy('order', 'desc').limit(1).get();
        memberOrder = lastMember.empty ? 0 : (lastMember.docs[0].data().order || 0) + 1;
    }

    const teamData = {
        name,
        role,
        image,
        email,
        linkedin,
        order: memberOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const docRef = await collections.team.add(teamData);
    const newDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(newDoc),
        statusCode: 201,
    });
}));

/**
 * PUT /api/team/:id
 * Update team member (protected)
 */
router.put('/:id', authenticate, bumpCacheVersion('team'), asyncHandler(async (req, res) => {
    const docRef = collections.team.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Team member not found',
            statusCode: 404,
        });
    }

    const { name, role, image, email, linkedin, order } = req.body;

    const updateData = {
        updatedAt: new Date(),
    };

    // Only update fields that are provided
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (image !== undefined) updateData.image = image;
    if (email !== undefined) updateData.email = email;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (order !== undefined) updateData.order = order;

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc),
    });
}));

/**
 * DELETE /api/team/:id
 * Delete team member (protected)
 */
router.delete('/:id', authenticate, bumpCacheVersion('team'), asyncHandler(async (req, res) => {
    const docRef = collections.team.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Team member not found',
            statusCode: 404,
        });
    }

    await docRef.delete();

    return apiResponse(res, {
        success: true,
        data: { message: 'Team member deleted successfully', id: req.params.id },
    });
}));

/**
 * PUT /api/team/bulk/reorder
 * Reorder team members (protected)
 */
router.put('/bulk/reorder', authenticate, bumpCacheVersion('team'), asyncHandler(async (req, res) => {
    const { order } = req.body;

    if (!Array.isArray(order)) {
        return apiResponse(res, {
            success: false,
            error: 'Order must be an array of { id, order } objects',
            statusCode: 400,
        });
    }

    const batch = collections.team.firestore.batch();

    for (const item of order) {
        if (item.id && typeof item.order === 'number') {
            const docRef = collections.team.doc(item.id);
            batch.update(docRef, { order: item.order, updatedAt: new Date() });
        }
    }

    await batch.commit();

    return apiResponse(res, {
        success: true,
        data: { message: 'Team members reordered successfully' },
    });
}));

export default router;
