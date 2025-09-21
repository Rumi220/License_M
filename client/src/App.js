import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import { useAuth } from "./contexts/AuthContext";


console.log("user");

function App() {
    const { token, user, logout } = useAuth();
    console.log(user);
    

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/register" element={user? <Dashboard/> :<Register />} />
        <Route path="/login" element={user? <Dashboard/> :<Login></Login>} />
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
