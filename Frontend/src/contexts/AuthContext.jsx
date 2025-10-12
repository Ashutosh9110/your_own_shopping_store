// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { signInWithEmail, signUpWithEmail, refreshIdToken } from '../services/firebaseRest';
import { getDocument } from '../services/firestoreRest';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { uid, email, displayName, role }
  const [idToken, setIdToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // login
  async function login(email, password) {
    const data = await signInWithEmail(email, password);
    setIdToken(data.idToken);
    setRefreshToken(data.refreshToken);
    // fetch profile from firestore
    const profile = await getDocument('users', data.localId, data.idToken);
    // convert profile fields -> plain object (you need a helper)
    setUser({ uid: data.localId, email: data.email, ...profileConverted });
    localStorage.setItem('refreshToken', data.refreshToken);
  }

  async function logout() {
    setUser(null); setIdToken(null); setRefreshToken(null);
    localStorage.removeItem('refreshToken');
  }

  // on mount: try to restore session
  useEffect(() => {
    const rt = localStorage.getItem('refreshToken');
    if (rt) {
      (async () => {
        try {
          const r = await refreshIdToken(rt);
          setIdToken(r.id_token);
          setRefreshToken(r.refresh_token);
          // fetch user profile
          const profile = await getDocument('users', r.user_id, r.id_token);
          setUser({ uid: r.user_id, ...profileConverted });
          localStorage.setItem('refreshToken', r.refresh_token);
        } catch(err) {
          console.warn('session restore failed', err);
          localStorage.removeItem('refreshToken');
        }
      })();
    }
  }, []);

  return <AuthContext.Provider value={{ user, idToken, refreshToken, login, logout, setUser }}>{children}</AuthContext.Provider>
}
