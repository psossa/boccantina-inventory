import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrashIcon } from './Icons';

export default function SupplyForm() {
  const { products, orders, setOrders, addToast } = useApp();
  const [category, setCategory] = useState('ALL');
  const [orderItems, setOrderItems] = useState([{ productId: '', qty: 1 }]);
  const [requester, setRequester] = useState('Kitchen');

  const filteredProducts = category === 'ALL' ? products : products.filter(p => p.category === category);

  const addItem = () => setOrderItems(prev => [...prev, { productId: '', qty: 1 }]);
  const removeItem = (idx) => setOrderItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx, field, value) => {
    setOrderItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const total = orderItems.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (prod ? prod.costPerUnit * item.qty : 0);
  }, 0);

  const submitOrder = () => {
    const validItems = orderItems.filter(i => i.productId && i.qty > 0);
    if (validItems.length === 0) { addToast('Please add at least one item', 'error'); return; }
    const items = validItems.map(i => {
      const p = products.find(x => x.id === i.productId);
      return { name: p.name, qty: i.qty, unit: p.pack, cost: p.costPerUnit };
    });
    const newOrder = {
      id: 'ORD-' + String(orders.length + 1).padStart(3, '0'),
      items, status: 'pending', date: new Date().toISOString().split('T')[0],
      total, requester
    };
    setOrders(prev => [newOrder, ...prev]);
    setOrderItems([{ productId: '', qty: 1 }]);
    addToast(`Order ${newOrder.id} submitted successfully`);
  };

  return (
    <div className="container dashboard">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h3 className="section-title">Supply Request Form</h3>
          <p className="section-subtitle">Create new purchase orders for the week</p>
        </div>
      </div>
      <div className="card" style={{ padding: '32px' }}>
        <div className="supply-form">
          <div className="form-row">
            <div className="form-group">
              <label>Requester</label>
              <select className="input select" value={requester} onChange={e => setRequester(e.target.value)}>
                <option>Kitchen</option><option>Bar</option><option>Management</option>
              </select>
            </div>
            <div className="form-group">
              <label>Filter Category</label>
              <select className="input select" value={category} onChange={e => setCategory(e.target.value)}>
                {['ALL','DRY','BREAD','VERDURAS','BEVERAGES','BEER','WINE','PAPER','JANITORIAL'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Items</div>
          <div className="order-items">
            {orderItems.map((item, idx) => (
              <div key={idx} className="order-item-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <select className="input select" value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)}>
                    <option value="">Select product...</option>
                    {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.name} (${p.costPerUnit.toFixed(2)}/{p.pack})</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <input className="input" type="number" min={1} value={item.qty} onChange={e => updateItem(idx, 'qty', parseInt(e.target.value) || 1)} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#131521', paddingBottom: '8px' }}>
                  {item.productId ? `$${(products.find(p => p.id === item.productId)?.costPerUnit * item.qty || 0).toFixed(2)}` : '—'}
                </div>
                <button className="btn btn-icon btn-outline" style={{ marginBottom: '8px' }} onClick={() => removeItem(idx)} disabled={orderItems.length === 1}><TrashIcon /></button>
              </div>
            ))}
          </div>
          <button className="btn btn-outline btn-sm" onClick={addItem} style={{ marginBottom: '24px' }}>+ Add Another Item</button>
          <div className="order-total">
            <span className="order-total-label">Estimated Total</span>
            <span className="order-total-value">${total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={submitOrder}>Submit Supply Request</button>
        </div>
      </div>
      <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 className="section-title" style={{ marginBottom: '16px' }}>Recent Orders</h3>
        <table className="orders-table">
          <thead>
            <tr><th>Order ID</th><th>Items</th><th>Requester</th><th>Date</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.id}</td>
                <td>{o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}</td>
                <td>{o.requester}</td>
                <td>{o.date}</td>
                <td style={{ fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
