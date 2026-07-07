(function () {
    let panelVisible = false;
    let panelEl = null;

    function createPanel() {
        if (panelEl) return;

        panelEl = document.createElement('div');
        panelEl.id = 'fhir-inspector-panel';
        panelEl.innerHTML = `
            <div class="inspector-header">
                <div class="inspector-title">
                    <span class="material-icons" style="font-size:18px;color:#7c4dff">terminal</span>
                    <span>Inspector FHIR</span>
                    <span class="inspector-badge" id="inspector-count">0</span>
                </div>
                <div class="inspector-actions">
                    <button class="inspector-btn" onclick="fhirInspector.clearLogs(); renderInspectorLogs();" title="Limpiar logs">
                        <span class="material-icons" style="font-size:16px">delete_sweep</span>
                    </button>
                    <button class="inspector-btn" onclick="toggleInspectorPanel()" title="Minimizar">
                        <span class="material-icons" style="font-size:16px" id="inspector-toggle-icon">expand_more</span>
                    </button>
                    <button class="inspector-btn" onclick="closeInspectorPanel()" title="Cerrar">
                        <span class="material-icons" style="font-size:16px">close</span>
                    </button>
                </div>
            </div>
            <div class="inspector-body" id="inspector-body">
                <div class="inspector-empty" id="inspector-empty">
                    <span class="material-icons" style="font-size:32px;color:#bbb">cloud_off</span>
                    <span style="color:#999;font-size:13px">Sin peticiones aún.<br>Las operaciones CRUD aparecerán aquí.</span>
                </div>
                <div class="inspector-logs" id="inspector-logs"></div>
            </div>
        `;

        document.body.appendChild(panelEl);

        const style = document.createElement('style');
        style.textContent = `
            #fhir-inspector-panel {
                position: fixed;
                bottom: 16px;
                right: 16px;
                width: 480px;
                max-height: 60vh;
                background: #1e1e2e;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                z-index: 99999;
                font-family: 'Roboto', sans-serif;
                color: #cdd6f4;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #313244;
                transition: all 0.3s ease;
            }
            #fhir-inspector-panel.minimized .inspector-body {
                display: none;
            }
            #fhir-inspector-panel.minimized {
                max-height: 48px;
            }
            .inspector-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 14px;
                background: #181825;
                border-bottom: 1px solid #313244;
                cursor: pointer;
                flex-shrink: 0;
            }
            .inspector-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 600;
            }
            .inspector-badge {
                background: #7c4dff;
                color: #fff;
                font-size: 11px;
                font-weight: 700;
                padding: 1px 7px;
                border-radius: 10px;
                min-width: 18px;
                text-align: center;
            }
            .inspector-actions {
                display: flex;
                gap: 4px;
            }
            .inspector-btn {
                background: none;
                border: none;
                color: #a6adc8;
                cursor: pointer;
                padding: 4px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .inspector-btn:hover { background: #313244; color: #cdd6f4; }
            .inspector-body {
                overflow-y: auto;
                flex: 1;
                min-height: 100px;
            }
            .inspector-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 32px;
            }
            .inspector-logs { padding: 4px 0; }
            .inspector-log {
                border-bottom: 1px solid #313244;
                padding: 8px 14px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .inspector-log:hover { background: #252536; }
            .inspector-log.expanded { background: #252536; }
            .inspector-log-summary {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
            }
            .inspector-method {
                font-weight: 700;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 4px;
                min-width: 44px;
                text-align: center;
            }
            .method-get { background: #1e3a5f; color: #89b4fa; }
            .method-post { background: #1e3f2f; color: #a6e3a1; }
            .method-put { background: #3f2e1e; color: #f9e2af; }
            .method-delete { background: #3f1e1e; color: #f38ba8; }
            .inspector-status {
                font-weight: 600;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 4px;
            }
            .status-2xx { background: #1e3f2f; color: #a6e3a1; }
            .status-4xx { background: #3f2e1e; color: #f9e2af; }
            .status-5xx, .status-error { background: #3f1e1e; color: #f38ba8; }
            .inspector-endpoint {
                color: #a6adc8;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .inspector-source {
                color: #7c4dff;
                font-size: 10px;
                background: #232136;
                border: 1px solid #313244;
                border-radius: 4px;
                padding: 1px 6px;
                white-space: nowrap;
            }
            .inspector-duration {
                color: #585b70;
                font-size: 10px;
                white-space: nowrap;
            }
            .inspector-log-detail {
                display: none;
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #313244;
            }
            .inspector-log.expanded .inspector-log-detail { display: block; }
            .inspector-detail-section {
                margin-bottom: 8px;
            }
            .inspector-detail-label {
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #6c7086;
                margin-bottom: 4px;
            }
            .inspector-detail-code {
                background: #11111b;
                border: 1px solid #313244;
                border-radius: 6px;
                padding: 8px;
                font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
                font-size: 11px;
                line-height: 1.5;
                overflow-x: auto;
                max-height: 200px;
                overflow-y: auto;
                white-space: pre-wrap;
                word-break: break-all;
                color: #cdd6f4;
            }
            .inspector-copy-btn {
                float: right;
                background: #313244;
                border: none;
                color: #a6adc8;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 10px;
                cursor: pointer;
            }
            .inspector-copy-btn:hover { background: #45475a; color: #cdd6f4; }
            .inspector-floating-btn {
                position: fixed;
                bottom: 16px;
                right: 16px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: #7c4dff;
                color: #fff;
                border: none;
                box-shadow: 0 4px 16px rgba(124, 77, 255, 0.4);
                cursor: pointer;
                z-index: 99998;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                font-size: 24px;
            }
            .inspector-floating-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(124, 77, 255, 0.6);
            }
            .inspector-floating-btn .material-icons { color: #fff; }
        `;
        document.head.appendChild(style);

        fhirInspector.onLog((entry) => {
            updateInspectorBadge();
            if (panelVisible && entry) appendLogEntry(entry);
        });
    }

    function appendLogEntry(log) {
        const container = document.getElementById('inspector-logs');
        const empty = document.getElementById('inspector-empty');
        if (empty) empty.style.display = 'none';
        if (!container) return;

        const el = document.createElement('div');
        el.className = 'inspector-log';
        el.dataset.logId = log.id;
        el.innerHTML = buildLogHTML(log);
        el.onclick = () => {
            el.classList.toggle('expanded');
        };
        container.prepend(el);
    }

    function buildLogHTML(log) {
        const req = log.request;
        const res = log.response || {};
        const methodClass = `method-${req.method.toLowerCase()}`;
        let statusClass = '';
        if (res.status >= 200 && res.status < 300) statusClass = 'status-2xx';
        else if (res.status >= 400 && res.status < 500) statusClass = 'status-4xx';
        else if (res.status >= 500) statusClass = 'status-5xx';
        else if (!res.status) statusClass = 'status-error';

        const endpoint = req.url.replace(API_BASE_URL, '');
        const time = new Date(log.timestamp).toLocaleTimeString('es-CO');

        const curl = fhirInspector.formatRequestAsCurl(log);
        const responseText = fhirInspector.formatResponse(log);

        return `
            <div class="inspector-log-summary">
                <span class="inspector-method ${methodClass}">${req.method}</span>
                <span class="inspector-status ${statusClass}">${res.status || 'ERR'}</span>
                <span class="inspector-endpoint" title="${endpoint}">${endpoint}</span>
                <span class="inspector-source" title="Origen">${log.source || ''}</span>
                <span class="inspector-duration">${log.duration}ms</span>
                <span style="color:#585b70;font-size:10px">${time}</span>
            </div>
            <div class="inspector-log-detail">
                <div class="inspector-detail-section">
                    <div class="inspector-detail-label">
                        📤 REQUEST (cURL)
                        <button class="inspector-copy-btn" onclick="event.stopPropagation(); copyText(\`${escapeJS(curl)}\`)">Copiar</button>
                    </div>
                    <div class="inspector-detail-code">${escapeHTML(curl)}</div>
                </div>
                <div class="inspector-detail-section">
                    <div class="inspector-detail-label">
                        📥 RESPONSE (${res.status} ${res.statusText})
                        <button class="inspector-copy-btn" onclick="event.stopPropagation(); copyText(\`${escapeJS(responseText)}\`)">Copiar</button>
                    </div>
                    <div class="inspector-detail-code">${escapeHTML(responseText)}</div>
                </div>
            </div>
        `;
    }

    function renderInspectorLogs() {
        const container = document.getElementById('inspector-logs');
        const empty = document.getElementById('inspector-empty');
        if (!container) return;

        const logs = fhirInspector.getLogs();
        if (logs.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'flex';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = logs.map(log =>
            `<div class="inspector-log" data-log-id="${log.id}" onclick="this.classList.toggle('expanded')">
                <div class="inspector-log-summary">${buildLogHTML(log)}</div>
            </div>`
        ).join('');
    }

    function updateInspectorBadge() {
        const badge = document.getElementById('inspector-count');
        if (badge) badge.textContent = fhirInspector.getLogs().length;
    }

    function toggleInspectorPanel() {
        panelVisible = !panelVisible;
        if (panelEl) {
            panelEl.classList.toggle('minimized');
            const icon = document.getElementById('inspector-toggle-icon');
            if (icon) icon.textContent = panelVisible ? 'expand_more' : 'expand_less';
        }
        const btn = document.getElementById('fhir-inspector-btn');
        if (btn) btn.style.display = panelVisible ? 'none' : 'flex';
    }

    function closeInspectorPanel() {
        panelVisible = false;
        if (panelEl) panelEl.remove();
        panelEl = null;
        const btn = document.getElementById('fhir-inspector-btn');
        if (btn) btn.style.display = 'flex';
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>').replace(/\s/g, ' ');
    }

    function escapeJS(str) {
        if (!str) return '';
        return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    }

    function copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            const toast = document.createElement('div');
            toast.textContent = '✅ Copiado al portapapeles';
            toast.style.cssText = 'position:fixed;bottom:80px;right:16px;background:#2e7d32;color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;z-index:100000;font-family:Roboto,sans-serif;';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        });
    }

    window.toggleInspectorPanel = toggleInspectorPanel;
    window.closeInspectorPanel = closeInspectorPanel;
    window.renderInspectorLogs = renderInspectorLogs;
    window.copyText = copyText;

    const floatingBtn = document.createElement('button');
    floatingBtn.className = 'inspector-floating-btn';
    floatingBtn.id = 'fhir-inspector-btn';
    floatingBtn.innerHTML = '<span class="material-icons">terminal</span>';
    floatingBtn.title = 'Abrir Inspector FHIR';
    floatingBtn.onclick = () => {
        createPanel();
        toggleInspectorPanel();
        renderInspectorLogs();
    };
    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(floatingBtn);
    });
})();
