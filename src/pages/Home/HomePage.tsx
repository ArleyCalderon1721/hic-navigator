import { useState } from 'react';
import { LocationSelector } from '../../components/LocationSelector';
import { VideoPlayer } from '../../components/VideoPlayer';
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
    reset,
  } = useRouteVideo();

  const [showVideo, setShowVideo] = useState(false);

  function handleSearch() {
    if (!originId || !destinationId) return;
    searchRoute();
    setShowVideo(true);
  }

  function handleClose() {
    setShowVideo(false);
    reset();
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
            </>
          )}
        </div>
      </div>

      {showVideo && result && (
        <VideoPlayer result={result} onClose={handleClose} />
      )}
    </div>
  );
}