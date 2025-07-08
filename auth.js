
const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const router = express.Router();
const db = new sqlite3.Database('./users.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'dark-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Инициализация базы данных
db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT
  )
`);
});

// Регистрация
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).send('All fields are required.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    \`INSERT INTO users (email, username, password) VALUES (?, ?, ?)\`,
    [email, username, hashedPassword],
    (err) => {
      if (err) {
        return res.status(400).send('User already exists or invalid data.');
      }
      res.status(200).send('Registration successful.');
    }
  );
});

// Логин
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(\`SELECT * FROM users WHERE email = ?\`, [email], async (err, user) => {
    if (err || !user) return res.status(400).send('User not found.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send('Invalid password.');

    req.session.user = { id: user.id, username: user.username };
    res.status(200).send('Login successful.');
  });
});

// Проверка авторизации
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).send('Not logged in.');
  }
});

module.exports = router;
