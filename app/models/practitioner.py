"""
FHIR Practitioner resource model.

Represents a person who is directly or indirectly involved
in the provisioning of healthcare.
Reference: https://www.hl7.org/fhir/practitioner.html
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


class PractitionerQualification(BaseModel):
    identifier: Optional[List[FHIRIdentifier]] = None
    code: FHIRCodeableConcept
    period: Optional[dict] = None
    issuer: Optional[dict] = None


class PractitionerCreate(BaseModel):
    identifier: Optional[List[FHIRIdentifier]] = None
    name: List[FHIRHumanName] = Field(..., min_length=1)
    telecom: Optional[List[FHIRContactPoint]] = None
    address: Optional[List[FHIRAddress]] = None
    gender: Optional[str] = None  # male | female | other | unknown
    birthDate: Optional[str] = None  # YYYY-MM-DD
    active: Optional[bool] = True
    qualification: Optional[List[PractitionerQualification]] = None
    specialty: Optional[List[FHIRCodeableConcept]] = None


class Practitioner(PractitionerCreate):
    resourceType: str = "Practitioner"
    id: str
    meta: Optional[FHIRMeta] = None


class PractitionerBundle(BaseModel):
    resourceType: str = "Bundle"
    type: str = "searchset"
    total: int
    entry: List[dict] = []
