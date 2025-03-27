import axios from "axios";
import React, {useState} from "react";
import '../styles/RegisterPage.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from '../pictures/logo.jpg';




const Register = () => {

    const [name , setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    

    const handleRegister = async(e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
          }

        try {
            const response = axios.post("https://tounsilearn.onrender.com/api/users/register", {
                name,
                email,
                password,
            });
            navigate("/login");
        } catch(err) {
            setError("Registration failed. Please try again.");
        }
    }

    return (
        <div className="register-page">
          {/* Left Side - Information / Image */}
          <div className="register-info">
            <h1>Welcome to Tounsi-Learn</h1>
            <br></br>
            <p>Your platform for sharing and accessing educational resources.</p>
          </div>
      
          {/* Right Side - Register Form */}
          <div className="register-container">
             <img src={logo} alt="logo" width="220" height="140"></img>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
              <button type="submit" className="submit-btn">Register</button>
              <div className="login-link">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
              </div>
            </form>
          </div>
        </div>
      );      

}
export default Register;