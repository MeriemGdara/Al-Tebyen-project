const express = require('express');
const mysql = require('mysql2');
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

app.get('/api/questions', (req, res) => {
  const category = (req.query.category || '').toString().trim();

  if (!category) {
    return res.status(400).json({ error: 'Catégorie requise' });
  }

  // 1. Trouver l'ID de la catégorie
  db.query(
    'SELECT id FROM categories WHERE name = ?',
    [category],
    (err, catResults) => {
      if (err) return res.status(500).json({
        error: 'Database error',
        details: err.message
      });

      if (catResults.length === 0) {
        return res.status(404).json({ error: 'Catégorie introuvable' });
      }

      const categoryId = catResults[0].id;

      // 2. Requête optimisée avec JOIN
      const sqlQuery = `
        SELECT
          q.id AS question_id,
          q.question_text,
          q.answer_text,
          JSON_ARRAYAGG(o.option_text) AS options
        FROM questions q
        JOIN options o ON q.id = o.question_id
        WHERE q.category_id = ?
        GROUP BY q.id
      `;

      db.query(sqlQuery, [categoryId], (err, results) => {
        if (err) return res.status(500).json({
          error: 'Database error',
          details: err.message
        });

        // 3. Validation des réponses
        const formattedResults = results.map(row => {
          const options = JSON.parse(row.options);

          if (!options.includes(row.answer_text)) {
            console.error(`Réponse invalide pour question ${row.question_id}`);
            options.push(row.answer_text); // Ajouter la réponse manquante
          }

          return {
            id: row.question_id,
            question: row.question_text,
            answer: row.answer_text,
            options: options.sort(() => Math.random() - 0.5) // Mélanger options
          };
        });

        res.json(formattedResults);
      });
  });
});
app.post('/api/quiz-results', async (req, res) => {
  const { user_id, category, score, total_questions, answers } = req.body;

  if (!user_id || !category || typeof score !== 'number') {
    return res.status(400).json({ error: 'Données manquantes ou invalides' });
  }

  try {
    // Récupération de l'ID de la catégorie
    const [categoryResults] = await db.promise().query(
      'SELECT id FROM categories WHERE name = ?',
      [category]
    );

    if (categoryResults.length === 0) {
      return res.status(404).json({ error: 'Catégorie introuvable' });
    }

    // Insertion du résultat du quiz
    const [result] = await db.promise().query(
      'INSERT INTO quiz_results (user_id, category_id, score, total_questions, answers) VALUES (?, ?, ?, ?, ?)',
      [
        user_id,
        categoryResults[0].id,
        score,
        total_questions,
        JSON.stringify(answers)
      ]
    );

    return res.json({
      success: true,
      session_id: result.insertId
    });

  } catch (error) {
    console.error('Erreur SQL:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur de base de données'
    });
  }
});


// ✅ Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email et mot de passe requis.');
  }

  db.query(
    'SELECT id, username, email, role FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return res.status(500).send('Erreur serveur.');
      if (results.length > 0) {
        res.json(results[0]); // Contient maintenant role
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

//affichage
app.get('/api/users', (req, res) => {
  db.query('SELECT id, username, email FROM users', (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des utilisateurs :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});
//modifier
app.put('/api/users/:id', (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.params.id;

  db.query(
    'UPDATE users SET username = ?, email = ?' + (password ? ', password = ?' : '') + ' WHERE id = ?',
    password ? [username, email, password, userId] : [username, email, userId],
    (err, result) => {
      if (err) return res.status(500).send('Erreur mise à jour.');
      res.json({ success: true });
    }
  );
});

// ❌ Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) return res.status(500).send('Erreur suppression.');
    res.json({ success: true });
  });
});

//affichage des contacts
app.get('/api/contact-messages', (req, res) => {
  db.query('SELECT id, name, email, message, timestamp, `read` FROM contact_messages ORDER BY timestamp DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

// Routes Categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, name });
  });
});

// Routes Questions
app.get('/api/questions', (req, res) => {
  db.query('SELECT * FROM questions', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/api/question', (req, res) => {
  const sql = 'SELECT id, category_id, question_text, answer_text FROM questions ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    res.json(results);
  });
});

// Routes Options
app.get('/api/options', (req, res) => {
  db.query('SELECT * FROM options', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/api/options', (req, res) => {
  const { question_id, option_text } = req.body;
  db.query('INSERT INTO options (question_id, option_text) VALUES (?, ?)',
  [question_id, option_text], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, question_id, option_text });
  });
});

app.put('/api/messages/:id/read', (req, res) => {
  const id = req.params.id;
  const read = req.body.read;

  // Utilise bien contact_messages au pluriel et `read` entouré de backticks
  db.query('UPDATE contact_messages SET `read` = ? WHERE id = ?', [read, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ success: true });
  });
});

app.listen(port, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
