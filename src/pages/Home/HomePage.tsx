import { useState } from 'react';
import { LocationSelector } from '../../components/LocationSelector';
import { VideoPlayer } from '../../components/VideoPlayer';
import { QRScanner } from '../../components/QRScanner';
import { useRouteVideo } from '../../hooks/useRouteVideo';

export function HomePage() {
  const {
    originId,
    destinationId,
    result,
    locations,
    isLoading,
    setOriginId,
    setDestinationId,
    searchRoute,
  } = useRouteVideo();

  const [showVideo, setShowVideo] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  function handleSearch() {
    if (!originId || !destinationId) return;
    searchRoute();
    setShowVideo(true);
  }

  function handleClose() {
    setShowVideo(false);
  }

  function handleQRScan(decodedText: string) {
    try {
      // El QR contiene una URL, extraer el parámetro origin
      const url = new URL(decodedText);
      const origin = url.searchParams.get('origin');
      
      if (origin) {
        setOriginId(origin);
        setShowScanner(false);
      } else {
        alert('QR inválido: no contiene un parámetro "origin"');
      }
    } catch (error) {
      // Si no es una URL válida, asumir que es directamente un ID de ubicación
      setOriginId(decodedText);
      setShowScanner(false);
    }
  }

  return (
    <div className="home-container">

      <video
        className="video-bg"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/fondo.mp4" type="video/mp4" />
      </video>

      <div className="video-bg-overlay" />

      <div className="home-card">
        <div className="home-header">
          <img src="/hic-logo.svg" alt="HIC logo" className="home-logo" />
          <br /><br /><br />
          <h1 className="home-title">Navigator</h1>
          <p className="home-subtitle">
            Encuentra tu camino dentro del Hospital Internacional de Colombia
          </p>
        </div>

        <div className="home-form">
        
          {isLoading ? (
            <p className="loading-text">Cargando ubicaciones...</p>
          ) : (
            <>
              <LocationSelector
                label="¿Dónde estás?"
                value={originId}
                locations={locations}
                onChange={setOriginId}
                excluded={destinationId}
              />

              <LocationSelector
                label="¿A dónde quieres ir?"
                value={destinationId}
                locations={locations}
                onChange={setDestinationId}
                excluded={originId}
              />

              <div className="qr-section" style={{ marginTop: '12px', textAlign: 'left' }}>
                <p style={{ fontSize: '0.85rem', color: '#444' }}>Enlace QR para esta ubicación de origen:</p>
                <input
                  className="qr-url"
                  readOnly
                  value={
                    originId
                      ? `${window.location.origin}${window.location.pathname}?origin=${encodeURIComponent(originId)}`
                      : 'Selecciona origen para generar el enlace QR'
                  }
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
                Copia esta URL y genera un QR con cualquier herramienta (https://www.qr-code-generator.com/ u otra). Cuando el visitante la abra se seleccionará el origen automáticamente.
              </p>

              <button
                className="home-btn"
                onClick={handleSearch}
                disabled={!originId || !destinationId}
              >
                Ver ruta
              </button>

              <button
                className="home-btn-secondary"
                onClick={() => setShowScanner(true)}
                style={{ marginTop: '8px' }}
              >
                📱 Escanear nuevo QR
              </button>
            </>
          )}
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showVideo && result && (
        <VideoPlayer result={result} onClose={handleClose} />
      )}
    </div>
  );
}