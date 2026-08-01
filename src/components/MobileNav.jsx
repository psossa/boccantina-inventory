import { useApp } from '../context/AppContext';
import { GridIcon, CalendarIcon, ClipboardIcon, ListIcon, BarChartIcon } from './Icons';

export default function MobileNav() {
  const { user, page, setPage } = useApp();
  if (!user) return null;
  const items = [
    { id: 'dashboard', label: 'Stock', icon: GridIcon },
    { id: 'weekly', label: 'Sheet', icon: CalendarIcon },
    { id: 'supply', label: 'Order', icon: ClipboardIcon },
    { id: 'kanban', label: 'Tasks', icon: ListIcon },
    { id: 'reports', label: 'Reports', icon: BarChartIcon },
  ];
  return (
    <div className="mobile-nav">
      {items.map(item => (
        <button key={item.id} className={`mobile-nav-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
          <item.icon /> {item.label}
        </button>
      ))}
    </div>
  );
}
