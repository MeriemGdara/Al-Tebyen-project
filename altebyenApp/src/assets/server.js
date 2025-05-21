const express = require('express');
const mysql = require('mysql2'); // tu as bien choisi mysql2, parfait
const cors = require('cors');

const app = express();
const port = 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Suffit, pas besoin de body-parser

// ✅ Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'altebyen_db',
  port: 3307
});

db.connect(err => {
  if (err) {
    console.error('❌ Erreur de connexion MySQL:', err);
  } else {
    console.log('✅ Connecté à MySQL');
  }
});

// ✅ Vérification email existant
app.get('/emailExists', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).send('Email requis.');
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send('Erreur serveur.');
    res.json(results.length > 0);
  });
});

// ✅ Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Tentative de connexion avec :', email, password); // 👈 AJOUTE ÇA

  if (!email || !password) {
    return res.status(400).send('Email et mot de passe requis.');
  }

  db.query(
    'SELECT id, username, email FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return res.status(500).send('Erreur serveur.');
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(401).send('Identifiants invalides.');
      }
    }
  );
});

// ✅ Signup
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Tous les champs sont requis.');
  }

  db.query(
    'SELECT * FROM users WHERE email = ? OR username = ?',
    [email, username],
    (err, results) => {
      if (err) return res.status(500).send('Erreur serveur.');
      if (results.length > 0) {
        return res.status(400).send('Email ou nom d’utilisateur déjà utilisé.');
      }

      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password],
        (err2) => {
          if (err2) return res.status(500).send('Erreur enregistrement.');
          res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
        }
      );
    }
  );
});

// ✅ Message de contact
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("Champs requis manquants.");
  }

  db.query(
    'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err) => {
      if (err) {
        console.error('Erreur insertion message:', err);
        return res.status(500).send("Erreur enregistrement message.");
      }
      res.status(201).json({ message: "Message enregistré avec succès." });
    }
  );
});

app.listen(port, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
