import express from 'express';
import { collections } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { bumpCacheVersion } from '../middleware/versionMiddleware.js';
import { asyncHandler, apiResponse, validateRequired, docToObject, docsToArray } from '../utils/helpers.js';

const router = express.Router();

/**
 * GET /api/blog
 * Fetch paginated blog posts
 * query params: page (default 1), limit (default 10), tag (optional)
 */
router.get('/', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tag = req.query.tag;

    // Simplified query to avoid missing index errors (500)
    // Fetch all posts sorted by date, then filter in memory
    // This is performant enough for < 1000 posts
    const snapshot = await collections.blogs
        .orderBy('publishedAt', 'desc')
        .get();

    let allDocs = docsToArray(snapshot);

    // 1. Filter by Published Status
    allDocs = allDocs.filter(doc => doc.isPublished === true);

    // 2. Filter by Tag (if provided)
    if (tag) {
        allDocs = allDocs.filter(doc => doc.tags && doc.tags.includes(tag));
    }

    // Manual pagination since Firestore offset is expensive/complex for simple cases
    const total = allDocs.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedDocs = allDocs.slice(offset, offset + limit);

    return apiResponse(res, {
        success: true,
        data: paginatedDocs,
        meta: {
            total,
            page,
            totalPages,
            limit
        }
    });
}));

/**
 * GET /api/blog/:slug
 * Fetch single blog post by slug
 */
router.get('/:slug', asyncHandler(async (req, res) => {
    const snapshot = await collections.blogs
        .where('slug', '==', req.params.slug)
        .where('isPublished', '==', true)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return apiResponse(res, {
            success: false,
            error: 'Blog post not found',
            statusCode: 404
        });
    }

    return apiResponse(res, {
        success: true,
        data: docToObject(snapshot.docs[0])
    });
}));

/**
 * POST /api/blog
 * Create new blog post (Private)
 */
router.post('/', authenticate, bumpCacheVersion('blog'), asyncHandler(async (req, res) => {
    const validation = validateRequired(req.body, ['title', 'slug', 'content']);
    if (!validation.valid) {
        return apiResponse(res, { success: false, error: validation.error, statusCode: 400 });
    }

    // Check slug uniqueness
    const slugCheck = await collections.blogs.where('slug', '==', req.body.slug).get();
    if (!slugCheck.empty) {
        return apiResponse(res, { success: false, error: 'Slug already exists', statusCode: 409 });
    }

    const newPost = {
        title: req.body.title,
        slug: req.body.slug,
        summary: req.body.summary || '',
        content: req.body.content, // HTML or Markdown
        coverImage: req.body.coverImage || '',
        author: req.body.author || 'Cracked Digital Team',
        tags: req.body.tags || [],
        seoTitle: req.body.seoTitle || req.body.title,
        seoDescription: req.body.seoDescription || req.body.summary || '',
        isPublished: req.body.isPublished !== false, // Default true
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await collections.blogs.add(newPost);
    const savedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(savedDoc),
        statusCode: 201
    });
}));

/**
 * PUT /api/blog/:id
 * Update blog post (Private)
 */
router.put('/:id', authenticate, bumpCacheVersion('blog'), asyncHandler(async (req, res) => {
    const docRef = collections.blogs.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return apiResponse(res, { success: false, error: 'Post not found', statusCode: 404 });
    }

    // If slug is changing, check uniqueness
    if (req.body.slug && req.body.slug !== doc.data().slug) {
        const slugCheck = await collections.blogs.where('slug', '==', req.body.slug).get();
        if (!slugCheck.empty) {
            return apiResponse(res, { success: false, error: 'Slug already exists', statusCode: 409 });
        }
    }

    const updates = {
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    // Prevent overriding creation date
    delete updates.createdAt;
    delete updates.id;

    await docRef.update(updates);
    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc)
    });
}));

/**
 * DELETE /api/blog/:id
 * Delete blog post (Private)
 */
router.delete('/:id', authenticate, bumpCacheVersion('blog'), asyncHandler(async (req, res) => {
    const docRef = collections.blogs.doc(req.params.id);
    await docRef.delete();
    return apiResponse(res, { success: true, data: { id: req.params.id } });
}));

export default router;
