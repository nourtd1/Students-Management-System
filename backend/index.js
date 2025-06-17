const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(cors());
app.use(bodyParser.json());

sgMail.setApiKey('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'); // Remplace par ta clé SendGrid

const users = []; // Pour la démo, en mémoire. Utilise une vraie base en prod.

const JWT_SECRET = 'MaSuperCleSecreteUltraLongueEtComplexe123!@#'; // À garder secret

// Inscription
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email déjà utilisé' });
  const hash = await bcrypt.hash(password, 10);
  users.push({ email, password: hash });
  res.json({ message: 'Compte créé' });
});

// Connexion
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Utilisateur inconnu' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });
  res.json({ message: 'Connexion réussie' });
});

// Demande de reset
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Utilisateur inconnu' });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `http://localhost:3000/reset-password/${token}`;

  sgMail.send({
    to: email,
    from: 'annourmah@gmail.com', // Doit être validé sur SendGrid
    subject: 'Réinitialisation de mot de passe',
    html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
           <a href="${resetLink}">${resetLink}</a>`
  });

  res.json({ message: 'Email envoyé' });
});

// Réinitialisation du mot de passe
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Utilisateur inconnu' });
    user.password = await bcrypt.hash(password, 10);
    res.json({ message: 'Mot de passe réinitialisé' });
  } catch (err) {
    res.status(400).json({ error: 'Lien invalide ou expiré' });
  }
});

app.listen(4000, () => console.log('API running on http://localhost:4000'));
