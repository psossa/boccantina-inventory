import { AppProvider, useApp } from './context/AppContext';
import ToastContainer from './components/ToastContainer';
import TopNav from './components/TopNav';
import MobileNav from './components/MobileNav';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import WeeklySheet from './components/WeeklySheet';
import SupplyForm from './components/SupplyForm';
import KanbanBoard from './components/KanbanBoard';
import ReportsPage from './components/ReportsPage';
import BarcodeScanner from './components/BarcodeScanner';

function AppContent() {
  const { page } = useApp();
  return (
    <>
      <ToastContainer />
      <TopNav />
      <div className={`page ${page === 'landing' ? 'active' : ''}`}><LandingPage /></div>
      <div className={`page ${page === 'login' ? 'active' : ''}`}><LoginPage /></div>
      <div className={`page ${page === 'dashboard' ? 'active' : ''}`}><Dashboard /></div>
      <div className={`page ${page === 'weekly' ? 'active' : ''}`}><WeeklySheet /></div>
      <div className={`page ${page === 'supply' ? 'active' : ''}`}><SupplyForm /></div>
      <div className={`page ${page === 'kanban' ? 'active' : ''}`}><KanbanBoard /></div>
      <div className={`page ${page === 'reports' ? 'active' : ''}`}><ReportsPage /></div>
      <div className={`page ${page === 'scanner' ? 'active' : ''}`}><BarcodeScanner /></div>
      <MobileNav />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
