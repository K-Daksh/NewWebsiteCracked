import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { apiResponse, asyncHandler, docToObject, docsToArray, validateRequired } from '../utils/helpers.js';
import { bumpCacheVersion } from '../middleware/versionMiddleware.js';

const router = Router();

/**
 * GET /api/events
 * Get all events (public)
 */
router.get('/', asyncHandler(async (req, res) => {
    const snapshot = await collections.events.orderBy('order', 'asc').get();
    const events = docsToArray(snapshot);

    return apiResponse(res, {
        success: true,
        data: events,
    });
}));

/**
 * GET /api/events/:id
 * Get single event by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const doc = await collections.events.doc(req.params.id).get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Event not found',
            statusCode: 404,
        });
    }

    return apiResponse(res, {
        success: true,
        data: docToObject(doc),
    });
}));

/**
 * POST /api/events
 * Create new event (protected)
 */
router.post('/', authenticate, bumpCacheVersion('events'), asyncHandler(async (req, res) => {
    const validation = validateRequired(req.body, ['title', 'date', 'type', 'description']);
    if (!validation.valid) {
        return apiResponse(res, {
            success: false,
            error: validation.error,
            statusCode: 400,
        });
    }

    const { title, date, type, description, images = [], location, capacity, registrationUrl, order } = req.body;

    // Validate type
    const validTypes = ['Past', 'Ongoing', 'Upcoming'];
    if (!validTypes.includes(type)) {
        return apiResponse(res, {
            success: false,
            error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
            statusCode: 400,
        });
    }

    // Get max order if not provided
    let eventOrder = order;
    if (eventOrder === undefined) {
        const lastEvent = await collections.events.orderBy('order', 'desc').limit(1).get();
        eventOrder = lastEvent.empty ? 0 : (lastEvent.docs[0].data().order || 0) + 1;
    }

    const eventData = {
        title,
        date,
        type,
        description,
        images: Array.isArray(images) ? images : [],
        location: location || null,
        capacity: capacity ? parseInt(capacity) : null,
        registrationUrl: registrationUrl || null,
        order: eventOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const docRef = await collections.events.add(eventData);
    const newDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(newDoc),
        statusCode: 201,
    });
}));

/**
 * PUT /api/events/:id
 * Update event (protected)
 */
router.put('/:id', authenticate, bumpCacheVersion('events'), asyncHandler(async (req, res) => {
    const docRef = collections.events.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Event not found',
            statusCode: 404,
        });
    }

    const { title, date, type, description, images, location, capacity, registrationUrl, order } = req.body;

    // Validate type if provided
    if (type) {
        const validTypes = ['Past', 'Ongoing', 'Upcoming'];
        if (!validTypes.includes(type)) {
            return apiResponse(res, {
                success: false,
                error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
                statusCode: 400,
            });
        }
    }

    const updateData = {
        updatedAt: new Date(),
    };

    // Only update fields that are provided
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = date;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];
    if (location !== undefined) updateData.location = location || null;
    if (capacity !== undefined) updateData.capacity = capacity ? parseInt(capacity) : null;
    if (registrationUrl !== undefined) updateData.registrationUrl = registrationUrl || null;
    if (order !== undefined) updateData.order = order;

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc),
    });
}));

/**
 * DELETE /api/events/:id
 * Delete event (protected)
 */
router.delete('/:id', authenticate, bumpCacheVersion('events'), asyncHandler(async (req, res) => {
    const docRef = collections.events.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Event not found',
            statusCode: 404,
        });
    }

    await docRef.delete();

    return apiResponse(res, {
        success: true,
        data: { message: 'Event deleted successfully', id: req.params.id },
    });
}));

/**
 * PUT /api/events/:id/status
 * Update event status (quick action)
 */
router.put('/:id/status', authenticate, bumpCacheVersion('events'), asyncHandler(async (req, res) => {
    const { type } = req.body;

    const validTypes = ['Past', 'Ongoing', 'Upcoming'];
    if (!validTypes.includes(type)) {
        return apiResponse(res, {
            success: false,
            error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
            statusCode: 400,
        });
    }

    const docRef = collections.events.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Event not found',
            statusCode: 404,
        });
    }

    await docRef.update({
        type,
        updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc),
    });
}));

/**
 * PUT /api/events/reorder
 * Reorder events (protected)
 */
router.put('/bulk/reorder', authenticate, bumpCacheVersion('events'), asyncHandler(async (req, res) => {
    const { order } = req.body;

    if (!Array.isArray(order)) {
        return apiResponse(res, {
            success: false,
            error: 'Order must be an array of { id, order } objects',
            statusCode: 400,
        });
    }

    const batch = collections.events.firestore.batch();

    for (const item of order) {
        if (item.id && typeof item.order === 'number') {
            const docRef = collections.events.doc(item.id);
            batch.update(docRef, { order: item.order, updatedAt: new Date() });
        }
    }

    await batch.commit();

    return apiResponse(res, {
        success: true,
        data: { message: 'Events reordered successfully' },
    });
}));

export default router;
