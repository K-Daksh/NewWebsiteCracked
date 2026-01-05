import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { collections } from '../config/firebase.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { apiResponse, asyncHandler } from '../utils/helpers.js';

const router = Router();

/**
 * POST /api/auth/login
 * Admin login
 */
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return apiResponse(res, {
            success: false,
            error: 'Email and password are required',
            statusCode: 400,
        });
    }

    // Find admin by email
    const snapshot = await collections.admins.where('email', '==', email.toLowerCase()).get();

    if (snapshot.empty) {
        return apiResponse(res, {
            success: false,
            error: 'Invalid credentials',
            statusCode: 401,
        });
    }

    const adminDoc = snapshot.docs[0];
    const admin = adminDoc.data();

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
        return apiResponse(res, {
            success: false,
            error: 'Invalid credentials',
            statusCode: 401,
        });
    }

    // Update last login
    await adminDoc.ref.update({
        lastLogin: new Date(),
    });

    // Generate token
    const token = generateToken({
        id: adminDoc.id,
        email: admin.email,
        role: admin.role,
    });

    return apiResponse(res, {
        success: true,
        data: {
            token,
            user: {
                id: adminDoc.id,
                email: admin.email,
                role: admin.role,
            },
        },
    });
}));

/**
 * POST /api/auth/logout
 * Admin logout (client-side token removal, just for logging)
 */
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
    // In a more complex system, you might blacklist the token here
    return apiResponse(res, {
        success: true,
        data: { message: 'Logged out successfully' },
    });
}));

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
    const adminDoc = await collections.admins.doc(req.user.id).get();

    if (!adminDoc.exists) {
        return apiResponse(res, {
            success: false,
            error: 'User not found',
            statusCode: 404,
        });
    }

    const admin = adminDoc.data();

    return apiResponse(res, {
        success: true,
        data: {
            id: adminDoc.id,
            email: admin.email,
            role: admin.role,
            lastLogin: admin.lastLogin?.toDate?.()?.toISOString() || null,
        },
    });
}));

/**
 * PUT /api/auth/password
 * Change password
 */
router.put('/password', authenticate, asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return apiResponse(res, {
            success: false,
            error: 'Current password and new password are required',
            statusCode: 400,
        });
    }

    if (newPassword.length < 8) {
        return apiResponse(res, {
            success: false,
            error: 'New password must be at least 8 characters',
            statusCode: 400,
        });
    }

    const adminDoc = await collections.admins.doc(req.user.id).get();
    const admin = adminDoc.data();

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.passwordHash);

    if (!isValidPassword) {
        return apiResponse(res, {
            success: false,
            error: 'Current password is incorrect',
            statusCode: 401,
        });
    }

    // Hash new password and update
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await adminDoc.ref.update({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
    });

    return apiResponse(res, {
        success: true,
        data: { message: 'Password updated successfully' },
    });
}));

export default router;
