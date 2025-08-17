import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditLicenseModal({ isOpen, onClose, license, onUpdated, token }) {
  const [formData, setFormData] = useState({
    licenseKey: "",
    productName: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (license) {
      setFormData({
        licenseKey: license.licenseKey,
        productName: license.productName,
        expiryDate: license.expiryDate ? license.expiryDate.split("T")[0] : "",
      });
    }
  }, [license]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/licenses/${license._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdated(); // refresh list
      onClose();   // close modal
    } catch (error) {
      alert("Failed to update license");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit License</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="licenseKey"
            value={formData.licenseKey}
            onChange={handleChange}
            placeholder="License Key"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
