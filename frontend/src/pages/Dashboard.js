import React, { useEffect, useState } from "react";
import { fetchCategories, fetchProducts } from "../utils/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="dashboard-root">
      <h1 className="welcome-message"> WINGS CAFE MENU </h1>

      <div className="dashboard-grid">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat.id);

          return (
            <div
              key={cat.id}
              className="category-card"
              style={{
                backgroundImage: `url(/images/categories/${cat.id}.jpg)`,
              }}
            >
              <div className="overlay">
                <h2 className="category-heading">{cat.name}</h2>
                <div className="products-grid">
                  {catProducts.slice(0, 6).map((prod) => {
                    const lowStock = prod.stock < 5;
                    return (
                      <div
                        key={prod.id}
                        className={`product-card ${lowStock ? "low-stock" : ""}`}
                      >
                        <img
                          src={`/images/products/${prod.id}.jpg`}
                          alt={prod.name}
                        />
                        <p>{prod.name}</p>
                        <span>M{prod.price.toFixed(2)}</span>
                        <small>{prod.stock} in stock</small>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
