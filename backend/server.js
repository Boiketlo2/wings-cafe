const express = require("express");
const cors = require("cors");
const multer = require("multer"); // handle image uploads
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ===========================
// DB Helpers
// ===========================
const dbPath = path.join(__dirname, "db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

// ===========================
// Categories (in memory for now)
// ===========================
let categories = [
  { id: 1, name: "Coffee" },
  { id: 2, name: "Tea" },
  { id: 3, name: "Pastries" },
  { id: 4, name: "Sandwiches" },
  { id: 5, name: "Drinks" }
];

// ===========================
// Products (still in memory)
// ===========================
let products = [
  // Coffee
  { id: 101, name: "Espresso", description: "Strong and bold", price: 3, category: 1, stock: 20, image: "espresso.jpg" },
  { id: 102, name: "Americano", description: "Smooth coffee", price: 4, category: 1, stock: 18, image: "americano.jpg" },
  { id: 103, name: "Latte", description: "Milk coffee", price: 5, category: 1, stock: 15, image: "latte.jpg" },
  { id: 104, name: "Cappuccino", description: "Foamy delight", price: 4, category: 1, stock: 12, image: "cappuccino.jpg" },
  { id: 105, name: "Mocha", description: "Chocolate coffee", price: 5, category: 1, stock: 10, image: "mocha.jpg" },

  // Tea
  { id: 201, name: "Green Tea", description: "Healthy and refreshing", price: 2, category: 2, stock: 25, image: "greentea.jpg" },
  { id: 202, name: "Black Tea", description: "Classic tea", price: 3, category: 2, stock: 20, image: "blacktea.jpg" },
  { id: 203, name: "Herbal Tea", description: "Floral flavors", price: 4, category: 2, stock: 15, image: "herbaltea.jpg" },
  { id: 204, name: "Chai Latte", description: "Spiced tea with milk", price: 3, category: 2, stock: 12, image: "chailatte.jpg" },
  { id: 205, name: "Iced Tea", description: "Cool and sweet", price: 3, category: 2, stock: 10, image: "icedtea.jpg" },

  // Pastries
  { id: 301, name: "Croissant", description: "Buttery and flaky", price: 3, category: 3, stock: 20, image: "croissant.jpg" },
  { id: 302, name: "Muffin", description: "Soft and sweet", price: 2.5, category: 3, stock: 18, image: "muffin.jpg" },
  { id: 303, name: "Danish", description: "Fruit-filled pastry", price: 3.5, category: 3, stock: 15, image: "danish.jpg" },
  { id: 304, name: "Scone", description: "Perfect with tea", price: 2.5, category: 3, stock: 12, image: "scone.jpg" },
  { id: 305, name: "Cookie", description: "Crispy treat", price: 2, category: 3, stock: 10, image: "cookie.jpg" },

  // Sandwiches
  { id: 401, name: "Ham Sandwich", description: "Classic ham", price: 5, category: 4, stock: 20, image: "hamsandwich.jpg" },
  { id: 402, name: "Veggie Sandwich", description: "Healthy veggies", price: 4.5, category: 4, stock: 18, image: "veggiesandwich.jpg" },
  { id: 403, name: "Chicken Sandwich", description: "Grilled chicken", price: 6, category: 4, stock: 15, image: "chickensandwich.jpg" },
  { id: 404, name: "Tuna Sandwich", description: "Tuna delight", price: 5.5, category: 4, stock: 12, image: "tunasandwich.jpg" },
  { id: 405, name: "Club Sandwich", description: "Triple-layered", price: 7, category: 4, stock: 10, image: "clubsandwich.jpg" },

  // Drinks
  { id: 501, name: "Mineral Water", description: "Pure and fresh", price: 1, category: 5, stock: 25, image: "water.jpg" },
  { id: 502, name: "Soda", description: "Refreshing fizz", price: 1.5, category: 5, stock: 20, image: "soda.jpg" },
  { id: 503, name: "Fruit Juice", description: "Vitamin-rich", price: 3, category: 5, stock: 15, image: "juice.jpg" },
  { id: 504, name: "Smoothie", description: "Fruity blend", price: 4, category: 5, stock: 12, image: "smoothie.jpg" },
  { id: 505, name: "Milkshake", description: "Creamy treat", price: 5, category: 5, stock: 10, image: "milkshake.jpg" }
];

// ===========================
// Multer setup for image uploads
// ===========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ===========================
// API Endpoints
// ===========================
app.get("/api/categories", (req, res) => res.json(categories));

app.get("/api/products", (req, res) => {
  const { category } = req.query;
  if (category) return res.json(products.filter(p => p.category == category));
  res.json(products);
});

// ===========================
// Update stock
// ===========================
app.put("/api/products/:id/update-stock", (req, res) => {
  const { id } = req.params;
  const { qtyChange } = req.body;
  const product = products.find(p => p.id === parseInt(id));
  if (!product) return res.status(404).json({ error: "Product not found" });

  product.stock += qtyChange;
  if (product.stock < 0) product.stock = 0;

  res.json(product);
});

// ===========================
// Add new product
// ===========================
app.post("/api/products", upload.single("image"), (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const id = Date.now();
  const image = req.file ? req.file.filename : "";

  const newProduct = {
    id,
    name,
    description,
    price: parseFloat(price),
    category: parseInt(category),
    stock: parseInt(stock),
    image,
  };

  products.push(newProduct);
  res.json(newProduct);
});

// ===========================
// Delete product
// ===========================
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const product = products[index];
  if (product.image) {
    const imgPath = path.join(__dirname, "uploads", product.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  products.splice(index, 1);
  res.json({ success: true });
});

// ===========================
// Record sale (persist to db.json) with stock check
// ===========================
app.post("/api/sales", (req, res) => {
  const db = readDB();

  // Check stock before recording sale
  for (let item of req.body.items) {
    const product = products.find(p => p.id === item.id);
    if (!product) {
      return res.status(404).json({ error: `Product ${item.id} not found` });
    }
    if (product.stock < item.qty) {
      return res.status(400).json({ 
        error: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
      });
    }
  }

  const sale = {
    id: Date.now(),
    type: "sale",
    items: req.body.items,
    total: req.body.total,
    paymentMethod: req.body.paymentMethod,
    date: new Date().toISOString(),
  };

  // Deduct stock
  sale.items.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) product.stock -= item.qty;
  });

  db.transactions.push(sale);
  writeDB(db);

  res.json(sale);
});

// ===========================
// Recent Sales (from db.json)
// ===========================
app.get("/api/sales/recent", (req, res) => {
  const db = readDB();
  const recent = db.transactions.slice(-10).reverse().map(sale => ({
    ...sale,
    items: sale.items.map(item => {
      const product = products.find(p => p.id === item.id);
      return {
        id: item.id,
        qty: item.qty,
        name: product ? product.name : `Product ${item.id}`,
        price: product ? product.price : 0,
        stock: product ? product.stock : 0,
        description: product ? product.description : ""
      };
    }),
  }));
  res.json(recent);
});

// ===========================
// Sales Summary / Reports (from db.json) with out-of-stock
// ===========================
app.get("/api/report/sales-summary", (req, res) => {
  const db = readDB();
  const summary = {};
  const bestSelling = {};

  const outOfStock = products.filter(p => p.stock <= 0).map(p => p.name);

  db.transactions.forEach(sale => {
    const date = sale.date.slice(0, 10);
    if (!summary[date]) summary[date] = { count: 0, total: 0, products: {} };

    summary[date].count += 1;
    summary[date].total += sale.total;

    sale.items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      const name = product ? product.name : `Product ${item.id}`;

      if (!summary[date].products[name]) summary[date].products[name] = { qty: 0, subtotal: 0 };
      summary[date].products[name].qty += item.qty;
      summary[date].products[name].subtotal += item.qty * (product?.price || 0);

      if (!bestSelling[name]) bestSelling[name] = { qty: 0, subtotal: 0 };
      bestSelling[name].qty += item.qty;
      bestSelling[name].subtotal += item.qty * (product?.price || 0);
    });
  });

  const bestSellingFiltered = Object.entries(bestSelling)
    .sort((a, b) => b[1].qty - a[1].qty)
    .map(([name, info]) => ({ name, ...info }));

  res.json({ summary, bestSelling: bestSellingFiltered, outOfStock });
});

// ===========================
// Serve uploaded images
// ===========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===========================
// Start Server
// ===========================
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
