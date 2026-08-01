import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ReportsPage() {
  const { orders, products, MONTHLY_DATA } = useApp();
  const [reportType, setReportType] = useState('monthly');

  const categoryTotals = {};
  products.forEach(p => {
    if (!categoryTotals[p.category]) categoryTotals[p.category] = 0;
    categoryTotals[p.category] += p.used * p.costPerUnit;
  });

  const maxVal = Math.max(...MONTHLY_DATA.map(d => d.food + d.beverages + d.beer + d.wine + d.paper + d.janitorial));

  return (
    <div className="container dashboard">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h3 className="section-title">Expenditure Reports</h3>
          <p className="section-subtitle">Monthly cost analysis and category breakdown</p>
        </div>
        <select className="input select" style={{ width: '160px' }} value={reportType} onChange={e => setReportType(e.target.value)}>
          <option value="monthly">Monthly View</option>
          <option value="category">By Category</option>
          <option value="orders">Order History</option>
        </select>
      </div>

      {reportType === 'monthly' && (
        <>
          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>Monthly Expenditure Trend</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '20px 0', borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
              {MONTHLY_DATA.map((d, i) => {
                const total = d.food + d.beverages + d.beer + d.wine + d.paper + d.janitorial;
                return (
                  <div key={i} style={{ flex: 1, minWidth: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>${(total/1000).toFixed(1)}k</div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ height: `${(d.food/maxVal)*200}px`, background: '#fabd2f', borderRadius: '4px 4px 0 0', minHeight: '4px' }} />
                      <div style={{ height: `${(d.beverages/maxVal)*200}px`, background: '#3b82f6', minHeight: '4px' }} />
                      <div style={{ height: `${(d.beer/maxVal)*200}px`, background: '#f59e0b', minHeight: '4px' }} />
                      <div style={{ height: `${(d.wine/maxVal)*200}px`, background: '#8b5cf6', minHeight: '4px' }} />
                      <div style={{ height: `${(d.paper/maxVal)*200}px`, background: '#10b981', minHeight: '4px' }} />
                      <div style={{ height: `${(d.janitorial/maxVal)*200}px`, background: '#6b7280', borderRadius: '0 0 4px 4px', minHeight: '4px' }} />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#131521' }}>{d.month}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[{c:'#fabd2f',l:'Food'},{c:'#3b82f6',l:'Beverages'},{c:'#f59e0b',l:'Beer'},{c:'#8b5cf6',l:'Wine'},{c:'#10b981',l:'Paper'},{c:'#6b7280',l:'Janitorial'}].map(x => (
                <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: x.c }} /> {x.l}
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Monthly Summary</h4>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Month</th><th style={{textAlign:'right'}}>Food</th><th style={{textAlign:'right'}}>Beverages</th>
                  <th style={{textAlign:'right'}}>Beer</th><th style={{textAlign:'right'}}>Wine</th>
                  <th style={{textAlign:'right'}}>Paper</th><th style={{textAlign:'right'}}>Janitorial</th><th style={{textAlign:'right'}}>Total</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_DATA.map(d => {
                  const total = d.food + d.beverages + d.beer + d.wine + d.paper + d.janitorial;
                  return (
                    <tr key={d.month}>
                      <td style={{ fontWeight: 600 }}>{d.month}</td>
                      <td style={{ textAlign: 'right' }}>${d.food.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>${d.beverages.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>${d.beer.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>${d.wine.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>${d.paper.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>${d.janitorial.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>${total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportType === 'category' && (
        <div className="card" style={{ padding: '24px' }}>
          <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>Current Week by Category</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(categoryTotals).sort((a,b) => b[1]-a[1]).map(([cat, total]) => {
              const max = Math.max(...Object.values(categoryTotals));
              const pct = (total/max)*100;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{cat}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>${total.toFixed(2)}</span>
                  </div>
                  <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#fabd2f', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reportType === 'orders' && (
        <div className="card" style={{ padding: '24px' }}>
          <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Order History</h4>
          <table className="report-table">
            <thead>
              <tr><th>Order ID</th><th>Items</th><th>Requester</th><th>Date</th><th style={{textAlign:'right'}}>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.id}</td>
                  <td>{o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}</td>
                  <td>{o.requester}</td>
                  <td>{o.date}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                  <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
