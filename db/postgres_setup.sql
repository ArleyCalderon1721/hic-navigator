-- PostgreSQL setup for HIC Navigator
-- Run this script in your PostgreSQL database

-- Create locations table
CREATE TABLE locations (
  id VARCHAR(60) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  floor VARCHAR(10) NOT NULL, -- Changed from enum to varchar
  floor_label VARCHAR(30) NOT NULL,
  area VARCHAR(100) NOT NULL,
  description TEXT
);

-- Insert locations data
INSERT INTO locations (id, name, floor, floor_label, area, description) VALUES
('p1-archivo', 'Archivo', 'P1', 'Piso 1', 'Servicios Administrativos', 'Salón de archivo con scanner, impresora y equipos de cómputo.'),
('p1-bienestar', 'Sala Bienestar', 'P1', 'Piso 1', 'Servicios al Paciente', 'Sala de bienestar con teléfono, computador y computador del psicólogo.'),
('p1-experiencia', 'Experiencia al Paciente', 'P1', 'Piso 1', 'Servicios al Paciente', 'Oficina de experiencia al paciente con teléfonos IP y computadores.'),
('p1-farmacia-uet', 'Farmacia UET', 'P1', 'Piso 1', 'Farmacia', 'Farmacia de urgencias con teléfono IP, computadores e internet.'),
('p1-farmazul', 'Farmazul', 'P1', 'Piso 1', 'Farmacia', 'Farmacia Farmazul con teléfonos IP, computadores e internet.'),
('p1-lobby', 'Lobby Principal', 'P1', 'Piso 1', 'Acceso General', 'Lobby con teléfonos IP, computadores, internet y SmartGate.'),
('p1-montanas-azules', 'Restaurante Montañas Azules', 'P1', 'Piso 1', 'Servicios Generales', 'Restaurante con teléfonos IP, computadores e internet.'),
('p1-pre-admisiones', 'Pre-Admisiones y Autorizaciones', 'P1', 'Piso 1', 'Servicios Administrativos', 'Pre-admisiones y autorizaciones con teléfonos IP y computadores.'),
('p1-puntos-vital', 'Puntos Vital', 'P1', 'Piso 1', 'Servicios Generales', 'Puntos Vital con teléfonos IP, computadores e internet.'),
('p1-sala-internacional', 'Sala Internacional', 'P1', 'Piso 1', 'Servicios Especiales', 'Sala internacional con teléfonos IP, computadores e internet.'),
('p1-sala-zapatoca', 'Sala Zapatoca (VIP)', 'P1', 'Piso 1', 'Salas VIP', 'Sala Zapatoca VIP con teléfonos IP, computadores e internet.'),
('p1-salud-mia', 'Salud Mía', 'P1', 'Piso 1', 'Servicios Generales', 'Oficina Salud Mía con teléfonos IP, computadores e internet.'),
('p1-uet-front', 'UET — Front (Recepción)', 'P1', 'Piso 1', 'UET (Urgencias)', 'Recepción principal de UET con teléfonos IP, computadores e internet.'),
('p1-uet-sala1', 'UET — Sala 1', 'P1', 'Piso 1', 'UET (Urgencias)', 'Sala 1 de urgencias con llamados, teléfonos IP, computadores y WiFi.'),
('p1-uet-sala2', 'UET — Sala 2', 'P1', 'Piso 1', 'UET (Urgencias)', 'Sala 2 de urgencias con llamados, teléfonos IP, computadores y WiFi.'),
('p1-uet-sala3', 'UET — Sala 3', 'P1', 'Piso 1', 'UET (Urgencias)', 'Sala 3 de urgencias con llamados, teléfonos IP, computadores y WiFi.'),
('p1-uet-sala4', 'UET — Sala 4', 'P1', 'Piso 1', 'UET (Urgencias)', 'Sala 4 de urgencias con llamados, teléfonos IP, computadores y WiFi.'),
('p1-uet-triage-ped', 'UET — Triage Pediátrico', 'P1', 'Piso 1', 'UET (Urgencias)', 'Triage pediátrico con TV de información institucional.'),
('s1-banco-de-sangre', 'Banco de Sangre', 'S1', 'Sótano 1', 'Consulta Externa', 'Digiturnos, computadores, impresoras e impresora de vales.'),
('s1-chequeos-ejecutivos', 'Chequeos Ejecutivos', 'S1', 'Sótano 1', 'Consulta Externa', 'Computadores, impresoras, televisores y TV box.'),
('s1-farmacia', 'Farmacia Salud Mía', 'S1', 'Sótano 1', 'Consulta Externa', 'Digiturnos, computadores, impresoras e impresora de vales.'),
('s1-farmacia-oncologica', 'Farmacia Oncológica', 'S1', 'Sótano 1', 'Consulta Externa', 'Farmacia oncológica con computador, internet y teléfonos IP.'),
('s1-gastroenterologia', 'Gastroenterología', 'S1', 'Sótano 1', 'Consulta Externa', 'Área de gastroenterología con TV informativos, computadores e impresora.'),
('s1-laboratorio-clinico', 'Laboratorio Clínico', 'S1', 'Sótano 1', 'Consulta Externa', 'Digiturnos, computadores, impresoras e impresora de vales.'),
('s1-medicina-nuclear', 'Medicina Nuclear', 'S1', 'Sótano 1', 'Consulta Externa', 'Área de medicina nuclear con computadores, impresoras y cámaras.'),
('s1-oncologia', 'Oncología', 'S1', 'Sótano 1', 'Consulta Externa', 'Área de oncología con digiturnos, computadores, impresoras y vales.'),
('s1-oncologia-vip', 'Oncología VIP (Chará)', 'S1', 'Sótano 1', 'Consulta Externa VIP', 'Área VIP Chará con TV informativos, computadores e impresora.');

-- Create routes table
CREATE TABLE routes (
  id VARCHAR(100) PRIMARY KEY,
  originId VARCHAR(60) NOT NULL REFERENCES locations(id),
  destinationId VARCHAR(60) NOT NULL REFERENCES locations(id),
  videoUrl VARCHAR(255) NOT NULL,
  duration VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert routes data
INSERT INTO routes (id, originId, destinationId, videoUrl, duration) VALUES
('p1-lobby__s1-farmacia', 'p1-lobby', 's1-farmacia', 'videos/routes/p1-lobby__s1-farmacia.mp4', '01:10'),
('s1-farmacia__p1-lobby', 's1-farmacia', 'p1-lobby', 'videos/routes/s1-farmacia__p1-lobby.mp4', '01:10'),
('s1-banco-de-sangre__s1-farmacia-oncologica', 's1-banco-de-sangre', 's1-farmacia-oncologica', 'videos/routes/s1-banco-de-sangre__s1-farmacia-oncologica.mp4', '01:10');