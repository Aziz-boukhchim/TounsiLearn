import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import '../styles/CoursesPage.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CoursesPage = () => {
  const { universityId } = useParams(); // Get university ID from the URL
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  // Fetch courses for the university
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${universityId}`, {
          headers: {
            'Cache-Control': 'no-cache', 
            'Pragma': 'no-cache'        
          }
        });
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses.");
      }
    };
  
    fetchCourses();
  }, [universityId]);
  
  return (
    <div>
      <Navbar />
      <div className="courses-container">
        <h2>Courses</h2>
        {error && <div className="error">{error}</div>}
        <div className="courses-list">
          {courses.length === 0 ? (
            <p>No courses available for this university.</p>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="course-card">
                <h3>{course.name}</h3>
                <Link to={`/select-options/${universityId}/${course._id}`}>
                  Select Year/Branch/Semester
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default CoursesPage;
