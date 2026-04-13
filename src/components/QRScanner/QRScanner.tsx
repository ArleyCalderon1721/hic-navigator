import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let selectedDeviceId: string | undefined;

    // Obtener las cámaras disponibles y seleccionar la trasera
    const initializeScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        
        if (cameras && cameras.length > 0) {
          // Intentar seleccionar la cámara trasera (back camera)
          const backCamera = cameras.find(camera => 
            camera.label.toLowerCase().includes('back') || 
            camera.label.toLowerCase().includes('trasera') ||
            camera.label.toLowerCase().includes('rear')
          );
          
          // Si no hay cámara trasera, seleccionar la primera disponible
          selectedDeviceId = backCamera ? backCamera.deviceId : cameras[0].deviceId;
        }

        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 0.9,
            disableFlip: true,
            deviceId: selectedDeviceId,
            showTorchButtonIfSupported: true,
          },
          false
        );

        scannerRef.current = scanner;

        const onScanSuccess = (decodedText: string) => {
          setIsScanning(false);
          onScan(decodedText);
          // Detener el scanner después de un escaneo exitoso
          if (scanner) {
            scanner.pause();
          }
        };

        const onScanFailure = (error: string) => {
          // Ignorar errores de escaneo fallido (son normales durante el escaneo)
          console.debug('Scan attempt failed:', error);
        };

        scanner.render(onScanSuccess, onScanFailure);
        setError(null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Error al inicializar la cámara: ${errorMessage}`);
        console.error('Scanner initialization error:', err);
      }
    };

    initializeScanner();

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.pause();
        } catch (e) {
          // El scanner ya se detuvo
        }
      }
    };
  }, [onScan]);

  const handleContinueScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.resume();
      setError(null);
      setIsScanning(true);
    }
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="qr-scanner-header">
          <h2>📱 Escanear QR</h2>
          <button className="qr-scanner-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && (
          <div className="qr-scanner-error">
            <p>⚠️ Error de cámara</p>
            <small>Verifica los permisos de cámara en la configuración de tu navegador</small>
          </div>
        )}

        {isScanning && !error && (
          <div className="qr-scanner-instruction">
            <p>📸 Apunta la cámara hacia el código QR</p>
          </div>
        )}

        <div id="qr-reader" className="qr-reader-container" />

        <div className="qr-scanner-footer">
          <button className="qr-btn-secondary" onClick={handleContinueScanning}>
            🔄 Reintentar
          </button>
          <button className="qr-btn-primary" onClick={onClose}>
            ✓ Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
