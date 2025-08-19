import React, { useState, useEffect } from "react";
import axios from "axios";


export default function EditLicenseModal({
  isOpen,
  onClose,
  license,
  onUpdated,
  token,
}) {
  const [formData, setFormData] = useState({
    clientName: "",
    productName: "",
    startDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (license) {
      setFormData({
        clientName: license.clientName,
        productName: license.productName,
        startDate: license.startDate ? license.startDate.split("T")[0] : "",
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
      onClose(); // close modal
    } catch (error) {
      alert("Failed to update license");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl px-10 py-6 w-96 shadow-lg">
        <h2 className="text-xl text-center font-semibold mb-4">Edit License</h2>
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
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
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
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
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

          <div className="flex justify-end space-x-2 pt-2">
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
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
