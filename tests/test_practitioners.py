"""
Tests for FHIR Practitioner resource endpoints.
"""
from tests.conftest import make_practitioner


class TestPractitionerCreate:
    def test_create_practitioner_returns_201(self, client):
        resp = client.post("/Practitioner", json={
            "name": [{"use": "official", "family": "López", "given": ["Ana"]}],
            "gender": "female",
            "specialty": [{"text": "Cardiología"}],
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["resourceType"] == "Practitioner"
        assert "id" in data
        assert data["name"][0]["family"] == "López"

    def test_create_practitioner_missing_name_returns_422(self, client):
        resp = client.post("/Practitioner", json={"gender": "female"})
        assert resp.status_code == 422

    def test_create_with_qualification(self, client):
        resp = client.post("/Practitioner", json={
            "name": [{"family": "Torres"}],
            "qualification": [
                {"code": {"text": "Médico especialista"}}
            ],
        })
        assert resp.status_code == 201
        assert resp.json()["qualification"][0]["code"]["text"] == "Médico especialista"


class TestPractitionerRead:
    def test_get_existing_practitioner(self, client):
        prac = make_practitioner(client)
        resp = client.get(f"/Practitioner/{prac['id']}")
        assert resp.status_code == 200
        assert resp.json()["id"] == prac["id"]

    def test_get_nonexistent_returns_404(self, client):
        resp = client.get("/Practitioner/nonexistent")
        assert resp.status_code == 404

    def test_search_all(self, client):
        make_practitioner(client, family="López")
        make_practitioner(client, family="Gómez")
        resp = client.get("/Practitioner")
        assert resp.status_code == 200
        assert resp.json()["total"] == 2

    def test_search_by_name(self, client):
        make_practitioner(client, family="López")
        make_practitioner(client, family="Gómez")
        resp = client.get("/Practitioner?name=López")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1

    def test_search_by_specialty(self, client):
        make_practitioner(client, specialty_text="Cardiología")
        make_practitioner(client, specialty_text="Neurología")
        resp = client.get("/Practitioner?specialty=Cardiología")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1


class TestPractitionerUpdate:
    def test_update_practitioner(self, client):
        prac = make_practitioner(client)
        resp = client.put(f"/Practitioner/{prac['id']}", json={
            "name": [{"family": "Actualizado", "given": ["Ana"]}],
        })
        assert resp.status_code == 200
        assert resp.json()["name"][0]["family"] == "Actualizado"
        assert resp.json()["meta"]["versionId"] == "2"

    def test_update_nonexistent_returns_404(self, client):
        resp = client.put("/Practitioner/nonexistent", json={"name": [{"family": "X"}]})
        assert resp.status_code == 404


class TestPractitionerDelete:
    def test_delete_practitioner(self, client):
        prac = make_practitioner(client)
        resp = client.delete(f"/Practitioner/{prac['id']}")
        assert resp.status_code == 204
        assert client.get(f"/Practitioner/{prac['id']}").status_code == 404

    def test_delete_nonexistent_returns_404(self, client):
        resp = client.delete("/Practitioner/nonexistent")
        assert resp.status_code == 404
