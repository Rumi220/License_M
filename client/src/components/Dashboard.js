import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddLicenseModal from "./AddLicenseModal";
import EditLicenseModal from "./EditLicenseModal";
import StatsCards from "./StatsCards";
import { Pencil, Trash2 } from "lucide-react";

/** Helper: safely parse JWT payload (role, id, etc.) */
function parseJwt(token) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4) {
      base64 += "=";
    }

    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [licenses, setLicenses] = useState([]);
  const [tracker, setTracker] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [limit] = useState(5); // items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  const openEditModal = (license) => {
    setSelectedLicense(license);
    setEditModalOpen(true);
  };

  // get token & role
  const token = localStorage.getItem("token");

  const decoded = parseJwt(token);
  const role = decoded?.role || "user";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      console.warn("No token found — please login to fetch licenses.");
      return;
    }
    fetchLicenses(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchLicenses = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/licenses?page=${pageNumber}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      console.log(data.licenses);
      setLicenses(data.licenses || []);
      setTotalPages(data.totalPages || 1);
      if (pageNumber === 1) {
        setTracker(licenses);
      }
    } catch (err) {
      console.error(
        "Failed to fetch licenses:",
        err?.response?.data || err.message
      );
      // Optional: if 401/403, force logout
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        alert("Session expired or unauthorized. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this license?")) return;
    try {
      await axios.delete(`${API_BASE}/api/licenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refetch current page
      fetchLicenses(page);
    } catch (err) {
      console.error("Delete error:", err?.response?.data || err.message);
      alert("Delete failed");
    }
  };

  return (
    <div className="py-8 px-4 sm:px-8 md:px-16 lg:px-32 lg:py-16 xl:px-64 xl:py-16 ">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-8 py-8 bg-white rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Dashboard
        </h1>

        {/* Add License Button for Admins */}
        {role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 px-5 py-2 flex items-center bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add License
          </button>
        )}
      </div>

      <StatsCards tracker={tracker} />

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-left text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                Client Name
              </th>
              <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                Product
              </th>
              <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                Start Date
              </th>
              <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                End Date
              </th>
              <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                Status
              </th>
              {role === "admin" && (
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={role === "admin" ? 6 : 5}
                  className="px-6 py-8 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : licenses.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "admin" ? 6 : 5}
                  className="px-6 py-8 text-center"
                >
                  No licenses found.
                </td>
              </tr>
            ) : (
              licenses.map((lic) => {
                const product = lic.productName;
                const client = lic.clientName;
                const start = lic.startDate;
                const expiry = lic.expiryDate;
                const status = lic.status;

                return (
                  <tr key={lic._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 break-words">{client}</td>
                    <td className="px-6 py-4 break-words">{product}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {start ? new Date(start).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expiry ? new Date(expiry).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full
                  ${
                    status === "Active"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : status === "Expiring Soon"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                      >
                        {status}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="px-3 py-4">
                        {" "}
                        {/* smaller horizontal padding */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(lic)}
                            className="p-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lic._id)}
                            className="p-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm">Page</span>
          <strong>{page}</strong>
          <span className="text-sm">of {totalPages}</span>
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <AddLicenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLicenseAdded={fetchLicenses}
      />
      <EditLicenseModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        license={selectedLicense}
        onUpdated={fetchLicenses} // refresh after update
        token={token}
      />
    </div>
  );
}
