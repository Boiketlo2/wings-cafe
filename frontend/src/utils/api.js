// ===========================
// Fetch Categories
// ===========================
export async function fetchCategories() {
  try {
    const res = await fetch("http://localhost:5000/api/categories");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("fetchCategories error:", err);
    return [];
  }
}

// ===========================
// Fetch Products (optionally by category)
// ===========================
export async function fetchProducts(categoryId = null) {
  try {
    let url = "http://localhost:5000/api/products";
    if (categoryId) url += `?category=${categoryId}`;
    const res = await fetch(url);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("fetchProducts error:", err);
    return [];
  }
}

// ===========================
// Post a new Sale
// ===========================
export async function postSale(sale) {
  try {
    const res = await fetch("http://localhost:5000/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sale),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("postSale error:", err);
    return null;
  }
}

// ===========================
// Fetch Recent Sales (last 10) with full product info
// ===========================
export async function fetchRecentSales() {
  try {
    const res = await fetch("http://localhost:5000/api/sales/recent");
    const data = await res.json();
    // Ensure each sale item includes name, price, stock, description, image
    if (Array.isArray(data)) {
      return data.map((sale) => ({
        ...sale,
        items: sale.items.map((item) => ({
          id: item.id,
          name: item.name || `Product ${item.id}`,
          qty: item.qty,
          price: item.price || 0,
          description: item.description || "",
          stock: item.stock ?? 0,
          image: item.image || "",
        })),
      }));
    }
    return [];
  } catch (err) {
    console.error("fetchRecentSales error:", err);
    return [];
  }
}
