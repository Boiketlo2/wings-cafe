import React, { useEffect, useState } from "react";
import { fetchCategories, fetchProducts, postSale, fetchRecentSales } from "../utils/api";

export default function Sales() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchCategories().then((cs) => {
      setCategories(cs);
      if (cs[0]) setActiveCategory(cs[0].id);
    });
    loadRecentOrders();
  }, []);

  useEffect(() => {
    if (activeCategory != null) {
      fetchProducts(activeCategory).then(setProducts);
    }
  }, [activeCategory]);

  function loadRecentOrders() {
    fetchRecentSales().then(setRecentOrders);
  }

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing)
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function updateQty(id, qty) {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty } : p)).filter((p) => p.qty > 0)
    );
  }

  async function checkout() {
    if (cart.length === 0) return alert("Cart is empty");
    const sale = {
      items: cart.map((c) => ({ id: c.id, qty: c.qty })),
      total: cart.reduce((s, c) => s + c.price * c.qty, 0),
      paymentMethod: "cash",
    };
    await postSale(sale);
    alert("Sale recorded");
    setCart([]);
    fetchProducts(activeCategory).then(setProducts);
    loadRecentOrders();
  }

  return (
    <div className="app-root">
      {/* Categories */}
      <div className="top-icons">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`icon ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      <div className="main-grid">
        {/* Recent Sales */}
        <div className="left-col">
          <div className="small-box">
            <h3>Recent Sales</h3>
            {recentOrders.length === 0 ? (
              <p>No recent sales</p>
            ) : (
              <ul>
                {recentOrders.map((order) => (
                  <li key={order.id}>
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.name} × {item.qty} M{item.price.toFixed(2)}
                      </div>
                    ))}
                    <strong>Total: M{order.total.toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Product Table */}
        <div className="center-col">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.stock}</td>
                  <td>M{p.price.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => addToCart(p)}
                      style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Panel */}
        <div className="right-col">
          <h3>Invoice</h3>
          {cart.length === 0 ? (
            <p>No items</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.qty} | M{(item.price * item.qty).toFixed(2)}
                  <button
                    onClick={() => updateQty(item.id, 0)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      marginLeft: "10px",
                      padding: "2px 6px",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p>
            <strong>Total: M{cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2)}</strong>
          </p>
          <button
            onClick={checkout}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
