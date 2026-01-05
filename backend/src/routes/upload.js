import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { bucket } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import { apiResponse, asyncHandler } from '../utils/helpers.js';

const router = Router();

/**
 * POST /api/upload
 * Upload single image to Firebase Storage
 */
router.post('/', authenticate, upload.single('image'), handleUploadError, asyncHandler(async (req, res) => {
    if (!req.file) {
        return apiResponse(res, {
            success: false,
            error: 'No file provided',
            statusCode: 400,
        });
    }

    const file = req.file;
    const extension = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    const filePath = `images/${filename}`;

    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => {
            reject(error);
        });

        blobStream.on('finish', async () => {
            // Make the file publicly accessible
            await blob.makePublic();

            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

            resolve(apiResponse(res, {
                success: true,
                data: {
                    url: publicUrl,
                    filename,
                    originalName: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                },
                statusCode: 201,
            }));
        });

        blobStream.end(file.buffer);
    });
}));

/**
 * POST /api/upload/multiple
 * Upload multiple images to Firebase Storage
 */
router.post('/multiple', authenticate, upload.array('images', 10), handleUploadError, asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return apiResponse(res, {
            success: false,
            error: 'No files provided',
            statusCode: 400,
        });
    }

    const uploadPromises = req.files.map(async (file) => {
        const extension = file.originalname.split('.').pop();
        const filename = `${uuidv4()}.${extension}`;
        const filePath = `images/${filename}`;

        const blob = bucket.file(filePath);

        return new Promise((resolve, reject) => {
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });

            blobStream.on('error', reject);

            blobStream.on('finish', async () => {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

                resolve({
                    url: publicUrl,
                    filename,
                    originalName: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                });
            });

            blobStream.end(file.buffer);
        });
    });

    const results = await Promise.all(uploadPromises);

    return apiResponse(res, {
        success: true,
        data: results,
        statusCode: 201,
    });
}));

/**
 * DELETE /api/upload/:filename
 * Delete image from Firebase Storage
 */
router.delete('/:filename', authenticate, asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const filePath = `images/${filename}`;

    const blob = bucket.file(filePath);
    const [exists] = await blob.exists();

    if (!exists) {
        return apiResponse(res, {
            success: false,
            error: 'File not found',
            statusCode: 404,
        });
    }

    await blob.delete();

    return apiResponse(res, {
        success: true,
        data: { message: 'File deleted successfully', filename },
    });
}));

/**
 * GET /api/upload/list
 * List all images in Firebase Storage
 */
router.get('/list', authenticate, asyncHandler(async (req, res) => {
    const [files] = await bucket.getFiles({ prefix: 'images/' });

    const images = files.map((file) => ({
        name: file.name.replace('images/', ''),
        url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
        size: parseInt(file.metadata.size),
        contentType: file.metadata.contentType,
        created: file.metadata.timeCreated,
        updated: file.metadata.updated,
    }));

    return apiResponse(res, {
        success: true,
        data: images,
    });
}));

export default router;
