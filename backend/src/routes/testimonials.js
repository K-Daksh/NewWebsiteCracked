import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { apiResponse, asyncHandler, docToObject, docsToArray, validateRequired } from '../utils/helpers.js';
import { bumpCacheVersion } from '../middleware/versionMiddleware.js';

const router = Router();

/**
 * GET /api/testimonials
 * Get all testimonials (public - only active ones)
 */
router.get('/', asyncHandler(async (req, res) => {
    // For public, only return active testimonials
    // For admin, return all
    const isAdmin = req.query.all === 'true' && req.headers.authorization;

    let query = collections.testimonials.orderBy('order', 'asc');
    if (!isAdmin) {
        query = query.where('isActive', '==', true);
    }

    const snapshot = await query.get();
    const testimonials = docsToArray(snapshot);

    return apiResponse(res, {
        success: true,
        data: testimonials,
    });
}));

/**
 * GET /api/testimonials/:id
 * Get single testimonial by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const doc = await collections.testimonials.doc(req.params.id).get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Testimonial not found',
            statusCode: 404,
        });
    }

    return apiResponse(res, {
        success: true,
        data: docToObject(doc),
    });
}));

/**
 * POST /api/testimonials
 * Create new testimonial (protected)
 */
router.post('/', authenticate, bumpCacheVersion('testimonials'), asyncHandler(async (req, res) => {
    const validation = validateRequired(req.body, ['name', 'role', 'text']);
    if (!validation.valid) {
        return apiResponse(res, {
            success: false,
            error: validation.error,
            statusCode: 400,
        });
    }

    const { name, role, company, image, text, order, isActive = true } = req.body;

    // Get max order if not provided
    let testimonialOrder = order;
    if (testimonialOrder === undefined) {
        const lastTestimonial = await collections.testimonials.orderBy('order', 'desc').limit(1).get();
        testimonialOrder = lastTestimonial.empty ? 0 : (lastTestimonial.docs[0].data().order || 0) + 1;
    }

    const testimonialData = {
        name,
        role,
        company: company || '',
        image: image || '',
        text,
        order: testimonialOrder,
        isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const docRef = await collections.testimonials.add(testimonialData);
    const newDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(newDoc),
        statusCode: 201,
    });
}));

/**
 * PUT /api/testimonials/:id
 * Update testimonial (protected)
 */
router.put('/:id', authenticate, bumpCacheVersion('testimonials'), asyncHandler(async (req, res) => {
    const docRef = collections.testimonials.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Testimonial not found',
            statusCode: 404,
        });
    }

    const { name, role, company, image, text, order, isActive } = req.body;

    const updateData = {
        updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (company !== undefined) updateData.company = company;
    if (image !== undefined) updateData.image = image;
    if (text !== undefined) updateData.text = text;
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
 * DELETE /api/testimonials/:id
 * Delete testimonial (protected)
 */
router.delete('/:id', authenticate, bumpCacheVersion('testimonials'), asyncHandler(async (req, res) => {
    const docRef = collections.testimonials.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Testimonial not found',
            statusCode: 404,
        });
    }

    await docRef.delete();

    return apiResponse(res, {
        success: true,
        data: { message: 'Testimonial deleted successfully', id: req.params.id },
    });
}));

/**
 * PUT /api/testimonials/:id/toggle
 * Toggle testimonial active status
 */
router.put('/:id/toggle', authenticate, bumpCacheVersion('testimonials'), asyncHandler(async (req, res) => {
    const docRef = collections.testimonials.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'Testimonial not found',
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

export default router;
