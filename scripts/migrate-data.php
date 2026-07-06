<?php
/**
 * Script de migración de datos desde MySQL/Laravel a HAPI FHIR
 *
 * Uso:
 *   php scripts/migrate-data.php
 *
 * Requisitos:
 *   - PHP 8.1+ con extension pdo_mysql
 *   - HAPI FHIR corriendo en http://localhost:8080/fhir
 *   - MySQL con la base de datos agenda_fhir y tabla fhir_resources
 */

$mysqlHost = '127.0.0.1';
$mysqlPort = 3306;
$mysqlDb   = 'agenda_fhir';
$mysqlUser = 'root';
$mysqlPass = '1122648225';

$hapiBase = 'http://localhost:8080/fhir';

$dsn = "mysql:host={$mysqlHost};port={$mysqlPort};dbname={$mysqlDb};charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $mysqlUser, $mysqlPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    echo "✓ Conectado a MySQL: {$mysqlDb}\n";
} catch (PDOException $e) {
    die("✗ Error de conexión MySQL: " . $e->getMessage() . "\n");
}

$stmt = $pdo->query("SELECT resource_type, id, data FROM fhir_resources ORDER BY 
    FIELD(resource_type, 'Organization', 'Location', 'Practitioner', 'PractitionerRole', 
           'HealthcareService', 'Schedule', 'Slot', 'Patient', 'Coverage', 
           'Appointment', 'AppointmentResponse'),
    created_at ASC");

$resources = $stmt->fetchAll();

if (empty($resources)) {
    die("✗ No se encontraron recursos en fhir_resources\n");
}

echo "✓ Se encontraron " . count($resources) . " recursos para migrar\n\n";

$success = 0;
$errors = 0;
$types = [];

foreach ($resources as $row) {
    $type = $row['resource_type'];
    $id = $row['id'];
    $data = json_decode($row['data'], true);

    if (!$data) {
        echo "  ✗ {$type}/{$id}: datos JSON inválidos\n";
        $errors++;
        continue;
    }

    $types[$type] = ($types[$type] ?? 0) + 1;
    $url = "{$hapiBase}/{$type}/{$id}";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => 'PUT',
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/fhir+json',
            'Accept: application/fhir+json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo "  ✓ {$type}/{$id} → {$httpCode}\n";
        $success++;
    } else {
        $body = json_decode($response, true);
        $diag = $body['issue'][0]['diagnostics'] ?? $response;
        echo "  ✗ {$type}/{$id} → {$httpCode}: {$diag}\n";
        $errors++;
    }
}

echo "\n─────────────────────────────────\n";
echo "Resumen:\n";
echo "  Total recursos: " . count($resources) . "\n";
echo "  Migrados:       {$success}\n";
echo "  Errores:        {$errors}\n";

foreach ($types as $type => $count) {
    echo "  - {$type}: {$count}\n";
}
echo "─────────────────────────────────\n";

if ($errors === 0) {
    echo "\n✓ Migración completada exitosamente.\n";
    echo "  HAPI FHIR disponible en: {$hapiBase}/metadata\n";
} else {
    echo "\n⚠ Migración completada con {$errors} errores.\n";
}
