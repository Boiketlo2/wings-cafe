import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Products from "./pages/Products";

function App() {
  const currentYear = new Date().getFullYear();

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Topbar />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer
          style={{
            borderTop: "2px solid #0044cc",
            backgroundColor: "#007bff",
            color: "#fff",
            textAlign: "center",
            padding: "10px 0",
            fontWeight: "bold",
            fontSize: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span style={{
            display: "inline-block",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            color: "#007bff",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "28px"
          }}>WC</span>
          <span>Wings Cafe &copy; {currentYear}</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;
