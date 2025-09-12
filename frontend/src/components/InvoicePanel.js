import React from 'react';

export default function InvoicePanel({ cart, updateQty, onCheckout }) {
  const total = cart.reduce((s,c)=> s + c.price * c.qty, 0);
  return (
    <div className="invoice">
      <h3>Invoice</h3>
      <div className="invoice-list">
        {cart.length===0 && <div className="empty">No items</div>}
        {cart.map(c => (
          <div key={c.id} className="invoice-item">
            <div className="iname">{c.name}</div>
            <div className="iqty">
              <button onClick={()=>updateQty(c.id, Math.max(0, c.qty-1))}>-</button>
              <span>{c.qty}</span>
              <button onClick={()=>updateQty(c.id, c.qty+1)}>+</button>
            </div>
            <div className="iprice">{(c.price * c.qty).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="invoice-total">
        <div>Total</div>
        <div className="amount">{total.toFixed(2)}</div>
      </div>
      <div className="invoice-actions">
        <button className="btn" onClick={onCheckout}>Pay</button>
      </div>
    </div>
  );
}
