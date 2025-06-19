import React, { createContext, useContext, useState, useEffect } from 'react';

// Clés pour le stockage dans localStorage
const USERS_KEY = 'users';
const LOGGEDIN_KEY = 'isLoggedIn';
const CURRENT_USER_KEY = 'currentUser';
const SESSION_EXPIRY_KEY = 'sessionExpiry';
// Utilisateur administrateur par défaut
const DEFAULT_ADMIN = { email: 'admin@school.com', password: 'admin123', nom: 'Admin', prenom: 'Admin' };

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour faciliter l'accès au contexte d'authentification
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // État pour la liste des utilisateurs, avec l'admin par défaut si vide
  const [users, setUsers] = useState(() => {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      const arr = JSON.parse(data);
      if (arr.length === 0) return [DEFAULT_ADMIN];
      return arr;
    }
    return [DEFAULT_ADMIN];
  });
  
  // État pour le statut de connexion
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(LOGGEDIN_KEY) === 'true';
  });

  // État pour l'utilisateur actuellement connecté
  const [currentUser, setCurrentUser] = useState(() => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  });

  // État pour les erreurs d'authentification
  const [authError, setAuthError] = useState('');

  // État pour le chargement
  const [loading, setLoading] = useState(false);

  // État pour la mémorisation de session
  const [rememberMe, setRememberMe] = useState(false);

  // Fonction de connexion
  const login = async (email, password, remember = false) => {
    setLoading(true);
    setAuthError('');
    
    try {
      // Simuler un délai réseau (à remplacer par une vraie API)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Vérification des identifiants dans la liste des utilisateurs
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Succès de la connexion
        const userData = { ...user };
        delete userData.password; // Ne pas stocker le mot de passe en mémoire
        
        setCurrentUser(userData);
        setIsLoggedIn(true);
        setRememberMe(remember);
        
        // Définir l'expiration de la session
        const expiryTime = remember 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours si "se souvenir de moi"
          : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures sinon
        
        localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toISOString());
        
        return { success: true, user: userData };
      } else {
        // Échec de la connexion
        setAuthError('Identifiants invalides');
        return { success: false, error: 'Identifiants invalides' };
      }
    } catch (error) {
      setAuthError('Une erreur est survenue lors de la connexion');
      return { success: false, error: 'Une erreur est survenue lors de la connexion' };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    localStorage.setItem(LOGGEDIN_KEY, 'false');
  };

  // Fonction d'inscription
  const register = async (userData) => {
    setLoading(true);
    setAuthError('');
    
    try {
      // Vérifier que l'email n'existe pas déjà
      if (users.some(u => u.email === userData.email)) {
        setAuthError('Cet email existe déjà.');
        return { success: false, error: 'Cet email existe déjà.' };
      }
      
      // Simuler un délai réseau (à remplacer par une vraie API)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ajouter le nouvel utilisateur
      const newUser = { 
        id: Date.now(), 
        createdAt: new Date().toISOString(),
        ...userData 
      };
      
      // Mettre à jour la liste des utilisateurs et attendre que la mise à jour soit effective
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Stocker immédiatement dans localStorage pour éviter les problèmes de synchronisation
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      
      // Connecter automatiquement l'utilisateur
      const userData = { ...newUser };
      delete userData.password; // Ne pas stocker le mot de passe en mémoire
      
      setCurrentUser(userData);
      setIsLoggedIn(true);
      
      // Définir l'expiration de la session (24 heures par défaut)
      const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toISOString());
      localStorage.setItem(LOGGEDIN_KEY, 'true');
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      setAuthError('Une erreur est survenue lors de l\'inscription');
      return { success: false, error: 'Une erreur est survenue lors de l\'inscription' };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de récupération de mot de passe
  const forgotPassword = async (email) => {
    setLoading(true);
    setAuthError('');
    
    try {
      // Vérifier que l'email existe
      const user = users.find(u => u.email === email);
      if (!user) {
        setAuthError('Aucun compte associé à cet email.');
        return { success: false, error: 'Aucun compte associé à cet email.' };
      }
      
      // Simuler un délai réseau (à remplacer par une vraie API)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dans une vraie application, envoyer un email de réinitialisation
      // Pour l'instant, on simule juste une réponse positive
      
      return { 
        success: true, 
        message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' 
      };
    } catch (error) {
      setAuthError('Une erreur est survenue');
      return { success: false, error: 'Une erreur est survenue' };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de réinitialisation de mot de passe
  const resetPassword = async (token, newPassword) => {
    // Dans une vraie application, vérifier le token et mettre à jour le mot de passe
    // Pour l'instant, c'est juste un placeholder
    return { success: false, error: 'Fonctionnalité non implémentée' };
  };

  // Vérifier l'expiration de la session
  useEffect(() => {
    if (isLoggedIn) {
      const expiryTimeStr = localStorage.getItem(SESSION_EXPIRY_KEY);
      if (expiryTimeStr) {
        const expiryTime = new Date(expiryTimeStr);
        if (expiryTime < new Date()) {
          // Session expirée
          logout();
        }
      }
    }
  }, [isLoggedIn]);

  // Sauvegarder les utilisateurs dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  // Sauvegarder le statut de connexion dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(LOGGEDIN_KEY, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // Sauvegarder l'utilisateur courant dans localStorage à chaque changement
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  // Fournit l'état et les fonctions d'authentification à tous les composants enfants
  return (
    <AuthContext.Provider value={{
      users,
      setUsers,
      isLoggedIn,
      currentUser,
      authError,
      loading,
      rememberMe,
      login,
      logout,
      register,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 