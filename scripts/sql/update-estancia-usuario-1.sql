-- Actualiza el rango de estancia de la reserva CONFIRMADA mas reciente
-- del cliente asociado al usuario con id_usuario = 1.
-- Ajusta las fechas segun lo que quieras probar.

UPDATE Reserva r
INNER JOIN Cliente c ON c.id_cliente = r.id_cliente
SET
  r.fecha_checkin = '2026-05-12',
  r.fecha_checkout = '2026-05-18'
WHERE
  c.id_usuario = 1
  AND r.estado = 'CONFIRMADA'
ORDER BY r.fecha_checkin DESC
LIMIT 1;

-- Verificacion sugerida:
-- SELECT r.id_reserva, r.fecha_checkin, r.fecha_checkout, r.estado
-- FROM Reserva r
-- INNER JOIN Cliente c ON c.id_cliente = r.id_cliente
-- WHERE c.id_usuario = 1
-- ORDER BY r.fecha_checkin DESC;
