-- ==============================================================================
-- SISTEMA DE GESTIÓN HOTELERA
<<<<<<< HEAD
-- Script INIT final
-- MySQL 8+
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS hotel_dsoo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hotel_dsoo;

-- ==============================================================================
-- 0. LIMPIEZA PREVIA
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS ChecklistHigieneArea;
DROP TABLE IF EXISTS ProgramacionHigieneArea;
DROP TABLE IF EXISTS ConsumoInsumo;
DROP TABLE IF EXISTS Insumo;
DROP TABLE IF EXISTS RegistroLimpieza;
DROP TABLE IF EXISTS SolicitudServicioAlojamiento;
DROP TABLE IF EXISTS ReservaAmenidad;
DROP TABLE IF EXISTS HorarioAmenidad;

DROP TABLE IF EXISTS ServicioRestaurante;
DROP TABLE IF EXISTS AreaAmenidad;

DROP TABLE IF EXISTS Pago;
DROP TABLE IF EXISTS Reserva;
DROP TABLE IF EXISTS Alojamiento;

DROP TABLE IF EXISTS Notificacion;
DROP TABLE IF EXISTS RegistroAuditoria;

DROP TABLE IF EXISTS Membresia;
DROP TABLE IF EXISTS Beneficio;
DROP TABLE IF EXISTS Cliente;

DROP TABLE IF EXISTS Rol_Permiso;
DROP TABLE IF EXISTS Permiso;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Rol;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- 1. SEGURIDAD Y ACCESO
-- ==============================================================================

CREATE TABLE Rol (
    id_rol       INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL UNIQUE,
    descripcion  VARCHAR(255)
);

CREATE TABLE Permiso (
    id_permiso   INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    recurso      VARCHAR(100) NOT NULL,
    accion       VARCHAR(100) NOT NULL
);

CREATE TABLE Rol_Permiso (
    id_rol       INT NOT NULL,
    id_permiso   INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    CONSTRAINT fk_rol_permiso_rol
        FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_rol_permiso_permiso
        FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Usuario (
    id_usuario           INT AUTO_INCREMENT PRIMARY KEY,
    id_rol               INT NOT NULL,
    nombre_completo      VARCHAR(150) NOT NULL,
    correo_electronico   VARCHAR(100) NOT NULL UNIQUE,
    contrasena_hash      VARCHAR(255) NOT NULL,
    activo               BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso        DATETIME NULL,
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ==============================================================================
-- 2. CLIENTES Y FIDELIZACIÓN
-- Cliente ahora es perfil de Usuario.
-- Beneficio ahora apunta a Rol.
-- ==============================================================================

CREATE TABLE Cliente (
    id_cliente                 INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario                 INT NOT NULL UNIQUE,
    numero_cliente             VARCHAR(20) NOT NULL UNIQUE,
    telefono                   VARCHAR(20),
    documento_identificacion   VARCHAR(50),
    direccion                  VARCHAR(255),
    fecha_registro             DATE NOT NULL,
    CONSTRAINT fk_cliente_usuario
        FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Membresia (
    id_membresia   INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente     INT NOT NULL,
    plan_meses     INT NOT NULL,
    fecha_inicio   DATE NOT NULL,
    fecha_fin      DATE NOT NULL,
    estado         ENUM('ACTIVA', 'VENCIDA', 'CANCELADA') NOT NULL DEFAULT 'ACTIVA',
    costo_total    DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_membresia_cliente
        FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Beneficio (
    id_beneficio           INT AUTO_INCREMENT PRIMARY KEY,
    id_rol                 INT NOT NULL,
    nombre                 VARCHAR(100) NOT NULL,
    descripcion            TEXT,
    acceso_villas          BOOLEAN NOT NULL DEFAULT FALSE,
    tipo_amenidades        VARCHAR(100),
    prioridad_reserva      VARCHAR(100),
    politica_cancelacion   VARCHAR(255),
    CONSTRAINT fk_beneficio_rol
        FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ==============================================================================
-- 3. OPERACIONES Y LOGS
-- ==============================================================================

CREATE TABLE Notificacion (
    id_notificacion   INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario        INT NOT NULL,
    tipo              ENUM('CORREO', 'SISTEMA', 'PUSH') NOT NULL,
    asunto            VARCHAR(200) NOT NULL,
    mensaje           TEXT NOT NULL,
    destinatario      VARCHAR(100) NOT NULL,
    fecha_envio       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    enviada           BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_notificacion_usuario
        FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE RegistroAuditoria (
    id_registro       INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accion            VARCHAR(100) NOT NULL,
    entidad_afectada  VARCHAR(100) NOT NULL,
    id_entidad        INT NOT NULL,
    descripcion       TEXT,
    ip_origen         VARCHAR(45)
);

-- ==============================================================================
-- 4. GESTIÓN DE HOSPEDAJE
-- Se conserva la base general y se agrega soporte para higiene/privacidad.
-- ==============================================================================

CREATE TABLE Alojamiento (
    id_alojamiento      INT AUTO_INCREMENT PRIMARY KEY,
    numero_o_nombre     VARCHAR(50) NOT NULL UNIQUE,
    tipo                ENUM('HABITACION_ESTANDAR', 'HABITACION_DELUXE', 'SUITE', 'VILLA_PREMIUM') NOT NULL,
    estado              ENUM('DISPONIBLE', 'OCUPADA', 'SUCIA', 'EN_LIMPIEZA', 'MANTENIMIENTO', 'NO_MOLESTAR', 'INACTIVA') NOT NULL DEFAULT 'DISPONIBLE',
    estado_higiene      ENUM('LIMPIA', 'SUCIA', 'PROGRAMADA', 'EN_ESPERA', 'EN_LIMPIEZA', 'REPOSICION_INSUMOS') NOT NULL DEFAULT 'LIMPIA',
    privacidad_activa   BOOLEAN NOT NULL DEFAULT FALSE,
    capacidad_maxima    INT NOT NULL,
    precio_base         DECIMAL(10,2) NOT NULL,
    descripcion         TEXT
);

CREATE TABLE Reserva (
    id_reserva          INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente          INT NOT NULL,
    id_alojamiento      INT NOT NULL,
    fecha_reserva       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_checkin       DATE NOT NULL,
    fecha_checkout      DATE NOT NULL,
    estado              ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    numero_huespedes    INT NOT NULL,
    CONSTRAINT fk_reserva_cliente
        FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_reserva_alojamiento
        FOREIGN KEY (id_alojamiento) REFERENCES Alojamiento(id_alojamiento)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Pago (
    id_pago            INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva         INT NOT NULL,
    monto              DECIMAL(10,2) NOT NULL,
    fecha_pago         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_pago        ENUM('EFECTIVO', 'TARJETA_CREDITO') NOT NULL,
    estado_pago        ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO') NOT NULL DEFAULT 'PENDIENTE',
    referencia         VARCHAR(100),
    CONSTRAINT fk_pago_reserva
        FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==============================================================================
-- 5. AMENIDADES Y SERVICIOS
-- Ampliada para soportar áreas públicas, restaurante y reservas por horario.
-- ==============================================================================

CREATE TABLE AreaAmenidad (
    id_area                INT AUTO_INCREMENT PRIMARY KEY,
    nombre                 VARCHAR(100) NOT NULL,
    tipo                   ENUM('SPA', 'GIMNASIO', 'PISCINA', 'CLASE_WELLNESS', 'KIDS_CLUB', 'RESTAURANTE', 'LOBBY', 'PASILLO', 'OTRA') NOT NULL,
    estado                 ENUM('DISPONIBLE', 'LIMPIA', 'EN_MANTENIMIENTO', 'LIMPIEZA_PROFUNDA', 'BLOQUEADA') NOT NULL DEFAULT 'DISPONIBLE',
    capacidad_maxima       INT NOT NULL,
    es_paso_critico        BOOLEAN NOT NULL DEFAULT FALSE,
    sello_higiene_visible  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE ServicioRestaurante (
    id_servicio      INT AUTO_INCREMENT PRIMARY KEY,
    id_area          INT NOT NULL,
    turno            ENUM('DESAYUNO', 'COMIDA', 'CENA') NOT NULL,
    tipo_servicio    ENUM('BUFFET', 'A_LA_CARTA') NOT NULL,
    CONSTRAINT fk_servicio_restaurante_area
        FOREIGN KEY (id_area) REFERENCES AreaAmenidad(id_area)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==============================================================================
-- 6. HIGIENE Y PRIVACIDAD DE ALOJAMIENTO
-- Soporta No Molestar, Saltar Limpieza Hoy y Programar Limpieza.
-- ==============================================================================

CREATE TABLE SolicitudServicioAlojamiento (
    id_solicitud          INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva            INT NOT NULL,
    tipo_solicitud        ENUM('PROGRAMAR_LIMPIEZA', 'NO_MOLESTAR', 'SALTAR_LIMPIEZA_HOY') NOT NULL,
    estado_solicitud      ENUM('SOLICITADA', 'VALIDADA', 'REPROGRAMADA', 'ATENDIDA', 'CANCELADA', 'RECHAZADA') NOT NULL DEFAULT 'SOLICITADA',
    fecha_solicitud       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_programada      DATE NULL,
    horario_programado    VARCHAR(30) NULL,
    observaciones         TEXT,
    CONSTRAINT fk_solicitud_reserva
        FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==============================================================================
-- 7. REGISTRO OPERATIVO DE LIMPIEZA
-- Reutilizable para alojamiento y áreas públicas.
-- ==============================================================================

CREATE TABLE RegistroLimpieza (
    id_registro             INT AUTO_INCREMENT PRIMARY KEY,
    id_solicitud            INT NULL,
    id_alojamiento          INT NULL,
    id_area                 INT NULL,
    id_usuario_personal     INT NOT NULL,
    fecha_inicio            DATETIME NULL,
    fecha_fin               DATETIME NULL,
    checklist_completo      BOOLEAN NOT NULL DEFAULT FALSE,
    observaciones           TEXT,
    CONSTRAINT fk_registro_limpieza_solicitud
        FOREIGN KEY (id_solicitud) REFERENCES SolicitudServicioAlojamiento(id_solicitud)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_registro_limpieza_alojamiento
        FOREIGN KEY (id_alojamiento) REFERENCES Alojamiento(id_alojamiento)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_registro_limpieza_area
        FOREIGN KEY (id_area) REFERENCES AreaAmenidad(id_area)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_registro_limpieza_usuario
        FOREIGN KEY (id_usuario_personal) REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==============================================================================
-- 8. INSUMOS Y CONSUMO
-- ==============================================================================

CREATE TABLE Insumo (
    id_insumo          INT AUTO_INCREMENT PRIMARY KEY,
    nombre             VARCHAR(100) NOT NULL,
    categoria          ENUM('LIMPIEZA', 'LAVANDERIA', 'AMENIDAD', 'OTRO') NOT NULL,
    stock_actual       DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_minimo       DECIMAL(10,2) NOT NULL DEFAULT 0,
    unidad_medida      VARCHAR(30) NOT NULL,
    activo             BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE ConsumoInsumo (
    id_consumo         INT AUTO_INCREMENT PRIMARY KEY,
    id_registro        INT NOT NULL,
    id_insumo          INT NOT NULL,
    cantidad           DECIMAL(10,2) NOT NULL,
    observaciones      TEXT,
    CONSTRAINT fk_consumo_registro
        FOREIGN KEY (id_registro) REFERENCES RegistroLimpieza(id_registro)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_consumo_insumo
        FOREIGN KEY (id_insumo) REFERENCES Insumo(id_insumo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==============================================================================
-- 9. HIGIENE DE ÁREAS PÚBLICAS
-- Soporta rondas, limpieza profunda, asignación y checklist.
-- ==============================================================================

CREATE TABLE ProgramacionHigieneArea (
    id_programacion        INT AUTO_INCREMENT PRIMARY KEY,
    id_area                INT NOT NULL,
    id_usuario_asignado    INT NOT NULL,
    tipo_higiene           ENUM('RUTINARIA', 'PROFUNDA', 'REFRESCO') NOT NULL,
    fecha_programada       DATE NOT NULL,
    hora_programada        TIME NOT NULL,
    estado_programacion    ENUM('PENDIENTE', 'EN_PROCESO', 'FINALIZADA', 'POSPUESTA', 'CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    observaciones          TEXT,
    CONSTRAINT fk_programacion_area
        FOREIGN KEY (id_area) REFERENCES AreaAmenidad(id_area)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_programacion_usuario
        FOREIGN KEY (id_usuario_asignado) REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE ChecklistHigieneArea (
    id_checklist        INT AUTO_INCREMENT PRIMARY KEY,
    id_registro         INT NOT NULL,
    tarea               VARCHAR(150) NOT NULL,
    completada          BOOLEAN NOT NULL DEFAULT FALSE,
    observaciones       TEXT,
    CONSTRAINT fk_checklist_registro
        FOREIGN KEY (id_registro) REFERENCES RegistroLimpieza(id_registro)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==============================================================================
-- 10. RESERVA DE AMENIDADES
-- Soporta catálogo, horario, cupo, buffer VIP y restricciones.
-- ==============================================================================

CREATE TABLE HorarioAmenidad (
    id_horario           INT AUTO_INCREMENT PRIMARY KEY,
    id_area              INT NOT NULL,
    dia_semana           ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO') NOT NULL,
    hora_inicio          TIME NOT NULL,
    hora_fin             TIME NOT NULL,
    cupo_base            INT NOT NULL,
    buffer_vip           INT NOT NULL DEFAULT 0,
    exclusivo_premium    BOOLEAN NOT NULL DEFAULT FALSE,
    exclusivo_vip        BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_horario_amenidad_area
        FOREIGN KEY (id_area) REFERENCES AreaAmenidad(id_area)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE ReservaAmenidad (
    id_reserva_amenidad   INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente            INT NOT NULL,
    id_area               INT NOT NULL,
    id_horario            INT NOT NULL,
    fecha_reserva         DATE NOT NULL,
    cantidad_personas     INT NOT NULL DEFAULT 1,
    estado                ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'FINALIZADA', 'LISTA_ESPERA', 'RECHAZADA') NOT NULL DEFAULT 'PENDIENTE',
    recordatorio          BOOLEAN NOT NULL DEFAULT FALSE,
    observaciones         TEXT,
    CONSTRAINT fk_reserva_amenidad_cliente
        FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_reserva_amenidad_area
        FOREIGN KEY (id_area) REFERENCES AreaAmenidad(id_area)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_reserva_amenidad_horario
        FOREIGN KEY (id_horario) REFERENCES HorarioAmenidad(id_horario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==============================================================================
-- 11. ÍNDICES RECOMENDADOS
-- ==============================================================================

CREATE INDEX idx_usuario_correo ON Usuario(correo_electronico);
CREATE INDEX idx_usuario_rol ON Usuario(id_rol);

CREATE INDEX idx_cliente_usuario ON Cliente(id_usuario);

CREATE INDEX idx_membresia_cliente ON Membresia(id_cliente);
CREATE INDEX idx_beneficio_rol ON Beneficio(id_rol);

CREATE INDEX idx_notificacion_usuario ON Notificacion(id_usuario);

CREATE INDEX idx_reserva_cliente ON Reserva(id_cliente);
CREATE INDEX idx_reserva_alojamiento ON Reserva(id_alojamiento);

CREATE INDEX idx_solicitud_reserva ON SolicitudServicioAlojamiento(id_reserva);

CREATE INDEX idx_registro_alojamiento ON RegistroLimpieza(id_alojamiento);
CREATE INDEX idx_registro_area ON RegistroLimpieza(id_area);
CREATE INDEX idx_registro_usuario ON RegistroLimpieza(id_usuario_personal);

CREATE INDEX idx_consumo_registro ON ConsumoInsumo(id_registro);
CREATE INDEX idx_consumo_insumo ON ConsumoInsumo(id_insumo);

CREATE INDEX idx_programacion_area_fecha ON ProgramacionHigieneArea(id_area, fecha_programada);
CREATE INDEX idx_programacion_usuario ON ProgramacionHigieneArea(id_usuario_asignado);

CREATE INDEX idx_horario_area_dia ON HorarioAmenidad(id_area, dia_semana);
CREATE INDEX idx_reserva_amenidad_cliente ON ReservaAmenidad(id_cliente);
CREATE INDEX idx_reserva_amenidad_fecha ON ReservaAmenidad(id_area, fecha_reserva);

-- ==============================================================================
-- 12. DATOS BASE MÍNIMOS
-- ==============================================================================

INSERT INTO Rol (nombre, descripcion) VALUES
('CLIENTE_REGULAR', 'Cliente con acceso estándar'),
('CLIENTE_PREMIUM', 'Cliente con acceso premium'),
('CLIENTE_VIP', 'Cliente con acceso VIP'),
('PERSONAL_LIMPIEZA', 'Empleado de limpieza'),
('RECEPCIONISTA', 'Empleado de recepción'),
('GERENTE', 'Gerente del hotel'),
('ADMIN', 'Administrador del sistema');

INSERT INTO Permiso (nombre, recurso, accion) VALUES
('VER_PANEL_CLIENTE', 'HIGIENE_ALOJAMIENTO', 'READ'),
('PROGRAMAR_LIMPIEZA', 'HIGIENE_ALOJAMIENTO', 'CREATE'),
('ACTIVAR_NO_MOLESTAR', 'HIGIENE_ALOJAMIENTO', 'UPDATE'),
('REGISTRAR_LIMPIEZA', 'REGISTRO_LIMPIEZA', 'CREATE'),
('GESTIONAR_AREAS_PUBLICAS', 'HIGIENE_AREAS', 'UPDATE'),
('RESERVAR_AMENIDAD', 'RESERVA_AMENIDAD', 'CREATE');

-- CLIENTE_REGULAR
INSERT INTO Rol_Permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM Rol r
JOIN Permiso p
WHERE r.nombre = 'CLIENTE_REGULAR'
  AND p.nombre IN ('VER_PANEL_CLIENTE', 'PROGRAMAR_LIMPIEZA', 'ACTIVAR_NO_MOLESTAR', 'RESERVAR_AMENIDAD');

-- CLIENTE_PREMIUM
INSERT INTO Rol_Permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM Rol r
JOIN Permiso p
WHERE r.nombre = 'CLIENTE_PREMIUM'
  AND p.nombre IN ('VER_PANEL_CLIENTE', 'PROGRAMAR_LIMPIEZA', 'ACTIVAR_NO_MOLESTAR', 'RESERVAR_AMENIDAD');

-- CLIENTE_VIP
INSERT INTO Rol_Permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM Rol r
JOIN Permiso p
WHERE r.nombre = 'CLIENTE_VIP'
  AND p.nombre IN ('VER_PANEL_CLIENTE', 'PROGRAMAR_LIMPIEZA', 'ACTIVAR_NO_MOLESTAR', 'RESERVAR_AMENIDAD');

-- PERSONAL_LIMPIEZA
INSERT INTO Rol_Permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM Rol r
JOIN Permiso p
WHERE r.nombre = 'PERSONAL_LIMPIEZA'
  AND p.nombre IN ('REGISTRAR_LIMPIEZA', 'GESTIONAR_AREAS_PUBLICAS');

-- RECEPCIONISTA
INSERT INTO Rol_Permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM Rol r
JOIN Permiso p
WHERE r.nombre = 'RECEPCIONISTA'
  AND p.nombre IN ('RESERVAR_AMENIDAD');

-- GERENTE
INSERT INTO Rol_Permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM Rol r
JOIN Permiso p
WHERE r.nombre = 'GERENTE'
  AND p.nombre IN ('GESTIONAR_AREAS_PUBLICAS', 'REGISTRAR_LIMPIEZA');

-- ADMIN
INSERT INTO Rol_Permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM Rol r
JOIN Permiso p
WHERE r.nombre = 'ADMIN';

-- Beneficios base ligados a rol
INSERT INTO Beneficio (
    id_rol,
    nombre,
    descripcion,
    acceso_villas,
    tipo_amenidades,
    prioridad_reserva,
    politica_cancelacion
)
SELECT
    r.id_rol,
    'Beneficios estándar',
    'Acceso base a amenidades generales según disponibilidad.',
    FALSE,
    'SPA,GIMNASIO,PISCINA',
    'NORMAL',
    'CANCELACION_ESTANDAR'
FROM Rol r
WHERE r.nombre = 'CLIENTE_REGULAR';

INSERT INTO Beneficio (
    id_rol,
    nombre,
    descripcion,
    acceso_villas,
    tipo_amenidades,
    prioridad_reserva,
    politica_cancelacion
)
SELECT
    r.id_rol,
    'Beneficios premium',
    'Acceso a amenidades premium y prioridad media en reservas.',
    FALSE,
    'SPA,GIMNASIO,PISCINA,CLASE_WELLNESS,RESTAURANTE',
    'MEDIA',
    'CANCELACION_FLEXIBLE'
FROM Rol r
WHERE r.nombre = 'CLIENTE_PREMIUM';

INSERT INTO Beneficio (
    id_rol,
    nombre,
    descripcion,
    acceso_villas,
    tipo_amenidades,
    prioridad_reserva,
    politica_cancelacion
)
SELECT
    r.id_rol,
    'Beneficios VIP',
    'Acceso total a amenidades, buffer estratégico y prioridad alta.',
    TRUE,
    'SPA,GIMNASIO,PISCINA,CLASE_WELLNESS,KIDS_CLUB,RESTAURANTE',
    'ALTA',
    'CANCELACION_VIP'
FROM Rol r
WHERE r.nombre = 'CLIENTE_VIP';
=======
-- Base de Datos sincronizada con Diagrama de Clases (XML/Draw.io)
-- Creación inicial
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEGURIDAD Y ACCESO (Clases: Rol, Permiso, Usuario)
-- ------------------------------------------------------------------------------

CREATE TABLE Rol (
    id_rol      INT          AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE Permiso (
    id_permiso INT          AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    recurso    VARCHAR(100) NOT NULL,
    accion     VARCHAR(100) NOT NULL
);

-- Tabla intermedia para la relación muchos a muchos entre Rol y Permiso
CREATE TABLE Rol_Permiso (
    id_rol     INT NOT NULL,
    id_permiso INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol)     REFERENCES Rol(id_rol)         ON DELETE CASCADE,
    FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso) ON DELETE CASCADE
);

CREATE TABLE Usuario (
    id_usuario         INT          AUTO_INCREMENT PRIMARY KEY,
    id_rol             INT          NOT NULL,
    nombre_completo    VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena_hash    VARCHAR(255) NOT NULL,
    activo             BOOLEAN      NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

-- ------------------------------------------------------------------------------
-- 2. CLIENTES Y FIDELIZACIÓN (Clases: Cliente, Membresia, Beneficio)
-- ------------------------------------------------------------------------------

CREATE TABLE Cliente (
    id_cliente               INT          AUTO_INCREMENT PRIMARY KEY,
    numero_cliente           VARCHAR(20)  NOT NULL UNIQUE,
    nombre_completo          VARCHAR(150) NOT NULL,
    correo_electronico       VARCHAR(100) NOT NULL UNIQUE,
    telefono                 VARCHAR(20),
    documento_identificacion VARCHAR(50),
    direccion                VARCHAR(255),
    tipo_cliente             ENUM('ESTANDAR', 'PREMIUM', 'VIP') NOT NULL DEFAULT 'ESTANDAR',
    fecha_registro           DATE         NOT NULL
);

CREATE TABLE Membresia (
    id_membresia INT           AUTO_INCREMENT PRIMARY KEY,
    id_cliente   INT           NOT NULL,
    plan_meses   INT           NOT NULL,
    fecha_inicio DATE          NOT NULL,
    fecha_fin    DATE          NOT NULL,
    estado       ENUM('ACTIVA', 'VENCIDA', 'CANCELADA') NOT NULL DEFAULT 'ACTIVA',
    costo_total  DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE Beneficio (
    id_beneficio         INT          AUTO_INCREMENT PRIMARY KEY,
    nombre               VARCHAR(100) NOT NULL,
    descripcion          TEXT,
    tipo_cliente         ENUM('ESTANDAR', 'PREMIUM', 'VIP') NOT NULL,
    acceso_villas        BOOLEAN      NOT NULL DEFAULT FALSE,
    tipo_amenidades      VARCHAR(100),
    prioridad_reserva    VARCHAR(100),
    politica_cancelacion VARCHAR(255)
);

-- ------------------------------------------------------------------------------
-- 3. OPERACIONES Y LOGS (Clases: Notificacion, RegistroAuditoria)
-- ------------------------------------------------------------------------------

CREATE TABLE Notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario      INT NULL,
    id_cliente      INT NULL,
    tipo            ENUM('CORREO', 'SISTEMA', 'PUSH') NOT NULL,
    asunto          VARCHAR(200) NOT NULL,
    mensaje         TEXT NOT NULL,
    destinatario    VARCHAR(100) NOT NULL,
    fecha_envio     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    enviada         BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE RegistroAuditoria (
    id_registro      INT          AUTO_INCREMENT PRIMARY KEY,
    fecha_hora       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accion           VARCHAR(100) NOT NULL,
    entidad_afectada VARCHAR(100) NOT NULL,
    id_entidad       INT          NOT NULL,
    descripcion      TEXT,
    ip_origen        VARCHAR(45)
);

-- ------------------------------------------------------------------------------
-- 4. GESTIÓN DE HOSPEDAJE (Clases: Alojamiento, Reserva, Pago)
-- ------------------------------------------------------------------------------

CREATE TABLE Alojamiento (
    id_alojamiento   INT AUTO_INCREMENT PRIMARY KEY,
    numero_o_nombre  VARCHAR(50) NOT NULL UNIQUE,
    tipo             ENUM('HABITACION_ESTANDAR', 'HABITACION_DELUXE', 'SUITE', 'VILLA_PREMIUM') NOT NULL,
    estado           ENUM('DISPONIBLE', 'OCUPADA', 'SUCIA', 'EN_LIMPIEZA', 'MANTENIMIENTO', 'NO_MOLESTAR', 'INACTIVA') NOT NULL DEFAULT 'DISPONIBLE',
    capacidad_maxima INT NOT NULL,
    precio_base      DECIMAL(10,2) NOT NULL,
    descripcion      TEXT
);

CREATE TABLE Reserva (
    id_reserva       INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente       INT NOT NULL,
    id_alojamiento   INT NOT NULL,
    fecha_reserva    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_checkin    DATE NOT NULL,
    fecha_checkout   DATE NOT NULL,
    estado           ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    numero_huespedes INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_alojamiento) REFERENCES Alojamiento(id_alojamiento) ON DELETE CASCADE
);

CREATE TABLE Pago (
    id_pago       INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva    INT NOT NULL,
    monto         DECIMAL(10,2) NOT NULL,
    fecha_pago    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_pago   ENUM('EFECTIVO', 'TARJETA_CREDITO') NOT NULL,
    estado_pago   ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO') NOT NULL DEFAULT 'PENDIENTE',
    referencia    VARCHAR(100),
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 5. AMENIDADES Y SERVICIOS (Clases: AreaAmenidad, ServicioRestaurante)
-- ------------------------------------------------------------------------------

CREATE TABLE AreaAmenidad (
    id_area          INT AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    tipo             ENUM('SPA', 'GIMNASIO', 'PISCINA', 'CLASE_WELLNESS', 'KIDS_CLUB', 'RESTAURANTE') NOT NULL,
    estado           ENUM('DISPONIBLE', 'EN_MANTENIMIENTO', 'LIMPIEZA_PROFUNDA', 'BLOQUEADA') NOT NULL DEFAULT 'DISPONIBLE',
    capacidad_maxima INT NOT NULL
);

CREATE TABLE ServicioRestaurante (
    id_servicio   INT AUTO_INCREMENT PRIMARY KEY,
    id_area       INT NOT NULL,
    turno         ENUM('DESAYUNO', 'COMIDA', 'CENA') NOT NULL,
    tipo_servicio ENUM('BUFFET', 'A_LA_CARTA') NOT NULL,
    FOREIGN KEY (id_area) REFERENCES AreaAmenidad(id_area) ON DELETE CASCADE
);
>>>>>>> main
