-- Crear base de datos (ejecutar primero)
CREATE DATABASE IF NOT EXISTS mieescuela_primero;
USE mieescuela_primero;

-- Tabla municipio
CREATE TABLE IF NOT EXISTS municipio (
    id_municipio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_municipio VARCHAR(80) UNIQUE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Jalisco'
);

-- Tabla nivel_educativo
CREATE TABLE IF NOT EXISTS nivel_educativo (
    id_nivel INT AUTO_INCREMENT PRIMARY KEY,
    nombre_nivel VARCHAR(40) UNIQUE NOT NULL
);

-- Tabla necesidad_catalogo (extendida)
CREATE TABLE IF NOT EXISTS necesidad_catalogo (
    id_necesidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_necesidad VARCHAR(100) NOT NULL,
    categoria_general VARCHAR(60),
    cantidad_requerida INT DEFAULT 0,
    cantidad_recibida INT DEFAULT 0,
    prioridad ENUM('alta', 'media', 'baja') DEFAULT 'media'
);

-- Tabla tipo_donacion
CREATE TABLE IF NOT EXISTS tipo_donacion (
    id_tipo_donacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla escuela
CREATE TABLE IF NOT EXISTS escuela (
    id_escuela CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(150) NOT NULL,
    id_municipio INT NOT NULL,
    id_nivel INT,
    num_estudiantes INT DEFAULT 0,
    num_maestros INT DEFAULT 0,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    descripcion TEXT,
    url_imagen TEXT,
    progreso_financiamiento INT DEFAULT 0 CHECK (progreso_financiamiento BETWEEN 0 AND 100),
    progreso_materiales INT DEFAULT 0 CHECK (progreso_materiales BETWEEN 0 AND 100),
    progreso_voluntariado INT DEFAULT 0 CHECK (progreso_voluntariado BETWEEN 0 AND 100),
    nivel_condicion ENUM('Ideal', 'Alto', 'Medio', 'Básico', 'Mínimo') DEFAULT 'Mínimo',
    FOREIGN KEY (id_municipio) REFERENCES municipio(id_municipio) ON DELETE RESTRICT,
    FOREIGN KEY (id_nivel) REFERENCES nivel_educativo(id_nivel) ON DELETE SET NULL
);

-- Relación escuela - necesidad
CREATE TABLE IF NOT EXISTS escuela_necesidad (
    id_escuela CHAR(36),
    id_necesidad INT,
    PRIMARY KEY (id_escuela, id_necesidad),
    FOREIGN KEY (id_escuela) REFERENCES escuela(id_escuela) ON DELETE CASCADE,
    FOREIGN KEY (id_necesidad) REFERENCES necesidad_catalogo(id_necesidad) ON DELETE CASCADE
);

-- Relación escuela - tipo_donacion
CREATE TABLE IF NOT EXISTS escuela_tipo_donacion (
    id_escuela CHAR(36),
    id_tipo_donacion INT,
    PRIMARY KEY (id_escuela, id_tipo_donacion),
    FOREIGN KEY (id_escuela) REFERENCES escuela(id_escuela) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_donacion) REFERENCES tipo_donacion(id_tipo_donacion) ON DELETE CASCADE
);

-- Tabla solicitud_apoyo
CREATE TABLE IF NOT EXISTS solicitud_apoyo (
    id_solicitud CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre_contacto VARCHAR(100) NOT NULL,
    institucion VARCHAR(150),
    id_municipio INT,
    tipo_institucion VARCHAR(80),
    forma_participacion VARCHAR(60),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    notas_adicionales TEXT,
    fecha_recepcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_escuela_interes CHAR(36),
    categoria_interes VARCHAR(100),
    FOREIGN KEY (id_municipio) REFERENCES municipio(id_municipio) ON DELETE SET NULL,
    FOREIGN KEY (id_escuela_interes) REFERENCES escuela(id_escuela) ON DELETE SET NULL
);

-- Tabla admin_usuario (sin bcrypt, contraseña en texto plano)
CREATE TABLE IF NOT EXISTS admin_usuario (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- En realidad almacena texto plano
    nombre_completo VARCHAR(100),
    rol VARCHAR(30) DEFAULT 'admin'
);

-- =====================================================
-- DATOS DE EJEMPLO
-- =====================================================

-- Municipios
INSERT INTO municipio (nombre_municipio) VALUES
('Zapopan'), ('Arandas'), ('San Juan de los Lagos'), ('Tlaquepaque'),
('Guadalajara'), ('Tlajomulco de Zúñiga'), ('El Salto'), ('Puerto Vallarta')
ON DUPLICATE KEY UPDATE nombre_municipio = VALUES(nombre_municipio);

-- Niveles educativos
INSERT INTO nivel_educativo (nombre_nivel) VALUES
('Preescolar'), ('Primaria'), ('Secundaria'), ('Preparatoria')
ON DUPLICATE KEY UPDATE nombre_nivel = VALUES(nombre_nivel);

-- Necesidades con cantidades y prioridades
INSERT INTO necesidad_catalogo (nombre_necesidad, categoria_general, cantidad_requerida, cantidad_recibida, prioridad) VALUES
('Libros', 'Material educativo', 200, 45, 'alta'),
('Computadoras', 'Tecnología', 30, 5, 'alta'),
('Útiles Escolares', 'Material educativo', 500, 120, 'media'),
('Infraestructura', 'Infraestructura', 1, 0, 'alta'),
('Tecnología', 'Tecnología', 20, 8, 'media'),
('Equipo Deportivo', 'Deporte', 50, 10, 'baja'),
('Materiales de Arte', 'Cultural', 100, 20, 'media'),
('Biblioteca', 'Material educativo', 1, 0, 'alta'),
('Laboratorio de Ciencias', 'Infraestructura', 1, 0, 'media'),
('Instrumentos Musicales', 'Cultural', 15, 2, 'baja'),
('Tablets', 'Tecnología', 40, 6, 'alta'),
('Proyectores', 'Tecnología', 10, 1, 'media'),
('Herramientas de Jardinería', 'Acceso', 20, 5, 'baja'),
('Semillas', 'Medio ambiente', 100, 30, 'media')
ON DUPLICATE KEY UPDATE nombre_necesidad = VALUES(nombre_necesidad);

-- Tipos de donación
INSERT INTO tipo_donacion (nombre_tipo) VALUES
('Económica'), ('En especie'), ('Voluntariado'), ('Talleres'), ('Vinculación')
ON DUPLICATE KEY UPDATE nombre_tipo = VALUES(nombre_tipo);

-- Admin demo (contraseña en texto plano: admin123)
INSERT INTO admin_usuario (email, password_hash, nombre_completo, rol) VALUES
('admin@miescuela.org', 'admin123', 'Administrador Principal', 'super_admin')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Obtener IDs para relaciones
SET @zapopan = (SELECT id_municipio FROM municipio WHERE nombre_municipio = 'Zapopan');
SET @sanjuan = (SELECT id_municipio FROM municipio WHERE nombre_municipio = 'San Juan de los Lagos');
SET @arandas = (SELECT id_municipio FROM municipio WHERE nombre_municipio = 'Arandas');
SET @tlaquepaque = (SELECT id_municipio FROM municipio WHERE nombre_municipio = 'Tlaquepaque');
SET @primaria = (SELECT id_nivel FROM nivel_educativo WHERE nombre_nivel = 'Primaria');
SET @secundaria = (SELECT id_nivel FROM nivel_educativo WHERE nombre_nivel = 'Secundaria');
SET @preescolar = (SELECT id_nivel FROM nivel_educativo WHERE nombre_nivel = 'Preescolar');

-- Escuelas de ejemplo
INSERT INTO escuela (id_escuela, nombre, id_municipio, id_nivel, num_estudiantes, num_maestros, descripcion, url_imagen, progreso_financiamiento, progreso_materiales, progreso_voluntariado, nivel_condicion)
VALUES
(UUID(), 'Escuela Rural La Esperanza', @zapopan, @primaria, 150, 10, 'Escuela rural que atiende a 150 estudiantes necesitados de materiales educativos y mejoras en infraestructura.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', 65, 40, 80, 'Mínimo'),
(UUID(), 'Escuela Comunidad Unida', @sanjuan, @secundaria, 200, 14, 'Escuela costera enfocada en educación ambiental y desarrollo comunitario.', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80', 45, 70, 55, 'Medio'),
(UUID(), 'Escuela Nueva Generación', @sanjuan, @primaria, 300, 20, 'Escuela urbana que brinda educación de calidad a familias de bajos ingresos.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', 80, 60, 90, 'Básico'),
(UUID(), 'Escuela Montaña Verde', @arandas, @preescolar, 80, 6, 'Escuela de montaña que enfatiza la agricultura y sostenibilidad.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', 30, 25, 40, 'Mínimo');

-- Asignar necesidades a la primera escuela (ejemplo)
SET @id_esperanza = (SELECT id_escuela FROM escuela WHERE nombre = 'Escuela Rural La Esperanza' LIMIT 1);
SET @id_libros = (SELECT id_necesidad FROM necesidad_catalogo WHERE nombre_necesidad = 'Libros');
SET @id_computadoras = (SELECT id_necesidad FROM necesidad_catalogo WHERE nombre_necesidad = 'Computadoras');
SET @id_infra = (SELECT id_necesidad FROM necesidad_catalogo WHERE nombre_necesidad = 'Infraestructura');

INSERT INTO escuela_necesidad (id_escuela, id_necesidad) VALUES
(@id_esperanza, @id_libros), (@id_esperanza, @id_computadoras), (@id_esperanza, @id_infra)
ON DUPLICATE KEY UPDATE id_necesidad = id_necesidad;

-- Asignar tipos de donación a la primera escuela
SET @id_economica = (SELECT id_tipo_donacion FROM tipo_donacion WHERE nombre_tipo = 'Económica');
SET @id_especie = (SELECT id_tipo_donacion FROM tipo_donacion WHERE nombre_tipo = 'En especie');
SET @id_voluntariado = (SELECT id_tipo_donacion FROM tipo_donacion WHERE nombre_tipo = 'Voluntariado');

INSERT INTO escuela_tipo_donacion (id_escuela, id_tipo_donacion) VALUES
(@id_esperanza, @id_economica), (@id_esperanza, @id_especie), (@id_esperanza, @id_voluntariado)
ON DUPLICATE KEY UPDATE id_tipo_donacion = id_tipo_donacion;

ALTER TABLE necesidad_catalogo 
ADD COLUMN propuesta TEXT DEFAULT NULL,
ADD COLUMN unidad VARCHAR(30) DEFAULT NULL,
ADD COLUMN estado VARCHAR(30) DEFAULT 'Pendiente',
ADD COLUMN detalles TEXT DEFAULT NULL;

-- =====================================================
-- VISTAS Y STORED PROCEDURES (PROPUESTAS)
-- =====================================================

-- Vista para simplificar la obtención de propuestas por escuela
CREATE OR REPLACE VIEW vista_propuestas_escuela AS
SELECT 
  nc.id_necesidad,
  nc.nombre_necesidad AS subcategoria,
  nc.categoria_general AS categoria,
  nc.propuesta,
  nc.cantidad_requerida,
  nc.cantidad_recibida,
  nc.unidad,
  nc.estado,
  nc.detalles,
  nc.prioridad,
  e.id_escuela,
  e.nombre AS escuela_nombre,
  m.nombre_municipio AS municipio
FROM necesidad_catalogo nc
JOIN escuela_necesidad en ON nc.id_necesidad = en.id_necesidad
JOIN escuela e ON en.id_escuela = e.id_escuela
JOIN municipio m ON e.id_municipio = m.id_municipio;

-- SP para Agregar una Propuesta
DELIMITER //
CREATE PROCEDURE sp_upsert_propuesta(
  IN p_id_escuela CHAR(36),
  IN p_subcategoria VARCHAR(100),
  IN p_categoria VARCHAR(60),
  IN p_propuesta TEXT,
  IN p_cantidad_requerida INT,
  IN p_unidad VARCHAR(30),
  IN p_estado VARCHAR(30),
  IN p_detalles TEXT
)
BEGIN
  DECLARE v_id_necesidad INT;

  -- Insertar nueva necesidad
  INSERT INTO necesidad_catalogo 
    (nombre_necesidad, categoria_general, cantidad_requerida, propuesta, unidad, estado, detalles)
  VALUES 
    (p_subcategoria, COALESCE(p_categoria, 'General'), COALESCE(p_cantidad_requerida, 0), 
     p_propuesta, p_unidad, COALESCE(p_estado, 'Pendiente'), p_detalles);

  SET v_id_necesidad = LAST_INSERT_ID();

  -- Vincular con la escuela
  INSERT IGNORE INTO escuela_necesidad (id_escuela, id_necesidad) 
  VALUES (p_id_escuela, v_id_necesidad);

  SELECT v_id_necesidad AS id_necesidad;
END //
DELIMITER ;

-- SP para Actualizar una Propuesta
DELIMITER //
CREATE PROCEDURE sp_update_propuesta(
  IN p_id_necesidad INT,
  IN p_subcategoria VARCHAR(100),
  IN p_categoria VARCHAR(60),
  IN p_propuesta TEXT,
  IN p_cantidad_requerida INT,
  IN p_unidad VARCHAR(30),
  IN p_estado VARCHAR(30),
  IN p_detalles TEXT
)
BEGIN
  UPDATE necesidad_catalogo 
  SET nombre_necesidad = COALESCE(p_subcategoria, nombre_necesidad),
      categoria_general = COALESCE(p_categoria, categoria_general),
      cantidad_requerida = COALESCE(p_cantidad_requerida, cantidad_requerida),
      propuesta = COALESCE(p_propuesta, propuesta),
      unidad = COALESCE(p_unidad, unidad),
      estado = COALESCE(p_estado, estado),
      detalles = COALESCE(p_detalles, detalles)
  WHERE id_necesidad = p_id_necesidad;
END //
DELIMITER ;

-- SP para Eliminar una Propuesta
DELIMITER //
CREATE PROCEDURE sp_delete_propuesta(
  IN p_id_necesidad INT
)
BEGIN
  -- Eliminar la relación (se hace por CASCADE, pero explícito por claridad)
  DELETE FROM escuela_necesidad WHERE id_necesidad = p_id_necesidad;
  -- Eliminar la necesidad
  DELETE FROM necesidad_catalogo WHERE id_necesidad = p_id_necesidad;
END //
DELIMITER ;