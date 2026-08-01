import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { INITIAL_PRODUCTS, INITIAL_TASKS, INITIAL_ORDERS, MONTHLY_DATA } from '../data/inventory';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('boccantina_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('boccantina_token') || null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [page, setPage] = useState(user ? 'dashboard' : 'landing');
  const [toasts, setToasts] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load from backend on mount if logged in
  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords, tks] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getTasks(),
      ]);
      if (prods.length > 0) setProducts(prods);
      if (ords.length > 0) setOrders(ords);
      if (tks && Object.keys(tks).length > 0) setTasks(tks);
      setLastSync(new Date().toISOString());
      setIsOnline(true);
    } catch (err) {
      console.error('Backend load failed, using local data:', err.message);
      setIsOnline(false);
      addToast('Offline mode — using local data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const syncNow = useCallback(async () => {
    if (!token) { addToast('Please log in to sync', 'error'); return; }
    setIsSyncing(true);
    try {
      await Promise.all([
        api.updateProductsBatch(products.map(p => ({ id: p.id, currentStock: p.currentStock, used: p.used, end: p.end, begin: p.begin }))),
        api.updateTasks(tasks),
      ]);
      const now = new Date().toISOString();
      setLastSync(now);
      setIsOnline(true);
      addToast('Cloud synchronized successfully');
    } catch (err) {
      setIsOnline(false);
      addToast('Sync failed — saved locally', 'error');
    } finally {
      setIsSyncing(false);
    }
  }, [token, products, tasks]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('boccantina_user');
    localStorage.removeItem('boccantina_token');
    setPage('landing');
    addToast('Logged out successfully');
  };

  const login = async (username, password) => {
    try {
      const res = await api.login(username, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('boccantina_user', JSON.stringify(res.user));
      localStorage.setItem('boccantina_token', res.token);
      setPage('dashboard');
      addToast(`Welcome back, ${res.user.name}`);
      return true;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const alerts = products
    .filter(p => p.currentStock <= p.threshold)
    .map(p => ({
      id: p.id, product: p.name, category: p.category,
      current: p.currentStock, threshold: p.threshold,
      suggested: Math.max(p.threshold * 2, 5), cost: p.costPerUnit
    }));

  const totalSku = products.length;
  const totalAlerts = alerts.length;
  const depletionRatio = totalSku > 0
    ? Math.round((products.reduce((a, p) => a + p.used, 0) / products.reduce((a, p) => a + p.begin, 0)) * 100)
    : 0;
  const weeklyValue = products.reduce((a, p) => a + (p.used * p.costPerUnit), 0);

  const value = {
    user, setUser, token, products, setProducts, orders, setOrders,
    tasks, setTasks, page, setPage, toasts, setToasts, addToast,
    alerts, totalSku, totalAlerts, depletionRatio, weeklyValue,
    lastSync, isSyncing, syncNow, logout, login, isOnline, loading,
    MONTHLY_DATA,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
