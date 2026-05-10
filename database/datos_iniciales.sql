-- ═══════════════════════════════════════════════════════════════════
-- DATOS INICIALES DEL SISTEMA
-- Ejecutar en phpMyAdmin (http://localhost:8080)
-- Seleccionar BD: hotel_dsoo antes de ejecutar
-- ═══════════════════════════════════════════════════════════════════

-- 1. ROLES DEL SISTEMA
INSERT INTO Rol (nombre, descripcion) VALUES 
('Administrador', 'Acceso total al sistema'),
('Recepcionista', 'Gestión de reservas y clientes'),
('Limpieza', 'Gestión de habitaciones'),
('Restaurante', 'Gestión del restaurante'),
('Estándar', 'Cliente estándar'),
('Premium', 'Cliente premium'),
('VIP', 'Cliente VIP')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- 2. CUENTA ADMINISTRADOR (semilla del sistema)
INSERT INTO Usuario (id_rol, nombre_completo, correo_electronico, contrasena_hash, activo) 
VALUES (1, 'Administrador del Sistema', 'admin@elrefugio.com', '12345678', true)
ON DUPLICATE KEY UPDATE contrasena_hash = '12345678';

-- 3. TABLA DE REGLAS DE UPGRADE
CREATE TABLE IF NOT EXISTS ReglaUpgrade (
  id_regla INT AUTO_INCREMENT PRIMARY KEY,
  noches_desde INT NOT NULL,
  noches_hasta INT NOT NULL,
  porcentaje_premium INT NOT NULL,
  porcentaje_vip INT NOT NULL
);

INSERT INTO ReglaUpgrade (noches_desde, noches_hasta, porcentaje_premium, porcentaje_vip) VALUES 
(1, 1, 110, 140),
(2, 2, 95, 120),
(3, 3, 80, 105),
(4, 4, 70, 90),
(5, 6, 60, 75),
(7, 999, 50, 60)
ON DUPLICATE KEY UPDATE porcentaje_premium = VALUES(porcentaje_premium);

-- 4. BENEFICIOS POR TIPO DE CLIENTE
INSERT INTO Beneficio (id_rol, nombre, acceso_villas, tipo_amenidades, prioridad_reserva, politica_cancelacion) VALUES
(5, 'Estándar', false, 'Básicas', 'Normal', 'Cancelación gratuita hasta 48 hrs antes'),
(6, 'Premium', true, 'Extendidas', 'Media', 'Cancelación gratuita hasta 24 hrs antes'),
(7, 'VIP', true, 'Sin límite', 'Alta', 'Cancelación gratuita hasta el check-in')
ON DUPLICATE KEY UPDATE tipo_amenidades = VALUES(tipo_amenidades);
