"""
FHIR common data types and base structures.
"""
from typing import Optional, List
from pydantic import BaseModel, Field


class FHIRCoding(BaseModel):
    system: Optional[str] = None
    code: Optional[str] = None
    display: Optional[str] = None


class FHIRCodeableConcept(BaseModel):
    coding: Optional[List[FHIRCoding]] = None
    text: Optional[str] = None


class FHIRHumanName(BaseModel):
    use: Optional[str] = None  # official | usual | temp | nickname | anonymous | old | maiden
    text: Optional[str] = None
    family: Optional[str] = None
    given: Optional[List[str]] = None
    prefix: Optional[List[str]] = None
    suffix: Optional[List[str]] = None


class FHIRContactPoint(BaseModel):
    system: Optional[str] = None  # phone | fax | email | pager | url | sms | other
    value: Optional[str] = None
    use: Optional[str] = None  # home | work | temp | old | mobile


class FHIRAddress(BaseModel):
    use: Optional[str] = None  # home | work | temp | old | billing
    type: Optional[str] = None  # postal | physical | both
    text: Optional[str] = None
    line: Optional[List[str]] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postalCode: Optional[str] = None
    country: Optional[str] = None


class FHIRIdentifier(BaseModel):
    system: Optional[str] = None
    value: Optional[str] = None
    use: Optional[str] = None


class FHIRReference(BaseModel):
    reference: Optional[str] = None
    display: Optional[str] = None


class FHIRPeriod(BaseModel):
    start: Optional[str] = None
    end: Optional[str] = None


class FHIRMeta(BaseModel):
    versionId: Optional[str] = None
    lastUpdated: Optional[str] = None


class FHIRIssue(BaseModel):
    severity: str  # fatal | error | warning | information
    code: str
    details: Optional[FHIRCodeableConcept] = None
    diagnostics: Optional[str] = None


class OperationOutcome(BaseModel):
    resourceType: str = "OperationOutcome"
    issue: List[FHIRIssue]
