// src/pages/Shop/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function Profile() {
  const { token, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });


  // Fetch user + address info
  const fetchProfile = async () => {
    try {
      const res = await API.get("api/users/profile");
      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
      });
      setAddresses(res.data.Addresses || []);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile info
  const handleProfileUpdate = async () => {
    try {
      await API.put("api/users/profile", form);
      alert("Profile updated!");
      fetchProfile();
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    }
  };

  // Add new address
  const handleAddAddress = async () => {
    try {
      await API.post("api/users/address", newAddress);
      alert("Address added!");
      setNewAddress({
        fullName: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });
      fetchProfile();
    } catch (err) {
      console.error("Failed to add address", err);
    }
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await API.delete(`api/users/address/${id}`);
      fetchProfile();
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  if (!profile) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-lg mt-30">
      <h2 className="text-3xl font-bold text-center text-gray-600 mb-6">
        My Profile
      </h2>

      {/* Profile Info */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-600">Personal Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded-lg p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg p-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            className="border rounded-lg p-2"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <button
          onClick={handleProfileUpdate}
          className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition cursor-pointer"
        >
          Update Profile
        </button>
      </div>

      {/* Addresses */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-600">
          Saved Addresses
        </h3>

        {addresses.length === 0 ? (
          <p className="text-gray-500 mb-4">No addresses saved yet.</p>
        ) : (
          addresses.map((a) => (
            <div
              key={a.id}
              className="border rounded-lg p-3 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{a.fullName}</p>
                <p className="text-sm text-gray-600">
                  {a.street}, {a.city}, {a.state}, {a.postalCode}, {a.country}
                </p>
                <p className="text-sm text-gray-600"> {a.phone}</p>
              </div>
              <button
                onClick={() => handleDeleteAddress(a.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))
        )}

        {/* Add Address */}
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-3 text-gray-600">Add New Address</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded-lg p-2"
              value={newAddress.fullName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, fullName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Street"
              className="border rounded-lg p-2"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="City"
              className="border rounded-lg p-2"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="State"
              className="border rounded-lg p-2"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="border rounded-lg p-2"
              value={newAddress.postalCode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postalCode: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Country"
              className="border rounded-lg p-2"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              className="border rounded-lg p-2"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleAddAddress}
            className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition cursor-pointer"
          >
            Add Address
          </button>
        </div>
      </div>
    </div>
  );
}
