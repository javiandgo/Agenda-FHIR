"""
Agenda FHIR – Medical Scheduling System
========================================
A FHIR R4-compliant REST API for scheduling medical appointments.

Supported FHIR resources:
  • Patient
  • Practitioner
  • Schedule
  • Slot
  • Appointment
"""
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from .routers import patients, practitioners, schedules, slots, appointments

app = FastAPI(
    title="Agenda FHIR – Sistema de Agenda Médica",
    description=(
        "API RESTful compatible con el estándar HL7 FHIR R4 para la gestión "
        "de citas médicas. Permite registrar pacientes, profesionales de salud, "
        "horarios, turnos disponibles y citas."
    ),
    version="1.0.0",
    contact={
        "name": "Agenda FHIR",
        "url": "https://github.com/javiandgo/Agenda-FHIR",
    },
    license_info={
        "name": "MIT",
    },
)

# ─── FHIR routers ────────────────────────────────────────────────────────────
app.include_router(patients.router)
app.include_router(practitioners.router)
app.include_router(schedules.router)
app.include_router(slots.router)
app.include_router(appointments.router)


# ─── Capability Statement (metadata) ─────────────────────────────────────────
@app.get("/metadata", tags=["Capability"])
def capability_statement():
    """Returns the FHIR CapabilityStatement for this server."""
    return {
        "resourceType": "CapabilityStatement",
        "status": "active",
        "date": "2024-01-01",
        "kind": "instance",
        "fhirVersion": "4.0.1",
        "format": ["application/fhir+json", "application/json"],
        "rest": [
            {
                "mode": "server",
                "resource": [
                    {"type": "Patient",      "interaction": [{"code": "read"}, {"code": "create"}, {"code": "update"}, {"code": "delete"}, {"code": "search-type"}]},
                    {"type": "Practitioner", "interaction": [{"code": "read"}, {"code": "create"}, {"code": "update"}, {"code": "delete"}, {"code": "search-type"}]},
                    {"type": "Schedule",     "interaction": [{"code": "read"}, {"code": "create"}, {"code": "update"}, {"code": "delete"}, {"code": "search-type"}]},
                    {"type": "Slot",         "interaction": [{"code": "read"}, {"code": "create"}, {"code": "update"}, {"code": "delete"}, {"code": "search-type"}]},
                    {"type": "Appointment",  "interaction": [{"code": "read"}, {"code": "create"}, {"code": "update"}, {"code": "delete"}, {"code": "search-type"}]},
                ],
            }
        ],
    }


# ─── Root ─────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Agenda FHIR – Sistema de Agenda Médica con Estándares HL7 FHIR R4",
        "docs": "/docs",
        "metadata": "/metadata",
    }
