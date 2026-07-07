let dataCache = {};
let apiAvailable = false;

async function initFHIRData() {
    try {
        const resp = await fetch(`${API_BASE_URL}/metadata`, {
            headers: { 'Accept': 'application/fhir+json' }
        });
        apiAvailable = resp.ok;
    } catch (e) {
        apiAvailable = false;
    }

    if (apiAvailable) {
        await refreshAllResources();
    }

    document.dispatchEvent(new CustomEvent('fhirCacheReady'));
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
        const resources = [];
        let url = `${API_BASE_URL}/${resourceType}?_count=200`;
        while (url) {
            const resp = await fetch(url, { headers: { 'Accept': 'application/fhir+json' } });
            if (!resp.ok) break;
            const bundle = await resp.json();
            resources.push(...(bundle.entry || []).map(e => e.resource));
            url = bundle.link?.find(l => l.relation === 'next')?.url || null;
        }
        dataCache[resourceType] = resources;
    } catch (e) {
        dataCache[resourceType] = dataCache[resourceType] || [];
    }
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
    resource.resourceType = resourceType;
    resource.id = resource.id || generateId(resourceType);

    if (apiAvailable) {
        try {
            const log = await fhirInspector.request('PUT', `/${resourceType}/${resource.id}`, resource);
            if (log.success) {
                const created = log.response.body;
                const cache = getResources(resourceType);
                const idx = cache.findIndex(r => r.id === created.id);
                if (idx === -1) cache.push(created);
                else cache[idx] = created;
                dataCache[resourceType] = cache;
                return created;
            }
            throw new Error('El servidor FHIR rechazó la operación');
        } catch (e) {
            if (e.message !== 'El servidor FHIR rechazó la operación') showToast(`API no disponible, guardado localmente`, 'warning');
            throw e;
        }
    }

    const cache = getResources(resourceType);
    cache.push(resource);
    dataCache[resourceType] = cache;
    return resource;
}

async function updateResource(resourceType, id, resource) {
    resource.id = id;
    resource.resourceType = resourceType;

    if (apiAvailable) {
        try {
            const log = await fhirInspector.request('PUT', `/${resourceType}/${id}`, resource);
            if (log.success) {
                const updated = log.response.body;
                const cache = getResources(resourceType);
                const idx = cache.findIndex(r => r.id === id);
                if (idx !== -1) cache[idx] = updated;
                dataCache[resourceType] = cache;
                return updated;
            }
            throw new Error('El servidor FHIR rechazó la operación');
        } catch (e) {
            if (e.message !== 'El servidor FHIR rechazó la operación') showToast(`API no disponible, guardado localmente`, 'warning');
            throw e;
        }
    }

    const cache = getResources(resourceType);
    const idx = cache.findIndex(r => r.id === id);
    if (idx !== -1) cache[idx] = resource;
    dataCache[resourceType] = cache;
    return resource;
}

async function deleteResource(resourceType, id) {
    if (apiAvailable) {
        try {
            const log = await fhirInspector.request('DELETE', `/${resourceType}/${id}`);
            if (log.success || log.response.status === 204) {
                const cache = getResources(resourceType);
                dataCache[resourceType] = cache.filter(r => r.id !== id);
                return;
            }
            throw new Error('El servidor FHIR rechazó la operación');
        } catch (e) {
            if (e.message !== 'El servidor FHIR rechazó la operación') showToast(`API no disponible`, 'warning');
            throw e;
        }
    }

    const cache = getResources(resourceType);
    dataCache[resourceType] = cache.filter(r => r.id !== id);
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

function calculateAge(birthDateIso) {
    if (!birthDateIso) return '-';
    const birth = new Date(birthDateIso + 'T00:00:00');
    if (isNaN(birth.getTime())) return '-';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? `${age} años` : '-';
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
    localStorage.setItem('fhir_session', JSON.stringify(session));
    return session;
}

function getSession() {
    let s = localStorage.getItem('fhir_session');
    if (!s) s = sessionStorage.getItem('fhir_session');
    return s ? JSON.parse(s) : null;
}

function logout() {
    localStorage.removeItem('fhir_session');
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
