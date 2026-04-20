"""
Router for FHIR Slot resources.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from ..models.slot import Slot, SlotCreate, SlotBundle
from ..models.common import OperationOutcome, FHIRIssue
from ..database import slots, schedules, new_id, build_meta

VALID_STATUSES = {"busy", "free", "busy-unavailable", "busy-tentative", "entered-in-error"}

router = APIRouter(prefix="/Slot", tags=["Slot"])


def _validate_schedule_ref(ref: str):
    if ref.startswith("Schedule/"):
        sid = ref.split("/", 1)[1]
        if sid not in schedules:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=OperationOutcome(
                    issue=[FHIRIssue(
                        severity="error", code="not-found",
                        diagnostics=f"Referenced {ref} not found"
                    )]
                ).model_dump(),
            )


@router.post("", response_model=Slot, status_code=status.HTTP_201_CREATED)
def create_slot(payload: SlotCreate):
    if payload.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=OperationOutcome(
                issue=[FHIRIssue(
                    severity="error", code="invalid",
                    diagnostics=f"Invalid slot status '{payload.status}'. Must be one of {VALID_STATUSES}"
                )]
            ).model_dump(),
        )
    _validate_schedule_ref(payload.schedule.reference or "")
    rid = new_id()
    resource = Slot(id=rid, meta=build_meta(), **payload.model_dump())
    slots[rid] = resource.model_dump()
    return resource


@router.get("", response_model=SlotBundle)
def search_slots(schedule: Optional[str] = None, status: Optional[str] = None):
    results = list(slots.values())
    if schedule:
        results = [s for s in results if (s.get("schedule") or {}).get("reference") == schedule]
    if status:
        results = [s for s in results if s.get("status") == status]
    return SlotBundle(
        total=len(results),
        entry=[{"fullUrl": f"Slot/{s['id']}", "resource": s} for s in results],
    )


@router.get("/{slot_id}", response_model=Slot)
def get_slot(slot_id: str):
    if slot_id not in slots:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Slot/{slot_id} not found")]
            ).model_dump(),
        )
    return Slot(**slots[slot_id])


@router.put("/{slot_id}", response_model=Slot)
def update_slot(slot_id: str, payload: SlotCreate):
    if slot_id not in slots:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Slot/{slot_id} not found")]
            ).model_dump(),
        )
    if payload.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=OperationOutcome(
                issue=[FHIRIssue(
                    severity="error", code="invalid",
                    diagnostics=f"Invalid slot status '{payload.status}'"
                )]
            ).model_dump(),
        )
    _validate_schedule_ref(payload.schedule.reference or "")
    existing_meta = slots[slot_id].get("meta", {})
    version = int(existing_meta.get("versionId", "1")) + 1
    meta = build_meta()
    meta["versionId"] = str(version)
    resource = Slot(id=slot_id, meta=meta, **payload.model_dump())
    slots[slot_id] = resource.model_dump()
    return resource


@router.delete("/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_slot(slot_id: str):
    if slot_id not in slots:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Slot/{slot_id} not found")]
            ).model_dump(),
        )
    del slots[slot_id]
