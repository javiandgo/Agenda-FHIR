"""
Router for FHIR Schedule resources.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from ..models.schedule import Schedule, ScheduleCreate, ScheduleBundle
from ..models.common import OperationOutcome, FHIRIssue
from ..database import schedules, practitioners, new_id, build_meta

router = APIRouter(prefix="/Schedule", tags=["Schedule"])


def _validate_actors(actors: list):
    """Ensure referenced practitioners exist."""
    for actor in actors:
        ref = (actor.get("reference") or "")
        if ref.startswith("Practitioner/"):
            pid = ref.split("/", 1)[1]
            if pid not in practitioners:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=OperationOutcome(
                        issue=[FHIRIssue(
                            severity="error", code="not-found",
                            diagnostics=f"Referenced Practitioner/{pid} not found"
                        )]
                    ).model_dump(),
                )


@router.post("", response_model=Schedule, status_code=status.HTTP_201_CREATED)
def create_schedule(payload: ScheduleCreate):
    actor_dicts = [a.model_dump() for a in payload.actor]
    _validate_actors(actor_dicts)
    rid = new_id()
    resource = Schedule(id=rid, meta=build_meta(), **payload.model_dump())
    schedules[rid] = resource.model_dump()
    return resource


@router.get("", response_model=ScheduleBundle)
def search_schedules(actor: Optional[str] = None):
    results = list(schedules.values())
    if actor:
        results = [
            s for s in results
            if any(a.get("reference") == actor for a in (s.get("actor") or []))
        ]
    return ScheduleBundle(
        total=len(results),
        entry=[{"fullUrl": f"Schedule/{s['id']}", "resource": s} for s in results],
    )


@router.get("/{schedule_id}", response_model=Schedule)
def get_schedule(schedule_id: str):
    if schedule_id not in schedules:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Schedule/{schedule_id} not found")]
            ).model_dump(),
        )
    return Schedule(**schedules[schedule_id])


@router.put("/{schedule_id}", response_model=Schedule)
def update_schedule(schedule_id: str, payload: ScheduleCreate):
    if schedule_id not in schedules:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Schedule/{schedule_id} not found")]
            ).model_dump(),
        )
    actor_dicts = [a.model_dump() for a in payload.actor]
    _validate_actors(actor_dicts)
    existing_meta = schedules[schedule_id].get("meta", {})
    version = int(existing_meta.get("versionId", "1")) + 1
    meta = build_meta()
    meta["versionId"] = str(version)
    resource = Schedule(id=schedule_id, meta=meta, **payload.model_dump())
    schedules[schedule_id] = resource.model_dump()
    return resource


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(schedule_id: str):
    if schedule_id not in schedules:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=OperationOutcome(
                issue=[FHIRIssue(severity="error", code="not-found",
                                 diagnostics=f"Schedule/{schedule_id} not found")]
            ).model_dump(),
        )
    del schedules[schedule_id]
