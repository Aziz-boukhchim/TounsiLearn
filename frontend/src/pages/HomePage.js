import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Homepage.css';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <header className="hero-section">
        <h1>Welcome to Tounsi-Learn!</h1>
        <p>
          Here you can upload, search, and download PDFs related to your university courses.
        </p>
      </header>
      
      <section className="features">
        <div className="feature">
          <h3>Upload PDFs</h3>
          <p>Share your study materials with your peers and help others prepare better.</p>
        </div>
        <div className="feature">
          <h3>Search PDFs</h3>
          <p>Find exam papers, notes, and other resources with ease using our search functionality.</p>
        </div>
        <div className="feature">
          <h3>Download PDFs</h3>
          <p>Download the latest course PDFs to stay up to date with your studies.</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to upload or search PDFs?</h2>
        <p>Get started now and contribute to the learning community.</p>
        <Link to='/upload'><button className="cta-button">Upload PDF</button></Link>
        <Link to='/universities'><button className="cta-button">Search PDFs</button></Link>
      </section>
      <br></br><br></br><br></br>
      <Footer></Footer>
    </div>
  );
}

export default HomePage;
