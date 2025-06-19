// Importation des dépendances React et des outils de routage
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StudentProvider } from './contexts/StudentContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// Importation des pages et composants principaux
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
import StudentDetailsPage from './pages/StudentDetailsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

// Composant de protection de route : redirige vers /login si l'utilisateur n'est pas authentifié
function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Définition des routes principales de l'application
function AppRoutes() {
  return (
    <>
      <NotificationSystem />
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<GetStartedPage />} />
        {/* Authentification */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* Pages protégées par authentification */}
        <Route path="/dashboard" element={<RequireAuth><Navbar /><Dashboard /></RequireAuth>} />
        <Route path="/search" element={<RequireAuth><Navbar /><SearchPage /></RequireAuth>} />
        <Route path="/register" element={<RequireAuth><Navbar /><RegisterStudentPage /></RequireAuth>} />
        <Route path="/add-result" element={<RequireAuth><Navbar /><AddResultPage /></RequireAuth>} />
        <Route path="/edit-student" element={<RequireAuth><Navbar /><EditStudentPage /></RequireAuth>} />
        <Route path="/edit-success" element={<RequireAuth><Navbar /><EditSuccessPage /></RequireAuth>} />
        <Route path="/students" element={<RequireAuth><Navbar /><StudentsListPage /></RequireAuth>} />
        <Route path="/student-details" element={<RequireAuth><Navbar /><StudentDetailsPage /></RequireAuth>} />
        <Route path="/results" element={<RequireAuth><Navbar /><ResultsListPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Navbar /><ProfilePage /></RequireAuth>} />
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

// Composant principal de l'application
function App() {
  return (
    // Fournit les contextes d'authentification et des étudiants à toute l'application
    <AuthProvider>
      <StudentProvider>
        <AppRoutes />
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;
