// src/components/AddLicenseModal.jsx
import { useState } from "react";
import axios from "axios";

export default function AddLicenseModal({ isOpen, onClose, onLicenseAdded }) {
  const [formData, setFormData] = useState({
    licenseKey: "",
    productName: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/licenses",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onLicenseAdded();
      onClose();
      setFormData({ licenseKey: "", productName: "", expiryDate: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add license");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New License</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="licenseKey"
            placeholder="License Key"
            value={formData.licenseKey}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
