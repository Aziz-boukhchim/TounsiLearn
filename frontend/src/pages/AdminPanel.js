import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [pdfs, setPdfs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    fetchPdfs();
    fetchUniversities();
  }, []);

  const fetchPdfs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/pdfs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      const data = await response.json();
      const pendingPdfs = data.filter(pdf => pdf.status === "Pending");
      setPdfs(pendingPdfs);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/universities", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const fetchCourses = async (universityId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/courses/${universityId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await response.json();
      console.log(data); // Check what the data looks like
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  

  const fetchYears = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/years/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await response.json();
      setYears(data);
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchBranches = async (yearId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/branches/${yearId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchSemesters = async (yearId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/semesters/${yearId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await response.json();
      setSemesters(data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const handleApprove = async (pdfId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/pdf/approve/${pdfId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      fetchPdfs(); // Refresh list
    } catch (error) {
      console.error("Error approving PDF:", error);
    }
  };

  const handleReject = async (pdfId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/pdf/reject/${pdfId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      fetchPdfs(); // Refresh list
    } catch (error) {
      console.error("Error rejecting PDF:", error);
    }
  };

  return (
   <div>
      <Navbar />
      <div className="admin-panel">
      <h1>Admin Panel</h1>

      {/* PDF Actions */}
      <div className="pdf-actions">
      <h2>Pending PDFs</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>University</th>
            <th>Uploaded By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pdfs.map((pdf) => (
            <tr key={pdf._id}>
              <td>{pdf.title}</td>
              <td>{pdf.university?.name || "Unknown"}</td>
              <td>{pdf.uploadedBy?.name || "Unknown"}</td>
              <td>
                <button onClick={() => handleApprove(pdf._id)}>Approve</button>
                <button onClick={() => handleReject(pdf._id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Add University */}
      <div className="add-university">
      <h2>Add University</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get("name");

          try {
            await fetch("http://localhost:5000/api/admin/add-university", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ name }),
            });
            fetchUniversities();
          } catch (error) {
            console.error("Error adding university:", error);
          }
        }}
      >
        <input type="text" name="name" placeholder="University Name" required />
        <button type="submit">Add</button>
      </form>

      <h2>Universities</h2>
      <ul>
        {universities.map((univ) => (
          <li key={univ._id}>{univ.name}</li>
        ))}
      </ul>
      </div>

      {/* Add Course */}
      <div className="add-course">
      <h2>Add Course</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get("name");
          const universityId = selectedUniversity;

          try {
            await fetch("http://localhost:5000/api/admin/add-course", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ name, universityId }),
            });
            fetchCourses(universityId);
          } catch (error) {
            console.error("Error adding course:", error);
          }
        }}
      >
        <select onChange={(e) => setSelectedUniversity(e.target.value)}>
          <option value="">Select University</option>
          {universities.map((univ) => (
            <option key={univ._id} value={univ._id}>
              {univ.name}
            </option>
          ))}
        </select>
        <input type="text" name="name" placeholder="Course Name" required />
        <button type="submit">Add</button>
      </form>

      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>{course.name}</li>
        ))}
      </ul>
      </div>

      {/* Add Year */}
      <div className="add-year">
      <h2>Add Year</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get("name");
          const courseId = selectedCourse;

          try {
            await fetch("http://localhost:5000/api/admin/add-year", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ name, courseId }),
            });
            fetchYears(courseId);
          } catch (error) {
            console.error("Error adding year:", error);
          }
        }}
      >
        <select onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
        <input type="text" name="name" placeholder="Year Name" required />
        <button type="submit">Add</button>
      </form>

      <h2>Years</h2>
      <ul>
        {years.map((year) => (
          <li key={year._id}>{year.name}</li>
        ))}
      </ul>
      </div>

      {/* Add Branch */}
      <div className="add-branch">
      <h2>Add Branch</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get("name");
          const yearId = selectedYear;

          try {
            await fetch("http://localhost:5000/api/admin/add-branch", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ name, yearId }),
            });
            fetchBranches(yearId);
          } catch (error) {
            console.error("Error adding branch:", error);
          }
        }}
      >
        <select onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year._id} value={year._id}>
              {year.name}
            </option>
          ))}
        </select>
        <input type="text" name="name" placeholder="Branch Name" required />
        <button type="submit">Add</button>
      </form>

      <h2>Branches</h2>
      <ul>
        {branches.map((branch) => (
          <li key={branch._id}>{branch.name}</li>
        ))}
      </ul>
      </div>

      {/* Add Semester */}
      <div className="add-semester">
      <h2>Add Semester</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get("name");
          const yearId = selectedYear;

          try {
            await fetch("http://localhost:5000/api/admin/add-semester", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ name, yearId }),
            });
            fetchSemesters(yearId);
          } catch (error) {
            console.error("Error adding semester:", error);
          }
        }}
      >
        <select onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year._id} value={year._id}>
              {year.name}
            </option>
          ))}
        </select>
        <input type="text" name="name" placeholder="Semester Name" required />
        <button type="submit">Add</button>
      </form>

      <h2>Semesters</h2>
      <ul>
        {semesters.map((semester) => (
          <li key={semester._id}>{semester.name}</li>
        ))}
      </ul>
      </div>
    </div>
    </div>
  );
};

export default AdminPanel;
