import React from "react";
import { NavLink } from "react-router-dom";

export default function Topbar() {
  const items = [
    { name: "Dashboard", path: "/" },
    { name: "Sales", path: "/sales" },
    { name: "Inventory", path: "/inventory" },
    { name: "Reports", path: "/reports" },
    { name: "Products", path: "/products" }
  ];

  return (
    <div
      className="topbar"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr", // ✅ 3 columns
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        borderBottom: "4px solid #0044cc",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,       // ✅ full width
        zIndex: 1000,
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" // ✅ floating effect
      }}
    >
      {/* Left: Logo */}
      <div
        className="topbar-left"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <span
          style={{
            display: "inline-block",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            color: "#007bff",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "36px",
            fontSize: "16px"
          }}
        >
          WC
        </span>
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>WingsCafe</span>
      </div>

      {/* Center: Navigation */}
      <div
        className="topbar-center"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px"
        }}
      >
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            style={({ isActive }) => ({
              color: "#fff",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal"
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Right: User info */}
      <div
        className="topbar-right"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <span className="user-info">Mr B.Alotsi 👤</span>
      </div>
    </div>
  );
}
