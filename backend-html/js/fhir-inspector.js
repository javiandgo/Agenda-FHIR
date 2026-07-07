const FHIR_INSPECTOR_STORAGE_KEY = 'fhir_inspector_logs';

class FHIRInspector {
    constructor() {
        this.logs = this._loadLogs();
        this.listeners = [];
        this.maxLogs = 100;
    }

    _loadLogs() {
        try {
            const raw = localStorage.getItem(FHIR_INSPECTOR_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    _saveLogs() {
        try {
            localStorage.setItem(FHIR_INSPECTOR_STORAGE_KEY, JSON.stringify(this.logs));
        } catch (e) {
            // Cuota de localStorage excedida u otro error: se conserva el log en memoria.
        }
    }

    async request(method, endpoint, body = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        const logEntry = {
            id: 'log-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
            timestamp: new Date().toISOString(),
            source: (typeof location !== 'undefined' ? location.pathname.split('/').pop() : '') || 'index.html',
            request: {
                method: method.toUpperCase(),
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/fhir+json'
                },
                body: body
            },
            response: null,
            duration: null,
            success: false
        };

        const start = performance.now();
        try {
            const options = {
                method: method.toUpperCase(),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/fhir+json'
                }
            };
            if (body && method.toUpperCase() !== 'GET') {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(url, options);
            let responseData = null;
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('json')) {
                responseData = await response.json();
            } else {
                const text = await response.text();
                try { responseData = JSON.parse(text); } catch (e) { responseData = text; }
            }

            logEntry.response = {
                status: response.status,
                statusText: response.statusText,
                headers: {
                    'Content-Type': contentType,
                },
                body: responseData
            };
            logEntry.duration = Math.round(performance.now() - start);
            logEntry.success = response.ok;
        } catch (err) {
            logEntry.response = {
                status: 0,
                statusText: 'Network Error',
                error: err.message
            };
            logEntry.duration = Math.round(performance.now() - start);
            logEntry.success = false;
        }

        this.logs.unshift(logEntry);
        if (this.logs.length > this.maxLogs) this.logs.pop();
        this._saveLogs();
        this.notify(logEntry);
        return logEntry;
    }

    get(endpoint) { return this.request('GET', endpoint); }
    post(endpoint, body) { return this.request('POST', endpoint, body); }
    put(endpoint, body) { return this.request('PUT', endpoint, body); }
    delete(endpoint) { return this.request('DELETE', endpoint); }

    getLogs() { return this.logs; }
    clearLogs() {
        this.logs = [];
        this._saveLogs();
        this.notify(null);
    }
    onLog(callback) { this.listeners.push(callback); }
    notify(entry) { this.listeners.forEach(fn => fn(entry)); }

    formatRequestAsCurl(logEntry) {
        const req = logEntry.request;
        let curl = `curl -X ${req.method} "${req.url}"`;
        for (const [key, val] of Object.entries(req.headers)) {
            curl += ` \\\n  -H "${key}: ${val}"`;
        }
        if (req.body) {
            curl += ` \\\n  -d '${JSON.stringify(req.body, null, 2)}'`;
        }
        return curl;
    }

    formatResponse(logEntry) {
        const res = logEntry.response;
        if (!res) return 'Sin respuesta';
        let output = `HTTP/1.1 ${res.status} ${res.statusText}\n`;
        for (const [key, val] of Object.entries(res.headers || {})) {
            output += `${key}: ${val}\n`;
        }
        output += '\n';
        if (res.body) {
            output += JSON.stringify(res.body, null, 2);
        }
        if (res.error) {
            output += `\nERROR: ${res.error}`;
        }
        return output;
    }
}

const fhirInspector = new FHIRInspector();
