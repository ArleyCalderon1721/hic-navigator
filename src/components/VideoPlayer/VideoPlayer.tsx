import type { RouteResult } from '../../types/hospital.types';

interface Props {
  result: RouteResult;
  onClose: () => void;
}

export function VideoPlayer({ result, onClose }: Props) {
  if (!result.found || !result.video) {
    return (
      <div className="video-overlay">
        <div className="video-modal">
          <div className="video-modal-header">
            <h2 className="video-modal-title">Ruta no encontrada</h2>
            <button className="video-close-btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
          <div className="video-not-found">
            <p>No existe un video registrado para esta ruta.</p>
            <p>
              De <strong>{result.origin?.name}</strong> a{' '}
              <strong>{result.destination?.name}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const videoSrc = result.video?.videoUrl
    ? result.video.videoUrl.startsWith('/')
      ? result.video.videoUrl
      : `/${result.video.videoUrl}`
    : undefined;

  return (
    <div className="video-overlay">
      <div className="video-modal">
        <div className="video-modal-header">
          <div className="video-modal-info">
            <h2 className="video-modal-title">
              {result.origin?.name} → {result.destination?.name}
            </h2>
            {result.video?.duration && (
              <span className="video-duration">
                Duración: {result.video.duration}
              </span>
            )}
          </div>
          <button className="video-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <div className="video-container">
          {videoSrc ? (
            <video
              src={videoSrc}
              title={`Ruta: ${result.origin?.name} → ${result.destination?.name}`}
              controls
              autoPlay
              muted
              className="video-player"
              onError={(e) => {
                console.error('Video load error', e);
                alert(
                  'No se puede cargar el video. Verifica que exista el archivo en public/videos/routes/'
                );
              }}
            >
              Tu navegador no soporta el elemento de video.
            </video>
          ) : (
            <div className="video-not-found">
              No se encontró un video válido para esta ruta.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}