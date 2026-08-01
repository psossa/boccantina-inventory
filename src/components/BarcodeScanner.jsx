import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CameraIcon, BoxIcon } from './Icons';

export default function BarcodeScanner() {
  const { products, setProducts, addToast } = useApp();
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [lastScan, setLastScan] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);
      startBarcodeDetection();
    } catch (err) {
      addToast('Camera access denied. Use manual entry.', 'error');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const startBarcodeDetection = () => {
    if (!('BarcodeDetector' in window)) return;
    const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e'] });
    const detect = async () => {
      if (!videoRef.current || !scanning) return;
      try {
        const codes = await detector.detect(videoRef.current);
        if (codes.length > 0) {
          handleScan(codes[0].rawValue);
          stopCamera();
          return;
        }
      } catch (e) {}
      requestAnimationFrame(detect);
    };
    detect();
  };

  const handleScan = (code) => {
    const product = products.find(p => p.code === code);
    if (product) {
      setLastScan({ type: 'found', product, code });
      addToast(`Found: ${product.name}`);
    } else {
      setLastScan({ type: 'notfound', code });
      addToast('Product not found in inventory', 'error');
    }
  };

  const adjustScannedProduct = (delta) => {
    if (!lastScan || lastScan.type !== 'found') return;
    const p = lastScan.product;
    setProducts(prev => prev.map(x => {
      if (x.id !== p.id) return x;
      const newStock = Math.max(0, x.currentStock + delta);
      return { ...x, currentStock: newStock, used: delta < 0 ? x.used - delta : x.used, end: newStock };
    }));
    addToast(`${p.name}: ${delta > 0 ? '+' : ''}${delta} unit${Math.abs(delta) !== 1 ? 's' : ''}`);
    setLastScan(null);
  };

  const handleManualLookup = () => {
    if (!manualCode.trim()) return;
    handleScan(manualCode.trim());
    setManualCode('');
  };

  useEffect(() => {
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); };
  }, []);

  return (
    <div className="container dashboard">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h3 className="section-title">Barcode Scanner</h3>
          <p className="section-subtitle">Scan items to quickly adjust stock levels</p>
        </div>
      </div>
      <div className="card" style={{ padding: '32px' }}>
        <div className="scanner-container">
          <div className="scanner-viewport">
            {scanning ? (
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="scanner-overlay">
                <div className="scanner-frame">
                  <div className="scan-line" />
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
            {!scanning ? (
              <button className="btn btn-primary" onClick={startCamera}><CameraIcon /> Start Camera</button>
            ) : (
              <button className="btn btn-outline" onClick={stopCamera}>Stop Camera</button>
            )}
          </div>
          <div style={{ maxWidth: '320px', margin: '0 auto' }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', textAlign: 'center' }}>Or enter barcode manually:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input className="input" placeholder="Enter barcode..." value={manualCode} onChange={e => setManualCode(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleManualLookup()} />
              <button className="btn btn-dark" onClick={handleManualLookup}>Lookup</button>
            </div>
          </div>
          {lastScan && (
            <div className="scan-result fade-in">
              {lastScan.type === 'found' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#131521', color: '#fabd2f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BoxIcon /></div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px' }}>{lastScan.product.name}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>Code: {lastScan.code} · {lastScan.product.category} · Current: {lastScan.product.currentStock} {lastScan.product.pack}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => adjustScannedProduct(-1)}>- Remove 1</button>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => adjustScannedProduct(1)}>+ Add 1</button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#ef4444' }}>
                  <p style={{ fontWeight: 600 }}>Product not found</p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>Barcode "{lastScan.code}" does not match any inventory item.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
