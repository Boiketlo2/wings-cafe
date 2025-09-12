import React, { useState } from "react";

export default function Stock() {
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(0);
  const [note, setNote] = useState("");

  async function addStock(e) {
    e.preventDefault();
    await fetch("/api/stock/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: Number(productId), qty: Number(qty), note }),
    });
    alert("Stock added");
  }

  async function removeStock(e) {
    e.preventDefault();
    await fetch("/api/stock/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: Number(productId), qty: Number(qty), note }),
    });
    alert("Stock removed");
  }

  return (
    <div>
      <h2>Stock Management</h2>
      <form>
        <input
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={addStock}>Add Stock</button>
        <button onClick={removeStock}>Remove Stock</button>
      </form>
    </div>
  );
}
