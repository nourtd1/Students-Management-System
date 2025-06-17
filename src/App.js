import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StudentProvider, useStudentContext } from './contexts/StudentContext';
import GetStartedPage from './pages/GetStartedPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import RegisterStudentPage from './pages/RegisterStudentPage';
import AddResultPage from './pages/AddResultPage';
import EditStudentPage from './pages/EditStudentPage';
import StudentsListPage from './pages/StudentsListPage';
import ResultsListPage from './pages/ResultsListPage';
import EditSuccessPage from './pages/EditSuccessPage';
import './App.css';

function RequireAuth({ children }) {
  const { isLoggedIn } = useStudentContext();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GetStartedPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<RequireAuth><Navbar /><Dashboard /></RequireAuth>} />
      <Route path="/search" element={<RequireAuth><Navbar /><SearchPage /></RequireAuth>} />
      <Route path="/register" element={<RequireAuth><Navbar /><RegisterStudentPage /></RequireAuth>} />
      <Route path="/add-result" element={<RequireAuth><Navbar /><AddResultPage /></RequireAuth>} />
      <Route path="/edit-student" element={<RequireAuth><Navbar /><EditStudentPage /></RequireAuth>} />
      <Route path="/edit-success" element={<RequireAuth><Navbar /><EditSuccessPage /></RequireAuth>} />
      <Route path="/students" element={<RequireAuth><Navbar /><StudentsListPage /></RequireAuth>} />
      <Route path="/results" element={<RequireAuth><Navbar /><ResultsListPage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <StudentProvider>
      <AppRoutes />
    </StudentProvider>
  );
}

export default App;
