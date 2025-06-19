import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Composant de formulaire de connexion/inscription
// Le paramètre onlyLogin détermine si on affiche uniquement le formulaire de connexion
const LoginForm = ({ onlyLogin }) => {
  // Récupération des fonctions et données d'authentification
  const { login, register, authError, loading } = useAuth();
  
  // États locaux pour le formulaire de connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  // États pour le formulaire d'inscription et la gestion de l'affichage
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({ nom: '', prenom: '', email: '', password: '' });
  const [registerSuccess, setRegisterSuccess] = useState('');
  
  // Hook de navigation pour les redirections
  const navigate = useNavigate();

  // Gestion de la soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Appel de la fonction de connexion du contexte d'authentification
    const result = await login(email, password, rememberMe);
    
    if (result.success) {
      navigate('/register'); // Redirection vers la page d'inscription d'étudiant
    } else {
      setError(result.error || 'Une erreur est survenue');
    }
  };

  // Version simplifiée du formulaire (pour la page de connexion dédiée)
  if (onlyLogin) {
    return (
      <div className="page-center">
        {/* En-tête avec logo et message de bienvenue */}
        <div className="card fade-in" style={{ textAlign: 'center', maxWidth: 450 }}>
          <div className="card-header" style={{ justifyContent: 'center', borderBottom: 'none' }}>
            <div>
              <i className="fa-solid fa-graduation-cap" style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
              <h2 className="card-title" style={{ fontSize: '2.2rem', marginBottom: '0.8rem' }}>Student Management</h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>Bienvenue sur votre espace de gestion</p>
            </div>
          </div>
          
          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} style={{ boxShadow: 'none', padding: '1.5rem 2rem 2rem', border: 'none' }}>
            <div className="form-group">
              <label htmlFor="email">
                <i className="fa-solid fa-envelope" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                Email
              </label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Entrez votre email"
                required 
                className="slide-in"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                <i className="fa-solid fa-lock" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                Mot de passe
              </label>
              <input 
                id="password"
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Entrez votre mot de passe"
                required 
                className="slide-in"
                disabled={loading}
              />
            </div>
            
            {/* Option "Se souvenir de moi" */}
            <div className="form-check" style={{ marginBottom: '1rem' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="slide-in"
                disabled={loading}
              />
              <label htmlFor="rememberMe" style={{ marginLeft: '8px', cursor: 'pointer' }}>
                Se souvenir de moi
              </label>
            </div>
            
            {(error || authError) && <div className="error slide-in">{error || authError}</div>}
            
            <button type="submit" className="slide-in" disabled={loading}>
              {loading ? (
                <span><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Connexion...</span>
              ) : (
                <span><i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>Se connecter</span>
              )}
            </button>
            
            {/* Lien vers la page de récupération de mot de passe */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <span 
                style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }} 
                onClick={() => navigate('/forgot-password')}
                className="slide-in"
              >
                Mot de passe oublié ?
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Gestion de la soumission du formulaire d'inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setRegisterSuccess('');
    
    // Vérification que tous les champs sont remplis
    if (!registerForm.nom || !registerForm.prenom || !registerForm.email || !registerForm.password) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    
    // Appel de la fonction d'inscription du contexte d'authentification
    const result = await register(registerForm);
    
    if (result.success) {
      // Afficher un message de succès
      setRegisterSuccess('Compte créé ! Vous êtes maintenant connecté.');
      
      // Redirection vers le tableau de bord après un court délai
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.error || 'Une erreur est survenue lors de l\'inscription');
    }
  };

  // Version complète avec bascule entre connexion et inscription
  return (
    <div className="card fade-in" style={{ maxWidth: 450, margin: '3rem auto' }}>
      {!showRegister ? (
        // Formulaire de connexion
        <>
          <div className="card-header">
            <h2 className="card-title">Connexion</h2>
            <i className="fa-solid fa-right-to-bracket" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
          </div>
          
          <form onSubmit={handleSubmit} style={{ boxShadow: 'none', padding: '1.5rem 2rem 2rem', border: 'none' }}>
            <div className="form-group">
              <label htmlFor="login-email">
                <i className="fa-solid fa-envelope" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                Email
              </label>
              <input 
                id="login-email"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Entrez votre email"
                required 
                className="slide-in"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="login-password">
                <i className="fa-solid fa-lock" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                Mot de passe
              </label>
              <input 
                id="login-password"
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Entrez votre mot de passe"
                required 
                className="slide-in"
                disabled={loading}
              />
            </div>
            
            {/* Option "Se souvenir de moi" */}
            <div className="form-check" style={{ marginBottom: '1rem' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="slide-in"
                disabled={loading}
              />
              <label htmlFor="rememberMe" style={{ marginLeft: '8px', cursor: 'pointer' }}>
                Se souvenir de moi
              </label>
            </div>
            
            {(error || authError) && <div className="error slide-in">{error || authError}</div>}
            
            <button type="submit" className="slide-in" disabled={loading}>
              {loading ? (
                <span><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Connexion...</span>
              ) : (
                <span><i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>Se connecter</span>
              )}
            </button>
            
            {/* Lien pour basculer vers le formulaire d'inscription */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <span 
                style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }} 
                onClick={() => { setShowRegister(true); setError(''); }}
                className="slide-in"
              >
                Créer un compte
              </span>
            </div>
          </form>
        </>
      ) : (
        // Formulaire d'inscription
        <>
          <div className="card-header">
            <h2 className="card-title">Créer un compte</h2>
            <i className="fa-solid fa-user-plus" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
          </div>
          
          <form onSubmit={handleRegister} style={{ boxShadow: 'none', padding: '1.5rem 2rem 2rem', border: 'none' }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="register-nom">
                  <i className="fa-solid fa-user" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                  Nom
                </label>
                <input 
                  id="register-nom"
                  name="nom" 
                  value={registerForm.nom} 
                  onChange={e => setRegisterForm({ ...registerForm, nom: e.target.value })} 
                  placeholder="Votre nom"
                  required 
                  className="slide-in"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="register-prenom">
                  <i className="fa-solid fa-user" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                  Prénom
                </label>
                <input 
                  id="register-prenom"
                  name="prenom" 
                  value={registerForm.prenom} 
                  onChange={e => setRegisterForm({ ...registerForm, prenom: e.target.value })} 
                  placeholder="Votre prénom"
                  required 
                  className="slide-in"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="register-email">
                <i className="fa-solid fa-envelope" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                Email
              </label>
              <input 
                id="register-email"
                type="email" 
                name="email" 
                value={registerForm.email} 
                onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} 
                placeholder="Votre adresse email"
                required 
                className="slide-in"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="register-password">
                <i className="fa-solid fa-lock" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                Mot de passe
              </label>
              <input 
                id="register-password"
                type="password" 
                name="password" 
                value={registerForm.password} 
                onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} 
                placeholder="Choisissez un mot de passe"
                required 
                className="slide-in"
                disabled={loading}
              />
            </div>
            
            {(error || authError) && <div className="error slide-in">{error || authError}</div>}
            {registerSuccess && <div className="success slide-in">{registerSuccess}</div>}
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="secondary slide-in" 
                onClick={() => { setShowRegister(false); setError(''); }}
                disabled={loading}
              >
                Retour
              </button>
              
              <button type="submit" className="slide-in" disabled={loading}>
                {loading ? (
                  <span><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Inscription...</span>
                ) : (
                  <span><i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i>S'inscrire</span>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default LoginForm;