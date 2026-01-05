import admin from 'firebase-admin';

/**
 * Convert Firestore document to plain object with ID
 */
export const docToObject = (doc) => {
    if (!doc.exists) return null;

    const data = doc.data();

    // Convert Firestore Timestamps to ISO strings
    const converted = {};
    for (const [key, value] of Object.entries(data)) {
        if (value instanceof admin.firestore.Timestamp) {
            converted[key] = value.toDate().toISOString();
        } else {
            converted[key] = value;
        }
    }

    return {
        id: doc.id,
        ...converted,
    };
};

/**
 * Convert array of Firestore documents to plain objects
 */
export const docsToArray = (snapshot) => {
    const docs = [];
    snapshot.forEach((doc) => {
        docs.push(docToObject(doc));
    });
    return docs;
};

/**
 * Generate a URL-safe slug from text
 */
export const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

/**
 * Validate required fields in request body
 */
export const validateRequired = (body, fields) => {
    const missing = fields.filter((field) => !body[field]);
    if (missing.length > 0) {
        return {
            valid: false,
            error: `Missing required fields: ${missing.join(', ')}`,
        };
    }
    return { valid: true };
};

/**
 * Create a standardized API response
 */
/**
 * Create a standardized API response
 */
export const apiResponse = (res, { success = true, data = null, error = null, statusCode = 200, ...rest }) => {
    return res.status(statusCode).json({
        success,
        data,
        error,
        timestamp: new Date().toISOString(),
        ...rest,
    });
};

/**
 * Wrap async route handlers to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
