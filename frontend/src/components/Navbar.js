import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Navbar.css';
import logo from '../pictures/logo.jpg';


const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false); // State for toggling menu
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken"); // Check if user is logged in

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        navigate("/login");
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Tounsi-Learn
                    <img src={logo} alt="logo"></img>
                </Link>

                <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    &#9776; {/* Hamburger icon */}
                </div>

                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <li>
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li>
                        <Link to="/universities" className="nav-link">Universities</Link>
                    </li>
                    <li>
                        <Link to="/upload" className="nav-link">Upload PDF</Link>
                    </li>
                </ul>

                <div className="profile-section">
                    {token ? (
                        <div className="profile-dropdown">
                            <span className="profile-icon">👤</span>
                            <div className="dropdown-content">
                                <Link to="/profile" className="dropdown-link">Profile</Link>
                                <br></br>
                                <Link to="/login" onClick={handleLogout} className="dropdown-link">Logout</Link>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-link">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
