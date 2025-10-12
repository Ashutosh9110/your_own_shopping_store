// src/services/firestoreRest.js
import { FIRESTORE_BASE } from './firebaseRest'; // or re-export constants

function toFirestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (Number.isInteger(value)) return { integerValue: String(value) };
  if (typeof value === 'number') return { doubleValue: value };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(v => toFirestoreValue(v)) } };
  }
  if (typeof value === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toFirestoreValue(v)]))
      }
    };
  }
  return { stringValue: String(value) };
}

function jsToFirestoreDocument(obj) {
  return { fields: Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toFirestoreValue(v)])) };
}

// usage helpers
export async function createDocument(collection, dataObj, idToken, docId = undefined) {
  const url = docId
    ? `${FIRESTORE_BASE}/${collection}?documentId=${encodeURIComponent(docId)}`
    : `${FIRESTORE_BASE}/${collection}`;
  const res = await fetch(url + `&key=${import.meta.env.VITE_FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsToFirestoreDocument(dataObj))
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function getDocument(collection, docId, idToken) {
  const url = `${FIRESTORE_BASE}/${collection}/${docId}`;
  const res = await fetch(url + `?key=${import.meta.env.VITE_FIREBASE_API_KEY}`, {
    headers: { 'Authorization': `Bearer ${idToken}` }
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// For simple list (get documents in a collection)
export async function listDocuments(collection, idToken, pageSize = 50) {
  const url = `${FIRESTORE_BASE}/${collection}?pageSize=${pageSize}`;
  const res = await fetch(url + `&key=${import.meta.env.VITE_FIREBASE_API_KEY}`, {
    headers: { 'Authorization': `Bearer ${idToken}` }
  });
  const data = await res.json();
  if (!res.ok) throw data;
  // convert Firestore document format -> simpler objects (helper not included here)
  return data;
}

export async function patchDocument(collection, docId, patchObj, idToken) {
  const url = `${FIRESTORE_BASE}/${collection}/${docId}?updateMask.fieldPaths=${Object.keys(patchObj).join('&updateMask.fieldPaths=')}`;
  const res = await fetch(url + `&key=${import.meta.env.VITE_FIREBASE_API_KEY}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(jsToFirestoreDocument(patchObj))
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function deleteDocument(collection, docId, idToken) {
  const url = `${FIRESTORE_BASE}/${collection}/${docId}`;
  const res = await fetch(url + `?key=${import.meta.env.VITE_FIREBASE_API_KEY}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${idToken}` }
  });
  if (!res.ok) throw await res.json();
  return true;
}
