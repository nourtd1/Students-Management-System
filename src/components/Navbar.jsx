import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStudentContext } from '../contexts/StudentContext';

const navItems = [
  { to: '/search', label: 'Rechercher un étudiant' },
  { to: '/register', label: 'Inscription étudiant' },
  { to: '/add-result', label: 'Ajouter un résultat' },
  { to: '/edit-student', label: 'Éditer un étudiant' },
  { to: '/students', label: 'Liste des étudiants' },
  { to: '/results', label: 'Liste des résultats' }
];

const Navbar = () => {
  const { setIsLoggedIn } = useStudentContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav style={{ background: '#3358e6', padding: '1rem 0', marginBottom: 0 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 0, flex: 1 }}>
          {navItems.map((item, idx) => (
            <React.Fragment key={item.to}>
              <NavLink
                to={item.to}
                style={({ isActive }) => ({
                  color: isActive ? '#fff' : '#eaf1ff',
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '0 18px',
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  borderRight: idx < navItems.length - 1 ? '1px solid #4f8cff' : 'none'
                })}
              >
                {item.label}
              </NavLink>
            </React.Fragment>
          ))}
        </div>
        <button onClick={handleLogout} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 500, cursor: 'pointer', marginLeft: 24 }}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 