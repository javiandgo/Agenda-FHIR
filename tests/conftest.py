"""
Shared pytest fixtures for the Agenda FHIR test suite.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app
import app.database as db


@pytest.fixture(autouse=True)
def clear_db():
    """Reset all in-memory stores before each test."""
    db.patients.clear()
    db.practitioners.clear()
    db.schedules.clear()
    db.slots.clear()
    db.appointments.clear()
    yield


@pytest.fixture
def client():
    return TestClient(app)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def make_patient(client, family="García", given=None):
    payload = {
        "name": [{"use": "official", "family": family, "given": given or ["Juan"]}],
        "gender": "male",
        "birthDate": "1990-05-15",
    }
    resp = client.post("/Patient", json=payload)
    assert resp.status_code == 201
    return resp.json()


def make_practitioner(client, family="López", specialty_text="Cardiología"):
    payload = {
        "name": [{"use": "official", "family": family, "given": ["Ana"]}],
        "gender": "female",
        "specialty": [{"text": specialty_text}],
    }
    resp = client.post("/Practitioner", json=payload)
    assert resp.status_code == 201
    return resp.json()


def make_schedule(client, practitioner_id):
    payload = {
        "actor": [{"reference": f"Practitioner/{practitioner_id}"}],
        "planningHorizon": {"start": "2024-06-01T00:00:00Z", "end": "2024-06-30T23:59:59Z"},
        "comment": "Agenda de junio",
    }
    resp = client.post("/Schedule", json=payload)
    assert resp.status_code == 201
    return resp.json()


def make_slot(client, schedule_id, status="free",
              start="2024-06-10T09:00:00Z", end="2024-06-10T09:30:00Z"):
    payload = {
        "schedule": {"reference": f"Schedule/{schedule_id}"},
        "status": status,
        "start": start,
        "end": end,
    }
    resp = client.post("/Slot", json=payload)
    assert resp.status_code == 201
    return resp.json()


def make_appointment(client, patient_id, practitioner_id, slot_id=None,
                     appt_status="booked"):
    payload = {
        "status": appt_status,
        "start": "2024-06-10T09:00:00Z",
        "end": "2024-06-10T09:30:00Z",
        "description": "Consulta de rutina",
        "participant": [
            {"actor": {"reference": f"Patient/{patient_id}"}, "status": "accepted"},
            {"actor": {"reference": f"Practitioner/{practitioner_id}"}, "status": "accepted"},
        ],
    }
    if slot_id:
        payload["slot"] = [{"reference": f"Slot/{slot_id}"}]
    resp = client.post("/Appointment", json=payload)
    assert resp.status_code == 201
    return resp.json()
