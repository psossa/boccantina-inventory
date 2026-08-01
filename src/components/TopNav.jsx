import { useApp } from '../context/AppContext';
import { GridIcon, CalendarIcon, ClipboardIcon, ListIcon, BarChartIcon, ScanIcon, RefreshIcon, LogoutIcon } from './Icons';

export default function TopNav() {
  const { user, page, setPage, lastSync, isSyncing, syncNow, logout } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Real-time Stock', icon: GridIcon },
    { id: 'weekly', label: 'Weekly Sheet', icon: CalendarIcon },
    { id: 'supply', label: 'Supply Form', icon: ClipboardIcon },
    { id: 'kanban', label: 'Kanban', icon: ListIcon },
    { id: 'reports', label: 'Reports', icon: BarChartIcon },
    { id: 'scanner', label: 'Scan', icon: ScanIcon },
  ];

  if (!user) return null;

  const formatTime = (iso) => {
    if (!iso) return 'Never';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <nav className="top-nav">
      <div className="container nav-inner">
        <div className="nav-logo">
          <img src="/LOGO-MED.png" alt="Boccantina" style={{ cursor: 'pointer' }} onClick={() => setPage('dashboard')} />
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>Inventory</span>
        </div>
        <div className="nav-links">
          {navItems.map(item => (
            <button key={item.id} className={`nav-link ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
              <item.icon /> {item.label}
            </button>
          ))}
        </div>
        <div className="nav-user">
          <div className="sync-badge" onClick={syncNow}>
            <span className={`sync-dot ${isSyncing ? 'syncing' : ''}`} />
            {isSyncing ? 'Syncing...' : `Synced (${formatTime(lastSync)})`}
            <RefreshIcon />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#131521', color: '#fabd2f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
              {user.avatar || user.name?.[0] || 'M'}
            </div>
            <span>{user.role || 'MANAGER'}</span>
          </div>
          <button className="btn btn-icon btn-outline" onClick={logout} title="Logout"><LogoutIcon /></button>
        </div>
      </div>
    </nav>
  );
}
