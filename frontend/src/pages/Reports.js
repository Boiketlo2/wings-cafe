import React, { useEffect, useState } from "react";

export default function Reports() {
  const [sales, setSales] = useState({});

  useEffect(() => {
    fetch("https://wings-cafe-4.onrender.com/api/report/sales-summary")
      .then((res) => res.json())
      .then(setSales)
      .catch((err) => console.error("Reports error:", err));
  }, []);

  // Flatten sales data into table rows
  const tableData = [];
  let totalRevenue = 0;

  if (sales.summary) {
    Object.entries(sales.summary).forEach(([date, data]) => {
      totalRevenue += data.total ?? 0;

      if (data.products && Object.keys(data.products).length > 0) {
        Object.entries(data.products).forEach(([product, info]) => {
          // Find if this product is best selling
          const bestSellingQty =
            sales.bestSelling?.find((p) => p.name === product)?.qty ?? "";
          // Check if out of stock
          const outOfStock =
            sales.outOfStock?.find((p) => p.name === product) ? "Yes" : "";

          tableData.push({
            date,
            product,
            qty: info?.qty ?? 0,
            subtotal: info?.subtotal ?? 0,
            total: data.total ?? 0,
            bestSellingQty,
            outOfStock,
          });
        });
      } else {
        tableData.push({
          date,
          product: "N/A",
          qty: 0,
          subtotal: 0,
          total: data.total ?? 0,
          bestSellingQty: "",
          outOfStock: "",
        });
      }
    });
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sales Report</h2>
      <h3>Total Revenue: M{totalRevenue.toFixed(2)}</h3>

      {tableData.length === 0 ? (
        <p>No sales recorded yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Date
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Product
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                Subtotal (M)
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                Total Sales (M)
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                Best Selling
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Out-of-Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx}>
                <td style={{ padding: "6px 8px" }}>{row.date}</td>
                <td style={{ padding: "6px 8px" }}>{row.product}</td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>
                  {row.qty}
                </td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>
                  {row.subtotal.toFixed(2)}
                </td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>
                  {row.total.toFixed(2)}
                </td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>
                  {row.bestSellingQty}
                </td>
                <td
                  style={{
                    padding: "6px 8px",
                    textAlign: "center",
                    color: row.outOfStock ? "red" : "inherit",
                    fontWeight: row.outOfStock ? "bold" : "normal",
                  }}
                >
                  {row.outOfStock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
