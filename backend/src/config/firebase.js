import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

// Try to load service account from JSON file first
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (serviceAccountPath) {
    const absolutePath = path.isAbsolute(serviceAccountPath)
        ? serviceAccountPath
        : path.join(__dirname, '..', '..', serviceAccountPath);

    if (existsSync(absolutePath)) {
        try {
            serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));
            console.log('✅ Firebase service account loaded from JSON file');
        } catch (error) {
            console.error('❌ Error reading service account file:', error.message);
        }
    }
}

// Fallback to environment variables
if (!serviceAccount && process.env.FIREBASE_PROJECT_ID) {
    serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };
    console.log('✅ Firebase service account loaded from environment variables');
}

if (!serviceAccount) {
    console.error('❌ No Firebase service account configuration found!');
    console.error('Please set FIREBASE_SERVICE_ACCOUNT_PATH or individual environment variables.');
    process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Export Firestore and Storage
export const db = admin.firestore();
export const storage = admin.storage();
export const bucket = storage.bucket();

// Collection references
export const collections = {
    events: db.collection('events'),
    stats: db.collection('stats'),
    testimonials: db.collection('testimonials'),
    faqs: db.collection('faqs'),
    milestones: db.collection('milestones'),
    blogs: db.collection('blogs'),
    settings: db.collection('settings'),
    admins: db.collection('admins'),
    team: db.collection('team'),
};

export default admin;
