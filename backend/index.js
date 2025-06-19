// Importation des dépendances principales
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

// Initialisation de l'application Express
const app = express();
app.use(cors()); // Autorise les requêtes cross-origin
app.use(bodyParser.json()); // Parse le JSON dans les requêtes

// Configuration de l'API SendGrid (remplacer par votre propre clé en production)
sgMail.setApiKey('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'); // Remplace par ta clé SendGrid

// Stockage temporaire des utilisateurs (à remplacer par une base de données en production)
const users = []; // Pour la démo, en mémoire. Utilise une vraie base en prod.

// Clé secrète pour JWT (à garder confidentielle)
const JWT_SECRET = 'MaSuperCleSecreteUltraLongueEtComplexe123!@#'; // À garder secret

// Route d'inscription d'un nouvel utilisateur
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  // Vérifie si l'email existe déjà
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email déjà utilisé' });
  // Hash du mot de passe
  const hash = await bcrypt.hash(password, 10);
  users.push({ email, password: hash });
  res.json({ message: 'Compte créé' });
});

// Route de connexion
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Utilisateur inconnu' });
  // Vérifie le mot de passe
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });
  res.json({ message: 'Connexion réussie' });
});

// Route de demande de réinitialisation de mot de passe
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Utilisateur inconnu' });

  // Génère un token JWT valable 15 minutes
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `http://localhost:3000/reset-password/${token}`;

  // Envoie l'email de réinitialisation via SendGrid
  sgMail.send({
    to: email,
    from: 'annourmah@gmail.com', // Doit être validé sur SendGrid
    subject: 'Réinitialisation de mot de passe',
    html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
           <a href="${resetLink}">${resetLink}</a>`
  });

  res.json({ message: 'Email envoyé' });
});

// Route de réinitialisation du mot de passe
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    // Vérifie et décode le token
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Utilisateur inconnu' });
    // Met à jour le mot de passe
    user.password = await bcrypt.hash(password, 10);
    res.json({ message: 'Mot de passe réinitialisé' });
  } catch (err) {
    res.status(400).json({ error: 'Lien invalide ou expiré' });
  }
});

// Démarrage du serveur sur le port 4000
app.listen(4000, () => console.log('API running on http://localhost:4000'));
