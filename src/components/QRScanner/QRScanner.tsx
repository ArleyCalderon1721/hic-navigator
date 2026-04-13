import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  let cancelled = false;

  const container = document.getElementById('qr-reader');
  if (container) container.innerHTML = '';

  const scanner = new Html5Qrcode('qr-reader');
  scannerRef.current = scanner;

  const startScanner = (facingMode: string) =>
    scanner.start(
      { facingMode },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        if (cancelled) return;
        onScan(decodedText);
        if (isRunningRef.current) {
          scanner.stop().catch(() => {});
          isRunningRef.current = false;
        }
      },
      undefined
    );

  startScanner('environment')
    .then(() => { if (!cancelled) isRunningRef.current = true; })
    .catch(() => {
      if (cancelled) return;
      startScanner('user')
        .then(() => { if (!cancelled) isRunningRef.current = true; })
        .catch((err) => {
          if (!cancelled) setError('No se pudo acceder a la cámara. Verifica los permisos.');
          console.error(err);
        });
    });

  return () => {
    cancelled = true;
    if (scannerRef.current && isRunningRef.current) {
      scannerRef.current.stop().catch(() => {});
      isRunningRef.current = false;
    }
  };
}, [onScan]);

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="qr-scanner-header">
          <h2>📱 Escanear QR</h2>
          <button className="qr-scanner-close" onClick={onClose}>✕</button>
        </div>

        {error ? (
          <div className="qr-scanner-error">
            <p>⚠️ {error}</p>
            <small>Verifica los permisos de cámara en tu navegador</small>
          </div>
        ) : (
          <div className="qr-scanner-instruction">
            <p>📸 Apunta la cámara hacia el código QR</p>
          </div>
        )}

        <div id="qr-reader" className="qr-reader-container" />

        <div className="qr-scanner-footer">
          <button className="qr-btn-primary" onClick={onClose}>✓ Cerrar</button>
        </div>
      </div>
    </div>
  );
}