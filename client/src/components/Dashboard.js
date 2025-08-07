import { useEffect, useState } from 'react';

function Dashboard() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("user"); // hardcoded for now, we'll get from token later

  useEffect(() => {
    // Fetch licenses from backend
    const fetchLicenses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/licenses'); // Change to your endpoint
        const data = await res.json();
        setLicenses(data);
      } catch (err) {
        console.error("Error fetching licenses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">License Dashboard</h2>
      {loading ? (
        <p>Loading licenses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licenses.map((license) => (
            <div key={license._id} className="border rounded p-4 shadow bg-white">
              <h3 className="text-lg font-semibold">{license.name}</h3>
              <p className="text-sm text-gray-600">Key: {license.key}</p>
              <p className="text-sm text-gray-600">Expires: {license.expiryDate}</p>
              {role === 'admin' && (
                <div className="mt-2 space-x-2">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
