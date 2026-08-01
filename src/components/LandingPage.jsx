import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { setPage } = useApp();
  return (
    <div className="landing-hero">
      <nav className="landing-nav">
        <img src="/LOGO-MED.png" alt="Boccantina" />
        <button className="btn btn-primary" onClick={() => setPage('login')}>Manager Login</button>
      </nav>
      <div className="landing-content">
        <div className="landing-tagline">Weekly Food + Beverage Inventory</div>
        <h1>Boccantina <span>Inventory</span></h1>
        <p>Real-time stock management, automated alerts, and seamless supply ordering for Cantina de Vinos.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }} onClick={() => setPage('login')}>
            Access Dashboard
          </button>
          <button className="btn" style={{ padding: '14px 32px', fontSize: '16px', background: 'transparent', border: '1.5px solid rgba(250,189,47,0.4)', color: '#fabd2f' }} onClick={() => setPage('login')}>
            View Reports
          </button>
        </div>
      </div>
      <div className="landing-footer">© 2026 Boccantina Cantina de Vinos. All rights reserved.</div>
    </div>
  );
}
