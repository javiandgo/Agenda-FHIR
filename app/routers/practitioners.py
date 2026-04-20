"""
Router for FHIR Practitioner resources.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from ..models.practitioner import Practitioner, PractitionerCreate, PractitionerBundle
from ..models.common import OperationOutcome, FHIRIssue
from ..database import practitioners, new_id, build_meta

router = APIRouter(prefix="/Practitioner", tags=["Practitioner"])


@router.post("", response_model=Practitioner, status_code=status.HTTP_201_CREATED)
def create_practitioner(payload: PractitionerCreate):
    rid = new_id()
    resource = Practitioner(id=rid, meta=build_meta(), **payload.model_dump())
    practitioners[rid] = resource.model_dump()
    return resource


@router.get("", response_model=PractitionerBundle)
def search_practitioners(name: Optional[str] = None, specialty: Optional[str] = None):
    results = list(practitioners.values())
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
    if specialty:
        spec_lower = specialty.lower()
        results = [
            p for p in results
            if any(
                any(
                    (c.get("display") or "").lower().find(spec_lower) >= 0
                    or (c.get("code") or "").lower().find(spec_lower) >= 0
                    for c in (s.get("coding") or [])
                )
                or (s.get("text") or "").lower().find(spec_lower) >= 0
                for s in (p.get("specialty") or [])
            )
        ]
    return PractitionerBundle(
        total=len(results),
        entry=[{"fullUrl": f"Practitioner/{p['id']}", "resource": p} for p in results],
    )


@router.get("/{practitioner_id}", response_model=Practitioner)
def get_practitioner(practitioner_id: str):
    if practitioner_id not in practitioners:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Practitioner/{practitioner_id} not found")]
            ).model_dump(),
        )
    return Practitioner(**practitioners[practitioner_id])


@router.put("/{practitioner_id}", response_model=Practitioner)
def update_practitioner(practitioner_id: str, payload: PractitionerCreate):
    if practitioner_id not in practitioners:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Practitioner/{practitioner_id} not found")]
            ).model_dump(),
        )
    existing_meta = practitioners[practitioner_id].get("meta", {})
    version = int(existing_meta.get("versionId", "1")) + 1
    meta = build_meta()
    meta["versionId"] = str(version)
    resource = Practitioner(id=practitioner_id, meta=meta, **payload.model_dump())
    practitioners[practitioner_id] = resource.model_dump()
    return resource


@router.delete("/{practitioner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_practitioner(practitioner_id: str):
    if practitioner_id not in practitioners:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Practitioner/{practitioner_id} not found")]
            ).model_dump(),
        )
    del practitioners[practitioner_id]
