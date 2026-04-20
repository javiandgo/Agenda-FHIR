"""
In-memory storage for FHIR resources.

In a production environment this would be replaced by a persistent
database (e.g. PostgreSQL with the HAPI FHIR server, or any SQL/NoSQL store).
"""
import uuid
from datetime import datetime, timezone
from typing import Dict, Any


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def new_id() -> str:
    return str(uuid.uuid4())


def build_meta() -> dict:
    return {"versionId": "1", "lastUpdated": _now_iso()}


# Simple dict-based stores keyed by resource id
patients: Dict[str, Any] = {}
practitioners: Dict[str, Any] = {}
schedules: Dict[str, Any] = {}
slots: Dict[str, Any] = {}
appointments: Dict[str, Any] = {}
