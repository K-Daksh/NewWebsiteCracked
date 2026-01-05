import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { apiResponse, asyncHandler, docToObject, docsToArray, validateRequired } from '../utils/helpers.js';
import { bumpCacheVersion } from '../middleware/versionMiddleware.js';

const router = Router();

/**
 * GET /api/faqs
 * Get all FAQs (public - only active ones)
 */
router.get('/', asyncHandler(async (req, res) => {
    const isAdmin = req.query.all === 'true' && req.headers.authorization;

    let query = collections.faqs.orderBy('order', 'asc');
    if (!isAdmin) {
        query = query.where('isActive', '==', true);
    }

    const snapshot = await query.get();
    const faqs = docsToArray(snapshot);

    return apiResponse(res, {
        success: true,
        data: faqs,
    });
}));

/**
 * GET /api/faqs/:id
 * Get single FAQ by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const doc = await collections.faqs.doc(req.params.id).get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'FAQ not found',
            statusCode: 404,
        });
    }

    return apiResponse(res, {
        success: true,
        data: docToObject(doc),
    });
}));

/**
 * POST /api/faqs
 * Create new FAQ (protected)
 */
router.post('/', authenticate, bumpCacheVersion('faqs'), asyncHandler(async (req, res) => {
    const validation = validateRequired(req.body, ['question', 'answer']);
    if (!validation.valid) {
        return apiResponse(res, {
            success: false,
            error: validation.error,
            statusCode: 400,
        });
    }

    const { question, answer, order, isActive = true } = req.body;

    // Get max order if not provided
    let faqOrder = order;
    if (faqOrder === undefined) {
        const lastFaq = await collections.faqs.orderBy('order', 'desc').limit(1).get();
        faqOrder = lastFaq.empty ? 0 : (lastFaq.docs[0].data().order || 0) + 1;
    }

    const faqData = {
        question,
        answer,
        order: faqOrder,
        isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const docRef = await collections.faqs.add(faqData);
    const newDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(newDoc),
        statusCode: 201,
    });
}));

/**
 * PUT /api/faqs/:id
 * Update FAQ (protected)
 */
router.put('/:id', authenticate, bumpCacheVersion('faqs'), asyncHandler(async (req, res) => {
    const docRef = collections.faqs.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'FAQ not found',
            statusCode: 404,
        });
    }

    const { question, answer, order, isActive } = req.body;

    const updateData = {
        updatedAt: new Date(),
    };

    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc),
    });
}));

/**
 * DELETE /api/faqs/:id
 * Delete FAQ (protected)
 */
router.delete('/:id', authenticate, bumpCacheVersion('faqs'), asyncHandler(async (req, res) => {
    const docRef = collections.faqs.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'FAQ not found',
            statusCode: 404,
        });
    }

    await docRef.delete();

    return apiResponse(res, {
        success: true,
        data: { message: 'FAQ deleted successfully', id: req.params.id },
    });
}));

/**
 * PUT /api/faqs/:id/toggle
 * Toggle FAQ active status
 */
router.put('/:id/toggle', authenticate, bumpCacheVersion('faqs'), asyncHandler(async (req, res) => {
    const docRef = collections.faqs.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'FAQ not found',
            statusCode: 404,
        });
    }

    const current = doc.data();
    await docRef.update({
        isActive: !current.isActive,
        updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc),
    });
}));

/**
 * PUT /api/faqs/bulk/reorder
 * Reorder FAQs (protected)
 */
router.put('/bulk/reorder', authenticate, bumpCacheVersion('faqs'), asyncHandler(async (req, res) => {
    const { order } = req.body;

    if (!Array.isArray(order)) {
        return apiResponse(res, {
            success: false,
            error: 'Order must be an array of { id, order } objects',
            statusCode: 400,
        });
    }

    const batch = collections.faqs.firestore.batch();

    for (const item of order) {
        if (item.id && typeof item.order === 'number') {
            const docRef = collections.faqs.doc(item.id);
            batch.update(docRef, { order: item.order, updatedAt: new Date() });
        }
    }

    await batch.commit();

    return apiResponse(res, {
        success: true,
        data: { message: 'FAQs reordered successfully' },
    });
}));

export default router;
