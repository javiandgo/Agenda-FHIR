"""
FHIR Slot resource model.

Represents a specific time slot within a Schedule.
Reference: https://www.hl7.org/fhir/slot.html
"""
from typing import Optional, List
from pydantic import BaseModel, Field
from .common import (
    FHIRReference,
    FHIRCodeableConcept,
    FHIRIdentifier,
    FHIRMeta,
)


class SlotCreate(BaseModel):
    identifier: Optional[List[FHIRIdentifier]] = None
    serviceType: Optional[List[FHIRCodeableConcept]] = None
    specialty: Optional[List[FHIRCodeableConcept]] = None
    appointmentType: Optional[FHIRCodeableConcept] = None
    schedule: FHIRReference = Field(...)
    status: str = Field(...)  # busy | free | busy-unavailable | busy-tentative | entered-in-error
    start: str = Field(...)   # ISO 8601 datetime
    end: str = Field(...)     # ISO 8601 datetime
    comment: Optional[str] = None


class Slot(SlotCreate):
    resourceType: str = "Slot"
    id: str
    meta: Optional[FHIRMeta] = None


class SlotBundle(BaseModel):
    resourceType: str = "Bundle"
    type: str = "searchset"
    total: int
    entry: List[dict] = []
