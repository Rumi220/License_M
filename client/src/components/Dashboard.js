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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const openEditModal = (license) => {
    setSelectedLicense(license);
    setEditModalOpen(true);
  };

  // get token & role
  const token = sessionStorage.getItem("token");

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
  }, [page, search]);

  const fetchLicenses = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/licenses?page=${pageNumber}&limit=${limit}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
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
        sessionStorage.removeItem("token");
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
      <div className="w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white text-center rounded-xl shadow-lg p-16 mb-6">
        <h2 className="text-3xl font-bold">
          NHQ Distributions Ltd. Licensing Portal
        </h2>
        <p className="mt-1 text-sm opacity-90">
          Manage licenses, track clients, and keep everything organized in one.
        </p>
      </div>

      <div className="p-2">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-6 sm:px-8 py-6 bg-white rounded-3xl shadow-md border border-gray-100 transition-all duration-300">
          {/* Dashboard Title */}
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>

          {/* Add License Button for Admins */}
          {role === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 sm:mt-0 px-5 py-2 flex items-center bg-green-600 text-white font-medium rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-200"
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
      </div>

      {/* 🔍 Search Bar */}
      <div
        className="flex px-4 py-3 mb-4 rounded-md border-2 overflow-hidden w-full lg:w-1/2 mx-auto 
                hover:border-blue-300 focus-within:border-blue-300 
                transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192.904 192.904"
          width="16px"
          className="fill-gray-600 mr-3 rotate-90"
        >
          <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
        </svg>
        <input
          type="text"
          placeholder="Search by client or product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to page 1
          }}
          className="w-full outline-none bg-transparent text-gray-600 text-sm"
        />
      </div>

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
                Customer PO Date
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
              <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                Details
              </th>
              <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                Reminder
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
                const customerPODate = lic.customerPODate
                const start = lic.startDate;
                const expiry = lic.expiryDate;
                const status = lic.status;
                const details = lic.details;
                const reminder = lic.reminder;
                console.log(reminder);
                

                return (
                  <tr key={lic._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 break-words">{client}</td>
                    <td className="px-6 py-4 break-words">{product}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customerPODate ? new Date(customerPODate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {start ? new Date(start).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expiry ? new Date(expiry).toLocaleDateString() : "-"}
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
                    <td className="px-6 py-4 break-words">{details ? details : "-"}</td>
                    <td className="px-6 py-4 break-words">{reminder}</td>
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
