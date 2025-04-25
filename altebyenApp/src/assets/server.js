const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ Important pour autoriser Angular
const app = express();
const port = 3000;

app.use(cors()); // ✅ Autoriser les requêtes CORS depuis localhost:4200
app.use(bodyParser.json());

// ✅ Route : vérifier si l'email existe
app.get('/emailExists', (req, res) => {
  const { email } = req.query;

  fs.readFile('bd.json', (err, data) => {
    if (err) {
      console.error('Erreur de lecture du fichier :', err);
      return res.status(500).send('Erreur de lecture du fichier.');
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error('Erreur de parsing JSON :', parseError);
      return res.status(500).send('Fichier JSON invalide.');
    }

    const userExists = users.some(user => user.email === email);
    res.json(userExists);
  });
});

// ✅ Route : login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile('bd.json', (err, data) => {
    if (err) {
      return res.status(500).send('Erreur de lecture du fichier.');
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).send('Fichier JSON invalide.');
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      res.json(user); // ✅ Utilisateur authentifié
    } else {
      res.status(401).send('Identifiants invalides.');
    }
  });
});

// ✅ Route : register
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  fs.readFile('bd.json', (err, data) => {
    if (err) {
      return res.status(500).send('Erreur de lecture du fichier.');
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).send('Fichier JSON invalide.');
    }

    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(400).send('L\'email est déjà utilisé.');
    }

    const newUser = { email, password };
    users.push(newUser);

    fs.writeFile('bd.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Erreur d\'écriture dans le fichier.');
      }
      res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
    });
  });
});

// ✅ Lancer le serveur
app.listen(port, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${port}`);
});
