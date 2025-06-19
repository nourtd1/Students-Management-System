import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStudentContext } from '../contexts/StudentContext';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

// Définition des éléments de navigation avec leurs chemins, libellés et icônes
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'fa-solid fa-gauge-high' },
  { to: '/search', label: 'Rechercher', icon: 'fa-solid fa-magnifying-glass' },
  { to: '/register', label: 'Inscription', icon: 'fa-solid fa-user-plus' },
  { to: '/add-result', label: 'Résultats', icon: 'fa-solid fa-chart-simple' },
  { to: '/edit-student', label: 'Éditer', icon: 'fa-solid fa-pen-to-square' },
  { to: '/students', label: 'Étudiants', icon: 'fa-solid fa-users' },
  { to: '/results', label: 'Notes', icon: 'fa-solid fa-list-check' }
];

// Composant de barre de navigation principale
const Navbar = () => {
  // État pour le menu mobile
  const [menuOpen, setMenuOpen] = useState(false);
  // État pour le menu du profil
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  // Référence pour le menu déroulant du profil
  const profileMenuRef = useRef(null);
  
  // Récupération des données et fonctions du contexte
  const { toggleTheme, theme } = useStudentContext();
  const { logout, currentUser } = useAuth();
  
  // Hooks pour la navigation et la localisation
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => location.pathname === path;
  
  // Fonction pour basculer le menu mobile
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  // Fonction pour basculer le menu du profil
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setProfileMenuOpen(!profileMenuOpen);
  };
  
  // Fonction pour fermer le menu mobile après un clic sur un lien
  const closeMenu = () => setMenuOpen(false);
  
  // Fermer le menu du profil lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="navbar-logo" onClick={closeMenu}>
          <i className="fa-solid fa-graduation-cap"></i>
          <span>Student Management</span>
        </Link>
        
        {/* Bouton du menu mobile */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          <i className={`fa-solid ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      
      {/* Menu de navigation (avec classe conditionnelle pour mobile) */}
      <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
        <div className="navbar-start">
          <Link 
            to="/dashboard" 
            className={`navbar-item ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <i className="fa-solid fa-home"></i>
            <span>Tableau de bord</span>
          </Link>
          
          <Link 
            to="/register" 
            className={`navbar-item ${isActive('/register') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>Inscrire un étudiant</span>
          </Link>
          
          <Link 
            to="/add-result" 
            className={`navbar-item ${isActive('/add-result') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <i className="fa-solid fa-file-circle-plus"></i>
            <span>Ajouter un résultat</span>
          </Link>
          
          <Link 
            to="/search" 
            className={`navbar-item ${isActive('/search') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <i className="fa-solid fa-search"></i>
            <span>Rechercher</span>
          </Link>
          
          <div className="navbar-dropdown">
            <span className="navbar-item dropdown-trigger">
              <i className="fa-solid fa-list"></i>
              <span>Listes</span>
              <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
            </span>
            
            <div className="dropdown-menu">
              <Link 
                to="/students" 
                className="dropdown-item"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-users"></i>
                <span>Liste des étudiants</span>
              </Link>
              
              <Link 
                to="/results" 
                className="dropdown-item"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-file-lines"></i>
                <span>Liste des résultats</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="navbar-end">
          {/* Affichage de l'utilisateur connecté avec menu déroulant */}
          {currentUser && (
            <div className="profile-dropdown" ref={profileMenuRef}>
              <div 
                className="navbar-item user-info" 
                onClick={toggleProfileMenu}
                title="Cliquez pour voir les options"
              >
                <i className="fa-solid fa-user-circle"></i>
                <span>{currentUser.prenom} {currentUser.nom}</span>
                <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
              </div>
              
              {profileMenuOpen && (
                <div className="profile-dropdown-menu">
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <i className="fa-solid fa-id-card"></i>
                    <span>Mon profil</span>
                  </Link>
                  
                  <Link 
                    to="/settings" 
                    className="dropdown-item"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <i className="fa-solid fa-gear"></i>
                    <span>Paramètres</span>
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-item" 
                    onClick={handleLogout}
                  >
                    <i className="fa-solid fa-sign-out-alt"></i>
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Bouton de changement de thème */}
          <button 
            className="navbar-item theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
          >
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 