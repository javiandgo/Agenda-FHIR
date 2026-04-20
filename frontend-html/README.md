# Frontend HTML - ACME Salud

Interfaz de usuario independiente para el sistema de agendamiento de citas FHIR, implementada con **Material Design 3** y diseño inspirado en Keralty.

## 📂 Estructura de Archivos

```
frontend-html/
├── index.html              # Página principal/inicio
├── agendar-cita.html       # Flujo de agendamiento (4 pasos)
├── confirmacion.html       # Confirmación de cita agendada
├── css/
│   ├── styles.css          # Estilos globales + Material Design 3
│   └── agendar.css         # Estilos específicos del flujo de agendamiento
└── js/
    ├── main.js             # Scripts generales (smooth scroll, animaciones)
    └── agendar.js          # Lógica del wizard de agendamiento
```

## 🎨 Sistema de Diseño

### Paleta de Colores (Material Design 3)

```css
--md-sys-color-primary: #0066cc /* Azul principal (Keralty) */ --md-sys-color-secondary: #00a859 /* Verde secundario (Keralty) */ --md-sys-color-tertiary: #7b61ff /* Acento morado */ --md-sys-color-error: #ba1a1a /* Rojo error */;
```

### Tipografía

- **Fuente**: Roboto (300, 400, 500, 700)
- **Escala tipográfica**: Material Design 3 Typescale
- **Iconos**: Material Icons

## 🧩 Componentes Material Design 3

### Utilizados

- `md-top-app-bar` - Barra de navegación
- `md-filled-button` - Botones principales
- `md-outlined-button` - Botones secundarios
- `md-text-button` - Botones de texto
- `md-outlined-card` - Tarjetas de contenido
- `md-filter-chip` - Chips de filtro
- `md-checkbox` - Casillas de verificación
- `md-outlined-text-field` - Campos de texto
- `md-icon` - Iconos Material

### Documentación

https://material-web.dev/

## 📄 Páginas Implementadas

### 1. index.html - Página Principal

**Secciones:**

- Hero con CTA
- Características del servicio (3 tarjetas)
- Clínicas disponibles (3 ubicaciones)
- Footer con información de contacto

**Estado**: ✅ Completo

### 2. agendar-cita.html - Agendamiento

**Flujo de 4 pasos:**

1. **Selección de Especialidad**: Grid con 6 especialidades comunes
2. **Selección de Médico**: Lista de profesionales con filtro por ubicación
3. **Fecha y Hora**: Calendario + slots horarios (mañana/tarde)
4. **Confirmación**: Resumen y aceptación de términos

**Estado**: ✅ Completo (HTML + CSS + JS)

### 3. confirmacion.html - Confirmación

**Contenido:**

- Resumen de la cita agendada
- Instrucciones pre-cita
- Opciones para agregar al calendario

**Estado**: ⏳ Pendiente

## 🚀 Cómo Usar

### 1. Servidor Local

```bash
# Opción 1: Python
cd frontend-html
python -m http.server 8000

# Opción 2: PHP
php -S localhost:8000

# Opción 3: Node.js (http-server)
npx http-server -p 8000
```

### 2. XAMPP

Copiar carpeta `frontend-html` a `htdocs/` y acceder a:

```
http://localhost/Agenda-FHIR/frontend-html/
```

### 3. Producción

Servir archivos estáticos desde cualquier servidor web (Apache, Nginx, etc.)

## 🎯 Funcionalidades JavaScript

### main.js

- Smooth scroll para navegación interna
- Animaciones de entrada (IntersectionObserver)
- Utilidades de formato de fecha/hora

### agendar.js

- Navegación del wizard (4 pasos)
- Validación de selecciones
- Estado de la aplicación (selectedData)
- Búsqueda de especialidades
- Filtros de ubicación

## 📱 Responsive Design

### Breakpoints

```css
/* Tablet */
@media (max-width: 768px) { ... }

/* Mobile */
@media (max-width: 480px) { ... }
```

### Optimizaciones móviles

- Grid de especialidades a 1 columna
- Stackeo vertical de elementos
- Botones a ancho completo
- Stepper con scroll horizontal

## 🔗 Integración Futura con Backend

### Endpoints FHIR esperados

```javascript
// GET especialidades disponibles
GET /fhir/HealthcareService?active=true

// GET médicos por especialidad
GET /fhir/PractitionerRole?specialty={specialtyCode}&location={locationId}

// GET slots disponibles
GET /fhir/Slot?schedule={scheduleId}&status=free&start=ge{date}

// POST crear cita
POST /fhir/Appointment
{
  "resourceType": "Appointment",
  "status": "proposed",
  "participant": [...]
}
```

### Modificaciones requeridas

1. Reemplazar datos mock en `agendar.js` con llamadas fetch()
2. Implementar autenticación OAuth 2.0 + SMART on FHIR
3. Agregar manejo de errores de API
4. Implementar loading states (skeleton screens)

## 🔐 Seguridad

### Headers recomendados

```
Content-Security-Policy: default-src 'self' https://esm.run https://fonts.googleapis.com
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS obligatorio en producción

## 🧪 Testing

### Checklist manual

- [ ] ✅ Navegación entre pasos del wizard
- [ ] ✅ Selección de especialidad
- [ ] ✅ Selección de médico
- [ ] ✅ Calendario interactivo
- [ ] ✅ Selección de horarios
- [ ] ✅ Validación de términos
- [ ] ❌ Integración con backend (pendiente)

## 📊 Métricas de Rendimiento

### Objetivos

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

### Optimizaciones actuales

- Fuentes con `display=swap`
- Componentes Material Design 3 via CDN (ESM)
- CSS minimalista (sin frameworks pesados)
- Animaciones solo con transform/opacity

## 📚 Referencias

- [Material Design 3](https://m3.material.io/)
- [Material Web Components](https://material-web.dev/)
- [FHIR R4 Appointment](https://www.hl7.org/fhir/appointment.html)
- [Keralty Design System](https://www.keralty.com)

## 👥 Equipo

- **Desarrollador Frontend**: ACME Salud Development Team
- **Diseño UX/UI**: Basado en Material Design 3 + Keralty
- **Consultor FHIR**: Arquitectura documentada en `/docs/ARQUITECTURA.md`

---

**Versión**: 1.0.0  
**Última actualización**: Abril 2026  
**Licencia**: Propietario - ACME Salud
