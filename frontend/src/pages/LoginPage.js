import React, { useState } from "react";
import axios from "axios";
import '../styles/LoginPage.css';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import logo from '../pictures/logo.jpg';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://tounsilearn.onrender.com/api/users/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("authToken", token);

      // ✅ Decode and check if role exists
      const decodedToken = jwtDecode(token);
      
      if (decodedToken.role) {
        localStorage.setItem("role", decodedToken.role);
      } else {
        console.error("Role not found in token!");
      }

      // Redirect based on role
      if (decodedToken.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Information / Image */}
      <div className="login-info">
        <h1>Welcome to Tounsi-Learn</h1>
        <br></br>
        <p>Your platform for sharing and accessing educational resources.</p>
     
      </div>

      {/* Right Side - Login Form */}
      <div className="login-container">
        <img className="logo" src={logo} alt="logo" width="250" height="150"></img>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button className="submit-btn" type="submit">Login</button>
          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
