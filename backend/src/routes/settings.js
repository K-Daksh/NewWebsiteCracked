import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { apiResponse, asyncHandler, docToObject } from '../utils/helpers.js';
import { bumpCacheVersion } from '../middleware/versionMiddleware.js';

const router = Router();

const SETTINGS_DOC_ID = 'site_settings';

/**
 * Default settings structure
 */
const defaultSettings = {
    heroTagline: "Central India's Premier Community",
    heroTitle1: "Cracked",
    heroTitle2: "Digital.",
    heroDescription: "We are the fastest growing tech collective bridging the gap between talent and opportunity.",
    whatsappLink: "https://chat.whatsapp.com/your-link",
    instagramLink: "https://instagram.com/crackeddigital",
    linkedinLink: "https://linkedin.com/company/crackeddigital",
    email: "contact@crackeddigital.com",
    phone: "+91 1234567890",
    address: "Indore, Madhya Pradesh, India",
    footerTagline: "Central India's Premier Tech Community",
    joinCta: "Join Now",
};

/**
 * GET /api/settings
 * Get site settings (public)
 */
router.get('/', asyncHandler(async (req, res) => {
    const doc = await collections.settings.doc(SETTINGS_DOC_ID).get();

    if (!doc.exists) {
        // Return defaults if no settings exist
        return apiResponse(res, {
            success: true,
            data: { id: SETTINGS_DOC_ID, ...defaultSettings },
        });
    }

    return apiResponse(res, {
        success: true,
        data: docToObject(doc),
    });
}));

/**
 * PUT /api/settings
 * Update site settings (protected)
 */
router.put('/', authenticate, bumpCacheVersion('settings'), asyncHandler(async (req, res) => {
    const docRef = collections.settings.doc(SETTINGS_DOC_ID);
    const doc = await docRef.get();

    const updateData = {
        ...req.body,
        updatedAt: new Date(),
    };

    // Remove any fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.createdAt;

    if (!doc.exists) {
        // Create with defaults merged with provided values
        await docRef.set({
            ...defaultSettings,
            ...updateData,
            createdAt: new Date(),
        });
    } else {
        await docRef.update(updateData);
    }

    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc),
    });
}));

/**
 * POST /api/settings/reset
 * Reset settings to defaults (protected)
 */
router.post('/reset', authenticate, bumpCacheVersion('settings'), asyncHandler(async (req, res) => {
    const docRef = collections.settings.doc(SETTINGS_DOC_ID);

    await docRef.set({
        ...defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();

    return apiResponse(res, {
        success: true,
        data: docToObject(updatedDoc),
    });
}));

export default router;
