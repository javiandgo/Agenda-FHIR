"""
Tests for FHIR Appointment resource endpoints.
"""
from tests.conftest import (
    make_patient,
    make_practitioner,
    make_schedule,
    make_slot,
    make_appointment,
)


class TestAppointmentCreate:
    def test_create_appointment(self, client):
        patient = make_patient(client)
        prac = make_practitioner(client)
        resp = client.post("/Appointment", json={
            "status": "booked",
            "start": "2024-06-10T09:00:00Z",
            "end": "2024-06-10T09:30:00Z",
            "description": "Consulta inicial",
            "participant": [
                {"actor": {"reference": f"Patient/{patient['id']}"}, "status": "accepted"},
                {"actor": {"reference": f"Practitioner/{prac['id']}"}, "status": "accepted"},
            ],
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["resourceType"] == "Appointment"
        assert data["status"] == "booked"
        assert len(data["participant"]) == 2

    def test_create_appointment_with_slot(self, client):
        patient = make_patient(client)
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        slot = make_slot(client, sched["id"])
        appt = make_appointment(client, patient["id"], prac["id"], slot_id=slot["id"])
        assert appt["slot"][0]["reference"] == f"Slot/{slot['id']}"
        # Slot should now be marked busy
        slot_resp = client.get(f"/Slot/{slot['id']}")
        assert slot_resp.json()["status"] == "busy"

    def test_create_appointment_invalid_status_returns_422(self, client):
        patient = make_patient(client)
        prac = make_practitioner(client)
        resp = client.post("/Appointment", json={
            "status": "invalid-status",
            "participant": [
                {"actor": {"reference": f"Patient/{patient['id']}"}, "status": "accepted"},
            ],
        })
        assert resp.status_code == 422

    def test_create_appointment_invalid_participant_status_returns_422(self, client):
        patient = make_patient(client)
        resp = client.post("/Appointment", json={
            "status": "booked",
            "participant": [
                {"actor": {"reference": f"Patient/{patient['id']}"}, "status": "invalid"},
            ],
        })
        assert resp.status_code == 422

    def test_create_appointment_nonexistent_patient_returns_422(self, client):
        prac = make_practitioner(client)
        resp = client.post("/Appointment", json={
            "status": "booked",
            "participant": [
                {"actor": {"reference": "Patient/nonexistent"}, "status": "accepted"},
                {"actor": {"reference": f"Practitioner/{prac['id']}"}, "status": "accepted"},
            ],
        })
        assert resp.status_code == 422

    def test_create_appointment_nonexistent_practitioner_returns_422(self, client):
        patient = make_patient(client)
        resp = client.post("/Appointment", json={
            "status": "booked",
            "participant": [
                {"actor": {"reference": f"Patient/{patient['id']}"}, "status": "accepted"},
                {"actor": {"reference": "Practitioner/nonexistent"}, "status": "accepted"},
            ],
        })
        assert resp.status_code == 422

    def test_create_appointment_missing_participant_returns_422(self, client):
        resp = client.post("/Appointment", json={"status": "booked", "participant": []})
        assert resp.status_code == 422


class TestAppointmentRead:
    def test_get_appointment(self, client):
        patient = make_patient(client)
        prac = make_practitioner(client)
        appt = make_appointment(client, patient["id"], prac["id"])
        resp = client.get(f"/Appointment/{appt['id']}")
        assert resp.status_code == 200
        assert resp.json()["id"] == appt["id"]

    def test_get_nonexistent_returns_404(self, client):
        resp = client.get("/Appointment/nonexistent")
        assert resp.status_code == 404

    def test_search_all(self, client):
        patient = make_patient(client)
        prac = make_practitioner(client)
        make_appointment(client, patient["id"], prac["id"])
        make_appointment(client, patient["id"], prac["id"])
        resp = client.get("/Appointment")
        assert resp.status_code == 200
        assert resp.json()["total"] == 2

    def test_search_by_patient(self, client):
        patient1 = make_patient(client, family="Uno")
        patient2 = make_patient(client, family="Dos")
        prac = make_practitioner(client)
        make_appointment(client, patient1["id"], prac["id"])
        make_appointment(client, patient2["id"], prac["id"])
        resp = client.get(f"/Appointment?patient={patient1['id']}")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1

    def test_search_by_practitioner(self, client):
        patient = make_patient(client)
        prac1 = make_practitioner(client, family="Uno")
        prac2 = make_practitioner(client, family="Dos")
        make_appointment(client, patient["id"], prac1["id"])
        make_appointment(client, patient["id"], prac2["id"])
        resp = client.get(f"/Appointment?practitioner={prac1['id']}")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1

    def test_search_by_status(self, client):
        patient = make_patient(client)
        prac = make_practitioner(client)
        make_appointment(client, patient["id"], prac["id"], appt_status="booked")
        make_appointment(client, patient["id"], prac["id"], appt_status="cancelled")
        resp = client.get("/Appointment?status=cancelled")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1

    def test_search_by_date(self, client):
        patient = make_patient(client)
        prac = make_practitioner(client)
        make_appointment(client, patient["id"], prac["id"])
        resp = client.get("/Appointment?date=2024-06-10")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1


class TestAppointmentUpdate:
    def test_update_appointment_status(self, client):
        patient = make_patient(client)
        prac = make_practitioner(client)
        appt = make_appointment(client, patient["id"], prac["id"])
        resp = client.put(f"/Appointment/{appt['id']}", json={
            "status": "fulfilled",
            "start": "2024-06-10T09:00:00Z",
            "end": "2024-06-10T09:30:00Z",
            "participant": [
                {"actor": {"reference": f"Patient/{patient['id']}"}, "status": "accepted"},
                {"actor": {"reference": f"Practitioner/{prac['id']}"}, "status": "accepted"},
            ],
        })
        assert resp.status_code == 200
        assert resp.json()["status"] == "fulfilled"
        assert resp.json()["meta"]["versionId"] == "2"

    def test_update_nonexistent_returns_404(self, client):
        resp = client.put("/Appointment/nonexistent", json={
            "status": "booked",
            "participant": [{"actor": {"reference": "Patient/x"}, "status": "accepted"}],
        })
        assert resp.status_code == 404


class TestAppointmentDelete:
    def test_delete_appointment(self, client):
        patient = make_patient(client)
        prac = make_practitioner(client)
        appt = make_appointment(client, patient["id"], prac["id"])
        resp = client.delete(f"/Appointment/{appt['id']}")
        assert resp.status_code == 204
        assert client.get(f"/Appointment/{appt['id']}").status_code == 404

    def test_delete_nonexistent_returns_404(self, client):
        resp = client.delete("/Appointment/nonexistent")
        assert resp.status_code == 404


class TestCapability:
    def test_metadata_endpoint(self, client):
        resp = client.get("/metadata")
        assert resp.status_code == 200
        data = resp.json()
        assert data["resourceType"] == "CapabilityStatement"
        assert data["fhirVersion"] == "4.0.1"

    def test_root_endpoint(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        assert "FHIR" in resp.json()["message"]
