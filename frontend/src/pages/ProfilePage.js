import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import '../styles/ProfilePage.css'

const ProfilePage = () => {
  const [userPdfs, setUserPdfs] = useState([]);
  const [error, setError] = useState("");

  // Fetch PDFs uploaded by the user
  useEffect(() => {
    axios.get("http://localhost:5000/api/pdfs/userPdf", { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } })
      .then(response => {
        setUserPdfs(response.data);
      })
      .catch(() => setError("Error fetching uploaded PDFs"));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="profile-container">

        {error && <div className="error">{error}</div>}

        {/* Display PDFs uploaded by the user */}
        <div className="user-pdfs">
          <h2>Your Uploaded PDFs</h2>
          {userPdfs.length === 0 ? (
            <p>No PDFs uploaded yet.</p>
          ) : (
            <div className="pdf-list">
              {userPdfs.map((pdf) => (
                <div key={pdf._id} className="pdf-card">
                  <h4>{pdf.title}</h4>
                  <p>{pdf.description}</p>
                  <p>{pdf.status}</p>
                  {/* Link or button to view the PDF */}
                  <a
                                    href={`http://localhost:5000/${pdf.fileurl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="view-btn"
                                >
                                    View PDF
                                </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
