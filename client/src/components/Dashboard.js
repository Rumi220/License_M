import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddLicenseModal from './AddLicenseModal';

/** Helper: safely parse JWT payload (role, id, etc.) */
function parseJwt(token) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [licenses, setLicenses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [limit] = useState(5); // items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // get token & role
  const token = localStorage.getItem('token');
  
  const decoded = parseJwt(token);
  const role = decoded?.role || 'user';
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      console.warn('No token found — please login to fetch licenses.');
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
      setLicenses(data.licenses || []);      
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch licenses:', err?.response?.data || err.message);
      // Optional: if 401/403, force logout
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        alert('Session expired or unauthorized. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this license?')) return;
    try {
      await axios.delete(`${API_BASE}/api/licenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refetch current page
      fetchLicenses(page);
    } catch (err) {
      console.error('Delete error:', err?.response?.data || err.message);
      alert('Delete failed');
    }
  };

  const handleEdit = (id) => {
    // navigate to edit page or open modal (not implemented here)
    navigate(`/licenses/edit/${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">License Dashboard</h1>
        
        {role === 'admin' && (
         <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add License
        </button>
        )}
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">License Key</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Created By</th>
              {role === 'admin' && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={role === 'admin' ? 5 : 4} className="px-4 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : licenses.length === 0 ? (
              <tr>
                <td colSpan={role === 'admin' ? 5 : 4} className="px-4 py-6 text-center">
                  No licenses found.
                </td>
              </tr>
            ) : (
              licenses.map((lic) => {

                const product = lic.productName
                const key = lic.licenseKey
                const expiry = lic.expiryDate
                const createdBy = lic.createdBy.name

                return (
                  <tr key={lic._id} className="border-t">
                    <td className="px-4 py-3">{product}</td>
                    <td className="px-4 py-3 break-all">{key}</td>
                    <td className="px-4 py-3">
                      {expiry ? new Date(expiry).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">{createdBy || '—'}</td>
                    {role === 'admin' && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(lic._id)}
                            className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(lic._id)}
                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
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
    </div>
  );
}