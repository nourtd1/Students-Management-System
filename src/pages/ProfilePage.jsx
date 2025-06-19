import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: currentUser?.nom || '',
    prenom: currentUser?.prenom || '',
    email: currentUser?.email || '',
  });
  
  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Fonction pour soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, on implémenterait la logique pour mettre à jour le profil utilisateur
    // Pour l'instant, on simule juste une mise à jour réussie
    setIsEditing(false);
  };
  
  // Fonction pour se déconnecter
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!currentUser) {
    return (
      <div className="page-center">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Erreur</h2>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Vous devez être connecté pour accéder à cette page.</p>
            <button onClick={() => navigate('/login')} className="mt-3">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="card fade-in">
        <div className="card-header">
          <h2 className="card-title">Mon profil</h2>
          <i className="fa-solid fa-id-card" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fa-solid fa-user-circle" style={{ fontSize: '5rem', color: 'var(--primary)' }}></i>
            </div>
            
            <div className="profile-info">
              <h3>{currentUser.prenom} {currentUser.nom}</h3>
              <p>{currentUser.email}</p>
              <p>Membre depuis: {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="profile-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className={isEditing ? 'secondary' : ''}
            >
              {isEditing ? (
                <><i className="fa-solid fa-xmark" style={{ marginRight: '8px' }}></i>Annuler</>
              ) : (
                <><i className="fa-solid fa-pen" style={{ marginRight: '8px' }}></i>Modifier le profil</>
              )}
            </button>
            
            <button onClick={handleLogout} className="danger">
              <i className="fa-solid fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
              Déconnexion
            </button>
          </div>
          
          {isEditing && (
            <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prenom">
                    <i className="fa-solid fa-user" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                    Prénom
                  </label>
                  <input 
                    id="prenom"
                    name="prenom" 
                    value={formData.prenom} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="nom">
                    <i className="fa-solid fa-user" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                    Nom
                  </label>
                  <input 
                    id="nom"
                    name="nom" 
                    value={formData.nom} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <i className="fa-solid fa-envelope" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                  Email
                </label>
                <input 
                  id="email"
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="new-password">
                  <i className="fa-solid fa-lock" style={{ marginRight: '8px', color: 'var(--gray-600)' }}></i>
                  Nouveau mot de passe (laisser vide pour ne pas changer)
                </label>
                <input 
                  id="new-password"
                  type="password" 
                  name="newPassword" 
                  placeholder="Nouveau mot de passe" 
                />
              </div>
              
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit">
                  <i className="fa-solid fa-save" style={{ marginRight: '8px' }}></i>
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          )}
          
          <div className="profile-section" style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <h4>Sécurité du compte</h4>
            <div style={{ marginTop: '1rem' }}>
              <button className="secondary">
                <i className="fa-solid fa-shield-alt" style={{ marginRight: '8px' }}></i>
                Changer le mot de passe
              </button>
              
              <button className="secondary" style={{ marginLeft: '1rem' }}>
                <i className="fa-solid fa-history" style={{ marginRight: '8px' }}></i>
                Historique de connexion
              </button>
            </div>
          </div>
          
          <div className="profile-section" style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <h4>Préférences</h4>
            <div style={{ marginTop: '1rem' }}>
              <button className="secondary">
                <i className="fa-solid fa-bell" style={{ marginRight: '8px' }}></i>
                Notifications
              </button>
              
              <button className="secondary" style={{ marginLeft: '1rem' }}>
                <i className="fa-solid fa-palette" style={{ marginRight: '8px' }}></i>
                Apparence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
