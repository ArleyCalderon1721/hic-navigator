import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getPreferredCameraId = async (): Promise<string | null> => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return null;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((device) => device.kind === 'videoinput');
      if (videoInputs.length === 0) {
        return null;
      }

      const normalizedLabel = (label: string) => label.toLowerCase();
      const rearCamera = videoInputs.find((device) => {
        const label = normalizedLabel(device.label);
        return label.includes('back') || label.includes('rear') || label.includes('environment');
      });
      if (rearCamera) {
        return rearCamera.deviceId;
      }

      if (videoInputs.length === 1) {
        return videoInputs[0].deviceId;
      }

      const frontCamera = videoInputs.find((device) => {
        const label = normalizedLabel(device.label);
        return label.includes('front') || label.includes('selfie');
      });
      if (frontCamera) {
        return videoInputs.find((device) => device.deviceId !== frontCamera.deviceId)?.deviceId ?? frontCamera.deviceId;
      }

      return videoInputs[0].deviceId;
    };

    const initializeScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Permiso de cámara denegado o no disponible: ${errorMessage}`);
        console.error('Camera permission error:', err);
        return;
      }

      let videoConstraints: MediaTrackConstraints | undefined;
      try {
        const preferredCameraId = await getPreferredCameraId();
        videoConstraints = preferredCameraId
          ? { deviceId: { exact: preferredCameraId } }
          : { facingMode: { ideal: 'environment' } };
      } catch (err) {
        videoConstraints = { facingMode: { ideal: 'environment' } };
      }

      if (!isMounted) {
        return;
      }

      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 0.9,
          videoConstraints,
        },
        true
      );

      scannerRef.current = scanner;

      const onScanSuccess = (decodedText: string) => {
        setIsScanning(false);
        onScan(decodedText);
        if (scanner) {
          scanner.pause();
        }
      };

      const onScanFailure = (error: string) => {
        console.debug('Scan attempt failed:', error);
      };

      try {
        scanner.render(onScanSuccess, onScanFailure);
        setError(null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Error al inicializar la cámara: ${errorMessage}`);
        console.error('Scanner render error:', err);
      }
    };

    initializeScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch(() => {
            try {
              scannerRef.current?.pause();
            } catch (_e) {
              // El scanner ya se detuvo
            }
          });
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
