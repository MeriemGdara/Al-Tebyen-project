const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Route pour vérifier si l'email existe déjà
app.get('/emailExists', (req, res) => {
  const { email } = req.query;

  fs.readFile('bd.json', (err, data) => {
    if (err) {
      return res.status(500).send('Erreur de lecture du fichier.');
    }

    const users = JSON.parse(data);
    const userExists = users.some(user => user.email === email);
    res.json(userExists);  // Renvoie true si l'email existe déjà
  });
});

// Route pour l'authentification
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile('bd.json', (err, data) => {
    if (err) {
      return res.status(500).send('Erreur de lecture du fichier.');
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      res.json(user);  // L'utilisateur est authentifié
    } else {
      res.status(401).send('Identifiants invalides.');
    }
  });
});

// Route pour l'enregistrement de l'utilisateur
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  fs.readFile('bd.json', (err, data) => {
    if (err) {
      return res.status(500).send('Erreur de lecture du fichier.');
    }

    const users = JSON.parse(data);

    // Vérifier si l'email est déjà pris
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(400).send('L\'email est déjà utilisé.');
    }

    const newUser = { email, password };
    users.push(newUser);

    // Sauvegarder les utilisateurs mis à jour dans le fichier
    fs.writeFile('bd.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Erreur d\'écriture dans le fichier.');
      }
      res.status(201).send('Utilisateur enregistré avec succès.');
    });
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
