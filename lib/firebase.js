// Firebase initialisation (client SDK).
// Real keys go in `.env.local` (never commit it). Add the same variables
// in Vercel > Project Settings > Environment Variables for deployment.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guard against double-initialisation (hot reload / multiple imports)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Admin user's UID (Firebase console → Authentication → Users), set in
// .env.local as NEXT_PUBLIC_ADMIN_UID. It is not a secret and not a security
// control: Firestore/Storage rules are what enforce admin-only writes.
const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;

export { app, db, auth, storage, adminUid };
