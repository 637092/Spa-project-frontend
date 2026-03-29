import { useState } from "react";
import api from "../api/axios";
import { setAdminAuth } from "../utils/adminAuth";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("admin/login/", { username, password });
      setAdminAuth(res.data.access, res.data.refresh);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="booking-form">
      <h2 className="services-title">Admin Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin} className="form-group">
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="book-btn">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
