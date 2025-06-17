import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentContext } from '../contexts/StudentContext';

const LoginForm = ({ onlyLogin }) => {
  const { users, setUsers, setIsLoggedIn } = useStudentContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({ nom: '', prenom: '', email: '', password: '' });
  const [registerSuccess, setRegisterSuccess] = useState('');
  const navigate = useNavigate();

  // Connexion
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setError('');
      setIsLoggedIn(true);
      navigate('/register');
    } else {
      setError('Identifiants invalides');
    }
  };

  if (onlyLogin) {
    return (
      <div className="page-center">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#3358e6', letterSpacing: 1, marginBottom: 8 }}>
            Student Management
          </div>
          <div style={{ fontSize: 18, color: '#4f8cff', fontWeight: 500, letterSpacing: 0.5 }}>
            Welcome Back
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ minWidth: 320 }}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" style={{ width: '100%', marginTop: 16 }}>Se connecter</button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ color: '#3358e6', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/forgot-password')}>
              Forgot Password?
            </span>
          </div>
        </form>
      </div>
    );
  }

  // Inscription
  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerForm.nom || !registerForm.prenom || !registerForm.email || !registerForm.password) return;
    if (users.some(u => u.email === registerForm.email)) {
      setRegisterSuccess('');
      setError('Cet email existe déjà.');
      return;
    }
    setUsers([...users, { ...registerForm }]);
    setRegisterSuccess('Compte créé ! Vous pouvez vous connecter.');
    setRegisterForm({ nom: '', prenom: '', email: '', password: '' });
    setError('');
    setTimeout(() => setRegisterSuccess(''), 2000);
    setShowRegister(false);
  };

  return (
    <div style={{ maxWidth: 350, margin: 'auto', marginTop: 100 }}>
      {!showRegister ? (
        <form onSubmit={handleSubmit}>
          <h2>Connexion</h2>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" style={{ width: '100%', marginTop: 16 }}>Se connecter</button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ color: '#3358e6', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setShowRegister(true); setError(''); }}>
              Créer un compte
            </span>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h2>Créer un compte</h2>
          <div>
            <label>Nom</label>
            <input name="nom" value={registerForm.nom} onChange={e => setRegisterForm({ ...registerForm, nom: e.target.value })} required />
          </div>
          <div>
            <label>Prénom</label>
            <input name="prenom" value={registerForm.prenom} onChange={e => setRegisterForm({ ...registerForm, prenom: e.target.value })} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} required />
          </div>
          <div>
            <label>Mot de passe</label>
            <input type="password" name="password" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} required />
          </div>
          {registerSuccess && <div className="success">{registerSuccess}</div>}
          {error && <div className="error">{error}</div>}
          <button type="submit" style={{ width: '100%', marginTop: 16 }}>Créer le compte</button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ color: '#3358e6', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setShowRegister(false); setError(''); }}>
              Retour à la connexion
            </span>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm; 