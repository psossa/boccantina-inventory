import { useApp } from '../context/AppContext';
import { BoxIcon, AlertIcon, TrendIcon, DollarIcon, SearchIcon, PlusIcon, MinusIcon } from './Icons';
import { useState } from 'react';

function KPICard({ icon: Icon, label, value, color }) {
  return (
    <div className="kpi-card fade-in">
      <div className={`kpi-icon ${color}`}><Icon /></div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}

function StockAdjustments() {
  const { products, setProducts, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.includes(search);
    const matchesFilter = filter === 'ALL' || p.category === filter;
    return matchesSearch && matchesFilter;
  });

  const adjustStock = (id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const newStock = Math.max(0, p.currentStock + delta);
      return { ...p, currentStock: newStock, used: delta < 0 ? p.used - delta : p.used, end: newStock };
    }));
    addToast(delta > 0 ? 'Stock added' : 'Stock removed');
  };

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="section-header">
        <div>
          <h3 className="section-title">Real-Time Stock Adjustments</h3>
          <p className="section-subtitle">Tap + / - to record additions/withdrawals during active service.</p>
        </div>
      </div>
      <div className="stock-search">
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}><SearchIcon /></span>
          <input className="input" style={{ paddingLeft: '38px' }} placeholder="Searching item name or code..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input select" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: '140px', flexShrink: 0 }}>
          {['ALL','DRY','BREAD','VERDURAS','BEVERAGES','BEER','WINE','PAPER','JANITORIAL'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="stock-list">
        {filtered.map(p => {
          const isLow = p.currentStock <= p.threshold;
          const isCritical = p.currentStock === 0;
          return (
            <div key={p.id} className={`stock-item ${isCritical ? 'critical' : isLow ? 'low' : ''}`}>
              <div className="stock-info">
                <div className="stock-name">
                  {p.name}
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase' }}>{p.pack}</span>
                  {isLow && <span className={`badge ${isCritical ? 'badge-critical' : 'badge-low'}`}>{isCritical ? 'CRITICAL' : 'LOW'}</span>}
                </div>
                <div className="stock-meta">Code: {p.code || 'N/A'} · {p.category}</div>
              </div>
              <div className="stock-controls">
                <button className="stock-btn" onClick={() => adjustStock(p.id, -1)}><MinusIcon /></button>
                <div>
                  <div className="stock-qty">{p.currentStock}</div>
                  <div className="stock-min">MIN: {p.threshold}</div>
                </div>
                <button className="stock-btn" onClick={() => adjustStock(p.id, 1)}><PlusIcon /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AutomatedAlerts() {
  const { alerts, setPage, addToast } = useApp();

  const createOrderFromAlert = (alert) => {
    addToast(`Added ${alert.product} to supply form`);
    setPage('supply');
  };

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertIcon />
          <h3 className="section-title">Automated Alerts</h3>
          {alerts.length > 0 && <span className="badge badge-critical">STOCK CRITICAL</span>}
        </div>
      </div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>Below critical threshold. Surcharges avoided with timely ordering.</p>
      <div className="alert-list">
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px' }}>All stock levels are healthy. No alerts.</div>
        ) : alerts.map(a => (
          <div key={a.id} className={`alert-item ${a.current === 0 ? 'critical' : ''}`}>
            <div className="alert-header">
              <div>
                <div className="alert-product">{a.product}</div>
                <div className="alert-details">CAT: {a.category} · PACK: {a.suggested} left</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: a.current === 0 ? '#ef4444' : '#f59e0b' }}>{a.current} / {a.threshold}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>left</div>
              </div>
            </div>
            <div className="alert-actions">
              <span style={{ fontSize: '12px', color: '#6b7280', flex: 1, display: 'flex', alignItems: 'center' }}>Suggested order: {a.suggested} {a.product.includes('CS') ? 'CS' : 'units'}</span>
              <button className="btn btn-dark btn-sm" onClick={() => createOrderFromAlert(a)}>Fill Supply Form</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { totalSku, totalAlerts, depletionRatio, weeklyValue } = useApp();
  return (
    <div className="container dashboard">
      <div className="kpi-grid">
        <KPICard icon={BoxIcon} label="Total SKU Tracked" value={totalSku} color="gold" />
        <KPICard icon={AlertIcon} label="Autogen Alerts" value={totalAlerts} color="red" />
        <KPICard icon={TrendIcon} label="Depletion Ratio" value={`${depletionRatio}%`} color="blue" />
        <KPICard icon={DollarIcon} label="Weekly Value Used" value={`$${weeklyValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} color="green" />
      </div>
      <div className="dashboard-grid">
        <StockAdjustments />
        <AutomatedAlerts />
      </div>
    </div>
  );
}
