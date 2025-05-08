const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// 📁 Chemins absolus vers les fichiers JSON
const USERS_FILE = path.join(__dirname, 'bd.json');
const CONTACT_FILE = path.join(__dirname, 'contactMessages.json');

// ✅ Route pour vérifier si l'email existe
app.get('/emailExists', (req, res) => {
  const { email } = req.query;

  fs.readFile(USERS_FILE, (err, data) => {
    if (err) {
      console.error('Erreur lecture fichier :', err);
      return res.status(500).send('Erreur lecture fichier.');
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error('Erreur parsing JSON :', parseError);
      return res.status(500).send('Fichier JSON invalide.');
    }

    const userExists = users.some(user => user.email === email);
    res.json(userExists);
  });
});

// ✅ Route pour login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile(USERS_FILE, (err, data) => {
    if (err) return res.status(500).send('Erreur lecture fichier.');

    let users;
    try {
      users = JSON.parse(data);
    } catch {
      return res.status(500).send('Fichier JSON invalide.');
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).send('Identifiants invalides.');
    }
  });
});

// ✅ Route pour signup
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  fs.readFile(USERS_FILE, (err, data) => {
    if (err) return res.status(500).send('Erreur lecture fichier.');

    let users;
    try {
      users = JSON.parse(data);
    } catch {
      return res.status(500).send('Fichier JSON invalide.');
    }

    if (users.some(u => u.email === email)) {
      return res.status(400).send('Email déjà utilisé.');
    }

    users.push({ email, password });

    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), err => {
      if (err) return res.status(500).send('Erreur écriture fichier.');
      res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
    });
  });
});

// ✅ Route pour enregistrer un message de contact
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("Champs requis manquants.");
  }

  fs.readFile(CONTACT_FILE, (err, data) => {
    let messages = [];

    if (!err && data.length > 0) {
      try {
        messages = JSON.parse(data);
      } catch (parseError) {
        console.error("Erreur parsing JSON :", parseError);
        return res.status(500).send("Fichier JSON invalide.");
      }
    }

    const newMessage = { name, email, message, timestamp: new Date().toISOString() };
    messages.push(newMessage);

    fs.writeFile(CONTACT_FILE, JSON.stringify(messages, null, 2), (err) => {
      if (err) {
        console.error("Erreur écriture :", err);
        return res.status(500).send("Erreur enregistrement message.");
      }
      console.log("✅ Nouveau message reçu :", newMessage);
      res.status(201).json({ message: 'Message enregistré avec succès.' });
    });
  });
});

// ✅ Lancement du serveur
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
