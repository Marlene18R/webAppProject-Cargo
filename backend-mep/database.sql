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
    nombre_necesidad VARCHAR(100) UNIQUE NOT NULL,
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

--SPs, Views y Triggers
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_crear_escuela$$
CREATE PROCEDURE sp_crear_escuela(
    IN p_id_escuela CHAR(36),
    IN p_nombre VARCHAR(150),
    IN p_id_municipio INT,
    IN p_id_nivel INT,
    IN p_num_estudiantes INT,
    IN p_num_maestros INT,
    IN p_telefono VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_direccion TEXT,
    IN p_descripcion TEXT,
    IN p_url_imagen TEXT,
    IN p_prog_financ INT,
    IN p_prog_mat INT,
    IN p_prog_vol INT,
    IN p_nivel_condicion VARCHAR(30),
    IN p_necesidades TEXT,   
    IN p_tipos_donacion TEXT    
)
BEGIN
    DECLARE v_id_necesidad INT DEFAULT NULL;
    DECLARE v_id_tipo INT DEFAULT NULL;
    DECLARE v_need_name VARCHAR(150);
    DECLARE v_type_name VARCHAR(150);
    DECLARE v_pos INT;
    DECLARE v_rem_n TEXT;
    DECLARE v_rem_t TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    IF EXISTS (
        SELECT 1 FROM escuela
        WHERE nombre = p_nombre AND id_municipio = p_id_municipio
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ya existe una escuela con ese nombre en este municipio';
    END IF;

    INSERT INTO escuela (
        id_escuela, nombre, id_municipio, id_nivel,
        num_estudiantes, num_maestros, telefono, email,
        direccion, descripcion, url_imagen,
        progreso_financiamiento, progreso_materiales, progreso_voluntariado,
        nivel_condicion
    ) VALUES (
        p_id_escuela, p_nombre, p_id_municipio, p_id_nivel,
        p_num_estudiantes, p_num_maestros, p_telefono, p_email,
        p_direccion, p_descripcion, p_url_imagen,
        p_prog_financ, p_prog_mat, p_prog_vol,
        p_nivel_condicion
    );

    SET v_rem_n = p_necesidades;
    WHILE LENGTH(TRIM(v_rem_n)) > 0 DO
        SET v_pos = LOCATE(',', v_rem_n);
        IF v_pos > 0 THEN
            SET v_need_name = TRIM(SUBSTRING(v_rem_n, 1, v_pos - 1));
            SET v_rem_n = TRIM(SUBSTRING(v_rem_n, v_pos + 1));
        ELSE
            SET v_need_name = TRIM(v_rem_n);
            SET v_rem_n = '';
        END IF;
        SELECT id_necesidad INTO v_id_necesidad
        FROM necesidad_catalogo WHERE nombre_necesidad = v_need_name LIMIT 1;
        IF v_id_necesidad IS NOT NULL THEN
            INSERT IGNORE INTO escuela_necesidad (id_escuela, id_necesidad)
            VALUES (p_id_escuela, v_id_necesidad);
        END IF;
        SET v_id_necesidad = NULL;
    END WHILE;


    SET v_rem_t = p_tipos_donacion;
    WHILE LENGTH(TRIM(v_rem_t)) > 0 DO
        SET v_pos = LOCATE(',', v_rem_t);
        IF v_pos > 0 THEN
            SET v_type_name = TRIM(SUBSTRING(v_rem_t, 1, v_pos - 1));
            SET v_rem_t = TRIM(SUBSTRING(v_rem_t, v_pos + 1));
        ELSE
            SET v_type_name = TRIM(v_rem_t);
            SET v_rem_t  = '';
        END IF;
        SELECT id_tipo_donacion INTO v_id_tipo
        FROM tipo_donacion WHERE nombre_tipo = v_type_name LIMIT 1;
        IF v_id_tipo IS NOT NULL THEN
            INSERT IGNORE INTO escuela_tipo_donacion (id_escuela, id_tipo_donacion)
            VALUES (p_id_escuela, v_id_tipo);
        END IF;
        SET v_id_tipo = NULL;
    END WHILE;

    COMMIT;
END$$


DROP PROCEDURE IF EXISTS sp_actualizar_progreso_escuela$$
CREATE PROCEDURE sp_actualizar_progreso_escuela(
    IN p_id_escuela CHAR(36),
    IN p_prog_financ INT,
    IN p_prog_mat INT,
    IN p_prog_vol INT
)
BEGIN
    DECLARE v_promedio DECIMAL(5,2);
    DECLARE v_nivel_condicion VARCHAR(30);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM escuela WHERE id_escuela = p_id_escuela) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Escuela no encontrada';
    END IF;

    SET v_promedio = (p_prog_financ + p_prog_mat + p_prog_vol) / 3;

    SET v_nivel_condicion = CASE
        WHEN v_promedio >= 80 THEN 'Ideal'
        WHEN v_promedio >= 60 THEN 'Alto'
        WHEN v_promedio >= 40 THEN 'Medio'
        WHEN v_promedio >= 20 THEN 'Básico'
        ELSE 'Mínimo'
    END;

    UPDATE escuela
    SET progreso_financiamiento = p_prog_financ,
        progreso_materiales = p_prog_mat,
        progreso_voluntariado = p_prog_vol,
        nivel_condicion = v_nivel_condicion
    WHERE id_escuela = p_id_escuela;

    COMMIT;
END$$


DROP PROCEDURE IF EXISTS sp_registrar_solicitud_apoyo$$
CREATE PROCEDURE sp_registrar_solicitud_apoyo(
    IN p_id_solicitud  CHAR(36),
    IN p_nombre_contacto VARCHAR(100),
    IN p_institucion VARCHAR(150),
    IN p_nombre_municipio VARCHAR(80),
    IN p_tipo_institucion VARCHAR(80),
    IN p_forma_participacion VARCHAR(60),
    IN p_telefono VARCHAR(20),
    IN p_correo VARCHAR(100),
    IN p_notas TEXT,
    IN p_id_escuela_interes CHAR(36),
    IN p_categoria_interes VARCHAR(100)
)
BEGIN
    DECLARE v_id_municipio INT DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT id_municipio INTO v_id_municipio
    FROM municipio WHERE nombre_municipio = p_nombre_municipio LIMIT 1;

    IF p_id_escuela_interes IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM escuela WHERE id_escuela = p_id_escuela_interes)
    THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La escuela de interés no existe';
    END IF;

    INSERT INTO solicitud_apoyo (
        id_solicitud, nombre_contacto, institucion,
        id_municipio, tipo_institucion, forma_participacion,
        telefono, correo, notas_adicionales,
        id_escuela_interes, categoria_interes
    ) VALUES (
        p_id_solicitud, p_nombre_contacto, p_institucion,
        v_id_municipio, p_tipo_institucion, p_forma_participacion,
        p_telefono, p_correo, p_notas,
        p_id_escuela_interes, p_categoria_interes
    );

    COMMIT;
END$$


DROP PROCEDURE IF EXISTS sp_eliminar_escuela$$
CREATE PROCEDURE sp_eliminar_escuela(
    IN p_id_escuela CHAR(36)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM escuela WHERE id_escuela = p_id_escuela) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Escuela no encontrada';
    END IF;

    DELETE FROM escuela_necesidad WHERE id_escuela = p_id_escuela;
    DELETE FROM escuela_tipo_donacion WHERE id_escuela = p_id_escuela;
    DELETE FROM solicitud_apoyo WHERE id_escuela_interes = p_id_escuela;
    DELETE FROM escuela WHERE id_escuela = p_id_escuela;

    COMMIT;
END$$


DELIMITER ;



DELIMITER $$

DROP PROCEDURE IF EXISTS sp_registrar_historial_progreso$$
CREATE PROCEDURE sp_registrar_historial_progreso(
    IN p_id_escuela CHAR(36),
    IN p_prog_financ INT,
    IN p_prog_mat INT,
    IN p_prog_vol INT,
    IN p_nivel VARCHAR(30)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO escuela_historial_progreso (
        id_escuela,
        prog_financiamiento,
        prog_materiales,
        prog_voluntariado,
        nivel_condicion
    ) VALUES (
        p_id_escuela,
        p_prog_financ,
        p_prog_mat,
        p_prog_vol,
        p_nivel
    );

    COMMIT;
END$$

DELIMITER ;


DELIMITER $$

DROP TRIGGER IF EXISTS trg_after_insert_solicitud$$
CREATE TRIGGER trg_after_insert_solicitud
AFTER INSERT ON solicitud_apoyo
FOR EACH ROW
BEGIN
    DECLARE v_f INT DEFAULT 0;
    DECLARE v_m INT DEFAULT 0;
    DECLARE v_v INT DEFAULT 0;

    IF NEW.id_escuela_interes IS NOT NULL THEN
        SELECT progreso_financiamiento,
               progreso_materiales,
               progreso_voluntariado
        INTO   v_f, v_m, v_v
        FROM   escuela
        WHERE  id_escuela = NEW.id_escuela_interes;

        CALL sp_actualizar_progreso_escuela(NEW.id_escuela_interes, v_f, v_m, v_v);
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_after_update_progreso$$
CREATE TRIGGER trg_after_update_progreso
AFTER UPDATE ON escuela
FOR EACH ROW
BEGIN
    IF OLD.progreso_financiamiento <> NEW.progreso_financiamiento
    OR OLD.progreso_materiales <> NEW.progreso_materiales
    OR OLD.progreso_voluntariado <> NEW.progreso_voluntariado
    THEN
        CALL sp_registrar_historial_progreso(
            NEW.id_escuela,
            NEW.progreso_financiamiento,
            NEW.progreso_materiales,
            NEW.progreso_voluntariado,
            NEW.nivel_condicion
        );
    END IF;
END$$


DROP TRIGGER IF EXISTS trg_before_delete_escuela$$
CREATE TRIGGER trg_before_delete_escuela
BEFORE DELETE ON escuela
FOR EACH ROW
BEGIN
    CALL sp_registrar_historial_progreso(
        OLD.id_escuela,
        OLD.progreso_financiamiento,
        OLD.progreso_materiales,
        OLD.progreso_voluntariado,
        OLD.nivel_condicion
    );
END$$


DELIMITER ;



CREATE OR REPLACE VIEW v_escuelas_completas AS
SELECT
    e.id_escuela,
    e.nombre,
    m.nombre_municipio AS county,
    nv.nombre_nivel AS nivel,
    e.num_estudiantes AS students,
    e.num_maestros AS teachers,
    e.telefono,
    e.email,
    e.direccion,
    e.descripcion,
    e.url_imagen AS image,
    e.progreso_financiamiento AS fundingProgress,
    e.progreso_materiales AS materialsProgress,
    e.progreso_voluntariado AS volunteerHoursProgress,
    e.nivel_condicion AS nivelCondicion
FROM escuela e
JOIN  municipio m ON e.id_municipio = m.id_municipio
LEFT JOIN nivel_educativo nv ON e.id_nivel = nv.id_nivel;


CREATE OR REPLACE VIEW v_solicitudes_con_municipio AS
SELECT
    s.id_solicitud,
    s.nombre_contacto,
    s.institucion,
    m.nombre_municipio AS municipio,
    s.tipo_institucion,
    s.forma_participacion,
    s.telefono,
    s.correo,
    s.notas_adicionales,
    s.fecha_recepcion,
    s.id_escuela_interes,
    s.categoria_interes
FROM solicitud_apoyo s
LEFT JOIN municipio m ON s.id_municipio = m.id_municipio
ORDER BY s.fecha_recepcion DESC;


CREATE OR REPLACE VIEW v_estadisticas_dashboard AS
SELECT
    (SELECT COUNT(*) FROM escuela) AS total_escuelas,
    (SELECT COUNT(*) FROM escuela_necesidad) AS total_necesidades,
    (SELECT COUNT(*) FROM solicitud_apoyo) AS total_solicitudes,
    (SELECT ROUND(AVG(progreso_financiamiento), 0) FROM escuela) AS progreso_promedio,
    (SELECT COUNT(*) FROM escuela
     WHERE nivel_condicion IN ('Básico','Medio','Alto','Ideal')) AS escuelas_basico_superior;


CREATE OR REPLACE VIEW v_necesidades_por_escuela AS
SELECT
    en.id_escuela,
    nc.id_necesidad,
    nc.nombre_necesidad,
    nc.categoria_general,
    nc.cantidad_requerida,
    nc.cantidad_recibida,
    nc.prioridad,
    nc.propuesta,
    nc.unidad,
    nc.estado,
    nc.detalles
FROM escuela_necesidad en
JOIN necesidad_catalogo nc ON en.id_necesidad = nc.id_necesidad;