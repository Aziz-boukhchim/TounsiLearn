import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // For navigation
import '../styles/UniversitiesPage.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState("");

  // Fetch universities on page load
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("https://tounsilearn.onrender.com/api/admin/universities");
        setUniversities(response.data);
      } catch (err) {
        setError("Failed to fetch universities.");
      }
    };

    fetchUniversities();
  }, []);

  return (
    <div>
      <Navbar></Navbar>
    <div className="universities-container">
      <h2>Universities</h2>
      {error && <div className="error">{error}</div>}
      <div className="universities-list">
        {universities.map((university) => (
          <div key={university._id} className="university-card">
            <h3>{university.name}</h3>
            <Link to={`/courses/${university._id}`}>View Courses</Link>
          </div>
        ))}
      </div>
    </div>
    <Footer></Footer>
    </div>
  );
};

export default UniversitiesPage;
