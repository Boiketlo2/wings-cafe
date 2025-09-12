import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [image, setImage] = useState(null);

  const API_URL = "https://wings-cafe-4.onrender.com"; // <-- Live backend URL

  async function loadProducts() {
    const res = await fetch(`${API_URL}/api/products`);
    setProducts(await res.json());
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function addProduct(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", parseFloat(form.price));
    formData.append("stock", parseInt(form.stock));
    formData.append("category", parseInt(form.category));
    if (image) formData.append("image", image);

    await fetch(`${API_URL}/api/products`, {
      method: "POST",
      body: formData,
    });

    setForm({ name: "", description: "", price: "", stock: "", category: "" });
    setImage(null);
    loadProducts();
  }

  async function deleteProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Management</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", marginBottom: "30px" }}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={`${API_URL}/images/products/${p.id}.jpg`}
                  alt={p.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                />
              </td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.stock}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>
                <button
                  onClick={() => deleteProduct(p.id)}
                  style={{
                    color: "white",
                    background: "red",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        onSubmit={addProduct}
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <input
          type="number"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button
          type="submit"
          style={{
            background: "blue",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}
