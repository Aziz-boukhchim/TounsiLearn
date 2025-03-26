import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/PDFsPage.css";
import Footer from "../components/Footer";

const PDFsPage = () => {
    // Destructure the parameters from the URL
    const { universityId, courseId, yearId, branchId, semesterId } = useParams();
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPDFs = async () => {
            try {
                // Prepare query parameters
                const queryParams = {
                    universityId,
                    courseId,
                    yearId,
                    semesterId,
                };

                // gonna add an array full of first yearsID ( just testing now!! )
                // Only include branchId if it's not the first year 
                if (yearId !== "67b34e7f04cab6b919d2128e") {
                    queryParams.branchId = branchId;
                }

                const response = await axios.get("http://localhost:5000/api/pdfs/search", {
                    params: queryParams,
                });

                console.log("Fetched PDFs:", response.data); // Debugging log

                // Filter out PDFs that are not approved
                const approvedPdfs = response.data.filter(pdf => pdf.status === "Approved");
                setPdfs(approvedPdfs);
            } catch (err) {
                setError("Failed to fetch PDFs.");
            }
        };

        fetchPDFs();
    }, [universityId, courseId, yearId, branchId, semesterId]); // Update when parameters change

    return (
        <div>
            <Navbar />
            <div className="pdfs-container">
                <h2>Available PDFs</h2>
                {error && <p className="error">{error}</p>}
                <div className="pdf-list">
                    {pdfs.length > 0 ? (
                        pdfs.map((pdf) => (
                            <div className="pdf-card" key={pdf._id}>
                                <h3>{pdf.title}</h3>
                                <p>{pdf.description}</p>
                                <a
                                    href={pdf.fileurl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="view-btn"
                                >
                                    View PDF
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>No PDFs available for the selected filters.</p>
                    )}
                </div>
            </div>
            <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br><br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
            <Footer></Footer>
        </div>
    );
};

export default PDFsPage;
