const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dbPath = path.join(__dirname, "../db.json");

// Helper: read DB
function readDB() {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
}

// Helper: write DB
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

// POST /api/sales - record a sale
router.post("/sales", (req, res) => {
  const { items, total, paymentMethod } = req.body;
  if (!items || !total) return res.status(400).json({ error: "Invalid sale" });

  const db = readDB();
  const newSale = {
    id: Date.now(),
    type: "sale",
    items,
    total,
    paymentMethod,
    date: new Date().toISOString(),
  };

  // Deduct stock
  items.forEach((item) => {
    const product = db.products.find((p) => p.id === item.id);
    if (product) product.quantity = Math.max(0, product.quantity - item.qty);
  });

  db.transactions.push(newSale);
  writeDB(db);

  res.json(newSale);
});

// GET /api/report/sales-summary
router.get("/sales-summary", (req, res) => {
  const db = readDB();
  const summary = {};
  const productSales = {}; // for best-selling products

  db.transactions.forEach((sale) => {
    const date = sale.date.slice(0, 10); // YYYY-MM-DD
    if (!summary[date]) summary[date] = { count: 0, total: 0, products: {} };
    summary[date].count += 1;
    summary[date].total += sale.total;

    sale.items.forEach((item) => {
      const product = db.products.find((p) => p.id === item.id);
      const name = product ? product.name : `Product ${item.id}`;

      // per day
      if (!summary[date].products[name])
        summary[date].products[name] = { qty: 0, subtotal: 0 };
      summary[date].products[name].qty += item.qty;
      summary[date].products[name].subtotal += item.qty * (product?.price || 0);

      // overall best-selling
      if (!productSales[name]) productSales[name] = { qty: 0, subtotal: 0 };
      productSales[name].qty += item.qty;
      productSales[name].subtotal += item.qty * (product?.price || 0);
    });
  });

  // Products that are out of stock
  const outOfStock = db.products
    .filter((p) => p.quantity <= 0)
    .map((p) => p.name);

  res.json({
    summary,
    bestSelling: Object.entries(productSales)
      .sort((a, b) => b[1].qty - a[1].qty)
      .map(([name, info]) => ({ name, ...info })),
    outOfStock, // array of product names
  });
});

module.exports = router;
