// src/components/Admin/AddProduct.jsx
import React, { useState, useContext } from 'react';
import { uploadImage } from '../../services/storageRest';
import { createDocument } from '../../services/firestoreRest';
import { AuthContext } from '../../contexts/AuthContext';

export default function AddProduct() {
  const { idToken } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const uploadedUrls = [];
      for (let i=0;i<images.length;i++) {
        const file = images[i];
        const dest = `products/${Date.now()}_${file.name}`;
        const { publicUrl } = await uploadImage(file, idToken, dest);
        uploadedUrls.push(publicUrl);
      }
      const product = {
        name,
        price: Number(price),
        category,
        images: uploadedUrls,
        createdAt: new Date().toISOString()
      };
      const resp = await createDocument('products', product, idToken);
      alert('Product added');
    } catch(err) {
      console.error(err);
      alert('Error: ' + (err.message || JSON.stringify(err)));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="border p-2 mb-2"/>
      <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" className="border p-2 mb-2"/>
      <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="border p-2 mb-2"/>
      <input type="file" multiple onChange={e=>setImages(e.target.files)} />
      <button className="bg-blue-600 text-white px-4 py-2 mt-3">Add Product</button>
    </form>
  );
}
