import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  console.log(user);
  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">LicenseApp</Link>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <span className="text-sm">Hi, {user?.name || user?.username || user?.email || 'User'}</span>
              <span className="text-xs px-2 py-1 bg-gray-700 rounded">{user?.role || 'user'}</span>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
