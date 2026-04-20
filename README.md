# Agenda-FHIR

Sistema de Agenda Médica con Estándares **HL7 FHIR R4**.

API RESTful construida con **Python + FastAPI** que implementa los recursos FHIR
necesarios para gestionar citas médicas: Pacientes, Profesionales de Salud,
Horarios, Turnos y Citas.

---

## Recursos FHIR implementados

| Recurso | Descripción |
|---------|-------------|
| **Patient** | Paciente que recibe atención médica |
| **Practitioner** | Profesional de salud (médico, enfermero, etc.) |
| **Schedule** | Agenda de disponibilidad de un profesional |
| **Slot** | Turno disponible dentro de una agenda |
| **Appointment** | Cita médica que asocia paciente y profesional |

Cada recurso soporta las operaciones CRUD completas (`GET`, `POST`, `PUT`, `DELETE`)
y búsqueda por parámetros relevantes.

---

## Inicio rápido

### Requisitos

- Python 3.11+
- pip

### Instalación

```bash
pip install -r requirements.txt
```

### Ejecutar el servidor

```bash
uvicorn app.main:app --reload
```

El servidor levanta en `http://localhost:8000`.

- **Documentación interactiva (Swagger UI):** `http://localhost:8000/docs`
- **Capability Statement FHIR:** `http://localhost:8000/metadata`

### Docker

```bash
docker compose up --build
```

---

## Ejecutar los tests

```bash
pytest tests/ -v
```

---

## Ejemplos de uso

### Crear un paciente

```bash
curl -X POST http://localhost:8000/Patient \
  -H "Content-Type: application/json" \
  -d '{
    "name": [{"use": "official", "family": "García", "given": ["Juan"]}],
    "gender": "male",
    "birthDate": "1990-05-15",
    "telecom": [{"system": "phone", "value": "+54911234567", "use": "mobile"}]
  }'
```

### Crear un profesional de salud

```bash
curl -X POST http://localhost:8000/Practitioner \
  -H "Content-Type: application/json" \
  -d '{
    "name": [{"use": "official", "family": "López", "given": ["Ana"]}],
    "gender": "female",
    "specialty": [{"text": "Cardiología"}]
  }'
```

### Crear una agenda (Schedule)

```bash
curl -X POST http://localhost:8000/Schedule \
  -H "Content-Type: application/json" \
  -d '{
    "actor": [{"reference": "Practitioner/<id>"}],
    "planningHorizon": {"start": "2024-06-01T00:00:00Z", "end": "2024-06-30T23:59:59Z"}
  }'
```

### Crear un turno disponible (Slot)

```bash
curl -X POST http://localhost:8000/Slot \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": {"reference": "Schedule/<id>"},
    "status": "free",
    "start": "2024-06-10T09:00:00Z",
    "end": "2024-06-10T09:30:00Z"
  }'
```

### Crear una cita médica (Appointment)

```bash
curl -X POST http://localhost:8000/Appointment \
  -H "Content-Type: application/json" \
  -d '{
    "status": "booked",
    "start": "2024-06-10T09:00:00Z",
    "end": "2024-06-10T09:30:00Z",
    "slot": [{"reference": "Slot/<id>"}],
    "description": "Consulta de rutina",
    "participant": [
      {"actor": {"reference": "Patient/<id>"}, "status": "accepted"},
      {"actor": {"reference": "Practitioner/<id>"}, "status": "accepted"}
    ]
  }'
```

---

## Estructura del proyecto

```
.
├── app/
│   ├── main.py            # Entrada de la aplicación FastAPI
│   ├── database.py        # Almacenamiento en memoria
│   ├── models/            # Modelos FHIR (Pydantic)
│   │   ├── common.py
│   │   ├── patient.py
│   │   ├── practitioner.py
│   │   ├── schedule.py
│   │   ├── slot.py
│   │   └── appointment.py
│   └── routers/           # Endpoints REST por recurso
│       ├── patients.py
│       ├── practitioners.py
│       ├── schedules.py
│       ├── slots.py
│       └── appointments.py
├── tests/                 # Suite de pruebas (pytest)
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

---

## Estándar utilizado

[HL7 FHIR R4](https://www.hl7.org/fhir/R4/) — versión 4.0.1
