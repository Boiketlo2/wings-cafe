import React, { useEffect, useState } from "react";
import { fetchCategories, fetchProducts } from "../utils/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [topbarHeight, setTopbarHeight] = useState(0);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchProducts().then(setProducts);

    // Measure topbar height dynamically
    const topbar = document.querySelector(".topbar");
    if (topbar) {
      setTopbarHeight(topbar.offsetHeight);
    }

    // Optional: update on window resize
    const handleResize = () => {
      if (topbar) setTopbarHeight(topbar.offsetHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="dashboard-root"
      style={{ marginTop: topbarHeight }} // ✅ auto spacing
    >
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
