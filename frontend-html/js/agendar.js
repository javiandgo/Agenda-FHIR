const API = API_BASE_URL;

const SPECIALTY_ICONS = {
  Pediatría: 'child_care',
  'Ginecología y Obstetricia': 'pregnant_woman',
  Cardiología: 'favorite',
  Nefrología: 'water_drop',
  Oncología: 'healing',
  Gastroenterología: 'restaurant',
  'Medicina general': 'stethoscope'
};

const DEFAULT_DURATION_FALLBACK = 30; // usado si el paciente no tiene Coverage registrada

let specialties = [];
let practitionerMap = {};
let locationMap = {};
let scheduleToPrac = {};
let doctorRoles = {};
let doctorLoc = {};
let allSlots = [];
let currentStep = 1;
let selectedData = {
  patientId: null, patientName: '',
  specialtyCode: null, specialtyName: null, serviceCategory: null,
  insurerId: null, insurerName: null,
  doctor: null, date: null, time: null, startIso: null, computedEnd: null, slotIds: []
};

// Duración real de la consulta según especialidad (general/especializada) + aseguradora del paciente
function getNeededDuration() {
  return calcularDuracion('ROUTINE', selectedData.serviceCategory, selectedData.insurerId) || DEFAULT_DURATION_FALLBACK;
}

async function loadInsurerForPatient(patientId) {
  selectedData.insurerId = null;
  selectedData.insurerName = null;
  if (!patientId) return;
  try {
    const resp = await fetch(`${API}/Coverage?beneficiary=Patient/${patientId}`, { headers: { 'Accept': 'application/fhir+json' } });
    if (!resp.ok) return;
    const bundle = await resp.json();
    const cov = (bundle.entry || []).map(e => e.resource)[0];
    if (cov) {
      selectedData.insurerId = getInsurerId(cov);
      selectedData.insurerName = cov.payor?.[0]?.display || '';
    }
  } catch (e) { /* sin cobertura disponible, se usará duración estándar */ }
}

document.addEventListener('DOMContentLoaded', async () => {
  showLoading(true);

  let sessionPatientId = null;
  let sessionPatientName = null;

  const urlParams = new URLSearchParams(window.location.search);
  const urlPatient = urlParams.get('patient');
  if (urlPatient) {
    sessionPatientId = urlPatient;
    try {
      const patResp = await fetch(`${API}/Patient/${urlPatient}`, {
        headers: { 'Accept': 'application/fhir+json' }
      });
      if (patResp.ok) {
        const p = await patResp.json();
        sessionPatientId = p.id;
        const name = p.name?.[0];
        sessionPatientName = (name?.given || []).join(' ') + ' ' + (name?.family || '');
      }
    } catch (e) { /* use URL id as fallback */ }
  } else try {
    const raw = localStorage.getItem('fhir_session') || sessionStorage.getItem('fhir_session');
    if (raw) {
      const session = JSON.parse(raw);
      if (session.patientId) {
        sessionPatientId = session.patientId;
        sessionPatientName = session.name || '';
        try {
          const patResp = await fetch(`${API}/Patient/${session.patientId}`, {
            headers: { 'Accept': 'application/fhir+json' }
          });
          if (patResp.ok) {
            const p = await patResp.json();
            sessionPatientId = p.id;
            const name = p.name?.[0];
            sessionPatientName = (name?.given || []).join(' ') + ' ' + (name?.family || '');
          }
        } catch (e) { /* use session data as fallback */ }
      }
    }
  } catch (e) { /* no session available */ }

  if (sessionPatientId) {
    selectedData.patientId = sessionPatientId;
    selectedData.patientName = sessionPatientName || sessionPatientId;
    await loadInsurerForPatient(sessionPatientId);
  }

  await loadInitialData();
  showLoading(false);
  initEventListeners();

  if (sessionPatientId) {
    document.getElementById('next-step-0').removeAttribute('disabled');
    goToStep(1);
  }
});

async function loadInitialData() {
  const [pracBundle, rolesBundle, locBundle, schedBundle, slotsBundle, hsBundle] = await Promise.all([
    fetch(`${API}/Practitioner`, { headers: { 'Accept': 'application/fhir+json' } }).then(r => r.json()),
    fetch(`${API}/PractitionerRole`, { headers: { 'Accept': 'application/fhir+json' } }).then(r => r.json()),
    fetch(`${API}/Location`, { headers: { 'Accept': 'application/fhir+json' } }).then(r => r.json()),
    fetch(`${API}/Schedule`, { headers: { 'Accept': 'application/fhir+json' } }).then(r => r.json()),
    fetch(`${API}/Slot?status=free`, { headers: { 'Accept': 'application/fhir+json' } }).then(r => r.json()),
    fetch(`${API}/HealthcareService`, { headers: { 'Accept': 'application/fhir+json' } }).then(r => r.json())
  ]);

  (schedBundle.entry || []).forEach(e => {
    const r = e.resource;
    const pracRef = (r.actor || []).find(a => a.reference?.startsWith('Practitioner/'))?.reference?.replace('Practitioner/', '');
    if (pracRef) scheduleToPrac[r.id] = pracRef;
  });

  (pracBundle.entry || []).forEach(e => {
    const r = e.resource;
    const id = r.id;
    const name = r.name?.[0];
    practitionerMap[id] = {
      display: (name?.prefix?.[0] || 'Dr.') + ' ' + (name?.family || '') + ' ' + (name?.given?.[0] || ''),
      family: name?.family || '',
      given: name?.given?.[0] || ''
    };
  });

  (locBundle.entry || []).forEach(e => {
    const r = e.resource;
    locationMap[r.id] = r.name || r.id;
  });

  const seenSpecs = {};
  (rolesBundle.entry || []).forEach(e => {
    const r = e.resource;
    const pracId = r.practitioner?.reference?.replace('Practitioner/', '');
    const spec = r.specialty?.[0]?.coding?.[0];
    const specName = spec?.display || 'Medicina General';
    const specCode = spec?.code || 'general';
    const locRef = r.location?.[0]?.reference?.replace('Location/', '') || '';
    const orgRef = r.organization?.reference?.replace('Organization/', '') || '';

    if (!seenSpecs[specCode]) {
      seenSpecs[specCode] = { code: specCode, name: specName };
    }
    if (!doctorRoles[pracId]) doctorRoles[pracId] = [];
    doctorRoles[pracId].push(specCode);
    if (!doctorLoc[pracId]) doctorLoc[pracId] = new Set();
    if (locRef) doctorLoc[pracId].add(locRef);
  });

  (hsBundle.entry || []).forEach(e => {
    const r = e.resource;
    const spec = r.specialty?.[0]?.coding?.[0];
    if (spec?.code && !seenSpecs[spec.code]) {
      seenSpecs[spec.code] = { code: spec.code, name: spec.display || spec.code };
    }
  });

  specialties = Object.values(seenSpecs);

  allSlots = (slotsBundle.entry || []).map(e => e.resource);

  renderLocationChips();
  renderSpecialtyGrid();
}

function renderLocationChips() {
  const group = document.querySelector('.chip-group');
  if (!group) return;
  const usedLocIds = new Set();
  Object.values(doctorLoc).forEach(s => s.forEach(locId => {
    if (locationMap[locId]) usedLocIds.add(locId);
  }));
  const names = [...usedLocIds].map(id => locationMap[id]);
  group.innerHTML = '<md-filter-chip label="Todas las clínicas" selected></md-filter-chip>' +
    names.map(n => `<md-filter-chip label="${n}"></md-filter-chip>`).join('');
}

function renderSpecialtyGrid() {
  const grid = document.querySelector('.specialty-grid');
  if (!grid) return;
  grid.innerHTML = specialties.map(s => `
    <md-outlined-card class="specialty-card" data-specialty="${s.code}">
      <div class="specialty-content">
        <span class="material-icons specialty-icon">${SPECIALTY_ICONS[s.name] || 'medical_services'}</span>
        <h3>${s.name}</h3>
        <md-filled-button class="select-btn">Seleccionar</md-filled-button>
      </div>
    </md-outlined-card>
  `).join('');
}

function initEventListeners() {
  const verifyBtn = document.getElementById('verify-patient');
  const docNumber = document.getElementById('doc-number');
  const nextStep0 = document.getElementById('next-step-0');
  const nextStep1 = document.getElementById('next-step-1');
  const prevStep2 = document.getElementById('prev-step-2');
  const nextStep2 = document.getElementById('next-step-2');
  const prevStep3 = document.getElementById('prev-step-3');
  const nextStep3 = document.getElementById('next-step-3');
  const prevStep4 = document.getElementById('prev-step-4');
  const confirmBtn = document.getElementById('confirm-appointment');
  const step1Search = document.querySelector('#step-1 md-outlined-text-field[type="search"]');

  verifyBtn.addEventListener('click', async () => {
    const system = document.getElementById('doc-type').value;
    const value = docNumber.value.trim();
    if (!value) { alert('Ingresa el número de documento'); return; }
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<span class="material-icons" slot="icon">hourglass_top</span> Verificando...';
    const resultDiv = document.getElementById('patient-result');
    resultDiv.style.display = 'none';
    const oldSystems = { 'urn:oid:2.16.170.3.899999040.1.4': 'urn:co:cc', 'urn:oid:2.16.170.1.2.2.899999042.1.3': 'urn:co:ce', 'urn:oid:2.16.170.3.899999040.1.3': 'urn:co:ti', 'urn:oid:2.16.170.3.899999040.1.2': 'urn:co:rc', 'urn:oid:2.16.170.1.2.2.899999042.1.1': 'urn:co:pp', 'urn:oid:2.16.170.1.2.2.899999090.800197268.1.2': 'urn:co:nt' };
    try {
      let resp = await fetch(`${API}/Patient?identifier=${system}|${encodeURIComponent(value)}`, {
        headers: { 'Accept': 'application/fhir+json' }
      });
      let bundle = await resp.json();
      let patients = (bundle.entry || []).map(e => e.resource);
      if (patients.length === 0 && oldSystems[system]) {
        resp = await fetch(`${API}/Patient?identifier=${oldSystems[system]}|${encodeURIComponent(value)}`, {
          headers: { 'Accept': 'application/fhir+json' }
        });
        bundle = await resp.json();
        patients = (bundle.entry || []).map(e => e.resource);
      }
      if (patients.length > 0) {
        const p = patients[0];
        selectedData.patientId = p.id;
        const name = p.name?.[0];
        selectedData.patientName = (name?.given || []).join(' ') + ' ' + (name?.family || '');
        await loadInsurerForPatient(p.id);
        resultDiv.innerHTML = `
          <md-outlined-card class="patient-result-card success">
            <span class="material-icons" style="font-size:36px">check_circle</span>
            <div>
              <strong style="font-size:18px">Paciente encontrado</strong>
              <p style="margin:4px 0 0">${selectedData.patientName}</p>
            </div>
          </md-outlined-card>`;
        resultDiv.style.display = 'block';
        nextStep0.removeAttribute('disabled');
      } else {
        resultDiv.innerHTML = `
          <md-outlined-card class="patient-result-card error">
            <span class="material-icons" style="font-size:36px">cancel</span>
            <div>
              <strong style="font-size:18px">Paciente no encontrado</strong>
              <p style="margin:4px 0 0">No se encontró un paciente con ese documento. Consulta a tu asegurador para registrarte.</p>
            </div>
          </md-outlined-card>`;
        resultDiv.style.display = 'block';
        nextStep0.setAttribute('disabled', '');
      }
    } catch (e) {
      console.error('Error buscando paciente:', e);
      resultDiv.innerHTML = `<md-outlined-card class="patient-result-card error"><span class="material-icons">error</span><div><strong>Error de conexión</strong><p>Verifica que el servidor esté funcionando.</p></div></md-outlined-card>`;
      resultDiv.style.display = 'block';
    }
    verifyBtn.disabled = false;
    verifyBtn.innerHTML = '<span class="material-icons" slot="icon">search</span> Verificar';
  });

  docNumber.addEventListener('keydown', e => { if (e.key === 'Enter') verifyBtn.click(); });

  nextStep0.addEventListener('click', () => { if (selectedData.patientId) goToStep(1); });

  document.querySelector('.specialty-grid').addEventListener('click', e => {
    const card = e.target.closest('.specialty-card');
    if (!card || !e.target.closest('.select-btn')) return;
    document.querySelectorAll('.specialty-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedData.specialtyCode = card.dataset.specialty;
    selectedData.specialtyName = card.querySelector('h3').textContent;
    selectedData.serviceCategory = getServiceCategory(selectedData.specialtyCode);
    nextStep1.removeAttribute('disabled');
    document.getElementById('selected-specialty').textContent = selectedData.specialtyName;
    document.getElementById('summary-specialty').textContent = selectedData.specialtyName;
    document.getElementById('summary-patient').textContent = selectedData.patientName;
    renderDoctorList();
  });

  nextStep1.addEventListener('click', () => { if (selectedData.specialtyCode) goToStep(2); });
  prevStep2.addEventListener('click', () => goToStep(1));
  prevStep3.addEventListener('click', () => goToStep(2));
  prevStep4.addEventListener('click', () => goToStep(3));

  nextStep2.addEventListener('click', () => {
    if (selectedData.doctor) goToStep(3);
  });

  nextStep3.addEventListener('click', () => {
    if (selectedData.date && selectedData.time) {
      goToStep(4);
      updateSummary();
    } else {
      alert('Por favor selecciona una fecha y hora para continuar');
    }
  });

  confirmBtn.addEventListener('click', async () => {
    const termsCheckboxes = document.querySelectorAll('.terms-section md-checkbox');
    if (!termsCheckboxes[0]?.checked || !termsCheckboxes[1]?.checked) {
      alert('Debes aceptar los términos y condiciones y autorizar el tratamiento de datos para continuar');
      return;
    }
    await bookAppointment();
  });

  document.querySelector('.chip-group').addEventListener('click', e => {
    const chip = e.target.closest('md-filter-chip');
    if (!chip) return;
    document.querySelectorAll('md-filter-chip').forEach(c => c.selected = false);
    chip.selected = true;
    const label = chip.getAttribute('label');
    renderDoctorList(label === 'Todas las clínicas' ? null : label);
  });

  if (step1Search) {
    step1Search.addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('.specialty-card').forEach(card => {
        card.style.display = card.querySelector('h3').textContent.toLowerCase().includes(term) ? 'block' : 'none';
      });
    });
  }
}

function renderDoctorList(locationFilter) {
  const container = document.querySelector('.doctors-list');
  if (!container) return;
  let allPracIds = Object.keys(doctorRoles).filter(id =>
    (doctorRoles[id] || []).includes(selectedData.specialtyCode)
  );
  if (allPracIds.length === 0) {
    allPracIds = Object.keys(doctorRoles);
  }

  let filtered = allPracIds;
  if (locationFilter) {
    filtered = allPracIds.filter(id => {
      const locIds = [...(doctorLoc[id] || [])];
      return locIds.some(locId => (locationMap[locId] || '').toLowerCase().includes(locationFilter.toLowerCase()));
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p style="padding: 24px; text-align: center; color: var(--md-sys-color-on-surface-variant);">No hay médicos disponibles para esta especialidad</p>';
    return;
  }

  container.innerHTML = filtered.map(pracId => {
    const p = practitionerMap[pracId] || { display: pracId };
    const locIds = [...(doctorLoc[pracId] || [])];
    const locName = locIds.map(locId => locationMap[locId] || locId).join(', ') || 'Por asignar';
    const pracSchedIds = Object.entries(scheduleToPrac).filter(([, p]) => p === pracId).map(([sId]) => sId);
    const pracSlots = allSlots.filter(s => {
      const schedRef = s.schedule?.reference?.replace('Schedule/', '') || '';
      return pracSchedIds.includes(schedRef) && s.status === 'free';
    });
    const nextAvail = pracSlots.length > 0
      ? (() => {
          const sorted = pracSlots.sort((a, b) => a.start?.localeCompare(b.start));
          const d = new Date(sorted[0].start);
          return `${d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })} - ${sorted[0].start?.split('T')[1]?.substring(0, 5) || ''}`;
        })()
      : 'No hay disponibilidad próxima';

    return `
      <md-outlined-card class="doctor-card" data-doctor="${pracId}">
        <div class="doctor-info">
          <div class="doctor-avatar"><span class="material-icons">person</span></div>
          <div class="doctor-details">
            <h3>${p.display}</h3>
            <p class="doctor-specialty">${selectedData.specialtyName}</p>
            <div class="doctor-meta">
              <span class="material-icons small">location_on</span>
              <span>${locName}</span>
            </div>
            <div class="doctor-meta next-available">
              <span class="material-icons small">schedule</span>
              <span>${nextAvail}</span>
            </div>
          </div>
          <div class="doctor-action">
            <md-filled-button class="select-doctor-btn">Seleccionar</md-filled-button>
          </div>
        </div>
      </md-outlined-card>`;
  }).join('');

  container.querySelectorAll('.select-doctor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.doctor-card');
      container.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedData.doctor = card.dataset.doctor;
      selectedData.slotIds = [];
      selectedData.startIso = null;
      selectedData.computedEnd = null;
      selectedData.date = null;
      selectedData.time = null;
      document.getElementById('next-step-2').removeAttribute('disabled');
      document.getElementById('summary-doctor').textContent = card.querySelector('h3').textContent;
    });
  });
}

function goToStep(n) {
  document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`step-${n}`).classList.add('active');
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active', 'completed');
    if (i < n) s.classList.add('completed');
    else if (i === n) s.classList.add('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentStep = n;

  if (n === 3 && selectedData.doctor) {
    populateCalendarAndSlots();
  }
}

async function populateCalendarAndSlots() {
  const docId = selectedData.doctor;
  const schedIds = Object.entries(scheduleToPrac).filter(([, p]) => p === docId).map(([sId]) => sId);

  if (schedIds.length === 0) {
    document.querySelector('.calendar-container').style.display = 'none';
    document.querySelector('.time-slots-container').style.display = 'none';
    return;
  }

  // Se traen TODOS los slots (libres y ocupados) de la agenda del médico, no solo los libres:
  // para calcular tramos contiguos correctamente hay que saber dónde hay huecos ya ocupados.
  showLoading(true);
  const bundles = await Promise.all(schedIds.map(id =>
    fetch(`${API}/Slot?schedule=Schedule/${id}&_count=500`, { headers: { 'Accept': 'application/fhir+json' } }).then(r => r.json())
  ));
  showLoading(false);
  const schedSlots = bundles.flatMap(b => (b.entry || []).map(e => e.resource));

  const neededDuration = getNeededDuration();
  const options = computeBookableStarts(schedSlots, neededDuration);

  if (options.length === 0) {
    document.querySelector('.calendar-container').style.display = 'none';
    document.querySelector('.time-slots-container').style.display = 'none';
    return;
  }

  document.querySelector('.calendar-container').style.display = 'block';
  document.querySelector('.time-slots-container').style.display = 'block';

  const sorted = options.sort((a, b) => a.start.localeCompare(b.start));
  const dates = [...new Set(sorted.map(o => o.start.split('T')[0]))];

  const grid = document.querySelector('.calendar-grid');
  const dayHeaders = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  // Se parsea a mediodía local (no medianoche UTC) para que getDay()/getDate() no
  // retrocedan un día en husos horarios negativos (ej. Colombia UTC-5).
  const firstDate = new Date(dates[0] + 'T12:00:00');
  const firstDay = firstDate.getDay() || 7;
  const lastDate = new Date(dates[dates.length - 1] + 'T12:00:00');
  const monthLabel = firstDate.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  const monthHeader = document.querySelector('.calendar-header h3');
  if (monthHeader) monthHeader.textContent = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const offset = firstDay - 1;
  // Diferencia en milisegundos en vez de restar getDate(): esta última falla cuando
  // firstDate y lastDate caen en meses distintos.
  const daysInSpan = Math.round((lastDate - firstDate) / 86400000) + 1;

  grid.innerHTML = dayHeaders.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

  for (let i = 0; i < offset; i++) {
    grid.innerHTML += '<div class="calendar-day empty"></div>';
  }

  for (let d = 0; d < daysInSpan; d++) {
    const date = new Date(firstDate);
    date.setDate(firstDate.getDate() + d);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const isAvailable = dates.includes(dateStr);
    const day = date.getDate();
    grid.innerHTML += `<div class="calendar-day ${isAvailable ? 'available' : 'unavailable'}" data-date="${dateStr}">${day}</div>`;
  }

  grid.querySelectorAll('.calendar-day.available').forEach(day => {
    day.addEventListener('click', () => onDateSelected(day, day.dataset.date, sorted, neededDuration));
  });

  if (dates.length > 0) {
    const first = dates[0];
    document.querySelectorAll('.calendar-day').forEach(d => {
      if (d.dataset.date === first) {
        d.classList.add('active');
        onDateSelected(d, first, sorted, neededDuration);
      }
    });
  }
}

// A partir de los Slots reales de la agenda (libres y ocupados), calcula en qué horas
// de inicio hay suficiente espacio libre y CONTIGUO para cubrir la duración exacta
// que corresponde según especialidad + aseguradora (grid granular de Opción B).
function computeBookableStarts(slots, neededMinutes) {
  const sorted = [...slots].sort((a, b) => (a.start || '').localeCompare(b.start || ''));
  const options = [];
  for (let i = 0; i < sorted.length; i++) {
    const anchor = sorted[i];
    if (anchor.status !== 'free') continue;
    const neededEndMs = new Date(anchor.start).getTime() + neededMinutes * 60000;
    let coveredUntilMs = new Date(anchor.start).getTime();
    const consumed = [];
    for (let j = i; j < sorted.length; j++) {
      const s = sorted[j];
      if (s.status !== 'free' || new Date(s.start).getTime() !== coveredUntilMs) break;
      consumed.push(s.id);
      coveredUntilMs = new Date(s.end).getTime();
      if (coveredUntilMs >= neededEndMs) break;
    }
    if (coveredUntilMs >= neededEndMs) {
      options.push({ start: anchor.start, end: new Date(neededEndMs).toISOString(), slotIds: consumed });
    }
  }
  return options;
}

function onDateSelected(dayEl, dateStr, options, neededDuration) {
  document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
  dayEl.classList.add('active');
  selectedData.date = dateStr;
  selectedData.time = null;
  selectedData.startIso = null;
  selectedData.computedEnd = null;
  selectedData.slotIds = [];

  const dayOptions = options.filter(o => o.start.startsWith(dateStr));
  const timeContainer = document.querySelector('.time-slots-container');
  const header = timeContainer.querySelector('h3');
  const dateObj = new Date(dateStr + 'T12:00:00');
  const dateLabel = dateObj.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  header.textContent = `Horarios Disponibles - ${dateLabel}`;

  const sections = timeContainer.querySelectorAll('.time-section');
  sections.forEach(sec => {
    const slotContainer = sec.querySelector('.time-slots');
    slotContainer.innerHTML = '';
    const isMorning = sec.querySelector('h4')?.textContent === 'Mañana';
    const filtered = dayOptions.filter(o => {
      const h = parseInt(o.start?.split('T')[1]?.substring(0, 2)) || 0;
      return isMorning ? h < 12 : h >= 12;
    });
    if (filtered.length === 0) {
      slotContainer.innerHTML = '<p style="padding: 12px; color: var(--md-sys-color-on-surface-variant);">No hay horarios disponibles</p>';
      return;
    }
    filtered.forEach(o => {
      const time = o.start?.split('T')[1]?.substring(0, 5) || '';
      const end = o.end?.split('T')[1]?.substring(0, 5) || '';
      const btn = document.createElement('md-filled-button');
      btn.className = 'time-slot';
      btn.dataset.time = time;
      btn.innerHTML = `${formatTimeDisplay(time)} <span class="slot-duration">hasta ${formatTimeDisplay(end)}</span>`;
      btn.addEventListener('click', () => onTimeSelected(btn, time, o.slotIds, o.start, o.end));
      slotContainer.appendChild(btn);
    });
  });

  timeContainer.querySelector('.info-message')?.remove();
  const infoMsg = document.createElement('div');
  infoMsg.className = 'info-message';
  const insurerLabel = selectedData.insurerName ? ` · ${selectedData.insurerName}` : ' · sin cobertura registrada';
  infoMsg.innerHTML = `<span class="material-icons">info</span><span>Duración estimada: ${neededDuration} minutos${insurerLabel}</span>`;
  timeContainer.appendChild(infoMsg);
}

function onTimeSelected(btn, time, slotIds, startIso, endIso) {
  document.querySelectorAll('.time-slot').forEach(s => {
    s.className = 'time-slot';
  });
  btn.classList.add('selected');
  selectedData.time = time;
  selectedData.slotIds = slotIds;
  selectedData.startIso = startIso;
  selectedData.computedEnd = endIso;
}

function updateSummary() {
  const dateObj = new Date(`${selectedData.date}T12:00:00`);
  const dateStr = dateObj.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const docName = (practitionerMap[selectedData.doctor] || {}).display || selectedData.doctor;
  const neededDuration = getNeededDuration();

  const detailEls = document.querySelectorAll('.summary-row .summary-detail span');
  if (detailEls.length >= 6) {
    detailEls[0].textContent = selectedData.patientName;
    detailEls[1].textContent = dateStr;
    detailEls[2].textContent = `${formatTimeDisplay(selectedData.time)} (${neededDuration} minutos)`;
    detailEls[3].textContent = docName;
    detailEls[4].textContent = selectedData.specialtyName;
    detailEls[2].textContent = docName;
    detailEls[3].textContent = selectedData.specialtyName;
  }
}

// Se crea al confirmar la cita, informando hora (inicio/fin), servicio, médico y
// comentarios, tal como lo requiere el flujo de agendamiento del proyecto. Usa el mismo
// esquema de id determinístico (apr-{appointmentId}) que el panel admin, para que ambos
// canales sean consistentes si la cita se consulta luego desde el backoffice.
async function generateAppointmentResponse(appointment, confNumber) {
  const docName = (practitionerMap[selectedData.doctor] || {}).display || selectedData.doctor;
  const locIds = [...(doctorLoc[selectedData.doctor] || [])];
  const locName = locIds.map(id => locationMap[id] || id).join(', ');
  const duration = getNeededDuration();
  const fmt = iso => iso ? new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : '';

  const apr = {
    resourceType: 'AppointmentResponse',
    id: `apr-${appointment.id}`,
    identifier: [{ system: 'urn:co:acme:appointment-response', value: `APR-${confNumber}` }],
    appointment: { reference: `Appointment/${appointment.id}`, display: `${selectedData.specialtyName} — ${selectedData.patientName}` },
    start: appointment.start,
    end: appointment.end,
    participantType: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType', code: 'PART', display: 'Participation' }], text: 'Paciente' }],
    actor: { reference: `Patient/${selectedData.patientId}`, display: selectedData.patientName },
    participantStatus: 'accepted',
    comment: [
      'Cita confirmada exitosamente.',
      `Servicio: ${selectedData.specialtyName}.`,
      'Tipo: Consulta.',
      `Médico: ${docName}.`,
      locName ? `Sede: ${locName}.` : '',
      `Inicio: ${fmt(appointment.start)} — Fin: ${fmt(appointment.end)} (${duration} min).`,
      'Por favor llegar 15 minutos antes con documento de identidad y carné de la EPS.'
    ].filter(Boolean).join(' ')
  };

  try {
    await fetch(`${API}/AppointmentResponse/${apr.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/fhir+json', 'Accept': 'application/fhir+json' },
      body: JSON.stringify(apr)
    });
  } catch (e) {
    console.error('Error creando AppointmentResponse:', e);
  }
}

async function bookAppointment() {
  const start = selectedData.startIso;
  const end = selectedData.computedEnd;
  const docName = (practitionerMap[selectedData.doctor] || {}).display || selectedData.doctor;

  function genConfirmation() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let r = '';
    for (let i = 0; i < 5; i++) r += chars[Math.floor(Math.random() * chars.length)];
    return `ACM-2026-${r}`;
  }
  const confNumber = genConfirmation();

  const body = {
    resourceType: 'Appointment',
    status: 'booked',
    identifier: [{ system: 'http://acme.salud/confirmacion', value: confNumber }],
    serviceType: [{ coding: [{ code: selectedData.specialtyCode }], text: selectedData.specialtyName }],
    appointmentType: { coding: [{ code: 'ROUTINE', display: 'Consulta' }] },
    start: start,
    end: end,
    minutesDuration: getNeededDuration(),
    participant: [
      { actor: { reference: `Practitioner/${selectedData.doctor}`, display: docName }, status: 'accepted' },
      { actor: { reference: `Patient/${selectedData.patientId}`, display: selectedData.patientName }, status: 'accepted' }
    ]
  };

  if (selectedData.slotIds.length) {
    body.slot = selectedData.slotIds.map(id => ({ reference: `Slot/${id}` }));
  }

  try {
    showLoading(true);

    const aptResp = await fetch(`${API}/Appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json', 'Accept': 'application/fhir+json' },
      body: JSON.stringify(body)
    });

    if (!aptResp.ok) {
      const err = await aptResp.text();
      console.error('Booking error:', err);
      alert('Error al agendar la cita. Por favor intenta de nuevo.');
      showLoading(false);
      return;
    }

    const appointment = await aptResp.json();
    const aptId = appointment.id;

    // Se consumen todos los slots contiguos que cubren la duración calculada (Opción B)
    await Promise.all(selectedData.slotIds.map(async slotId => {
      const slotResp = await fetch(`${API}/Slot/${slotId}`, { headers: { 'Accept': 'application/fhir+json' } });
      if (!slotResp.ok) return;
      const slot = await slotResp.json();
      slot.status = 'busy';
      await fetch(`${API}/Slot/${slotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/fhir+json' },
        body: JSON.stringify(slot)
      });
    }));

    await generateAppointmentResponse(appointment, confNumber);

    const params = new URLSearchParams({
      id: aptId,
      conf: confNumber,
      patientId: selectedData.patientId,
      patientName: selectedData.patientName,
      specialty: selectedData.specialtyCode,
      specialtyName: selectedData.specialtyName,
      doctor: selectedData.doctor,
      date: selectedData.date,
      time: selectedData.time
    });
    window.location.href = `confirmacion.html?${params.toString()}`;
  } catch (e) {
    console.error('Booking error:', e);
    alert('Error de conexión. Verifica que el servidor esté funcionando.');
    showLoading(false);
  }
}

function formatTimeDisplay(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

function showLoading(show) {
  let overlay = document.querySelector('.loading-overlay');
  if (show) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = '<div class="loading-spinner"></div><p>Cargando datos...</p>';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;';
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
  } else if (overlay) {
    overlay.style.display = 'none';
  }
}
