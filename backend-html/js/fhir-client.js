// ==========================================
// ACME Salud - FHIR Client Simulado
// Gestión de recursos FHIR en localStorage
// ==========================================

const FHIR_BASE = 'fhir_db';

// ==========================================
// Inicialización de datos demo
// ==========================================
function initFHIRData() {
  if (localStorage.getItem(`${FHIR_BASE}_initialized`)) return;

  // Organizations
  setResources('Organization', [
    { resourceType: 'Organization', id: 'org-acme', identifier: [{ system: 'urn:co:nit', value: '900123456-7' }],
      active: true, type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/organization-type', code: 'prov', display: 'Healthcare Provider' }] }],
      name: 'ACME Salud S.A.', alias: ['ACME'], telecom: [{ system: 'phone', value: '+57 1 3456789' }, { system: 'email', value: 'contacto@acmesalud.co' }],
      address: [{ line: ['Cra 7 # 45-21'], city: 'Bogotá', postalCode: '110111', country: 'CO' }] },
    { resourceType: 'Organization', id: 'org-sanitas', identifier: [{ system: 'urn:co:nit', value: '800123001-5' }],
      active: true, type: [{ coding: [{ code: 'ins', display: 'Insurance Company' }] }],
      name: 'EPS Sanitas', alias: ['Sanitas'], telecom: [{ system: 'phone', value: '+57 1 7654321' }],
      address: [{ line: ['Av El Dorado # 68B-85'], city: 'Bogotá', country: 'CO' }] },
    { resourceType: 'Organization', id: 'org-compensar', identifier: [{ system: 'urn:co:nit', value: '860007336-3' }],
      active: true, type: [{ coding: [{ code: 'ins', display: 'Insurance Company' }] }],
      name: 'EPS Compensar', alias: ['Compensar'], telecom: [{ system: 'phone', value: '+57 1 3078000' }],
      address: [{ line: ['Av 68 # 49B-36'], city: 'Bogotá', country: 'CO' }] },
  ]);

  // Patients
  setResources('Patient', [
    { resourceType: 'Patient', id: 'pat-001', identifier: [{ system: 'urn:co:cc', value: '1020123456', type: { text: 'Cédula de Ciudadanía' } }],
      active: true, name: [{ use: 'official', family: 'Rodríguez', given: ['María', 'Fernanda'] }],
      telecom: [{ system: 'phone', value: '+57 310 5678901' }, { system: 'email', value: 'mfrodriguez@correo.co' }],
      gender: 'female', birthDate: '1990-03-15',
      address: [{ line: ['Calle 45 # 12-30 Apto 203'], city: 'Bogotá', country: 'CO' }] },
    { resourceType: 'Patient', id: 'pat-002', identifier: [{ system: 'urn:co:cc', value: '79987654', type: { text: 'Cédula de Ciudadanía' } }],
      active: true, name: [{ use: 'official', family: 'Gómez', given: ['Carlos', 'Andrés'] }],
      telecom: [{ system: 'phone', value: '+57 320 1234567' }, { system: 'email', value: 'cagomez@mail.co' }],
      gender: 'male', birthDate: '1985-07-22',
      address: [{ line: ['Carrera 15 # 80-10'], city: 'Bogotá', country: 'CO' }] },
    { resourceType: 'Patient', id: 'pat-003', identifier: [{ system: 'urn:co:cc', value: '52456789', type: { text: 'Cédula de Ciudadanía' } }],
      active: true, name: [{ use: 'official', family: 'Martínez', given: ['Luisa', 'Carolina'] }],
      telecom: [{ system: 'phone', value: '+57 315 9876543' }, { system: 'email', value: 'lcmartinez@email.co' }],
      gender: 'female', birthDate: '1995-11-08',
      address: [{ line: ['Transversal 28 # 55-90'], city: 'Medellín', country: 'CO' }] },
  ]);

  // Coverage
  setResources('Coverage', [
    { resourceType: 'Coverage', id: 'cov-001', status: 'active',
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'PUBLICPOL', display: 'Contributivo' }] },
      subscriber: { reference: 'Patient/pat-001' },
      beneficiary: { reference: 'Patient/pat-001' },
      payor: [{ reference: 'Organization/org-sanitas', display: 'EPS Sanitas' }],
      period: { start: '2026-01-01', end: '2026-12-31' },
      class: [{ type: { coding: [{ code: 'plan' }] }, value: 'PLAN-CONTRIB-A', name: 'Plan Contributivo Nivel A' }],
      _consultaDuracion: 20 },
    { resourceType: 'Coverage', id: 'cov-002', status: 'active',
      type: { coding: [{ code: 'SUBSIDPAD', display: 'Subsidiado' }] },
      subscriber: { reference: 'Patient/pat-002' },
      beneficiary: { reference: 'Patient/pat-002' },
      payor: [{ reference: 'Organization/org-compensar', display: 'EPS Compensar' }],
      period: { start: '2026-01-01', end: '2026-12-31' },
      class: [{ type: { coding: [{ code: 'plan' }] }, value: 'PLAN-SUB-B', name: 'Plan Subsidiado Nivel B' }],
      _consultaDuracion: 15 },
    { resourceType: 'Coverage', id: 'cov-003', status: 'active',
      type: { coding: [{ code: 'PUBLICPOL', display: 'Contributivo' }] },
      subscriber: { reference: 'Patient/pat-003' },
      beneficiary: { reference: 'Patient/pat-003' },
      payor: [{ reference: 'Organization/org-sanitas', display: 'EPS Sanitas' }],
      period: { start: '2026-01-01', end: '2026-12-31' },
      class: [{ type: { coding: [{ code: 'plan' }] }, value: 'PLAN-CONTRIB-A', name: 'Plan Contributivo Nivel A' }],
      _consultaDuracion: 20 },
  ]);

  // Practitioners
  setResources('Practitioner', [
    { resourceType: 'Practitioner', id: 'prac-casas',
      identifier: [{ system: 'urn:co:tarjeta-profesional', value: '111222333', type: { text: 'Tarjeta Profesional' } },
                   { system: 'urn:co:cc', value: '79123456', type: { text: 'Cédula' } }],
      active: true, name: [{ use: 'official', family: 'Casas', given: ['Gregorio'], prefix: ['Dr.'] }],
      telecom: [{ system: 'phone', value: '+57 300 1234567' }, { system: 'email', value: 'gcasas@acmesalud.co' }],
      gender: 'male', birthDate: '1975-05-12',
      qualification: [{ code: { coding: [{ system: 'http://snomed.info/sct', code: '394537008', display: 'Pediatría' }], text: 'Especialista en Pediatría' } }] },
    { resourceType: 'Practitioner', id: 'prac-torres',
      identifier: [{ system: 'urn:co:tarjeta-profesional', value: '444555666', type: { text: 'Tarjeta Profesional' } },
                   { system: 'urn:co:cc', value: '52345678', type: { text: 'Cédula' } }],
      active: true, name: [{ use: 'official', family: 'Torres', given: ['Ana', 'María'], prefix: ['Dra.'] }],
      telecom: [{ system: 'phone', value: '+57 315 9876543' }, { system: 'email', value: 'amtorres@acmesalud.co' }],
      gender: 'female', birthDate: '1980-09-20',
      qualification: [{ code: { coding: [{ system: 'http://snomed.info/sct', code: '394814009', display: 'Medicina General' }], text: 'Médica General' } }] },
    { resourceType: 'Practitioner', id: 'prac-mendez',
      identifier: [{ system: 'urn:co:tarjeta-profesional', value: '777888999', type: { text: 'Tarjeta Profesional' } },
                   { system: 'urn:co:cc', value: '80234567', type: { text: 'Cédula' } }],
      active: true, name: [{ use: 'official', family: 'Méndez', given: ['Roberto'], prefix: ['Dr.'] }],
      telecom: [{ system: 'phone', value: '+57 321 7654321' }, { system: 'email', value: 'rmendez@acmesalud.co' }],
      gender: 'male', birthDate: '1970-02-28',
      qualification: [{ code: { coding: [{ system: 'http://snomed.info/sct', code: '394802001', display: 'Cardiología' }], text: 'Especialista en Cardiología' } }] },
  ]);

  // PractitionerRoles
  setResources('PractitionerRole', [
    { resourceType: 'PractitionerRole', id: 'role-casas', active: true,
      period: { start: '2026-01-01', end: '2026-12-31' },
      practitioner: { reference: 'Practitioner/prac-casas', display: 'Dr. Gregorio Casas' },
      organization: { reference: 'Organization/org-acme', display: 'ACME Salud' },
      code: [{ coding: [{ system: 'http://snomed.info/sct', code: '394537008', display: 'Pediatra' }] }],
      specialty: [{ coding: [{ system: 'http://snomed.info/sct', code: '394537008', display: 'Pediatría' }] }],
      availableTime: [{ daysOfWeek: ['mon','tue','wed','thu','fri'], availableStartTime: '08:00:00', availableEndTime: '16:00:00' }] },
    { resourceType: 'PractitionerRole', id: 'role-torres', active: true,
      period: { start: '2026-01-01', end: '2026-12-31' },
      practitioner: { reference: 'Practitioner/prac-torres', display: 'Dra. Ana María Torres' },
      organization: { reference: 'Organization/org-acme', display: 'ACME Salud' },
      code: [{ coding: [{ code: 'GP', display: 'Médica General' }] }],
      specialty: [{ coding: [{ system: 'http://snomed.info/sct', code: '394814009', display: 'Medicina General' }] }],
      availableTime: [{ daysOfWeek: ['mon','tue','wed','thu','fri','sat'], availableStartTime: '07:00:00', availableEndTime: '15:00:00' }] },
    { resourceType: 'PractitionerRole', id: 'role-mendez', active: true,
      period: { start: '2026-01-01', end: '2026-12-31' },
      practitioner: { reference: 'Practitioner/prac-mendez', display: 'Dr. Roberto Méndez' },
      organization: { reference: 'Organization/org-acme', display: 'ACME Salud' },
      code: [{ coding: [{ code: 'CARD', display: 'Cardiólogo' }] }],
      specialty: [{ coding: [{ system: 'http://snomed.info/sct', code: '394802001', display: 'Cardiología' }] }],
      availableTime: [{ daysOfWeek: ['mon','wed','fri'], availableStartTime: '09:00:00', availableEndTime: '17:00:00' }] },
  ]);

  // Schedules
  setResources('Schedule', [
    { resourceType: 'Schedule', id: 'sch-casas-may',
      identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-CASAS-MAY2026' }],
      active: true,
      serviceCategory: [{ coding: [{ code: '17', display: 'General Practice' }] }],
      serviceType: [{ coding: [{ system: 'http://snomed.info/sct', code: '394537008', display: 'Pediatría' }] }],
      specialty: [{ coding: [{ system: 'http://snomed.info/sct', code: '394537008', display: 'Pediatría' }] }],
      actor: [{ reference: 'Practitioner/prac-casas', display: 'Dr. Gregorio Casas' },
               { reference: 'Location/loc-norte', display: 'Clínica Norte' }],
      planningHorizon: { start: '2026-05-01', end: '2026-05-31' },
      comment: 'Agenda mensual de Pediatría - Dr. Casas - Mayo 2026' },
    { resourceType: 'Schedule', id: 'sch-torres-may',
      identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-TORRES-MAY2026' }],
      active: true,
      serviceType: [{ coding: [{ system: 'http://snomed.info/sct', code: '394814009', display: 'Medicina General' }] }],
      actor: [{ reference: 'Practitioner/prac-torres', display: 'Dra. Ana Torres' }],
      planningHorizon: { start: '2026-05-01', end: '2026-05-31' },
      comment: 'Agenda mensual Medicina General - Dra. Torres - Mayo 2026' },
    { resourceType: 'Schedule', id: 'sch-mendez-may',
      identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-MENDEZ-MAY2026' }],
      active: true,
      serviceType: [{ coding: [{ system: 'http://snomed.info/sct', code: '394802001', display: 'Cardiología' }] }],
      actor: [{ reference: 'Practitioner/prac-mendez', display: 'Dr. Roberto Méndez' }],
      planningHorizon: { start: '2026-05-01', end: '2026-05-31' },
      comment: 'Agenda mensual Cardiología - Dr. Méndez - Mayo 2026' },
  ]);

  // Slots
  setResources('Slot', [
    { resourceType: 'Slot', id: 'slot-001', schedule: { reference: 'Schedule/sch-casas-may' },
      status: 'free', serviceType: [{ coding: [{ code: '394537008', display: 'Pediatría' }] }],
      start: '2026-05-05T08:00:00-05:00', end: '2026-05-05T08:20:00-05:00', comment: 'Disponible' },
    { resourceType: 'Slot', id: 'slot-002', schedule: { reference: 'Schedule/sch-casas-may' },
      status: 'busy', serviceType: [{ coding: [{ code: '394537008', display: 'Pediatría' }] }],
      start: '2026-05-05T08:20:00-05:00', end: '2026-05-05T08:40:00-05:00' },
    { resourceType: 'Slot', id: 'slot-003', schedule: { reference: 'Schedule/sch-casas-may' },
      status: 'free', serviceType: [{ coding: [{ code: '394537008', display: 'Pediatría' }] }],
      start: '2026-05-05T09:00:00-05:00', end: '2026-05-05T09:20:00-05:00' },
    { resourceType: 'Slot', id: 'slot-004', schedule: { reference: 'Schedule/sch-torres-may' },
      status: 'free', serviceType: [{ coding: [{ code: '394814009', display: 'Medicina General' }] }],
      start: '2026-05-06T07:00:00-05:00', end: '2026-05-06T07:15:00-05:00' },
    { resourceType: 'Slot', id: 'slot-005', schedule: { reference: 'Schedule/sch-mendez-may' },
      status: 'free', serviceType: [{ coding: [{ code: '394802001', display: 'Cardiología' }] }],
      start: '2026-05-07T09:00:00-05:00', end: '2026-05-07T09:20:00-05:00' },
  ]);

  // Appointments
  setResources('Appointment', [
    { resourceType: 'Appointment', id: 'apt-001',
      identifier: [{ system: 'urn:co:acme:appointment', value: 'APT-2026-001234' }],
      status: 'booked',
      serviceType: [{ coding: [{ system: 'http://snomed.info/sct', code: '394537008', display: 'Pediatría' }], text: 'Consulta de Pediatría' }],
      specialty: [{ coding: [{ code: '394537008', display: 'Pediatría' }] }],
      appointmentType: { coding: [{ code: 'ROUTINE', display: 'Primera vez' }] },
      reasonCode: [{ text: 'Revisión de rutina pediátrica' }],
      slot: [{ reference: 'Slot/slot-001' }],
      start: '2026-05-05T08:00:00-05:00', end: '2026-05-05T08:20:00-05:00',
      created: '2026-04-20T10:30:00Z',
      comment: 'Favor llegar 10 min antes con documentos',
      participant: [
        { actor: { reference: 'Patient/pat-001', display: 'María Fernanda Rodríguez' }, status: 'accepted', required: 'required' },
        { actor: { reference: 'Practitioner/prac-casas', display: 'Dr. Gregorio Casas' }, status: 'accepted', required: 'required' }
      ] },
    { resourceType: 'Appointment', id: 'apt-002',
      identifier: [{ system: 'urn:co:acme:appointment', value: 'APT-2026-001235' }],
      status: 'pending',
      serviceType: [{ coding: [{ code: '394814009', display: 'Medicina General' }], text: 'Medicina General' }],
      appointmentType: { coding: [{ code: 'ROUTINE', display: 'Control' }] },
      reasonCode: [{ text: 'Control mensual' }],
      slot: [{ reference: 'Slot/slot-004' }],
      start: '2026-05-06T07:00:00-05:00', end: '2026-05-06T07:15:00-05:00',
      created: '2026-04-21T14:00:00Z',
      participant: [
        { actor: { reference: 'Patient/pat-002', display: 'Carlos Andrés Gómez' }, status: 'needs-action', required: 'required' },
        { actor: { reference: 'Practitioner/prac-torres', display: 'Dra. Ana María Torres' }, status: 'accepted', required: 'required' }
      ] },
    { resourceType: 'Appointment', id: 'apt-003',
      identifier: [{ system: 'urn:co:acme:appointment', value: 'APT-2026-001200' }],
      status: 'cancelled',
      cancelationReason: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason', code: 'pat', display: 'Paciente' }], text: 'El paciente no puede asistir por viaje imprevisto' },
      serviceType: [{ coding: [{ code: '394802001', display: 'Cardiología' }], text: 'Cardiología' }],
      start: '2026-05-07T09:00:00-05:00', end: '2026-05-07T09:20:00-05:00',
      created: '2026-04-15T09:00:00Z',
      participant: [
        { actor: { reference: 'Patient/pat-003', display: 'Luisa Carolina Martínez' }, status: 'declined', required: 'required' },
        { actor: { reference: 'Practitioner/prac-mendez', display: 'Dr. Roberto Méndez' }, status: 'accepted', required: 'required' }
      ] },
  ]);

  // AppointmentResponses
  setResources('AppointmentResponse', [
    { resourceType: 'AppointmentResponse', id: 'apr-001',
      appointment: { reference: 'Appointment/apt-001' },
      start: '2026-05-05T08:00:00-05:00', end: '2026-05-05T08:20:00-05:00',
      participantType: [{ coding: [{ code: 'patient', display: 'Paciente' }] }],
      actor: { reference: 'Patient/pat-001', display: 'María Fernanda Rodríguez' },
      participantStatus: 'accepted',
      comment: 'Cita confirmada. Servicio: Pediatría con Dr. Gregorio Casas. Por favor llegar 10 minutos antes.' },
  ]);

  localStorage.setItem(`${FHIR_BASE}_initialized`, 'true');
}

// ==========================================
// CRUD Genérico
// ==========================================
function getResources(resourceType) {
  const data = localStorage.getItem(`${FHIR_BASE}_${resourceType}`);
  return data ? JSON.parse(data) : [];
}

function setResources(resourceType, resources) {
  localStorage.setItem(`${FHIR_BASE}_${resourceType}`, JSON.stringify(resources));
}

function getResource(resourceType, id) {
  return getResources(resourceType).find(r => r.id === id) || null;
}

function createResource(resourceType, resource) {
  const resources = getResources(resourceType);
  resource.id = resource.id || generateId(resourceType);
  resource.meta = { versionId: '1', lastUpdated: new Date().toISOString() };
  resources.push(resource);
  setResources(resourceType, resources);
  return resource;
}

function updateResource(resourceType, id, resource) {
  const resources = getResources(resourceType);
  const idx = resources.findIndex(r => r.id === id);
  if (idx === -1) return null;
  resource.id = id;
  resource.meta = { ...resources[idx].meta, versionId: String(parseInt(resources[idx].meta?.versionId || '0') + 1), lastUpdated: new Date().toISOString() };
  resources[idx] = resource;
  setResources(resourceType, resources);
  return resource;
}

function deleteResource(resourceType, id) {
  const resources = getResources(resourceType).filter(r => r.id !== id);
  setResources(resourceType, resources);
}

function generateId(prefix) {
  return `${prefix.toLowerCase().substring(0, 3)}-${Date.now().toString(36)}`;
}

// ==========================================
// Helpers
// ==========================================
function getPatientName(patient) {
  if (!patient?.name?.[0]) return 'Sin nombre';
  const n = patient.name[0];
  return `${n.prefix?.[0] ? n.prefix[0] + ' ' : ''}${(n.given || []).join(' ')} ${n.family || ''}`.trim();
}

function getPractitionerName(prac) {
  return getPatientName(prac);
}

function getResourceDisplay(ref) {
  if (!ref) return '-';
  if (typeof ref === 'string') return ref.split('/').pop();
  if (ref.display) return ref.display;
  if (ref.reference) return ref.reference.split('/').pop();
  return '-';
}

function formatDateTime(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
}

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO', { dateStyle: 'long' });
}

// ==========================================
// Autenticación simulada
// ==========================================
function login(email, password, role) {
  const users = {
    'admin@acmesalud.co':    { password: 'admin123', role: 'admin',    name: 'Administrador ACME', patientId: null },
    'paciente@acmesalud.co': { password: 'paciente123', role: 'patient', name: 'María Fernanda Rodríguez', patientId: 'pat-001' },
    'carlos@acmesalud.co':   { password: 'carlos123', role: 'patient', name: 'Carlos Andrés Gómez', patientId: 'pat-002' },
  };
  const user = users[email];
  if (!user || user.password !== password) return null;
  const session = { email, role: user.role, name: user.name, patientId: user.patientId, loginAt: new Date().toISOString() };
  sessionStorage.setItem('fhir_session', JSON.stringify(session));
  return session;
}

function getSession() {
  const s = sessionStorage.getItem('fhir_session');
  return s ? JSON.parse(s) : null;
}

function logout() {
  sessionStorage.removeItem('fhir_session');
  window.location.href = 'login.html';
}

function requireAuth(allowedRoles) {
  const session = getSession();
  if (!session) { window.location.href = 'login.html'; return null; }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    window.location.href = session.role === 'patient' ? 'patient-dashboard.html' : 'index.html';
    return null;
  }
  return session;
}

// ==========================================
// Toast Notifications
// ==========================================
function showToast(message, type = 'default') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: 'check_circle', error: 'error', warning: 'warning', default: 'info' };
  toast.innerHTML = `<span class="material-icons" style="font-size:20px">${icons[type] || 'info'}</span><span>${message}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ==========================================
// Modal helpers
// ==========================================
function openModal(id) { document.getElementById(id)?.classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

// ==========================================
// Render sidebar usuario
// ==========================================
function renderSidebarUser(session) {
  const el = document.getElementById('sidebar-user-name');
  const er = document.getElementById('sidebar-user-role');
  if (el) el.textContent = session.name;
  if (er) er.textContent = session.role === 'admin' ? 'Administrador' : 'Paciente';
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  initFHIRData();

  // Active nav highlight
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && href === current) item.classList.add('active');
  });

  // Sidebar mobile toggle
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // Logout buttons
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', logout);
  });
});
