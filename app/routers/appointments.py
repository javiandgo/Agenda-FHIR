"""
Router for FHIR Appointment resources.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from ..models.appointment import (
    Appointment,
    AppointmentCreate,
    AppointmentBundle,
    VALID_STATUSES,
    VALID_PARTICIPANT_STATUSES,
)
from ..models.common import OperationOutcome, FHIRIssue
from ..database import appointments, patients, practitioners, slots, new_id, build_meta

router = APIRouter(prefix="/Appointment", tags=["Appointment"])


def _validate_participant(participant: dict):
    actor = participant.get("actor") or {}
    ref = actor.get("reference") or ""
    if ref.startswith("Patient/"):
        pid = ref.split("/", 1)[1]
        if pid not in patients:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=OperationOutcome(
                    issue=[FHIRIssue(
                        severity="error", code="not-found",
                        diagnostics=f"Referenced {ref} not found"
                    )]
                ).model_dump(),
            )
    elif ref.startswith("Practitioner/"):
        pid = ref.split("/", 1)[1]
        if pid not in practitioners:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=OperationOutcome(
                    issue=[FHIRIssue(
                        severity="error", code="not-found",
                        diagnostics=f"Referenced {ref} not found"
                    )]
                ).model_dump(),
            )
    part_status = participant.get("status")
    if part_status not in VALID_PARTICIPANT_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=OperationOutcome(
                issue=[FHIRIssue(
                    severity="error", code="invalid",
                    diagnostics=f"Invalid participant status '{part_status}'"
                )]
            ).model_dump(),
        )


def _validate_slot_refs(slot_refs: list):
    for slot_ref in slot_refs:
        ref = slot_ref.get("reference") or ""
        if ref.startswith("Slot/"):
            sid = ref.split("/", 1)[1]
            if sid not in slots:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=OperationOutcome(
                        issue=[FHIRIssue(
                            severity="error", code="not-found",
                            diagnostics=f"Referenced {ref} not found"
                        )]
                    ).model_dump(),
                )


@router.post("", response_model=Appointment, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate):
    if payload.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=OperationOutcome(
                issue=[FHIRIssue(
                    severity="error", code="invalid",
                    diagnostics=f"Invalid appointment status '{payload.status}'"
                )]
            ).model_dump(),
        )
    for p in payload.participant:
        _validate_participant(p.model_dump())
    if payload.slot:
        _validate_slot_refs([s.model_dump() for s in payload.slot])
    rid = new_id()
    resource = Appointment(id=rid, meta=build_meta(), **payload.model_dump())
    appointments[rid] = resource.model_dump()

    # Mark referenced slots as busy
    if payload.slot:
        for slot_ref in payload.slot:
            ref = slot_ref.reference or ""
            if ref.startswith("Slot/"):
                sid = ref.split("/", 1)[1]
                if sid in slots:
                    slots[sid]["status"] = "busy"

    return resource


@router.get("", response_model=AppointmentBundle)
def search_appointments(
    patient: Optional[str] = None,
    practitioner: Optional[str] = None,
    status: Optional[str] = None,
    date: Optional[str] = None,
):
    results = list(appointments.values())
    if patient:
        results = [
            a for a in results
            if any(
                (p.get("actor") or {}).get("reference") == f"Patient/{patient}"
                for p in (a.get("participant") or [])
            )
        ]
    if practitioner:
        results = [
            a for a in results
            if any(
                (p.get("actor") or {}).get("reference") == f"Practitioner/{practitioner}"
                for p in (a.get("participant") or [])
            )
        ]
    if status:
        results = [a for a in results if a.get("status") == status]
    if date:
        results = [
            a for a in results
            if (a.get("start") or "").startswith(date)
        ]
    return AppointmentBundle(
        total=len(results),
        entry=[{"fullUrl": f"Appointment/{a['id']}", "resource": a} for a in results],
    )


@router.get("/{appointment_id}", response_model=Appointment)
def get_appointment(appointment_id: str):
    if appointment_id not in appointments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Appointment/{appointment_id} not found")]
            ).model_dump(),
        )
    return Appointment(**appointments[appointment_id])


@router.put("/{appointment_id}", response_model=Appointment)
def update_appointment(appointment_id: str, payload: AppointmentCreate):
    if appointment_id not in appointments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Appointment/{appointment_id} not found")]
            ).model_dump(),
        )
    if payload.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=OperationOutcome(
                issue=[FHIRIssue(
                    severity="error", code="invalid",
                    diagnostics=f"Invalid appointment status '{payload.status}'"
                )]
            ).model_dump(),
        )
    for p in payload.participant:
        _validate_participant(p.model_dump())
    if payload.slot:
        _validate_slot_refs([s.model_dump() for s in payload.slot])
    existing_meta = appointments[appointment_id].get("meta", {})
    version = int(existing_meta.get("versionId", "1")) + 1
    meta = build_meta()
    meta["versionId"] = str(version)
    resource = Appointment(id=appointment_id, meta=meta, **payload.model_dump())
    appointments[appointment_id] = resource.model_dump()
    return resource


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: str):
    if appointment_id not in appointments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Appointment/{appointment_id} not found")]
            ).model_dump(),
        )
    del appointments[appointment_id]
