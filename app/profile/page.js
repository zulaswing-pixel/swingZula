"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Package,
  LogOut,
  Home,
  User,
  MapPin,
  ShoppingBag,
  Edit,
  X,
  Mail,
  Phone as PhoneIcon,
  Trash2,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [newAddress, setNewAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "India",
    phone: "",
    default: false,
  });

  const [errors, setErrors] = useState({});

const onlyLetters = (val) => val.replace(/[^a-zA-Z\s]/g, "");
const onlyNumbers = (val) => val.replace(/\D/g, "");

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const customerShopifyId = localStorage.getItem("customerShopifyId");
      if (!customerShopifyId) {
        alert("Please login first!");
        window.location.href = "/auth/login";
        return;
      }

      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerShopifyId }),
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.customer);

          setEditForm({
            firstName: data.customer.firstName || "",
            lastName: data.customer.lastName || "",
            email: data.customer.email || "",
            phone: data.customer.phone || "",
          });
        } else {
          alert("Failed to load profile. Please login again.");
          localStorage.removeItem("customerShopifyId");
          window.location.href = "/auth/login";
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

const handleLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("customerShopifyId");
    localStorage.removeItem("cartId");
  }

  // 🔔 Notify Header & other listeners
  window.dispatchEvent(new Event("user-logged-out"));

  // 🔥 Redirect & refresh app state
  router.replace("/auth/login");
  router.refresh();
};



  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
  const { name, value } = e.target;

  let updated = value;
  if (name === "firstName" || name === "lastName") {
    updated = onlyLetters(value);
  }

  setEditForm({ ...editForm, [name]: updated });
};


  const saveProfile = async () => {
     let newErrors = {};

  if (!editForm.firstName.trim())
    newErrors.firstName = "First name required";

  if (!editForm.lastName.trim())
    newErrors.lastName = "Last name required";

  if (!editForm.email || !isValidEmail(editForm.email))
    newErrors.email = "Valid email required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
          email: editForm.email.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Profile updated successfully!");
        setEditModalOpen(false);
        refreshUser();
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  const refreshUser = async () => {
    const customerShopifyId = localStorage.getItem("customerShopifyId");
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerShopifyId }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.customer);
      setEditForm({
        firstName: data.customer.firstName || "",
        lastName: data.customer.lastName || "",
        email: data.customer.email || "",
        phone: data.customer.phone || "",
      });
    }
  };

  const openEditAddressModal = (addr) => {
    setEditingAddress({ ...addr, isDefault: addr.id === user.defaultAddress?.id });
    setEditModalOpen(true);
  };

  const openAddAddressModal = () => {
    setAddModalOpen(true);
  };

  const handleAddressInputChange = (e, isNew = false) => {
  const { name, value } = e.target;
  let updated = value;

  if (["city", "province"].includes(name)) {
    updated = onlyLetters(value);
  }

  if (name === "zip") {
    updated = onlyNumbers(value).slice(0, 6);
  }

  if (name === "phone") {
    updated = onlyNumbers(value).slice(0, 10);
  }

  if (isNew) {
    setNewAddress({ ...newAddress, [name]: updated });
  } else {
    setEditingAddress({ ...editingAddress, [name]: updated });
  }
};


  const saveEditedAddress = async () => {
    let addr = editingAddress;
  let newErrors = {};

  if (!addr.address1) newErrors.address1 = "Address required";
  if (!addr.city) newErrors.city = "City required";
  if (!addr.province) newErrors.province = "State required";
  if (!addr.zip || addr.zip.length !== 6)
    newErrors.zip = "Valid PIN required";
  if (!addr.phone || addr.phone.length !== 10)
    newErrors.phone = "Valid phone required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
    try {
      const res = await fetch("/api/address/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerShopifyId: user.id,
          addressId: editingAddress.id,
          address: {
            ...editingAddress,
            default: editingAddress.isDefault || false,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        setEditModalOpen(false);
        setEditingAddress(null);
        alert("Address updated successfully!");
      } else {
        alert("Failed to update address");
      }
    } catch (err) {
      alert("Error updating address");
    }
  };

  const deleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch("/api/address/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerShopifyId: user.id, addressId }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        alert("Address deleted successfully!");
      } else {
        alert("Failed to delete address");
      }
    } catch (err) {
      alert("Error deleting address");
    }
  };

  const saveNewAddress = async () => {

    let addr = newAddress;
  let newErrors = {};

  if (!addr.address1) newErrors.address1 = "Address required";
  if (!addr.city) newErrors.city = "City required";
  if (!addr.province) newErrors.province = "State required";
  if (!addr.zip || addr.zip.length !== 6)
    newErrors.zip = "Valid PIN required";
  if (!addr.phone || addr.phone.length !== 10)
    newErrors.phone = "Valid phone required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
    try {
      const res = await fetch("/api/address/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerShopifyId: user.id,
          address: { ...newAddress, default: newAddress.default || false },
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        setAddModalOpen(false);
        setNewAddress({
          address1: "", address2: "", city: "", province: "", zip: "", country: "India", phone: "", default: false,
        });
        alert("New address added successfully!");
      } else {
        alert("Failed to add address");
      }
    } catch (err) {
      alert("Error adding address");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl sm:text-3xl font-bold text-indigo-800 animate-pulse">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const allAddresses = [
    ...(user.addresses || []),
    ...(user.defaultAddress && !user.addresses?.some(a => a.id === user.defaultAddress.id) ? [user.defaultAddress] : [])
  ].filter(Boolean);

  const validAddresses = allAddresses.filter(addr =>
    addr.address1?.trim() || addr.city?.trim() || addr.zip?.trim()
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header
          className="relative h-56 sm:h-64 md:h-80 bg-cover bg-center bg-no-repeat mt-5"
          style={{ backgroundImage: "url('/b5.webp')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold drop-shadow-2xl">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mt-3 drop-shadow-lg">
              Your Swing Zula Family
            </p>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Profile Card */}
          <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 mb-10 border border-indigo-100">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-lg flex-shrink-0">
                  {user.firstName?.[0] || "U"}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </h2>
                    <button onClick={openEditModal} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      <Edit className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                  </div>
                  <p className="text-lg sm:text-xl text-indigo-700 flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <Mail className="w-5 h-5" /> {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-indigo-700 flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <PhoneIcon className="w-5 h-5" /> {user.phone}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full sm:w-auto flex items-center justify-center gap-3 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:scale-105 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>

            {/* Default Address Preview */}
            {user.defaultAddress && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border-l-4 border-indigo-600 shadow-lg">
                <p className="font-bold text-lg sm:text-xl mb-3 flex items-center gap-3 justify-center sm:justify-start text-slate-900">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7" /> Default Delivery Address
                </p>
                <p className="text-slate-800 leading-relaxed text-center sm:text-left text-sm sm:text-base">
                  {user.defaultAddress.address1}
                  {user.defaultAddress.address2 && `, ${user.defaultAddress.address2}`}
                  <br />
                  {user.defaultAddress.city}, {user.defaultAddress.province} - {user.defaultAddress.zip}
                  <br />
                  {user.defaultAddress.country}
                </p>
              </div>
            )}
          </section>

          {/* Addresses Management Section */}
          <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 mb-10 border border-indigo-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-800 text-center sm:text-left">
                  My Addresses
                </h2>
              </div>
              {validAddresses.length < 10 && (
                <button
                  onClick={openAddAddressModal}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:scale-105 transition text-sm sm:text-base cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Add New
                </button>
              )}
            </div>

            {validAddresses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
                <p className="text-xl sm:text-2xl text-indigo-700 mb-6">No addresses saved yet.</p>
                <button
                  onClick={openAddAddressModal}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition cursor-pointer"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {validAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-2xl p-6 border-2 transition-all ${
                      addr.id === user.defaultAddress?.id
                        ? "border-indigo-600 bg-indigo-50 shadow-lg"
                        : "border-slate-200 bg-white hover:border-indigo-400"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <h4 className="font-bold text-lg sm:text-xl text-center sm:text-left text-slate-900">
                        {addr.id === user.defaultAddress?.id ? "Default Address" : "Address"}
                      </h4>
                      <div className="flex gap-3 justify-center sm:justify-end w-full sm:w-auto">
                        <button onClick={() => openEditAddressModal(addr)} className="text-indigo-600 cursor-pointer">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteAddress(addr.id)} className="text-red-600 cursor-pointer">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-sm sm:text-base text-center sm:text-left">
                      {addr.address1}
                      {addr.address2 && `, ${addr.address2}`}
                      <br />
                      {addr.city}, {addr.province} - {addr.zip}
                      <br />
                      {addr.country}
                      {addr.phone && <><br />Phone: {addr.phone}</>}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Continue Shopping */}
          <div className="text-center py-10">
            <a
              href="/"
              className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-5 sm:px-12 sm:py-6 rounded-2xl text-xl sm:text-2xl font-bold shadow-2xl hover:scale-105 transition"
            >
              <Home className="w-7 h-7 sm:w-8 sm:h-8" />
              Continue Shopping
            </a>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/order-history")}
              className="text-lg sm:text-xl text-indigo-700 underline hover:text-indigo-900 cursor-pointer"
            >
              View Order History →
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(editModalOpen || addModalOpen) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-indigo-800">
                {addModalOpen ? "Add New Address" : editingAddress ? "Edit Address" : "Edit Profile"}
              </h3>
              <button onClick={() => {
                setEditModalOpen(false);
                setAddModalOpen(false);
                setEditingAddress(null);
              }}>
                <X className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600 cursor-pointer" />
              </button>
            </div>

            {!editingAddress && !addModalOpen && (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="firstName" value={editForm.firstName} onChange={handleEditChange} placeholder="First Name" className="w-full p-4 border border-indigo-200 rounded-xl focus:border-indigo-600 text-base" />{errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    <input name="lastName" value={editForm.lastName} onChange={handleEditChange} placeholder="Last Name" className="w-full p-4 border border-indigo-200 rounded-xl focus:border-indigo-600 text-base" />{errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                  <input name="email" type="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" className="w-full p-4 border border-indigo-200 rounded-xl focus:border-indigo-600 text-base" />{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  <input name="phone" value={editForm.phone} readOnly className="w-full p-4 border border-indigo-200 rounded-xl bg-gray-100 text-base" />
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button onClick={saveProfile} className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold cursor-pointer">
                    Save Changes
                  </button>
                  <button onClick={() => setEditModalOpen(false)} className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-bold cursor-pointer">
                    Cancel
                  </button>
                </div>
              </>
            )}

            {(editingAddress || addModalOpen) && (
              <>
                <div className="space-y-4">
                  <input name="address1" value={editingAddress?.address1 || newAddress.address1} onChange={(e) => handleAddressInputChange(e, addModalOpen)} placeholder="Address Line 1" className="w-full p-4 border border-indigo-200 rounded-xl" />{errors.address1 && <p className="text-red-500 text-sm">{errors.address1}</p>}
                  <input name="address2" value={editingAddress?.address2 || newAddress.address2} onChange={(e) => handleAddressInputChange(e, addModalOpen)} placeholder="Address Line 2 (optional)" className="w-full p-4 border border-indigo-200 rounded-xl" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="city" value={editingAddress?.city || newAddress.city} onChange={(e) => handleAddressInputChange(e, addModalOpen)} placeholder="City" className="w-full p-4 border border-indigo-200 rounded-xl" />{errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

                    <input name="province" value={editingAddress?.province || newAddress.province} onChange={(e) => handleAddressInputChange(e, addModalOpen)} placeholder="State" className="w-full p-4 border border-indigo-200 rounded-xl" />{errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
                  </div>
                  <input name="zip" value={editingAddress?.zip || newAddress.zip} onChange={(e) => handleAddressInputChange(e, addModalOpen)} placeholder="PIN Code" className="w-full p-4 border border-indigo-200 rounded-xl" />{errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}
                  <input name="phone" value={editingAddress?.phone || newAddress.phone} onChange={(e) => handleAddressInputChange(e, addModalOpen)} placeholder="Phone" className="w-full p-4 border border-indigo-200 rounded-xl" />{errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={editingAddress?.isDefault || newAddress.default}
                      onChange={(e) => addModalOpen
                        ? setNewAddress({ ...newAddress, default: e.target.checked })
                        : setEditingAddress({ ...editingAddress, isDefault: e.target.checked })
                      }
                      className="w-5 h-5"
                    />
                    <label className="font-medium text-base">Set as default address</label>
                  </div>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button onClick={editingAddress ? saveEditedAddress : saveNewAddress} className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold cursor-pointer">
                    Save Address
                  </button>
                  <button onClick={() => {
                    setEditModalOpen(false);
                    setAddModalOpen(false);
                    setEditingAddress(null);
                  }} className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-bold cursor-pointer">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}