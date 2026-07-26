const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serves frontend files from /public folder

// Setup SQLite Database
const db = new sqlite3.Database(':memory:'); // In-memory DB for quick setup

db.serialize(() => {
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    image TEXT
  )`);

  // Insert Sample Products
  const stmt = db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
  stmt.run("Wireless Headphones", 59.99, "https://via.placeholder.com/150");
  stmt.run("Mechanical Keyboard", 89.99, "https://via.placeholder.com/150");
  stmt.run("Ergonomic Mouse", 29.99, "https://via.placeholder.com/150");
  stmt.finalize();
});

// GET Endpoint: Fetch all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST Endpoint: Checkout simulation
app.post('/api/checkout', (req, res) => {
  const { cart, total } = req.body;
  if (!cart || cart.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  // Here you would integrate Stripe / PayPal API
  console.log("Received order:", cart, "Total:", total);
  res.json({ success: true, message: "Order placed successfully!" });
});

app.listen(PORT, () => {
  console.log(`E-commerce server running on http://localhost:${PORT}`);
});
