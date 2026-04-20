"""
FHIR Appointment resource model.

Represents a booking of a healthcare event.
Reference: https://www.hl7.org/fhir/appointment.html
"""
from typing import Optional, List
from pydantic import BaseModel, Field
from .common import (
    FHIRReference,
    FHIRCodeableConcept,
    FHIRIdentifier,
    FHIRMeta,
)

VALID_STATUSES = {
    "proposed",
    "pending",
    "booked",
    "arrived",
    "fulfilled",
    "cancelled",
    "noshow",
    "entered-in-error",
    "checked-in",
    "waitlist",
}

VALID_PARTICIPANT_STATUSES = {"accepted", "declined", "tentative", "needs-action"}


class AppointmentParticipant(BaseModel):
    type: Optional[List[FHIRCodeableConcept]] = None
    actor: Optional[FHIRReference] = None
    required: Optional[str] = None  # required | optional | information-only
    status: str  # accepted | declined | tentative | needs-action


class AppointmentCreate(BaseModel):
    identifier: Optional[List[FHIRIdentifier]] = None
    status: str = Field(...)
    serviceType: Optional[List[FHIRCodeableConcept]] = None
    specialty: Optional[List[FHIRCodeableConcept]] = None
    appointmentType: Optional[FHIRCodeableConcept] = None
    reasonCode: Optional[List[FHIRCodeableConcept]] = None
    description: Optional[str] = None
    start: Optional[str] = None    # ISO 8601 datetime
    end: Optional[str] = None      # ISO 8601 datetime
    slot: Optional[List[FHIRReference]] = None
    comment: Optional[str] = None
    participant: List[AppointmentParticipant] = Field(..., min_length=1)


class Appointment(AppointmentCreate):
    resourceType: str = "Appointment"
    id: str
    meta: Optional[FHIRMeta] = None


class AppointmentBundle(BaseModel):
    resourceType: str = "Bundle"
    type: str = "searchset"
    total: int
    entry: List[dict] = []
