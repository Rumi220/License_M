// src/components/AddLicenseModal.jsx
import { useState } from "react";
import axios from "axios";


export default function AddLicenseModal({ isOpen, onClose, onLicenseAdded }) {
  const [formData, setFormData] = useState({
    clientName: "",
    productName: "",
    startDate: "",
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
      const token = sessionStorage.getItem("token");
      await axios.post("http://localhost:5000/api/licenses", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onLicenseAdded();
      onClose();
      setFormData({
        clientName: "",
        productName: "",
        startDate: "",
        expiryDate: "",
      });
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
      <div className="bg-white px-10 py-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl text-center font-bold mb-4">Add New License</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col mb-4">
            <label
              htmlFor="clientName"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Client Name
            </label>
            <input
              id="clientName"
              type="text"
              name="clientName"
              placeholder="Enter client name"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="productName"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              name="productName"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="startDate"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
    id="startDate"
    type="date"
    name="startDate"
    value={formData.startDate}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="Select start date"
    required
  /> 
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="expiryDate"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              End Date
            </label>

            <input
  id="expiryDate"
  type="date"
  name="expiryDate"
  value={formData.expiryDate}
  onChange={handleChange}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Select end date"
  required
/>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  clientName: "",
                  productName: "",
                  startDate: "",
                  expiryDate: "",
                });
                onClose();
              }}
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
