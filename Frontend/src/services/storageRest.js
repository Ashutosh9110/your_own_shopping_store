// src/services/storageRest.js
export async function uploadImage(file, idToken, destinationPath) {
  // destinationPath e.g. `products/product123/image1.jpg`
  const url = `${STORAGE_UPLOAD}?uploadType=multipart&name=${encodeURIComponent(destinationPath)}`;
  // Build multipart body: metadata + file
  const boundary = '------my-custom-boundary' + Date.now();
  const meta = { name: destinationPath };
  const reader = new Response(file).body; // FormData would be simpler but storage expects multipart/related
  // Simpler: use FormData (browser will set content-type multipart/form-data)
  const fd = new FormData();
  fd.append('file', file);
  // When using simple form post: this endpoint also supports it:
  const res = await fetch(`${STORAGE_UPLOAD}?name=${encodeURIComponent(destinationPath)}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${idToken}` },
    body: fd
  });
  const data = await res.json();
  if (!res.ok) throw data;
  // data contains `mediaLink` and `downloadTokens` maybe. Construct public URL:
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(destinationPath)}?alt=media`;
  return { meta: data, publicUrl };
}
