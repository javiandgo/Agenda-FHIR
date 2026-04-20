# Ejemplos de Recursos FHIR - ACME Salud

Este directorio contiene ejemplos completos de recursos FHIR utilizados en el sistema de agendas de ACME Salud.

## Estructura de Archivos

```
ejemplos-fhir/
├── organization-acme-salud.json
├── organization-salud-completa.json
├── organization-salud-cooperativa.json
├── location-clinica-norte.json
├── location-clinica-centro.json
├── location-clinica-sur.json
├── practitioner-gregorio-casas.json
├── practitioner-role-casas-pediatria.json
├── healthcare-service-pediatria.json
├── schedule-casas-mayo-2026.json
├── slot-ejemplo.json
├── patient-ejemplo.json
├── coverage-ejemplo.json
├── appointment-ejemplo.json
└── appointment-response-ejemplo.json
```

## Casos de Uso

### 1. Crear una Nueva Organización

```bash
POST /api/fhir/Organization
Content-Type: application/fhir+json

# Body: Ver organization-acme-salud.json
```

### 2. Buscar Slots Disponibles

```bash
GET /api/fhir/Slot?schedule=Schedule/schedule-casas-mayo-2026&status=free&start=ge2026-05-01
```

### 3. Reservar una Cita

```bash
POST /api/fhir/Appointment
Content-Type: application/fhir+json

# Body: Ver appointment-ejemplo.json
```

### 4. Cancelar una Cita

```bash
PUT /api/fhir/Appointment/appointment-001
Content-Type: application/fhir+json

{
  "resourceType": "Appointment",
  "id": "appointment-001",
  "status": "cancelled",
  "cancelationReason": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
      "code": "pat",
      "display": "Patient"
    }],
    "text": "El paciente solicitó cancelación"
  }
}
```

## Flujo Completo de Agendamiento

### Paso 1: Paciente busca disponibilidad

```http
GET /api/fhir/Slot?
  service-type=http://snomed.info/sct|394537008&
  status=free&
  start=ge2026-05-01&
  start=le2026-05-31
```

**Respuesta:**

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 45,
  "entry": [
    {
      "resource": {
        "resourceType": "Slot",
        "id": "slot-20260505-0800",
        "schedule": {
          "reference": "Schedule/schedule-casas-mayo-2026"
        },
        "status": "free",
        "start": "2026-05-05T08:00:00Z",
        "end": "2026-05-05T08:45:00Z"
      }
    }
  ]
}
```

### Paso 2: Crear Appointment

```http
POST /api/fhir/Appointment
Content-Type: application/fhir+json

{
  "resourceType": "Appointment",
  "status": "proposed",
  "slot": [
    {"reference": "Slot/slot-20260505-0800"}
  ],
  "participant": [
    {
      "actor": {"reference": "Patient/patient-12345"},
      "status": "accepted"
    }
  ]
}
```

### Paso 3: Sistema Confirma

```json
{
  "resourceType": "Appointment",
  "id": "appointment-001",
  "status": "booked",
  "start": "2026-05-05T08:00:00Z",
  "end": "2026-05-05T08:45:00Z"
}
```

### Paso 4: Generar AppointmentResponse

```json
{
  "resourceType": "AppointmentResponse",
  "id": "response-001",
  "appointment": { "reference": "Appointment/appointment-001" },
  "participantStatus": "accepted",
  "comment": "Cita confirmada para el 5 de mayo a las 8:00 AM"
}
```

## Validación de Recursos

Todos los recursos FHIR deben validarse contra el esquema oficial:

```bash
# Usando FHIR Validator CLI
java -jar validator_cli.jar organization-acme-salud.json -version 4.0
```

O mediante el servicio online:
https://validator.fhir.org/

## Referencias

- [FHIR Resource Index](https://www.hl7.org/fhir/resourcelist.html)
- [FHIR Search](https://www.hl7.org/fhir/search.html)
- [FHIR Data Types](https://www.hl7.org/fhir/datatypes.html)
