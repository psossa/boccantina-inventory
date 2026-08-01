import { useApp } from '../context/AppContext';
import { useState } from 'react';

export default function WeeklySheet() {
  const { products, setProducts, addToast } = useApp();

  const updateValue = (id, field, value) => {
    const num = parseFloat(value) || 0;
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, [field.toLowerCase()]: num };
      if (field === 'USED') {
        updated.currentStock = Math.max(0, updated.begin - num);
        updated.end = updated.currentStock;
      }
      return updated;
    }));
  };

  const catOrder = ['DRY','BREAD','VERDURAS','BEVERAGES','BEER','WINE','PAPER','JANITORIAL'];
  const grouped = {};
  catOrder.forEach(c => grouped[c] = products.filter(p => p.category === c));
  const totalCost = products.reduce((a, p) => a + (p.used * p.costPerUnit), 0);

  return (
    <div className="container dashboard">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h3 className="section-title">Weekly Inventory Sheet</h3>
          <p className="section-subtitle">Period: Week 3 · July 2026</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => addToast('Sheet exported to CSV')}>Export CSV</button>
          <button className="btn btn-primary btn-sm" onClick={() => addToast('Sheet saved')}>Save Sheet</button>
        </div>
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="sheet-table">
          <thead>
            <tr>
              <th>ITEM</th><th>PACK</th><th>CODE</th>
              {['BEGIN','MON','TUES','WED','THUR','FRI','Sat','END'].map(d => <th key={d} style={{ textAlign: 'center' }}>{d}</th>)}
              <th>USED</th><th>COST/UNIT</th><th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {catOrder.map(cat => {
              const items = grouped[cat] || [];
              if (items.length === 0) return null;
              const catTotal = items.reduce((a, p) => a + (p.used * p.costPerUnit), 0);
              return (
                <>
                  <tr key={cat} className="category-row"><td colSpan={13}>{cat}</td></tr>
                  {items.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td>{p.pack}</td>
                      <td>{p.code || '—'}</td>
                      <td style={{ textAlign: 'center' }}><input value={p.begin} onChange={e => updateValue(p.id, 'BEGIN', e.target.value)} /></td>
                      <td style={{ textAlign: 'center' }}>—</td>
                      <td style={{ textAlign: 'center' }}>—</td>
                      <td style={{ textAlign: 'center' }}>—</td>
                      <td style={{ textAlign: 'center' }}>—</td>
                      <td style={{ textAlign: 'center' }}>—</td>
                      <td style={{ textAlign: 'center' }}>—</td>
                      <td style={{ textAlign: 'center' }}><input value={p.used} onChange={e => updateValue(p.id, 'USED', e.target.value)} /></td>
                      <td>${p.costPerUnit.toFixed(2)}</td>
                      <td style={{ fontWeight: 600 }}>${(p.used * p.costPerUnit).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#fafafa' }}>
                    <td colSpan={12} style={{ textAlign: 'right', fontWeight: 600, fontSize: '12px', color: '#6b7280' }}>TOTAL {cat}</td>
                    <td style={{ fontWeight: 700, color: '#131521' }}>${catTotal.toFixed(2)}</td>
                  </tr>
                </>
              );
            })}
            <tr className="total-row">
              <td colSpan={12} style={{ textAlign: 'right', fontSize: '14px' }}>OVERALL TOTAL</td>
              <td style={{ fontSize: '16px', fontFamily: 'Playfair Display, serif' }}>${totalCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
