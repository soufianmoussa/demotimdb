const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./server/db.sqlite');

app.use(cors());
app.use(express.json());

// initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  const defaultUser = 'demo';
  const defaultPass = 'password';
  db.get('SELECT * FROM users WHERE username = ?', [defaultUser], (err, row) => {
    if (!row) {
      bcrypt.hash(defaultPass, 10, (e, hash) => {
        if (!e) {
          db.run('INSERT INTO users (username, password) VALUES (?, ?)', [defaultUser, hash]);
          console.log('Seeded default user: demo/password');
        }
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });
  db.get('SELECT password FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!row) return res.status(401).json({ message: 'Invalid credentials' });

    bcrypt.compare(password, row.password, (e, ok) => {
      if (ok) {
        res.json({ success: true, username });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
