const FHIR_BASE = 'fhir_db';
let dataCache = {};
let apiAvailable = false;

async function initFHIRData() {
    if (localStorage.getItem(`${FHIR_BASE}_initialized`)) {
        loadCacheFromLocalStorage();
    } else {
        seedLocalData();
        saveCacheToLocalStorage();
        localStorage.setItem(`${FHIR_BASE}_initialized`, 'true');
    }

    document.dispatchEvent(new CustomEvent('fhirCacheReady'));

    try {
        const resp = await fetch(`${API_BASE_URL}/metadata`);
        if (resp.ok) {
            apiAvailable = true;
            await refreshAllResources();
            saveCacheToLocalStorage();
        }
    } catch (e) {}
}

function loadCacheFromLocalStorage() {
    const types = ['Organization', 'Location', 'Practitioner', 'PractitionerRole', 'HealthcareService', 'Schedule', 'Slot', 'Patient', 'Coverage', 'Appointment', 'AppointmentResponse'];
    types.forEach(t => {
        const data = localStorage.getItem(`${FHIR_BASE}_${t}`);
        dataCache[t] = data ? JSON.parse(data) : [];
    });
}

function saveCacheToLocalStorage() {
    Object.keys(dataCache).forEach(t => {
        localStorage.setItem(`${FHIR_BASE}_${t}`, JSON.stringify(dataCache[t]));
    });
}

async function refreshAllResources() {
    const types = ['Organization', 'Location', 'Practitioner', 'PractitionerRole', 'HealthcareService', 'Schedule', 'Slot', 'Patient', 'Coverage', 'Appointment', 'AppointmentResponse'];
    for (const t of types) {
        await refreshResourceCache(t);
    }
}

async function refreshResourceCache(resourceType) {
    if (!apiAvailable) return;
    try {
        const result = await fhirInspector.get('/' + resourceType);
        if (result.success && result.response.body && result.response.body.entry) {
            dataCache[resourceType] = result.response.body.entry.map(e => e.resource);
        }
    } catch (e) {}
}

function seedLocalData() {
    dataCache['Organization'] = [
        { resourceType: 'Organization', id: 'org-acme', identifier: [{ system: 'urn:co:nit', value: '1100155555' }], active: true, name: 'ACME Salud S.A.', telecom: [{ system: 'phone', value: '+57 1 3456789' }], address: [{ city: 'Bogotá', country: 'CO' }] },
        { resourceType: 'Organization', id: 'ins-salud-completa', identifier: [{ system: 'urn:co:nit', value: '800123001-5' }], active: true, name: 'Salud Completa EPS', type: [{ coding: [{ code: 'ins', display: 'Insurance Company' }] }] },
        { resourceType: 'Organization', id: 'ins-salud-cooperativa', identifier: [{ system: 'urn:co:nit', value: '860007336-3' }], active: true, name: 'Salud Cooperativa EPS', type: [{ coding: [{ code: 'ins', display: 'Insurance Company' }] }] },
    ];
    dataCache['Location'] = [
        { resourceType: 'Location', id: 'loc-norte', status: 'active', name: 'Clínica Norte', identifier: [{ system: 'urn:co:acme:sede', value: '1100155555-1' }], address: { city: 'Bogotá', line: ['Carrera 7 #100-50'], country: 'CO' }, telecom: [{ system: 'phone', value: '+57 1 234 5679' }], managingOrganization: { reference: 'Organization/org-acme', display: 'ACME Salud' } },
        { resourceType: 'Location', id: 'loc-centro', status: 'active', name: 'Clínica Centro', identifier: [{ system: 'urn:co:acme:sede', value: '1100155555-2' }], address: { city: 'Bogotá', line: ['Calle 45 #15-30'], country: 'CO' }, telecom: [{ system: 'phone', value: '+57 1 234 5680' }], managingOrganization: { reference: 'Organization/org-acme', display: 'ACME Salud' } },
        { resourceType: 'Location', id: 'loc-sur', status: 'active', name: 'Clínica Sur', identifier: [{ system: 'urn:co:acme:sede', value: '1100155555-3' }], address: { city: 'Bogotá', line: ['Autopista Sur #85-20'], country: 'CO' }, telecom: [{ system: 'phone', value: '+57 1 234 5681' }], managingOrganization: { reference: 'Organization/org-acme', display: 'ACME Salud' } },
    ];
    dataCache['Practitioner'] = [
        { resourceType: 'Practitioner', id: 'prac-casas', active: true, name: [{ use: 'official', family: 'Casas', given: ['Gregorio'], prefix: ['Dr.'] }], telecom: [{ system: 'phone', value: '+57 300 1234567' }], gender: 'male' },
        { resourceType: 'Practitioner', id: 'prac-luna', active: true, name: [{ use: 'official', family: 'Luna', given: ['Elmer'], prefix: ['Dr.'] }], telecom: [{ system: 'phone', value: '+57 300 2345678' }], gender: 'male' },
        { resourceType: 'Practitioner', id: 'prac-chavez', active: true, name: [{ use: 'official', family: 'Chávez', given: ['Luis', 'Manuel'], prefix: ['Dr.'] }], gender: 'male' },
        { resourceType: 'Practitioner', id: 'prac-silva', active: true, name: [{ use: 'official', family: 'Silva', given: ['Alvaro'], prefix: ['Dr.'] }], gender: 'male' },
        { resourceType: 'Practitioner', id: 'prac-narvaez', active: true, name: [{ use: 'official', family: 'Narvaez', given: ['Diego'], prefix: ['Dr.'] }], gender: 'male' },
        { resourceType: 'Practitioner', id: 'prac-fonseca', active: true, name: [{ use: 'official', family: 'Fonseca', given: ['Alonso'], prefix: ['Dr.'] }], gender: 'male' },
    ];
    dataCache['HealthcareService'] = [
        { resourceType: 'HealthcareService', id: 'hs-norte', active: true, providedBy: { reference: 'Organization/org-acme', display: 'ACME Salud' }, name: 'Consulta Externa - Clínica Norte', location: [{ reference: 'Location/loc-norte', display: 'Clínica Norte' }], type: [{ coding: [{ code: '394814009', display: 'Medicina General' }] }, { coding: [{ code: '394537008', display: 'Pediatría' }] }, { coding: [{ code: '394586005', display: 'Gineco Obstetricia' }] }] },
        { resourceType: 'HealthcareService', id: 'hs-centro', active: true, providedBy: { reference: 'Organization/org-acme', display: 'ACME Salud' }, name: 'Consulta Externa - Clínica Centro', location: [{ reference: 'Location/loc-centro', display: 'Clínica Centro' }], type: [{ coding: [{ code: '394814009', display: 'Medicina General' }] }, { coding: [{ code: '394810000', display: 'Nefrología' }] }, { coding: [{ code: '394582007', display: 'Gastroenterología' }] }] },
        { resourceType: 'HealthcareService', id: 'hs-sur', active: true, providedBy: { reference: 'Organization/org-acme', display: 'ACME Salud' }, name: 'Consulta Externa - Clínica Sur', location: [{ reference: 'Location/loc-sur', display: 'Clínica Sur' }], type: [{ coding: [{ code: '394814009', display: 'Medicina General' }] }, { coding: [{ code: '394593009', display: 'Oncología' }] }, { coding: [{ code: '394802001', display: 'Cardiología' }] }] },
    ];
    dataCache['PractitionerRole'] = [
        { resourceType: 'PractitionerRole', id: 'role-casas', active: true, practitioner: { reference: 'Practitioner/prac-casas', display: 'Dr. Gregorio Casas' }, organization: { reference: 'Organization/org-acme' }, code: [{ coding: [{ code: '394537008', display: 'Pediatra' }] }], specialty: [{ coding: [{ code: '394537008', display: 'Pediatría' }] }], location: [{ reference: 'Location/loc-norte', display: 'Clínica Norte' }], healthcareService: [{ reference: 'HealthcareService/hs-norte' }] },
        { resourceType: 'PractitionerRole', id: 'role-luna', active: true, practitioner: { reference: 'Practitioner/prac-luna', display: 'Dr. Elmer Luna' }, organization: { reference: 'Organization/org-acme' }, code: [{ coding: [{ code: '394586005', display: 'Ginecólogo' }] }], specialty: [{ coding: [{ code: '394586005', display: 'Gineco Obstetricia' }] }], location: [{ reference: 'Location/loc-norte', display: 'Clínica Norte' }], healthcareService: [{ reference: 'HealthcareService/hs-norte' }] },
        { resourceType: 'PractitionerRole', id: 'role-chavez', active: true, practitioner: { reference: 'Practitioner/prac-chavez', display: 'Dr. Luis Chávez' }, organization: { reference: 'Organization/org-acme' }, code: [{ coding: [{ code: '394810000', display: 'Nefrólogo' }] }], specialty: [{ coding: [{ code: '394810000', display: 'Nefrología' }] }], location: [{ reference: 'Location/loc-centro', display: 'Clínica Centro' }], healthcareService: [{ reference: 'HealthcareService/hs-centro' }] },
        { resourceType: 'PractitionerRole', id: 'role-silva', active: true, practitioner: { reference: 'Practitioner/prac-silva', display: 'Dr. Alvaro Silva' }, organization: { reference: 'Organization/org-acme' }, code: [{ coding: [{ code: '394582007', display: 'Gastroenterólogo' }] }], specialty: [{ coding: [{ code: '394582007', display: 'Gastroenterología' }] }], location: [{ reference: 'Location/loc-centro', display: 'Clínica Centro' }], healthcareService: [{ reference: 'HealthcareService/hs-centro' }] },
        { resourceType: 'PractitionerRole', id: 'role-narvaez', active: true, practitioner: { reference: 'Practitioner/prac-narvaez', display: 'Dr. Diego Narvaez' }, organization: { reference: 'Organization/org-acme' }, code: [{ coding: [{ code: '394593009', display: 'Oncólogo' }] }], specialty: [{ coding: [{ code: '394593009', display: 'Oncología' }] }], location: [{ reference: 'Location/loc-sur', display: 'Clínica Sur' }], healthcareService: [{ reference: 'HealthcareService/hs-sur' }] },
        { resourceType: 'PractitionerRole', id: 'role-fonseca', active: true, practitioner: { reference: 'Practitioner/prac-fonseca', display: 'Dr. Alonso Fonseca' }, organization: { reference: 'Organization/org-acme' }, code: [{ coding: [{ code: '394802001', display: 'Cardiólogo' }] }], specialty: [{ coding: [{ code: '394802001', display: 'Cardiología' }] }], location: [{ reference: 'Location/loc-sur', display: 'Clínica Sur' }], healthcareService: [{ reference: 'HealthcareService/hs-sur' }] },
    ];
    dataCache['Patient'] = [
        { resourceType: 'Patient', id: 'pat-001', identifier: [{ system: 'urn:co:cc', value: '1020123456' }], active: true, name: [{ use: 'official', family: 'Rodríguez', given: ['María', 'Fernanda'] }], telecom: [{ system: 'phone', value: '+57 310 5678901' }], gender: 'female', birthDate: '1990-03-15' },
        { resourceType: 'Patient', id: 'pat-002', identifier: [{ system: 'urn:co:cc', value: '79987654' }], active: true, name: [{ use: 'official', family: 'Gómez', given: ['Carlos', 'Andrés'] }], telecom: [{ system: 'phone', value: '+57 320 1234567' }], gender: 'male', birthDate: '1985-07-22' },
        { resourceType: 'Patient', id: 'pat-003', identifier: [{ system: 'urn:co:cc', value: '52456789' }], active: true, name: [{ use: 'official', family: 'Martínez', given: ['Luisa', 'Carolina'] }], telecom: [{ system: 'phone', value: '+57 315 9876543' }], gender: 'female', birthDate: '1995-11-08' },
        { resourceType: 'Patient', id: 'pat-004', identifier: [{ system: 'urn:co:cc', value: '1030543210' }], active: true, name: [{ use: 'official', family: 'Pérez', given: ['Ana', 'Sofía'] }], gender: 'female', birthDate: '2000-01-10' },
        { resourceType: 'Patient', id: 'pat-005', identifier: [{ system: 'urn:co:cc', value: '80123456' }], active: true, name: [{ use: 'official', family: 'López', given: ['Jorge', 'Enrique'] }], gender: 'male', birthDate: '1975-06-30' },
    ];
    dataCache['Coverage'] = [
        { resourceType: 'Coverage', id: 'cov-001', status: 'active', type: { coding: [{ code: 'PUBLICPOL', display: 'Contributivo' }] }, beneficiary: { reference: 'Patient/pat-001' }, subscriber: { reference: 'Patient/pat-001' }, payor: [{ reference: 'Organization/ins-salud-completa', display: 'Salud Completa' }], period: { start: '2026-01-01', end: '2026-12-31' }, _consultaDuracion: 30 },
        { resourceType: 'Coverage', id: 'cov-002', status: 'active', type: { coding: [{ code: 'SUBSIDPAD', display: 'Subsidiado' }] }, beneficiary: { reference: 'Patient/pat-002' }, subscriber: { reference: 'Patient/pat-002' }, payor: [{ reference: 'Organization/ins-salud-cooperativa', display: 'Salud Cooperativa' }], period: { start: '2026-01-01', end: '2026-12-31' }, _consultaDuracion: 20 },
        { resourceType: 'Coverage', id: 'cov-003', status: 'active', type: { coding: [{ code: 'PUBLICPOL', display: 'Contributivo' }] }, beneficiary: { reference: 'Patient/pat-003' }, subscriber: { reference: 'Patient/pat-003' }, payor: [{ reference: 'Organization/ins-salud-completa', display: 'Salud Completa' }], period: { start: '2026-01-01', end: '2026-12-31' }, _consultaDuracion: 30 },
        { resourceType: 'Coverage', id: 'cov-004', status: 'active', type: { coding: [{ code: 'PUBLICPOL', display: 'Contributivo' }] }, beneficiary: { reference: 'Patient/pat-004' }, subscriber: { reference: 'Patient/pat-004' }, payor: [{ reference: 'Organization/ins-salud-cooperativa', display: 'Salud Cooperativa' }], period: { start: '2026-01-01', end: '2026-12-31' }, _consultaDuracion: 20 },
        { resourceType: 'Coverage', id: 'cov-005', status: 'active', type: { coding: [{ code: 'PUBLICPOL', display: 'Contributivo' }] }, beneficiary: { reference: 'Patient/pat-005' }, subscriber: { reference: 'Patient/pat-005' }, payor: [{ reference: 'Organization/ins-salud-completa', display: 'Salud Completa' }], period: { start: '2026-01-01', end: '2026-12-31' }, _consultaDuracion: 30 },
    ];
    dataCache['Schedule'] = [
        // Agendas por HealthcareService (REQ: cada servicio especializado tiene su propia agenda mensual)
        { resourceType: 'Schedule', id: 'sch-hs-norte-jul', active: true, identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-HS-NORTE-2026-07' }], serviceType: [{ coding: [{ code: '394814009', display: 'Medicina General' }] }, { coding: [{ code: '394537008', display: 'Pediatría' }] }, { coding: [{ code: '394586005', display: 'Gineco Obstetricia' }] }], actor: [{ reference: 'HealthcareService/hs-norte', display: 'Consulta Externa - Clínica Norte' }, { reference: 'Location/loc-norte', display: 'Clínica Norte' }], planningHorizon: { start: '2026-07-01', end: '2026-07-31' }, comment: 'Agenda mensual Julio 2026 — Consulta Externa Clínica Norte' },
        { resourceType: 'Schedule', id: 'sch-hs-centro-jul', active: true, identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-HS-CENTRO-2026-07' }], serviceType: [{ coding: [{ code: '394814009', display: 'Medicina General' }] }, { coding: [{ code: '394810000', display: 'Nefrología' }] }, { coding: [{ code: '394582007', display: 'Gastroenterología' }] }], actor: [{ reference: 'HealthcareService/hs-centro', display: 'Consulta Externa - Clínica Centro' }, { reference: 'Location/loc-centro', display: 'Clínica Centro' }], planningHorizon: { start: '2026-07-01', end: '2026-07-31' }, comment: 'Agenda mensual Julio 2026 — Consulta Externa Clínica Centro' },
        { resourceType: 'Schedule', id: 'sch-hs-sur-jul', active: true, identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-HS-SUR-2026-07' }], serviceType: [{ coding: [{ code: '394814009', display: 'Medicina General' }] }, { coding: [{ code: '394593009', display: 'Oncología' }] }, { coding: [{ code: '394802001', display: 'Cardiología' }] }], actor: [{ reference: 'HealthcareService/hs-sur', display: 'Consulta Externa - Clínica Sur' }, { reference: 'Location/loc-sur', display: 'Clínica Sur' }], planningHorizon: { start: '2026-07-01', end: '2026-07-31' }, comment: 'Agenda mensual Julio 2026 — Consulta Externa Clínica Sur' },
        // Agendas por Practitioner (REQ: cada médico especialista tiene su propia agenda mensual)
        { resourceType: 'Schedule', id: 'sch-casas-jul', active: true, identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-CASAS-2026-07' }], serviceType: [{ coding: [{ code: '394537008', display: 'Pediatría' }] }], actor: [{ reference: 'Practitioner/prac-casas', display: 'Dr. Gregorio Casas' }, { reference: 'Location/loc-norte', display: 'Clínica Norte' }, { reference: 'HealthcareService/hs-norte', display: 'Consulta Externa - Clínica Norte' }], planningHorizon: { start: '2026-07-01', end: '2026-07-31' }, comment: 'Agenda mensual Julio 2026 — Dr. Gregorio Casas, Pediatría' },
        { resourceType: 'Schedule', id: 'sch-luna-jul', active: true, identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-LUNA-2026-07' }], serviceType: [{ coding: [{ code: '394586005', display: 'Gineco Obstetricia' }] }], actor: [{ reference: 'Practitioner/prac-luna', display: 'Dr. Elmer Luna' }, { reference: 'Location/loc-norte', display: 'Clínica Norte' }, { reference: 'HealthcareService/hs-norte', display: 'Consulta Externa - Clínica Norte' }], planningHorizon: { start: '2026-07-01', end: '2026-07-31' }, comment: 'Agenda mensual Julio 2026 — Dr. Elmer Luna, Gineco Obstetricia' },
        { resourceType: 'Schedule', id: 'sch-chavez-jul', active: true, identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-CHAVEZ-2026-07' }], serviceType: [{ coding: [{ code: '394810000', display: 'Nefrología' }] }], actor: [{ reference: 'Practitioner/prac-chavez', display: 'Dr. Luis Chávez' }, { reference: 'Location/loc-centro', display: 'Clínica Centro' }, { reference: 'HealthcareService/hs-centro', display: 'Consulta Externa - Clínica Centro' }], planningHorizon: { start: '2026-07-01', end: '2026-07-31' }, comment: 'Agenda mensual Julio 2026 — Dr. Luis Chávez, Nefrología' },
        { resourceType: 'Schedule', id: 'sch-silva-jul', active: true, identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-SILVA-2026-07' }], serviceType: [{ coding: [{ code: '394582007', display: 'Gastroenterología' }] }], actor: [{ reference: 'Practitioner/prac-silva', display: 'Dr. Alvaro Silva' }, { reference: 'Location/loc-centro', display: 'Clínica Centro' }, { reference: 'HealthcareService/hs-centro', display: 'Consulta Externa - Clínica Centro' }], planningHorizon: { start: '2026-07-01', end: '2026-07-31' }, comment: 'Agenda mensual Julio 2026 — Dr. Alvaro Silva, Gastroenterología' },
        { resourceType: 'Schedule', id: 'sch-narvaez-jul', active: true, identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-NARVAEZ-2026-07' }], serviceType: [{ coding: [{ code: '394593009', display: 'Oncología' }] }], actor: [{ reference: 'Practitioner/prac-narvaez', display: 'Dr. Diego Narvaez' }, { reference: 'Location/loc-sur', display: 'Clínica Sur' }, { reference: 'HealthcareService/hs-sur', display: 'Consulta Externa - Clínica Sur' }], planningHorizon: { start: '2026-07-01', end: '2026-07-31' }, comment: 'Agenda mensual Julio 2026 — Dr. Diego Narvaez, Oncología' },
        { resourceType: 'Schedule', id: 'sch-fonseca-jul', active: true, identifier: [{ system: 'urn:co:acme:schedule', value: 'SCH-FONSECA-2026-07' }], serviceType: [{ coding: [{ code: '394802001', display: 'Cardiología' }] }], actor: [{ reference: 'Practitioner/prac-fonseca', display: 'Dr. Alonso Fonseca' }, { reference: 'Location/loc-sur', display: 'Clínica Sur' }, { reference: 'HealthcareService/hs-sur', display: 'Consulta Externa - Clínica Sur' }], planningHorizon: { start: '2026-07-01', end: '2026-07-31' }, comment: 'Agenda mensual Julio 2026 — Dr. Alonso Fonseca, Cardiología' },
    ];
    dataCache['Slot'] = [];
    const startTime = new Date('2026-07-07T08:00:00-05:00').getTime();
    let slotCounter = 1;
    for (let d = 0; d < 5; d++) {
        const dayStart = startTime + (d * 86400000);
        const dayOfWeek = new Date(dayStart).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        for (let i = 0; i < 8; i++) {
            const slotStart = dayStart + (i * 45 * 60000);
            const slotEnd = slotStart + (45 * 60000);
            dataCache['Slot'].push({
                resourceType: 'Slot', id: 'slot-casas-' + String(slotCounter).padStart(3, '0'),
                schedule: { reference: 'Schedule/sch-casas-jul' },
                serviceType: [{ coding: [{ code: '394537008', display: 'Pediatría' }] }],
                status: (slotCounter === 1) ? 'busy' : 'free',
                start: new Date(slotStart).toISOString(), end: new Date(slotEnd).toISOString()
            });
            slotCounter++;
        }
    }
    dataCache['Appointment'] = [
        { resourceType: 'Appointment', id: 'apt-001', status: 'booked', serviceType: [{ coding: [{ code: '394537008', display: 'Pediatría' }], text: 'Pediatría' }], appointmentType: { coding: [{ code: 'ROUTINE', display: 'Primera vez' }], text: 'Primera vez' }, slot: [{ reference: 'Slot/slot-casas-001' }], start: '2026-07-07T08:00:00-05:00', end: '2026-07-07T08:45:00-05:00', minutesDuration: 45, created: '2026-06-20T10:30:00Z', comment: 'Paciente con cobertura Salud Completa — Duración 45 min (primera vez especializada).', participant: [{ actor: { reference: 'Patient/pat-001', display: 'María Fernanda Rodríguez' }, status: 'accepted', required: 'required' }, { actor: { reference: 'Practitioner/prac-casas', display: 'Dr. Gregorio Casas' }, status: 'accepted', required: 'required' }, { actor: { reference: 'Location/loc-norte', display: 'Clínica Norte' }, status: 'accepted', required: 'required' }, { actor: { reference: 'HealthcareService/hs-norte', display: 'Consulta Externa - Clínica Norte' }, status: 'accepted', required: 'required' }] },
        { resourceType: 'Appointment', id: 'apt-002', status: 'pending', serviceType: [{ coding: [{ code: '394537008', display: 'Pediatría' }], text: 'Pediatría' }], appointmentType: { coding: [{ code: 'FOLLOWUP', display: 'Control' }], text: 'Control' }, slot: [{ reference: 'Slot/slot-casas-004' }], start: '2026-07-07T09:45:00-05:00', end: '2026-07-07T10:15:00-05:00', minutesDuration: 30, created: '2026-06-21T14:00:00Z', comment: 'Paciente con cobertura Salud Cooperativa — Duración 30 min (control especializada).', participant: [{ actor: { reference: 'Patient/pat-002', display: 'Carlos Andrés Gómez' }, status: 'needs-action', required: 'required' }, { actor: { reference: 'Practitioner/prac-casas', display: 'Dr. Gregorio Casas' }, status: 'accepted', required: 'required' }, { actor: { reference: 'Location/loc-norte', display: 'Clínica Norte' }, status: 'accepted', required: 'required' }] },
    ];
    dataCache['AppointmentResponse'] = [
        { resourceType: 'AppointmentResponse', id: 'apr-apt-001', appointment: { reference: 'Appointment/apt-001', display: 'Cita pediatría - María Fernanda Rodríguez' }, start: '2026-07-07T08:00:00-05:00', end: '2026-07-07T08:45:00-05:00', participantType: [{ coding: [{ code: 'PART', display: 'Participation' }] }], participantStatus: 'accepted', actor: { reference: 'Patient/pat-001', display: 'María Fernanda Rodríguez' }, comment: 'Cita confirmada. Servicio: Pediatría. Médico: Dr. Gregorio Casas. Clínica Norte — 07/07/2026 08:00-08:45. Por favor llegar 15 min antes con documento de identidad y carné de la EPS.' },
    ];
    Object.keys(dataCache).forEach(t => {
        if (!dataCache[t]) dataCache[t] = [];
    });
}

function getResources(resourceType) {
    if (!dataCache[resourceType]) dataCache[resourceType] = [];
    return dataCache[resourceType];
}

function getResource(resourceType, id) {
    if (!id) return null;
    const resources = getResources(resourceType);
    return resources.find(r => r.id === id) || null;
}

async function createResource(resourceType, resource) {
    resource.id = resource.id || generateId(resourceType);
    resource.meta = { versionId: '1', lastUpdated: new Date().toISOString() };

    if (apiAvailable) {
        try {
            const result = await fhirInspector.post('/' + resourceType, resource);
            if (result.success && result.response.body) {
                const created = result.response.body;
                const cache = getResources(resourceType);
                cache.push(created);
                dataCache[resourceType] = cache;
                saveCacheToLocalStorage();
                showToast(`${resourceType} creado en servidor FHIR`, 'success');
                return created;
            }
        } catch (e) {
            showToast(`API no disponible, guardado localmente`, 'warning');
        }
    }

    const cache = getResources(resourceType);
    cache.push(resource);
    dataCache[resourceType] = cache;
    saveCacheToLocalStorage();
    return resource;
}

async function updateResource(resourceType, id, resource) {
    resource.id = id;
    const existing = getResource(resourceType, id);
    resource.meta = { ...(existing?.meta || {}), versionId: String(parseInt(existing?.meta?.versionId || '0') + 1), lastUpdated: new Date().toISOString() };

    if (apiAvailable) {
        try {
            const result = await fhirInspector.put('/' + resourceType + '/' + id, resource);
            if (result.success && result.response.body) {
                const updated = result.response.body;
                const cache = getResources(resourceType);
                const idx = cache.findIndex(r => r.id === id);
                if (idx !== -1) cache[idx] = updated;
                dataCache[resourceType] = cache;
                saveCacheToLocalStorage();
                showToast(`${resourceType}/${id} actualizado en servidor FHIR`, 'success');
                return updated;
            }
        } catch (e) {
            showToast(`API no disponible, guardado localmente`, 'warning');
        }
    }

    const cache = getResources(resourceType);
    const idx = cache.findIndex(r => r.id === id);
    if (idx !== -1) cache[idx] = resource;
    dataCache[resourceType] = cache;
    saveCacheToLocalStorage();
    return resource;
}

async function deleteResource(resourceType, id) {
    if (apiAvailable) {
        try {
            const result = await fhirInspector.delete('/' + resourceType + '/' + id);
            if (result.success) {
                const cache = getResources(resourceType);
                dataCache[resourceType] = cache.filter(r => r.id !== id);
                saveCacheToLocalStorage();
                showToast(`${resourceType}/${id} eliminado del servidor FHIR`, 'success');
                return;
            }
        } catch (e) {}
    }

    const cache = getResources(resourceType);
    dataCache[resourceType] = cache.filter(r => r.id !== id);
    saveCacheToLocalStorage();
}

function generateId(prefix) {
    return `${prefix.toLowerCase().substring(0, 3)}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
}

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

const LOCAL_USERS = {
    'admin@acmesalud.co': { password: 'admin123', role: 'admin', name: 'Administrador ACME', patientId: null },
    'paciente@acmesalud.co': { password: 'paciente123', role: 'patient', name: 'María Fernanda Rodríguez', patientId: 'pat-001' },
    'carlos@acmesalud.co': { password: 'carlos123', role: 'patient', name: 'Carlos Andrés Gómez', patientId: 'pat-002' },
};

function login(email, password, role) {
    const user = LOCAL_USERS[email];
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

function openModal(id) { document.getElementById(id)?.classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

function renderSidebarUser(session) {
    const el = document.getElementById('sidebar-user-name');
    const er = document.getElementById('sidebar-user-role');
    if (el) el.textContent = session.name;
    if (er) er.textContent = session.role === 'admin' ? 'Administrador' : 'Paciente';
}

document.addEventListener('DOMContentLoaded', () => {
    initFHIRData().then(() => {
        const event = new CustomEvent('fhirCacheReady');
        document.dispatchEvent(event);
    });

    const current = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href && href === current) item.classList.add('active');
    });

    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    document.querySelectorAll('[data-logout]').forEach(btn => {
        btn.addEventListener('click', logout);
    });
});
