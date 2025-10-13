// src/services/storageRest.js
const BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

export async function uploadProductImage(file, idToken, productId) {
  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/product-images%2F${productId}?uploadType=media`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": file.type,
      Authorization: `Bearer ${idToken}`,
    },
    body: file,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error.message);

  // Public URL
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(
    `product-images/${productId}`
  )}?alt=media`;
}
