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
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        borderBottom: "4px solid #0044cc", // full-width border like footer
        width: "100%",
        boxSizing: "border-box",
        position: "fixed",   // ✅ make it fixed
        top: 0,              // ✅ stick to the top
        center: 0,             // ✅ align from left
        zIndex: 1000         // ✅ stay above other content
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
          flex: 1,
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
      <div className="topbar-right">
        <span className="user-info">Mr B.Alotsi 👤</span>
      </div>
    </div>
  );
}
