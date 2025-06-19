import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStudentContext } from '../contexts/StudentContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme, addNotification } = useStudentContext();
  const navigate = useNavigate();
  
  // États pour les différentes sections de paramètres
  const [activeTab, setActiveTab] = useState('appearance');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newStudentAlert: true,
    resultUpdates: true,
    systemUpdates: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: true,
    showActivity: true,
    allowDataCollection: false
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Fonction pour gérer les changements dans les paramètres de notification
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Fonction pour gérer les changements dans les paramètres de confidentialité
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Fonction pour sauvegarder les paramètres
  const handleSave = () => {
    // Ici, on implémenterait la logique pour sauvegarder les paramètres
    // Pour l'instant, on simule juste une sauvegarde réussie
    setSaveSuccess(true);
    addNotification("Paramètres enregistrés avec succès!", "success");
    setTimeout(() => setSaveSuccess(false), 3000);
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
    <div className="container" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div className="card fade-in">
        <div className="card-header">
          <h2 className="card-title">Paramètres</h2>
          <i className="fa-solid fa-gear" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
        </div>
        
        <div className="settings-container">
          {/* Menu de navigation des paramètres */}
          <div className="settings-nav">
            <div 
              className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <i className="fa-solid fa-palette"></i>
              <span>Apparence</span>
            </div>
            <div 
              className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="fa-solid fa-bell"></i>
              <span>Notifications</span>
            </div>
            <div 
              className={`settings-nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <i className="fa-solid fa-user-shield"></i>
              <span>Confidentialité</span>
            </div>
            <div 
              className={`settings-nav-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <i className="fa-solid fa-info-circle"></i>
              <span>À propos</span>
            </div>
          </div>
          
          {/* Contenu des paramètres */}
          <div className="settings-content">
            {/* Paramètres d'apparence */}
            {activeTab === 'appearance' && (
              <div className="settings-section">
                <h3>Apparence</h3>
                <p>Personnalisez l'apparence de l'application selon vos préférences.</p>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Thème</h4>
                    <p>Choisissez entre le mode clair et le mode sombre.</p>
                  </div>
                  <div className="setting-control">
                    <button 
                      className="theme-toggle-btn" 
                      onClick={toggleTheme}
                    >
                      {theme === 'light' ? (
                        <>
                          <i className="fa-solid fa-moon"></i>
                          <span>Mode sombre</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-sun"></i>
                          <span>Mode clair</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Couleur d'accent</h4>
                    <p>Choisissez la couleur principale de l'interface.</p>
                  </div>
                  <div className="setting-control color-options">
                    <div className="color-option active" style={{ backgroundColor: '#4361ee' }}></div>
                    <div className="color-option" style={{ backgroundColor: '#3a0ca3' }}></div>
                    <div className="color-option" style={{ backgroundColor: '#7209b7' }}></div>
                    <div className="color-option" style={{ backgroundColor: '#f72585' }}></div>
                    <div className="color-option" style={{ backgroundColor: '#4cc9f0' }}></div>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Taille de police</h4>
                    <p>Ajustez la taille du texte dans l'application.</p>
                  </div>
                  <div className="setting-control">
                    <div className="font-size-slider">
                      <span>A</span>
                      <input type="range" min="1" max="3" defaultValue="2" />
                      <span style={{ fontSize: '1.2rem' }}>A</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Paramètres de notifications */}
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h3>Notifications</h3>
                <p>Configurez vos préférences de notifications.</p>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Notifications par email</h4>
                    <p>Recevez des notifications par email.</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="emailNotifications" 
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Nouveaux étudiants</h4>
                    <p>Soyez notifié lorsqu'un nouvel étudiant est inscrit.</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="newStudentAlert" 
                        checked={notificationSettings.newStudentAlert}
                        onChange={handleNotificationChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Mises à jour des résultats</h4>
                    <p>Soyez notifié lorsque des résultats sont ajoutés ou modifiés.</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="resultUpdates" 
                        checked={notificationSettings.resultUpdates}
                        onChange={handleNotificationChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Mises à jour système</h4>
                    <p>Recevez des notifications sur les mises à jour de l'application.</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="systemUpdates" 
                        checked={notificationSettings.systemUpdates}
                        onChange={handleNotificationChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Paramètres de confidentialité */}
            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h3>Confidentialité</h3>
                <p>Gérez vos paramètres de confidentialité et de sécurité.</p>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Afficher mon email</h4>
                    <p>Permettre aux autres utilisateurs de voir votre adresse email.</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="showEmail" 
                        checked={privacySettings.showEmail}
                        onChange={handlePrivacyChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Activité visible</h4>
                    <p>Permettre aux autres utilisateurs de voir votre activité récente.</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="showActivity" 
                        checked={privacySettings.showActivity}
                        onChange={handlePrivacyChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Collecte de données</h4>
                    <p>Autoriser la collecte de données anonymes pour améliorer l'application.</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="allowDataCollection" 
                        checked={privacySettings.allowDataCollection}
                        onChange={handlePrivacyChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-label">
                    <h4>Exporter mes données</h4>
                    <p>Téléchargez une copie de toutes vos données personnelles.</p>
                  </div>
                  <div className="setting-control">
                    <button className="secondary">
                      <i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i>
                      Exporter
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* À propos */}
            {activeTab === 'about' && (
              <div className="settings-section">
                <h3>À propos</h3>
                <p>Informations sur l'application.</p>
                
                <div className="about-app">
                  <div className="app-logo">
                    <i className="fa-solid fa-graduation-cap" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
                  </div>
                  <h2>Student Management System</h2>
                  <p>Version 1.0.0</p>
                  <p>© 2023 Tous droits réservés</p>
                  
                  <div className="about-links">
                    <a href="#" className="about-link">
                      <i className="fa-solid fa-book"></i>
                      <span>Documentation</span>
                    </a>
                    <a href="#" className="about-link">
                      <i className="fa-solid fa-circle-question"></i>
                      <span>Aide</span>
                    </a>
                    <a href="#" className="about-link">
                      <i className="fa-solid fa-bug"></i>
                      <span>Signaler un problème</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bouton de sauvegarde */}
            {(activeTab === 'notifications' || activeTab === 'privacy') && (
              <div className="settings-actions">
                <button onClick={handleSave} className="primary">
                  <i className="fa-solid fa-save" style={{ marginRight: '8px' }}></i>
                  Enregistrer les modifications
                </button>
                
                {saveSuccess && (
                  <div className="save-success">
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Paramètres enregistrés avec succès!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
