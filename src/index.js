// Importation des dépendances React
import React from 'react';
import ReactDOM from 'react-dom/client';
// Importation des styles globaux
import './index.css';
// Importation du composant principal de l'application
import App from './App';
// Importation des utilitaires pour le service worker (fonctionnalités hors ligne)
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// Importation de l'outil de mesure des performances
import reportWebVitals from './reportWebVitals';
// Importation du routeur pour la navigation entre les pages
import { BrowserRouter } from 'react-router-dom';

// Création du point d'entrée React dans le DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
// Rendu de l'application dans le DOM
root.render(
  // StrictMode active des vérifications supplémentaires en développement
  <React.StrictMode>
    {/* BrowserRouter permet la navigation entre les pages */}
    <BrowserRouter>
      {/* Composant principal de l'application */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Si vous souhaitez que votre application fonctionne hors ligne et se charge plus rapidement,
// vous pouvez changer unregister() en register() ci-dessous. Notez que cela comporte
// certains pièges. En savoir plus sur les service workers : https://cra.link/PWA
serviceWorkerRegistration.unregister();

// Si vous souhaitez commencer à mesurer les performances de votre application,
// passez une fonction pour enregistrer les résultats (par exemple : reportWebVitals(console.log))
// ou envoyez-les à un point de terminaison d'analyse. En savoir plus : https://bit.ly/CRA-vitals
reportWebVitals();
