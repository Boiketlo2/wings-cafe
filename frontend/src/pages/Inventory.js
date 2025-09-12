import React, { useEffect, useState } from "react";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("https://wings-cafe-4.onrender.com/api/products");
      const data = await res.json();
      setInventory(data);
      setLoading(false);
    } catch (err) {
      console.error("Inventory error:", err);
      setLoading(false);
    }
  };

  const updateStock = async (id, qtyChange) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/update-stock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qtyChange }),
      });

      if (!res.ok) throw new Error("Failed to update stock");

      const updatedProduct = await res.json();
      setInventory(prev =>
        prev.map(item => (item.id === id ? { ...item, stock: updatedProduct.stock } : item))
      );
    } catch (err) {
      console.error("Stock update error:", err);
      alert("Failed to update stock");
    }
  };

  const addStock = id => {
    const qty = parseInt(prompt("Enter quantity to add:"), 10);
    if (isNaN(qty) || qty <= 0) return alert("Invalid quantity");
    updateStock(id, qty);
  };

  const removeStock = id => {
    const qty = parseInt(prompt("Enter quantity to remove:"), 10);
    if (isNaN(qty) || qty <= 0) return alert("Invalid quantity");
    updateStock(id, -qty);
  };

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div className="inventory-root">
      <h2>Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price (M)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.stock}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>
                <button
                  onClick={() => addStock(item.id)}
                  style={{ backgroundColor: "blue", color: "white", marginRight: "5px", padding: "5px 10px", border: "none", borderRadius: "5px" }}
                >
                  Add
                </button>
                <button
                  onClick={() => removeStock(item.id)}
                  style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px" }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
