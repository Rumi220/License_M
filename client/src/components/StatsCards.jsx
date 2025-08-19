import axios from "axios";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function StatsCards({ tracker }) {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
useEffect(() => {
  let isMounted = true;
  setLoading(true);

  const fetchLicenses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/licenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (isMounted) {
        setLicenses(res.data.licenses);
      }
    } catch (err) {
      console.error(
        "Failed to fetch licenses:",
        err?.response?.data || err.message
      );
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchLicenses();

  return () => {
    isMounted = false;
  };
}, [token, tracker]);


  const totalClients = licenses.length;

  // Count based on status
  const active = licenses.filter((lic) => lic.status === "Active").length;
  const expiringSoon = licenses.filter(
    (lic) => lic.status === "Expiring Soon"
  ).length;
  const expired = licenses.filter((lic) => lic.status === "Expired").length;

  const stats = [
    {
      label: "Total Clients",
      value: totalClients,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
    {
      label: "Active Licenses",
      value: active,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bg: "bg-green-100",
      text: "text-green-700",
    },
    {
      label: "Expiring Soon",
      value: expiringSoon,
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },
    {
      label: "Expired Licenses",
      value: expired,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      bg: "bg-red-100",
      text: "text-red-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex items-center p-4 bg-white rounded-2xl shadow-md border border-gray-100"
        >
          <div className={`p-3 rounded-full ${stat.bg} mr-4`}>{stat.icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            {loading ? (
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className={`text-xl font-bold ${stat.text}`}>{stat.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
