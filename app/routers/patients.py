"""
Router for FHIR Patient resources.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from ..models.patient import Patient, PatientCreate, PatientBundle
from ..models.common import OperationOutcome, FHIRIssue
from ..database import patients, new_id, build_meta

router = APIRouter(prefix="/Patient", tags=["Patient"])


def _to_resource(data: dict) -> Patient:
    return Patient(**data)


@router.post("", response_model=Patient, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreate):
    rid = new_id()
    resource = Patient(id=rid, meta=build_meta(), **payload.model_dump())
    patients[rid] = resource.model_dump()
    return resource


@router.get("", response_model=PatientBundle)
def search_patients(name: Optional[str] = None, identifier: Optional[str] = None):
    results = list(patients.values())
    if name:
        name_lower = name.lower()
        results = [
            p for p in results
            if any(
                (n.get("text") or "").lower().find(name_lower) >= 0
                or any(g.lower().find(name_lower) >= 0 for g in (n.get("given") or []))
                or (n.get("family") or "").lower().find(name_lower) >= 0
                for n in (p.get("name") or [])
            )
        ]
    if identifier:
        results = [
            p for p in results
            if any(
                i.get("value") == identifier
                for i in (p.get("identifier") or [])
            )
        ]
    return PatientBundle(
        total=len(results),
        entry=[{"fullUrl": f"Patient/{p['id']}", "resource": p} for p in results],
    )


@router.get("/{patient_id}", response_model=Patient)
def get_patient(patient_id: str):
    if patient_id not in patients:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Patient/{patient_id} not found")]
            ).model_dump(),
        )
    return Patient(**patients[patient_id])


@router.put("/{patient_id}", response_model=Patient)
def update_patient(patient_id: str, payload: PatientCreate):
    if patient_id not in patients:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Patient/{patient_id} not found")]
            ).model_dump(),
        )
    existing_meta = patients[patient_id].get("meta", {})
    version = int(existing_meta.get("versionId", "1")) + 1
    meta = build_meta()
    meta["versionId"] = str(version)
    resource = Patient(id=patient_id, meta=meta, **payload.model_dump())
    patients[patient_id] = resource.model_dump()
    return resource


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: str):
    if patient_id not in patients:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Patient/{patient_id} not found")]
            ).model_dump(),
        )
    del patients[patient_id]
