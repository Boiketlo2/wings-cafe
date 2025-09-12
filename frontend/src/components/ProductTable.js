import React from 'react';

export default function ProductTable({ products=[], onAdd }) {
  return (
    <div className="product-table">
      <table>
        <thead>
          <tr><th>Item</th><th>Desc</th><th>Stock</th><th>Price</th><th></th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.quantity}</td>
              <td>{p.price.toFixed(2)}</td>
              <td><button onClick={()=>onAdd(p)}>Add</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
