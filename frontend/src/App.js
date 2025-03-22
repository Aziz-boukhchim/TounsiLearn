import './App.css';
import './pages/LoginPage';
import { BrowserRouter as Router,Route,Routes, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UniversitiesPage from './pages/UniversitiesPage';
import UploadPdfPage from './pages/UploadPdfPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoutes';
import CoursesPage from "./pages/CoursesPage";
import SelectOptionsPage from './pages/SelectOptionsPage';
import PDFsPage from './pages/PDFsPage';
import AdminPanel from "./pages/AdminPanel";
import { jwtDecode } from "jwt-decode";
import ScrollToTop from './components/ScrollToTop';

const token = localStorage.getItem("authToken");
const role = token ? jwtDecode(token).role : null


function App() {
  return (
    <Router>
    <div className='main-content'>
      <ScrollToTop />
      <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage></HomePage></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/universities" exact element={<ProtectedRoute><UniversitiesPage></UniversitiesPage></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadPdfPage></UploadPdfPage></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage></ProfilePage></ProtectedRoute>} />
          <Route path="/courses/:universityId" element={<CoursesPage />} />
          <Route path="/select-options/:universityId/:courseId" element={<SelectOptionsPage />} />
          <Route path="/pdfs/:universityId/:courseId/:yearId/:branchId/:semesterId" element={<PDFsPage></PDFsPage>} />

          <Route 
           path='/admin'
           element={role === "admin" ? <AdminPanel/> : <Navigate to="/"/>}
          />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
