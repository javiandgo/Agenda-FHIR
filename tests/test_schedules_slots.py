"""
Tests for FHIR Schedule and Slot resource endpoints.
"""
from tests.conftest import make_practitioner, make_schedule, make_slot


class TestScheduleCreate:
    def test_create_schedule(self, client):
        prac = make_practitioner(client)
        resp = client.post("/Schedule", json={
            "actor": [{"reference": f"Practitioner/{prac['id']}"}],
            "planningHorizon": {"start": "2024-06-01T00:00:00Z", "end": "2024-06-30T23:59:59Z"},
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["resourceType"] == "Schedule"
        assert data["actor"][0]["reference"] == f"Practitioner/{prac['id']}"

    def test_create_schedule_missing_actor_returns_422(self, client):
        resp = client.post("/Schedule", json={
            "planningHorizon": {"start": "2024-06-01T00:00:00Z"},
        })
        assert resp.status_code == 422

    def test_create_schedule_invalid_practitioner_ref_returns_422(self, client):
        resp = client.post("/Schedule", json={
            "actor": [{"reference": "Practitioner/nonexistent"}],
        })
        assert resp.status_code == 422


class TestScheduleRead:
    def test_get_schedule(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        resp = client.get(f"/Schedule/{sched['id']}")
        assert resp.status_code == 200
        assert resp.json()["id"] == sched["id"]

    def test_get_nonexistent_returns_404(self, client):
        resp = client.get("/Schedule/nonexistent")
        assert resp.status_code == 404

    def test_search_by_actor(self, client):
        prac1 = make_practitioner(client, family="Uno")
        prac2 = make_practitioner(client, family="Dos")
        make_schedule(client, prac1["id"])
        make_schedule(client, prac2["id"])
        resp = client.get(f"/Schedule?actor=Practitioner/{prac1['id']}")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1


class TestScheduleUpdate:
    def test_update_schedule(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        resp = client.put(f"/Schedule/{sched['id']}", json={
            "actor": [{"reference": f"Practitioner/{prac['id']}"}],
            "comment": "Agenda actualizada",
        })
        assert resp.status_code == 200
        assert resp.json()["comment"] == "Agenda actualizada"
        assert resp.json()["meta"]["versionId"] == "2"


class TestScheduleDelete:
    def test_delete_schedule(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        resp = client.delete(f"/Schedule/{sched['id']}")
        assert resp.status_code == 204

    def test_delete_nonexistent_returns_404(self, client):
        resp = client.delete("/Schedule/nonexistent")
        assert resp.status_code == 404


class TestSlotCreate:
    def test_create_free_slot(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        resp = client.post("/Slot", json={
            "schedule": {"reference": f"Schedule/{sched['id']}"},
            "status": "free",
            "start": "2024-06-10T09:00:00Z",
            "end": "2024-06-10T09:30:00Z",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["resourceType"] == "Slot"
        assert data["status"] == "free"

    def test_create_slot_invalid_status_returns_422(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        resp = client.post("/Slot", json={
            "schedule": {"reference": f"Schedule/{sched['id']}"},
            "status": "invalid-status",
            "start": "2024-06-10T09:00:00Z",
            "end": "2024-06-10T09:30:00Z",
        })
        assert resp.status_code == 422

    def test_create_slot_invalid_schedule_ref_returns_422(self, client):
        resp = client.post("/Slot", json={
            "schedule": {"reference": "Schedule/nonexistent"},
            "status": "free",
            "start": "2024-06-10T09:00:00Z",
            "end": "2024-06-10T09:30:00Z",
        })
        assert resp.status_code == 422


class TestSlotRead:
    def test_get_slot(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        slot = make_slot(client, sched["id"])
        resp = client.get(f"/Slot/{slot['id']}")
        assert resp.status_code == 200

    def test_get_nonexistent_slot_returns_404(self, client):
        resp = client.get("/Slot/nonexistent")
        assert resp.status_code == 404

    def test_search_slots_by_schedule(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        make_slot(client, sched["id"])
        make_slot(client, sched["id"], start="2024-06-10T10:00:00Z", end="2024-06-10T10:30:00Z")
        resp = client.get(f"/Slot?schedule=Schedule/{sched['id']}")
        assert resp.status_code == 200
        assert resp.json()["total"] == 2

    def test_search_slots_by_status(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        make_slot(client, sched["id"], status="free")
        make_slot(client, sched["id"], status="busy-unavailable",
                  start="2024-06-10T10:00:00Z", end="2024-06-10T10:30:00Z")
        resp = client.get("/Slot?status=free")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1


class TestSlotUpdate:
    def test_update_slot_status(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        slot = make_slot(client, sched["id"])
        resp = client.put(f"/Slot/{slot['id']}", json={
            "schedule": {"reference": f"Schedule/{sched['id']}"},
            "status": "busy-tentative",
            "start": "2024-06-10T09:00:00Z",
            "end": "2024-06-10T09:30:00Z",
        })
        assert resp.status_code == 200
        assert resp.json()["status"] == "busy-tentative"
        assert resp.json()["meta"]["versionId"] == "2"


class TestSlotDelete:
    def test_delete_slot(self, client):
        prac = make_practitioner(client)
        sched = make_schedule(client, prac["id"])
        slot = make_slot(client, sched["id"])
        resp = client.delete(f"/Slot/{slot['id']}")
        assert resp.status_code == 204

    def test_delete_nonexistent_slot_returns_404(self, client):
        resp = client.delete("/Slot/nonexistent")
        assert resp.status_code == 404
