хconst express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const paypal = require("paypal-rest-sdk");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET
});

const db = new sqlite3.Database("./vip.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS vip (email TEXT PRIMARY KEY, type TEXT, timestamp TEXT)");
});

app.post("/api/pay", (req, res) => {
  const { email, type } = req.body;
  const stmt = db.prepare("INSERT OR REPLACE INTO vip (email, type, timestamp) VALUES (?, ?, ?)");
  stmt.run(email, type, new Date().toISOString());
  stmt.finalize();
  res.sendStatus(200);
});

app.get("/api/check", (req, res) => {
  const email = req.query.email;
  db.get("SELECT * FROM vip WHERE email = ?", [email], (err, row) => {
    if (row) res.json({ status: "VIP", type: row.type });
    else res.json({ status: "FREE" });
  });
});

app.get("/api/check", (req, res) => {
  const email = req.query.email;
  db.get("SELECT * FROM vip WHERE email = ?", [email], (err, row) => {
    if (row) res.json({ status: "VIP", type: row.type });
    else res.json({ status: "FREE" });
  });
});
app.get("/", (req, res) => {
  res.send("DarkRoulette API is alive 🕷️ Welcome to the abyss.");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dark server has risen on port ${PORT}`);
});
