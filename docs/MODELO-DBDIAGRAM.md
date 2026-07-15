# Modelo de Datos - Agenda FHIR

## Diagrama DBDiagram.io

Copia el siguiente código en [dbdiagram.io](https://dbdiagram.io) para visualizar el modelo de datos:

```dbml
Table Organization {
  id string [pk]
  name string [not null]
  identifier string [unique]
  type string [note: "prestador_o_asegurador"]
  active boolean [default: true]
  created_at timestamp
}

Table Location {
  id string [pk]
  name string [not null]
  identifier string
  organization_id string [ref: > Organization.id]
  address string
  telecom string
  status string [default: "active"]
  created_at timestamp
}

Table Practitioner {
  id string [pk]
  name string [not null]
  identifier string [unique, note: "Tarjeta_profesional"]
  speciality string
  telecom string
  active boolean [default: true]
  created_at timestamp
}

Table PractitionerRole {
  id string [pk]
  practitioner_id string [ref: > Practitioner.id, not null]
  organization_id string [ref: > Organization.id, not null]
  location_id string [ref: > Location.id]
  specialty string
  start_date date
  end_date date
  active boolean [default: true]
  created_at timestamp
}

Table HealthcareService {
  id string [pk]
  name string [not null]
  organization_id string [ref: > Organization.id, not null]
  location_id string [ref: > Location.id, not null]
  specialty string
  description string
  active boolean [default: true]
  created_at timestamp
}

Table Schedule {
  id string [pk]
  identifier string
  type string [note: "service_o_practitioner"]
  actor_id string [note: "HealthcareService.id_o_PractitionerRole.id"]
  start_date date [not null]
  end_date date [not null]
  comment string
  active boolean [default: true]
  created_at timestamp
}

Table Slot {
  id string [pk]
  schedule_id string [ref: > Schedule.id, not null]
  status string [note: "free_busy_busy-unavailable_busy-tentative"]
  start_time datetime [not null]
  end_time datetime [not null]
  comment string
  created_at timestamp
}

Table Patient {
  id string [pk]
  name string [not null]
  identifier string [unique, note: "Cedula_o_Documento"]
  date_of_birth date
  gender string [note: "male_female_other_unknown"]
  telecom string
  address string
  active boolean [default: true]
  created_at timestamp
}

Table Coverage {
  id string [pk]
  patient_id string [ref: > Patient.id, not null]
  beneficiary_id string
  payor_id string [ref: > Organization.id, not null, note: "Asegurador"]
  relationship string [note: "self_spouse_child_etc"]
  period_start date [not null]
  period_end date
  status string [default: "active"]
  created_at timestamp
}

Table ConsultationDuration {
  id string [pk]
  payor_id string [ref: > Organization.id, not null]
  consultation_type string [note: "primera_vez_control_telemedicina"]
  specialty string
  duration_minutes int [not null]
  created_at timestamp
}

Table Appointment {
  id string [pk]
  identifier string [unique]
  status string [note: "proposed_pending_booked_cancelled_etc"]
  patient_id string [ref: > Patient.id, not null]
  practitioner_id string [ref: > PractitionerRole.id]
  healthcare_service_id string [ref: > HealthcareService.id]
  location_id string [ref: > Location.id]
  slot_id string [ref: > Slot.id]
  appointment_type string [note: "CHECKUP_EMERGENCY_ROUTINE_WALKIN"]
  start_time datetime [not null]
  end_time datetime [not null]
  cancellation_reason string
  comment string
  created_at timestamp
  updated_at timestamp
}

Table AppointmentResponse {
  id string [pk]
  appointment_id string [ref: > Appointment.id, not null]
  patient_id string [ref: > Patient.id, not null]
  practitioner_id string [ref: > PractitionerRole.id]
  participation_status string [note: "accepted_declined_tentative_needs-action"]
  appointment_start datetime
  appointment_end datetime
  healthcare_service string
  comment string
  created_at timestamp
}
```

## Descripción del Modelo

### Entidades Principales

| Entidad | Descripción | FHIR Resource |
|---------|-------------|---------------|
| **Organization** | Organizaciones (prestadores y aseguradoras) | Organization |
| **Location** | Puntos de atención de ACME Salud | Location |
| **Practitioner** | Médicos especialistas | Practitioner |
| **PractitionerRole** | Relación médico-organización-especialidad | PractitionerRole |
| **HealthcareService** | Servicios de salud ofrecidos | HealthcareService |
| **Schedule** | Agendas mensuales | Schedule |
| **Slot** | Espacios de tiempo disponibles | Slot |
| **Patient** | Pacientes del sistema | Patient |
| **Coverage** | Coberturas de seguros | Coverage |
| **Appointment** | Citas agendadas | Appointment |
| **AppointmentResponse** | Respuesta a solicitud de cita | AppointmentResponse |

### Relaciones Clave

1. **Organization → Location**: Una organización tiene múltiples ubicaciones (3 clínicas)
2. **Practitioner → PractitionerRole**: Un médico puede tener múltiples roles en diferentes organizaciones
3. **HealthcareService → Location**: Cada servicio está disponible en una ubicación
4. **Schedule → Slot**: Cada agenda contiene múltiples espacios de tiempo
5. **Patient → Coverage**: Un paciente tiene cobertura con una o más aseguradoras
6. **Appointment → Slot**: Una cita ocupa un espacio de tiempo específico
7. **Appointment → Patient**: Cada cita está asociada a un paciente
8. **Appointment → PractitionerRole**: Una cita es atendida por un médico específico

### Flujo de Negocio

```
1. SETUP INICIAL
   Organization (ACME Salud) → Locations (3 clínicas)
   Practitioners (6 médicos) → PractitionerRoles
   HealthcareServices → Schedules (mensuales)
   Schedules → Slots (espacios disponibles)

2. REGISTRO DE PACIENTES
   Patient (nuevo paciente)
   Coverage (con asegurador)
   ConsultationDuration (duración según asegurador)

3. AGENDAMIENTO
   Appointment (solicitud de cita)
   Slot (asignación de espacio)
   AppointmentResponse (confirmación)

4. CANCELACIÓN
   Appointment.status = "cancelled"
   Appointment.cancellation_reason (motivo)
```

### Notas de Implementación

- **Estados de Slot**: `free` (disponible), `busy` (ocupado), `busy-unavailable` (no disponible), `busy-tentative` (tentativo)
- **Estados de Appointment**: Sigue el estándar FHIR para ciclo de vida de citas
- **Duración de Consultas**: Varía según asegurador y tipo de consulta (tabla ConsultationDuration)
- **Agendas Mensuales**: Se recomienda crear nuevos registros de Schedule al inicio de cada mes
- **Identificadores**: Usar UUIDs o IDs del sistema FHIR

### Para Importar en DBDiagram.io

1. Ve a [dbdiagram.io](https://dbdiagram.io)
2. Crea un nuevo diagrama
3. Copia el código DBML anterior en el editor
4. El diagrama se renderizará automáticamente con todas las relaciones
