import express from 'express';
import { db } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const COLLECTION = 'hiring_requests';

// POST /api/hiring - Create a new hiring request (Public)
router.post('/', async (req, res) => {
    try {
        const { companyName, workEmail, requirements } = req.body;

        if (!companyName || !workEmail || typeof companyName !== 'string' || typeof workEmail !== 'string') {
            return res.status(400).json({ error: 'Company Name and Email are required and must be strings.' });
        }

        const newRequest = {
            companyName,
            workEmail,
            requirements: requirements || '',
            status: 'pending', // pending, contacted, closed
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection(COLLECTION).add(newRequest);

        res.status(201).json({
            success: true,
            id: docRef.id,
            message: 'Hiring request submitted successfully.'
        });

    } catch (error) {
        console.error('Error creating hiring request:', error);
        res.status(500).json({ error: 'Failed to submit request.' });
    }
});

// GET /api/hiring - Get all requests (Admin only)
router.get('/', authenticate, async (req, res) => {
    try {
        const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get();
        const requests = [];
        snapshot.forEach(doc => {
            requests.push({ id: doc.id, ...doc.data() });
        });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching hiring requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests.' });
    }
});

// PUT /api/hiring/:id/status - Update status (Admin only)
router.put('/:id/status', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'pending', 'contacted', 'closed'

        if (!status) return res.status(400).json({ error: 'Status is required' });

        await db.collection(COLLECTION).doc(id).update({ status });

        res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status.' });
    }
});

// DELETE /api/hiring/:id - Delete request (Admin only)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection(COLLECTION).doc(id).delete();
        res.json({ success: true, message: 'Hiring request deleted' });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ error: 'Failed to delete request.' });
    }
});

export default router;
