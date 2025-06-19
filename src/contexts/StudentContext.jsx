import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Création du contexte qui sera utilisé pour partager l'état entre les composants
const StudentContext = createContext();

// Hook personnalisé pour faciliter l'accès au contexte dans les composants
export const useStudentContext = () => useContext(StudentContext);

// URL de base de l'API
const API_URL = 'http://localhost:4000/api';

// Clés pour le stockage dans localStorage
const STUDENTS_KEY = 'students';
const RESULTS_KEY = 'results';
const USERS_KEY = 'users';
const LOGGEDIN_KEY = 'isLoggedIn';
const THEME_KEY = 'theme';
const OFFLINE_MODE_KEY = 'offline_mode';

// Utilisateur administrateur par défaut
const DEFAULT_ADMIN = { email: 'admin@school.com', password: 'admin123', nom: 'Admin', prenom: 'Admin' };

// Composant Provider qui encapsule l'application et fournit l'état global
export const StudentProvider = ({ children }) => {
  // État pour la liste des étudiants, initialisé depuis localStorage ou tableau vide
  const [students, setStudents] = useState(() => {
    const data = localStorage.getItem(STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  });
  
  // État pour la liste des résultats, initialisé depuis localStorage ou tableau vide
  const [results, setResults] = useState(() => {
    const data = localStorage.getItem(RESULTS_KEY);
    return data ? JSON.parse(data) : [];
  });
  
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
  
  // État pour le statut de connexion, initialisé depuis localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(LOGGEDIN_KEY) === 'true';
  });

  // État pour le thème, initialisé depuis localStorage ou 'light' par défaut
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'light';
  });

  // État pour les notifications
  const [notifications, setNotifications] = useState([]);
  
  // État pour le mode hors ligne
  const [offlineMode, setOfflineMode] = useState(() => {
    return localStorage.getItem(OFFLINE_MODE_KEY) === 'true';
  });
  
  // État pour le statut de connexion au serveur
  const [serverConnected, setServerConnected] = useState(false);

  // Fonction pour basculer entre les thèmes clair et sombre
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  // Fonction pour basculer entre le mode en ligne et hors ligne
  const toggleOfflineMode = () => {
    setOfflineMode(prev => !prev);
  };
  
  // Vérifier la connexion au serveur au chargement
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const response = await axios.get(`${API_URL}/test`, { timeout: 3000 });
        if (response.data && response.data.message) {
          setServerConnected(true);
          addNotification('Connecté au serveur', 'success');
        }
      } catch (error) {
        console.error('Erreur de connexion au serveur:', error);
        setServerConnected(false);
        setOfflineMode(true);
        addNotification('Mode hors ligne activé - Impossible de se connecter au serveur', 'warning');
      }
    };
    
    checkServerConnection();
    
    // Vérifier périodiquement la connexion
    const interval = setInterval(checkServerConnection, 30000); // Toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, []);

  // Fonction pour ajouter une notification
  const addNotification = (message, type = 'info', autoClose = true) => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Fermeture automatique après 5 secondes si autoClose est true
    if (autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
    
    return id;
  };
  
  // Fonction pour supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Fonction pour ajouter un étudiant avec notification
  const addStudent = async (student) => {
    const newStudent = { 
      id: Date.now(), 
      createdAt: new Date().toISOString(),
      ...student 
    };
    
    try {
      if (!offlineMode && serverConnected) {
        // Essayer d'ajouter l'étudiant via l'API si en mode en ligne
        const response = await axios.post(`${API_URL}/students`, student);
        if (response.data && response.data.success) {
          // Utiliser l'ID généré par le serveur
          newStudent.id = response.data.student._id || newStudent.id;
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'étudiant sur le serveur:', error);
      addNotification('Erreur de connexion au serveur - Données sauvegardées localement', 'warning');
    }
    
    // Toujours ajouter localement pour assurer la disponibilité des données
    setStudents(prev => [...prev, newStudent]);
    addNotification(`Étudiant ${student.firstName || student.nom} ${student.lastName || student.prenom} ajouté avec succès!`, 'success');
    return newStudent;
  };

  // Fonction pour mettre à jour un étudiant avec notification
  const updateStudent = async (id, data) => {
    try {
      if (!offlineMode && serverConnected) {
        // Essayer de mettre à jour l'étudiant via l'API si en mode en ligne
        await axios.put(`${API_URL}/students/${id}`, data);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'étudiant sur le serveur:', error);
      addNotification('Erreur de connexion au serveur - Données sauvegardées localement', 'warning');
    }
    
    // Toujours mettre à jour localement
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...data } : student
    ));
    addNotification(`Informations de l'étudiant mises à jour avec succès!`, 'success');
  };

  // Fonction pour supprimer un étudiant avec notification
  const deleteStudent = async (id) => {
    const student = students.find(s => s.id === id);
    if (student) {
      try {
        if (!offlineMode && serverConnected) {
          // Essayer de supprimer l'étudiant via l'API si en mode en ligne
          await axios.delete(`${API_URL}/students/${id}`);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'étudiant sur le serveur:', error);
        addNotification('Erreur de connexion au serveur - Données sauvegardées localement', 'warning');
      }
      
      // Toujours supprimer localement
      setStudents(prev => prev.filter(s => s.id !== id));
      addNotification(`Étudiant ${student.firstName || student.nom} ${student.lastName || student.prenom} supprimé avec succès!`, 'warning');
    }
  };

  // Fonction pour ajouter un résultat avec notification
  const addResult = async (result) => {
    const newResult = { 
      id: Date.now(), 
      createdAt: new Date().toISOString(),
      ...result 
    };
    
    try {
      if (!offlineMode && serverConnected) {
        // Essayer d'ajouter le résultat via l'API si en mode en ligne
        const response = await axios.post(`${API_URL}/results`, result);
        if (response.data && response.data.success) {
          // Utiliser l'ID généré par le serveur
          newResult.id = response.data.result._id || newResult.id;
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du résultat sur le serveur:', error);
      addNotification('Erreur de connexion au serveur - Données sauvegardées localement', 'warning');
    }
    
    // Toujours ajouter localement
    setResults(prev => [...prev, newResult]);
    
    const student = students.find(s => s.id === result.studentId || s.id === parseInt(result.studentId));
    if (student) {
      addNotification(`Résultat ajouté pour ${student.firstName || student.nom} ${student.lastName || student.prenom} en ${result.subject}!`, 'success');
    } else {
      addNotification(`Résultat ajouté avec succès!`, 'success');
    }
    
    return newResult;
  };

  // Effet pour sauvegarder les étudiants dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  }, [students]);

  // Effet pour sauvegarder les résultats dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  }, [results]);

  // Effet pour sauvegarder les utilisateurs dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  // Effet pour sauvegarder le statut de connexion dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(LOGGEDIN_KEY, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // Effet pour sauvegarder le thème dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    // Appliquer le thème au document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Effet pour sauvegarder le mode hors ligne dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(OFFLINE_MODE_KEY, offlineMode ? 'true' : 'false');
  }, [offlineMode]);

  // Fournit l'état et les fonctions de mise à jour à tous les composants enfants
  return (
    <StudentContext.Provider value={{ 
      students, setStudents, addStudent, updateStudent, deleteStudent,
      results, setResults, addResult,
      users, setUsers, 
      isLoggedIn, setIsLoggedIn,
      theme, setTheme, toggleTheme,
      notifications, addNotification, removeNotification,
      offlineMode, toggleOfflineMode, serverConnected
    }}>
      {children}
    </StudentContext.Provider>
  );
}; 