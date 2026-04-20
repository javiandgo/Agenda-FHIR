"""
FHIR Schedule resource model.

Defines the availability of a practitioner for appointments.
Reference: https://www.hl7.org/fhir/schedule.html
"""
from typing import Optional, List
from pydantic import BaseModel, Field
from .common import (
    FHIRReference,
    FHIRCodeableConcept,
    FHIRPeriod,
    FHIRIdentifier,
    FHIRMeta,
)


class ScheduleCreate(BaseModel):
    identifier: Optional[List[FHIRIdentifier]] = None
    active: Optional[bool] = True
    serviceType: Optional[List[FHIRCodeableConcept]] = None
    specialty: Optional[List[FHIRCodeableConcept]] = None
    actor: List[FHIRReference] = Field(..., min_length=1)
    planningHorizon: Optional[FHIRPeriod] = None
    comment: Optional[str] = None


class Schedule(ScheduleCreate):
    resourceType: str = "Schedule"
    id: str
    meta: Optional[FHIRMeta] = None


class ScheduleBundle(BaseModel):
    resourceType: str = "Bundle"
    type: str = "searchset"
    total: int
    entry: List[dict] = []
