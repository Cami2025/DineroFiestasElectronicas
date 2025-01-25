<?php
// Conexión a SQLite
$db = new PDO("sqlite:montos.db");

// Obtener datos enviados desde el frontend
$nombre = $_POST['nombre'];
$monto = $_POST['monto'];

// Actualizar el monto total
$db->exec("UPDATE total SET monto_total = monto_total + $monto");

// Insertar en el historial de depósitos
$stmt = $db->prepare("INSERT INTO depositos (nombre, monto) VALUES (:nombre, :monto)");
$stmt->bindValue(':nombre', $nombre);
$stmt->bindValue(':monto', $monto);
$stmt->execute();

// Obtener el nuevo monto total
$result = $db->query("SELECT monto_total FROM total");
$total = $result->fetch(PDO::FETCH_ASSOC)['monto_total'];

echo json_encode(["success" => true, "total" => $total]);
?>
