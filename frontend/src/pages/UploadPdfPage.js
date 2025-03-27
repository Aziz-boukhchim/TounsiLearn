import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UploadPdfPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UploadPage = () => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [universityId, setUniversityId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isFirstYear, setIsFirstYear] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get("https://tounsilearn.onrender.com/api/admin/universities")
      .then((response) => setUniversities(response.data))
      .catch(() => setError("Error fetching universities"));
  }, []);

  useEffect(() => {
    if (universityId) {
      axios
        .get(`https://tounsilearn.onrender.com/api/courses/${universityId}`)
        .then((response) => setCourses(response.data))
        .catch(() => setError("Error fetching courses"));
    }
  }, [universityId]);

  useEffect(() => {
    if (courseId) {
      axios
        .get(`https://tounsilearn.onrender.com/api/years/${courseId}`)
        .then((response) => setYears(response.data))
        .catch(() => setError("Error fetching years"));
    }
  }, [courseId]);

  useEffect(() => {
    const foundYear = years.find((year) => year._id === selectedYear);
    setIsFirstYear(foundYear?.name === "1"); // Update first year logic

    if (selectedYear && !isFirstYear) {
      axios
        .get(`https://tounsilearn.onrender.com/api/branches/${selectedYear}`)
        .then((response) => setBranches(response.data))
        .catch(() => setError("Error fetching branches"));
    } else {
      setBranches([]);
      setSelectedBranch("");
    }
  }, [selectedYear, years, isFirstYear]);

  useEffect(() => {
    if (selectedYear) {
      axios
        .get(`https://tounsilearn.onrender.com/api/semesters/${selectedYear}`)
        .then((response) => setSemesters(response.data))
        .catch(() => setError("Error fetching semesters"));
    } else {
      setSemesters([]);
      setSelectedSemester("");
    }
  }, [selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedBranch("");
    setSelectedSemester("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("pdfFile", pdfFile);
    formData.append("universityId", universityId);
    formData.append("courseId", courseId);
    formData.append("yearId", selectedYear);
    formData.append("branchId", selectedBranch);
    formData.append("semesterId", selectedSemester);

    const token = localStorage.getItem("authToken"); // Get the token from localStorage

    try {
      const response = await axios.post("https://tounsilearn.onrender.com/api/pdfs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });
      setSuccess("PDF uploaded successfully!");
      setError("");
      // Redirect after success or reset the form
    } catch (err) {
      setError("Failed to upload PDF.");
      setSuccess("");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="upload-container">
        <h2>Upload PDF</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>PDF File:</label>
            <input
              type="file"
              onChange={(e) => setPdfFile(e.target.files[0])}
              required
            />
          </div>

          <div className="form-group">
            <label>University:</label>
            <select
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
              required
            >
              <option value="">Select University</option>
              {universities.map((university) => (
                <option key={university._id} value={university._id}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Course:</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Year:</label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              required
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.name} Year
                </option>
              ))}
            </select>
          </div>

          {/* Conditionally render Branch select based on Year */}
          {!isFirstYear && branches.length > 0 && (
            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <select
                id="branch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Semester:</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester._id} value={semester._id}>
                  Semester {semester.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Upload PDF</button>
        </form>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default UploadPage;
