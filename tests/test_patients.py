"""
Tests for FHIR Patient resource endpoints.
"""
from tests.conftest import make_patient


class TestPatientCreate:
    def test_create_patient_returns_201(self, client):
        resp = client.post("/Patient", json={
            "name": [{"use": "official", "family": "García", "given": ["Juan"]}],
            "gender": "male",
            "birthDate": "1990-05-15",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["resourceType"] == "Patient"
        assert "id" in data
        assert data["name"][0]["family"] == "García"
        assert data["meta"]["versionId"] == "1"

    def test_create_patient_missing_name_returns_422(self, client):
        resp = client.post("/Patient", json={"gender": "male"})
        assert resp.status_code == 422

    def test_create_patient_with_identifiers(self, client):
        resp = client.post("/Patient", json={
            "name": [{"family": "Pérez", "given": ["María"]}],
            "identifier": [{"system": "http://hospital.example/mrn", "value": "MRN-001"}],
        })
        assert resp.status_code == 201
        assert resp.json()["identifier"][0]["value"] == "MRN-001"


class TestPatientRead:
    def test_get_existing_patient(self, client):
        patient = make_patient(client)
        resp = client.get(f"/Patient/{patient['id']}")
        assert resp.status_code == 200
        assert resp.json()["id"] == patient["id"]

    def test_get_nonexistent_patient_returns_404(self, client):
        resp = client.get("/Patient/nonexistent-id")
        assert resp.status_code == 404

    def test_search_patients_empty(self, client):
        resp = client.get("/Patient")
        assert resp.status_code == 200
        data = resp.json()
        assert data["resourceType"] == "Bundle"
        assert data["total"] == 0

    def test_search_patients_by_name(self, client):
        make_patient(client, family="García")
        make_patient(client, family="Rodríguez")
        resp = client.get("/Patient?name=García")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 1
        assert data["entry"][0]["resource"]["name"][0]["family"] == "García"

    def test_search_patients_by_given_name(self, client):
        make_patient(client, given=["Carlos"])
        make_patient(client, given=["Pedro"])
        resp = client.get("/Patient?name=Carlos")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1

    def test_search_patients_by_identifier(self, client):
        client.post("/Patient", json={
            "name": [{"family": "Test"}],
            "identifier": [{"system": "http://example.com", "value": "ID-999"}],
        })
        resp = client.get("/Patient?identifier=ID-999")
        assert resp.status_code == 200
        assert resp.json()["total"] == 1


class TestPatientUpdate:
    def test_update_patient(self, client):
        patient = make_patient(client)
        resp = client.put(f"/Patient/{patient['id']}", json={
            "name": [{"family": "Actualizado", "given": ["Juan"]}],
            "gender": "male",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"][0]["family"] == "Actualizado"
        assert data["meta"]["versionId"] == "2"

    def test_update_nonexistent_patient_returns_404(self, client):
        resp = client.put("/Patient/nonexistent", json={
            "name": [{"family": "X"}],
        })
        assert resp.status_code == 404


class TestPatientDelete:
    def test_delete_patient(self, client):
        patient = make_patient(client)
        resp = client.delete(f"/Patient/{patient['id']}")
        assert resp.status_code == 204
        assert client.get(f"/Patient/{patient['id']}").status_code == 404

    def test_delete_nonexistent_patient_returns_404(self, client):
        resp = client.delete("/Patient/nonexistent")
        assert resp.status_code == 404
