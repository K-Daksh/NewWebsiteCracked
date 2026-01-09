import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { apiResponse, asyncHandler, docsToArray, docToObject } from '../utils/helpers.js';
import { serverCache } from '../utils/serverCache.js';

const router = Router();

/**
 * GET /api/public/all
 * Get all public data in one request (for initial page load)
 */
router.get('/all', asyncHandler(async (req, res) => {
    // 1. CDN Caching Headers
    // public: cacheable by anyone (CDN, Browser)
    // max-age=60: Browser caches for 60 seconds
    // s-maxage=300: CDN caches for 5 minutes (300 seconds)
    // stale-while-revalidate=600: If cache expires, CDN serves stale while fetching fresh in background
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');

    // 2. Check In-Memory Hot Cache
    const cached = serverCache.get();
    if (cached) {
        console.log('[API] Serving from Hot Cache');
        return apiResponse(res, {
            success: true,
            versionId: cached.versionId,
            data: cached.data,
            source: 'cache'
        });
    }

    console.log('[API] Cache miss - Fetching from Firebase');

    // Fetch all collections - simple queries without orderBy to avoid index issues
    const [
        eventsSnapshot,
        statsSnapshot,
        testimonialsSnapshot,
        faqsSnapshot,
        milestonesSnapshot,
        teamSnapshot,
        settingsDoc,
        versionDoc,
    ] = await Promise.all([
        collections.events.orderBy('date', 'desc').get(),
        collections.stats.orderBy('order', 'asc').get(),
        collections.testimonials.where('isActive', '==', true).orderBy('order', 'asc').get(),
        collections.faqs.where('isActive', '==', true).orderBy('order', 'asc').get(),
        collections.milestones.orderBy('order', 'asc').get(),
        collections.team.orderBy('order', 'asc').get(),
        collections.settings.doc('site_settings').get().catch(() => ({ exists: false })),
        collections.settings.doc('cache_version').get().catch(() => ({ exists: false })),
    ]);

    // Convert to arrays (sorting already done by database)
    const events = docsToArray(eventsSnapshot);
    const stats = docsToArray(statsSnapshot);
    const testimonials = docsToArray(testimonialsSnapshot);
    const faqs = docsToArray(faqsSnapshot);
    const milestones = docsToArray(milestonesSnapshot);
    const team = docsToArray(teamSnapshot);

    // Default settings if none exist
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

    // Get cache version or create initial version
    let versionId = Date.now().toString();
    if (versionDoc.exists) {
        const versionData = docToObject(versionDoc);
        versionId = versionData.versionId;
    } else {
        // Initialize cache version if it doesn't exist
        const initialVersion = {
            versionId,
            lastUpdated: new Date(),
            updatedBy: 'system',
            changeType: 'initialize',
            description: 'Initial cache version created'
        };
        await collections.settings.doc('cache_version').set(initialVersion);
    }

    const payloadData = {
        events,
        stats,
        testimonials,
        faqs,
        milestones,
        team,
        settings: settingsDoc.exists ? docToObject(settingsDoc) : defaultSettings,
    };

    // 3. Update Hot Cache
    serverCache.set(versionId, payloadData);

    return apiResponse(res, {
        success: true,
        versionId,  // Include version for client-side caching
        data: payloadData,
        source: 'db'
    });
}));

export default router;

