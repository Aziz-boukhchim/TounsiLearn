import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/SelectOptionsPage.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SelectOptionsPage = () => {
  const { universityId, courseId } = useParams();
  const [years, setYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isFirstYear, setIsFirstYear] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/years/${courseId}`)
      .then((response) => setYears(response.data))
      .catch(() => setError("Error fetching years"));
  }, [courseId]);

  useEffect(() => {
    const foundYear = years.find((year) => year._id === selectedYear);
    setIsFirstYear(foundYear?.name === "1");
  }, [selectedYear, years]);

  useEffect(() => {
    if (selectedYear && !isFirstYear) {
      axios
        .get(`http://localhost:5000/api/branches/${selectedYear}`)
        .then((response) => setBranches(response.data))
        .catch(() => setError("Error fetching branches"));
    } else {
      setBranches([]); 
      setSelectedBranch(""); 
    }
  }, [selectedYear, isFirstYear]);

  useEffect(() => {
    if (selectedYear) {
      axios
        .get(`http://localhost:5000/api/semesters/${selectedYear}`)
        .then((response) => setSemesters(response.data))
        .catch(() => setError("There Is No PDFs Yet In This Section"));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const searchParams = {
      courseId,
      yearId: selectedYear,
      semesterId: selectedSemester,
    };

    if (!isFirstYear) {
      searchParams.branchId = selectedBranch;
    }

    axios
      .get(`http://localhost:5000/api/pdfs/search`, { params: searchParams })
      .then((response) => {
        navigate(
          `/pdfs/${universityId}/${courseId}/${selectedYear}/${selectedBranch || "none"}/${selectedSemester}`,
          { state: { pdfs: response.data } }
        );
      })
      .catch(() => setError("Error fetching PDFs."));
  };

  return (
    <div>
      <Navbar />
      <div className="select-options-container">
        <h2>Select Year/Branch/Semester</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <select id="year" value={selectedYear} onChange={handleYearChange} required>
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.name} Year
                </option>
              ))}
            </select>
          </div>

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
            <label htmlFor="semester">Semester</label>
            <select id="semester" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} required>
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester._id} value={semester._id}>
                  Semester {semester.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">View PDFs</button>
        </form>
      </div>
      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
      <Footer></Footer>
    </div>
  );
};

export default SelectOptionsPage;
