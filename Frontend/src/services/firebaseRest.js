// src/services/firebaseRest.js
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

// Identity Toolkit (Auth) endpoints
const ID_TOOLKIT_BASE = 'https://identitytoolkit.googleapis.com/v1';
const SECURE_TOKEN = 'https://securetoken.googleapis.com/v1/token';

// Firestore base
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Storage base
const STORAGE_UPLOAD = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o`;

// --- AUTH (REST) ---
// Sign up (email/password)
export async function signUpWithEmail(email, password, displayName = '') {
  const url = `${ID_TOOLKIT_BASE}/accounts:signUp?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email, password, returnSecureToken: true})
  });
  const data = await res.json();
  if (!res.ok) throw data;
  // Optionally update profile displayName via accounts:update
  if (displayName) {
    await fetch(`${ID_TOOLKIT_BASE}/accounts:update?key=${API_KEY}`, {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({idToken: data.idToken, displayName, returnSecureToken: true})
    });
  }
  return data; // contains idToken, refreshToken, localId (uid), expiresIn
}

// Sign in
export async function signInWithEmail(email, password) {
  const url = `${ID_TOOLKIT_BASE}/accounts:signInWithPassword?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email, password, returnSecureToken: true})
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Refresh token -> get a fresh idToken
export async function refreshIdToken(refreshToken) {
  const res = await fetch(`${SECURE_TOKEN}?key=${API_KEY}`, {
    method: 'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data; // contains id_token, refresh_token, user_id, expires_in
}

// Send password reset email
export async function sendPasswordReset(email) {
  const url = `${ID_TOOLKIT_BASE}/accounts:sendOobCode?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({requestType: "PASSWORD_RESET", email})
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
