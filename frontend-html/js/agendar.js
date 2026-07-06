const API = API_BASE_URL;

const specialtyMeta = {
  pediatria: { icon: 'child_care', name: 'Pediatría' },
  obstetricia: { icon: 'pregnant_woman', name: 'Obstetricia' },
  cardiologia: { icon: 'favorite', name: 'Cardiología' },
  nefrologia: { icon: 'water_drop', name: 'Nefrología' },
  oncologia: { icon: 'healing', name: 'Oncología' },
  gastroenterologia: { icon: 'restaurant', name: 'Gastroenterología' }
};

const practitionerNames = {
  'prac-casas': 'Dr. Gregorio Casas',
  'prac-luna': 'Dr. Elmer Luna',
  'prac-chavez': 'Dr. Luis Chávez',
  'prac-silva': 'Dr. Alvaro Silva',
  'prac-narvaez': 'Dr. Diego Narváez',
  'prac-fonseca': 'Dr. Alonso Fonseca'
};

const doctorSpecialties = {};
const doctorLocations = {};
let practitionerRoles = [];
let allSlots = [];
let currentStep = 1;
let selectedData = { specialty: null, doctor: null, date: null, time: null, slotId: null };

document.addEventListener('DOMContentLoaded', async () => {
  showLoading(true);
  await loadInitialData();
  showLoading(false);
  initEventListeners();
});

async function loadInitialData() {
  const rolesBundle = await fetch(`${API}/PractitionerRole`).then(r => r.json());
  const entries = rolesBundle.entry || [];

  practitionerRoles = entries.map(e => {
    const r = e.resource;
    const pracId = r.practitioner?.reference?.replace('Practitioner/', '');
    const specCode = r.code?.[0]?.coding?.[0]?.code || 'general';
    const locRef = r.location?.[0]?.reference || '';
    const orgRef = r.organization?.reference || '';

    if (!doctorSpecialties[pracId]) doctorSpecialties[pracId] = [];
    doctorSpecialties[pracId].push(specCode);
    doctorLocations[pracId] = locRef;

    return r;
  });

  const slotsBundle = await fetch(`${API}/Slot?status=free`).then(r => r.json());
  allSlots = (slotsBundle.entry || []).map(e => e.resource);

  updateSpecialtyCards();
}

function updateSpecialtyCards() {
  const cards = document.querySelectorAll('.specialty-card');
  cards.forEach(card => {
    const spec = card.dataset.specialty;
    const pracIds = Object.keys(doctorSpecialties).filter(id => doctorSpecialties[id].includes(spec));
    const availableSlots = allSlots.filter(s => {
      const schedRef = s.schedule?.reference || '';
      return pracIds.some(pId => schedRef.includes(pId));
    });
    const countEl = card.querySelector('.available-slots');
    if (countEl) countEl.textContent = `${availableSlots.length} turnos disponibles`;
  });
}

function initEventListeners() {
  const specialtyCards = document.querySelectorAll('.specialty-card');
  const nextStep1 = document.getElementById('next-step-1');

  specialtyCards.forEach(card => {
    const selectBtn = card.querySelector('.select-btn');
    selectBtn.addEventListener('click', () => {
      specialtyCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedData.specialty = card.dataset.specialty;
      nextStep1.removeAttribute('disabled');
      const nameEl = card.querySelector('h3').textContent;
      document.getElementById('selected-specialty').textContent = nameEl;
      document.getElementById('summary-specialty').textContent = nameEl;
      updateDoctorList();
    });
  });

  nextStep1.addEventListener('click', () => { if (selectedData.specialty) goToStep(2); });

  const docCards = document.querySelectorAll('.doctor-card');
  const prevStep2 = document.getElementById('prev-step-2');
  const nextStep2 = document.getElementById('next-step-2');

  docCards.forEach(card => {
    const btn = card.querySelector('.select-doctor-btn');
    btn.addEventListener('click', () => {
      docCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedData.doctor = card.dataset.doctor;
      selectedData.slotId = null;
      selectedData.date = null;
      selectedData.time = null;
      nextStep2.removeAttribute('disabled');
      const name = card.querySelector('h3').textContent;
      document.getElementById('summary-doctor').textContent = name;
    });
  });

  prevStep2.addEventListener('click', () => goToStep(1));
  nextStep2.addEventListener('click', () => {
    if (selectedData.doctor) goToStep(3);
  });

  const prevStep3 = document.getElementById('prev-step-3');
  const nextStep3 = document.getElementById('next-step-3');

  prevStep3.addEventListener('click', () => goToStep(2));
  nextStep3.addEventListener('click', () => {
    if (selectedData.date && selectedData.time) {
      goToStep(4);
      updateSummary();
    } else {
      alert('Por favor selecciona una fecha y hora para continuar');
    }
  });

  const prevStep4 = document.getElementById('prev-step-4');
  const confirmBtn = document.getElementById('confirm-appointment');

  prevStep4.addEventListener('click', () => goToStep(3));

  confirmBtn.addEventListener('click', async () => {
    const termsCheckboxes = document.querySelectorAll('.terms-section md-checkbox');
    if (!termsCheckboxes[0]?.checked || !termsCheckboxes[1]?.checked) {
      alert('Debes aceptar los términos y condiciones y autorizar el tratamiento de datos para continuar');
      return;
    }
    await bookAppointment();
  });

  const locationChips = document.querySelectorAll('md-filter-chip');
  locationChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const label = chip.getAttribute('label');
      const isAll = label === 'Todas las clínicas';
      locationChips.forEach(c => c.selected = false);
      chip.selected = true;
      updateDoctorList(isAll ? null : label);
    });
  });

  const searchInput = document.querySelector('md-outlined-text-field[type="search"]');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('.specialty-card').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = name.includes(term) ? 'block' : 'none';
      });
    });
  }
}

function updateDoctorList(locationFilter) {
  const allDoctorCards = document.querySelectorAll('.doctor-card');
  const pracIds = Object.keys(doctorSpecialties).filter(id =>
    doctorSpecialties[id].includes(selectedData.specialty)
  );

  allDoctorCards.forEach(card => {
    const docId = card.dataset.doctor;
    const show = pracIds.includes(docId);
    card.style.display = show ? 'flex' : 'none';

    if (!show) return;

    const name = practitionerNames[docId] || docId;
    card.querySelector('h3').textContent = name;
    const specName = specialtyMeta[selectedData.specialty]?.name || selectedData.specialty;
    card.querySelector('.doctor-specialty').textContent = specName;

    const locLabel = doctorLocations[docId]?.replace('Location/', '') || 'Clínica Norte';
    const locMap = { 'loc-norte': 'Clínica Norte', 'loc-centro': 'Clínica Centro', 'loc-sur': 'Clínica Sur' };
    card.querySelectorAll('.doctor-meta span:last-child').forEach(el => {
      if (el.closest('.doctor-meta')?.querySelector('.material-icons.small')?.textContent === 'location_on') {
        el.textContent = locMap[locLabel] || locLabel;
      }
    });

    const nextAvail = card.querySelector('.next-available span:last-child');
    if (nextAvail) {
      const availSlots = allSlots.filter(s => {
        const schedRef = s.schedule?.reference || '';
        return schedRef.includes(docId) && s.status === 'free';
      });
      if (availSlots.length > 0) {
        const sorted = availSlots.sort((a, b) => a.start?.localeCompare(b.start));
        const nextDate = new Date(sorted[0].start);
        const dateStr = nextDate.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
        const timeStr = sorted[0].start?.split('T')[1]?.substring(0, 5) || '';
        nextAvail.textContent = `Próxima disponibilidad: ${dateStr} - ${timeStr}`;
      } else {
        nextAvail.textContent = 'No hay disponibilidad próxima';
      }
    }
  });
}

function goToStep(n) {
  document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`step-${n}`).classList.add('active');
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active', 'completed');
    if (i + 1 < n) s.classList.add('completed');
    else if (i + 1 === n) s.classList.add('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentStep = n;

  if (n === 3 && selectedData.doctor) {
    populateCalendarAndSlots();
  }
}

function populateCalendarAndSlots() {
  const docId = selectedData.doctor;
  const freeSlots = allSlots.filter(s => {
    const schedRef = s.schedule?.reference || '';
    return schedRef.includes(docId) && s.status === 'free';
  });

  if (freeSlots.length === 0) {
    document.querySelector('.calendar-container').style.display = 'none';
    document.querySelector('.time-slots-container').style.display = 'none';
    return;
  }

  document.querySelector('.calendar-container').style.display = 'block';
  document.querySelector('.time-slots-container').style.display = 'block';

  const sorted = freeSlots.sort((a, b) => a.start?.localeCompare(b.start));
  const dates = [...new Set(sorted.map(s => s.start?.split('T')[0]).filter(Boolean))];

  const calendarDays = document.querySelectorAll('.calendar-day.available, .calendar-day.unavailable');
  calendarDays.forEach(day => {
    const dateStr = day.dataset.date;
    if (dateStr && dates.includes(dateStr)) {
      day.className = 'calendar-day available';
      day.addEventListener('click', () => onDateSelected(day, dateStr, sorted));
    } else if (dateStr) {
      day.className = 'calendar-day unavailable';
    }
  });

  if (dates.length > 0) {
    const firstDate = dates[0];
    document.querySelectorAll('.calendar-day').forEach(d => {
      if (d.dataset.date === firstDate) {
        d.classList.add('active');
        onDateSelected(d, firstDate, sorted);
      }
    });
  }
}

function onDateSelected(dayEl, dateStr, slots) {
  document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
  dayEl.classList.add('active');
  selectedData.date = dateStr;
  selectedData.time = null;
  selectedData.slotId = null;

  const daySlots = slots.filter(s => s.start?.startsWith(dateStr));
  const timeContainer = document.querySelector('.time-slots-container');
  const header = timeContainer.querySelector('h3');
  const dateObj = new Date(dateStr + 'T12:00:00');
  const dateLabel = dateObj.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  header.textContent = `Horarios Disponibles - ${dateLabel}`;

  const morningSection = timeContainer.querySelector('.time-section:first-child .time-slots');
  const afternoonSection = timeContainer.querySelector('.time-section:last-child .time-slots');
  morningSection.innerHTML = '';
  afternoonSection.innerHTML = '';

  const morningSlots = daySlots.filter(s => {
    const h = parseInt(s.start?.split('T')[1]?.substring(0, 2)) || 0;
    return h < 12;
  });
  const afternoonSlots = daySlots.filter(s => {
    const h = parseInt(s.start?.split('T')[1]?.substring(0, 2)) || 0;
    return h >= 12;
  });

  morningSlots.forEach(s => {
    const time = s.start?.split('T')[1]?.substring(0, 5) || '';
    const end = s.end?.split('T')[1]?.substring(0, 5) || '';
    const btn = document.createElement('md-filled-button');
    btn.className = 'time-slot';
    btn.dataset.time = time;
    btn.dataset.slotId = s.id;
    btn.innerHTML = `${formatTimeDisplay(time)} <span class="slot-duration">hasta ${formatTimeDisplay(end)}</span>`;
    btn.addEventListener('click', () => onTimeSelected(btn, time, s.id));
    morningSection.appendChild(btn);
  });

  afternoonSlots.forEach(s => {
    const time = s.start?.split('T')[1]?.substring(0, 5) || '';
    const end = s.end?.split('T')[1]?.substring(0, 5) || '';
    const btn = document.createElement('md-filled-button');
    btn.className = 'time-slot';
    btn.dataset.time = time;
    btn.dataset.slotId = s.id;
    btn.innerHTML = `${formatTimeDisplay(time)} <span class="slot-duration">hasta ${formatTimeDisplay(end)}</span>`;
    btn.addEventListener('click', () => onTimeSelected(btn, time, s.id));
    afternoonSection.appendChild(btn);
  });

  if (morningSlots.length === 0) {
    morningSection.innerHTML = '<p style="padding: 12px; color: var(--md-sys-color-on-surface-variant);">No hay horarios disponibles en la mañana</p>';
  }
  if (afternoonSlots.length === 0) {
    afternoonSection.innerHTML = '<p style="padding: 12px; color: var(--md-sys-color-on-surface-variant);">No hay horarios disponibles en la tarde</p>';
  }
}

function onTimeSelected(btn, time, slotId) {
  document.querySelectorAll('.time-slot').forEach(s => {
    s.className = 'time-slot';
  });
  btn.classList.add('selected');
  selectedData.time = time;
  selectedData.slotId = slotId;
}

function updateSummary() {
  const dateObj = new Date(`${selectedData.date}T12:00:00`);
  const dateStr = dateObj.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const docName = practitionerNames[selectedData.doctor] || selectedData.doctor;
  const specName = specialtyMeta[selectedData.specialty]?.name || selectedData.specialty;

  const rows = document.querySelectorAll('.summary-row .summary-detail');
  if (rows.length >= 5) {
    rows[0].querySelector('span').textContent = dateStr;
    rows[1].querySelector('span').textContent = `${formatTimeDisplay(selectedData.time)} (30 minutos)`;
    rows[2].querySelector('span').textContent = docName;
    rows[3].querySelector('span').textContent = specName;
  }
}

async function bookAppointment() {
  const start = `${selectedData.date}T${selectedData.time}:00-05:00`;
  const endDate = new Date(`${selectedData.date}T${selectedData.time}:00-05:00`);
  endDate.setMinutes(endDate.getMinutes() + 30);
  const end = endDate.toISOString().replace(/\.\d{3}Z$/, '-05:00');

  const body = {
    resourceType: 'Appointment',
    status: 'booked',
    serviceType: [{ coding: [{ code: selectedData.specialty }], text: specialtyMeta[selectedData.specialty]?.name || selectedData.specialty }],
    appointmentType: { coding: [{ code: 'ROUTINE', display: 'Consulta' }] },
    start: start,
    end: end,
    participant: [
      { actor: { reference: 'Patient/pat-001', display: 'María Fernanda Rodríguez' }, status: 'accepted' },
      { actor: { reference: `Practitioner/${selectedData.doctor}`, display: practitionerNames[selectedData.doctor] || selectedData.doctor }, status: 'accepted' }
    ]
  };

  if (selectedData.slotId) {
    body.slot = [{ reference: `Slot/${selectedData.slotId}` }];
  }

  try {
    showLoading(true);
    const resp = await fetch(`${API}/Appointment/$book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error('Booking error:', err);
      alert('Error al agendar la cita. Por favor intenta de nuevo.');
      showLoading(false);
      return;
    }

    const result = await resp.json();
    let aptId = result.id || '';
    if (!aptId && result.resourceType === 'Bundle') {
      const aptEntry = (result.entry || []).find(e => e.resource?.resourceType === 'Appointment');
      if (aptEntry) aptId = aptEntry.resource.id;
    }

    const params = new URLSearchParams({
      id: aptId,
      specialty: selectedData.specialty,
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
