-- Crear tabla routes para HIC Navigator
-- Ejecutar este script en tu BD MySQL después de importar locations.sql

CREATE TABLE `routes` (
  `id` varchar(100) NOT NULL,
  `originId` varchar(60) NOT NULL,
  `destinationId` varchar(60) NOT NULL,
  `videoUrl` varchar(255) NOT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `originId` (`originId`),
  KEY `destinationId` (`destinationId`),
  CONSTRAINT `routes_ibfk_1` FOREIGN KEY (`originId`) REFERENCES `locations` (`id`),
  CONSTRAINT `routes_ibfk_2` FOREIGN KEY (`destinationId`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insertar algunas rutas de ejemplo
INSERT INTO `routes` (`id`, `originId`, `destinationId`, `videoUrl`, `duration`) VALUES
('p1-lobby__s1-farmacia', 'p1-lobby', 's1-farmacia', 'videos/routes/p1-lobby__s1-farmacia.mp4', '01:10'),
('s1-farmacia__p1-lobby', 's1-farmacia', 'p1-lobby', 'videos/routes/s1-farmacia__p1-lobby.mp4', '01:10'),
('s1-banco-de-sangre__s1-farmacia-oncologica', 's1-banco-de-sangre', 's1-farmacia-oncologica', 'videos/routes/s1-banco-de-sangre__s1-farmacia-oncologica.mp4', '01:10');

COMMIT;