"""
FHIR Patient resource model.

Represents a person receiving healthcare services.
Reference: https://www.hl7.org/fhir/patient.html
"""
from typing import Optional, List
from pydantic import BaseModel, Field
from .common import (
    FHIRHumanName,
    FHIRContactPoint,
    FHIRAddress,
    FHIRIdentifier,
    FHIRCodeableConcept,
    FHIRMeta,
)


class PatientCreate(BaseModel):
    identifier: Optional[List[FHIRIdentifier]] = None
    name: List[FHIRHumanName] = Field(..., min_length=1)
    telecom: Optional[List[FHIRContactPoint]] = None
    gender: Optional[str] = None  # male | female | other | unknown
    birthDate: Optional[str] = None  # YYYY-MM-DD
    address: Optional[List[FHIRAddress]] = None
    active: Optional[bool] = True
    maritalStatus: Optional[FHIRCodeableConcept] = None
    communication: Optional[List[dict]] = None


class Patient(PatientCreate):
    resourceType: str = "Patient"
    id: str
    meta: Optional[FHIRMeta] = None


class PatientBundle(BaseModel):
    resourceType: str = "Bundle"
    type: str = "searchset"
    total: int
    entry: List[dict] = []
