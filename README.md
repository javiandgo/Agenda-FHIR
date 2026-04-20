# Sistema de Agenda FHIR - ACME Salud

Sistema unificado de gestión de agendas médicas basado en el estándar FHIR (Fast Healthcare Interoperability Resources) para integrar tres puntos de atención y múltiples canales de solicitud de citas.

---

## 🚀 Inicio Rápido

**¿Primera vez aquí?** Sigue esta guía según tu rol:

| Si eres...                | Comienza con...                                                  | Tiempo |
| ------------------------- | ---------------------------------------------------------------- | ------ |
| 👔 **Ejecutivo/Director** | [RESUMEN-EJECUTIVO.md](RESUMEN-EJECUTIVO.md)                     | 5 min  |
| 💻 **Desarrollador**      | [QUICKSTART.md](QUICKSTART.md)                                   | 45 min |
| 🎨 **Diseñador UX/UI**    | [docs/WIREFRAMES.md](docs/WIREFRAMES.md)                         | 30 min |
| 📊 **Product Owner**      | [INDICE.md](INDICE.md) → [PRESENTACION.md](docs/PRESENTACION.md) | 30 min |
| 🏗️ **Arquitecto**         | [ARQUITECTURA.md](ARQUITECTURA.md)                               | 90 min |

---

## 📁 Documentación Completa

Este proyecto incluye documentación exhaustiva:

### 📄 Documentos Principales

1. **[INDICE.md](INDICE.md)** - 📂 Índice maestro de toda la documentación
2. **[RESUMEN-EJECUTIVO.md](RESUMEN-EJECUTIVO.md)** - 📊 Resumen ejecutivo (1 página)
3. **[ARQUITECTURA.md](ARQUITECTURA.md)** - 🏗️ Diseño técnico completo (60+ páginas)
4. **[INSTALACION.md](INSTALACION.md)** - ⚙️ Guía de instalación paso a paso
5. **[QUICKSTART.md](QUICKSTART.md)** - ⚡ Inicio rápido para desarrolladores

### 📚 Documentación Extendida (docs/)

6. **[docs/PRESENTACION.md](docs/PRESENTACION.md)** - 🎤 Presentación de 30 minutos (22 slides)
7. **[docs/WIREFRAMES.md](docs/WIREFRAMES.md)** - 🎨 Diseños de interfaz (5 canales)
8. **[docs/REFERENCIAS.md](docs/REFERENCIAS.md)** - 📖 Bibliografía (61 fuentes)
9. **[docs/ejemplos-fhir/](docs/ejemplos-fhir/)** - 💾 Ejemplos de recursos FHIR en JSON

---

## 📋 Descripción del Proyecto

ACME Salud requiere una solución para unificar el sistema de agendas que permita a los pacientes solicitar citas en los tres puntos de atención de la organización a través de múltiples canales (Web, móvil, call center, ventanilla).

## 🏗️ Arquitectura

### Stack Tecnológico

**Backend:**

- PHP 8.2+
- Laravel 11
- PostgreSQL 15+
- Redis 7+

**Frontend:**

- React 18+ (Web) - _Planificado_
- Flutter 3+ (Móvil) - _Planificado_
- **HTML5 + Material Design 3** (Prototipo funcional) - ✅ _Implementado_

**Estándares:**

- FHIR R4/R5
- OAuth 2.0 + SMART on FHIR
- RESTful API

### 🎨 Prototipo Frontend Standalone

**Disponible en:** `frontend-html/` - [Ver documentación](frontend-html/README.md)

Interfaz de usuario completa implementada con **Material Design 3** y diseño inspirado en Keralty:

- ✅ Página principal (index.html)
- ✅ Flujo de agendamiento de 4 pasos (agendar-cita.html)
- ✅ Página de confirmación (confirmacion.html)
- ✅ Responsive design (mobile-first)
- ✅ Componentes Material Web
- ✅ JavaScript vanilla (sin frameworks)

**Características:**

- Selección de especialidad con búsqueda
- Selección de médico con filtros por ubicación
- Calendario interactivo
- Selector de horarios (mañana/tarde)
- Validación de términos y condiciones
- Animaciones y transiciones suaves

**Cómo probar:**

```bash
cd frontend-html
python -m http.server 8000
# Navegar a http://localhost:8000
```

## 📦 Recursos FHIR Implementados

| Recurso               | Descripción                 |
| --------------------- | --------------------------- |
| `Organization`        | ACME Salud y aseguradoras   |
| `Location`            | Clínicas Norte, Centro, Sur |
| `Practitioner`        | Médicos especialistas       |
| `PractitionerRole`    | Roles y especialidades      |
| `HealthcareService`   | Servicios de salud          |
| `Schedule`            | Agendas mensuales           |
| `Slot`                | Espacios de tiempo          |
| `Patient`             | Pacientes                   |
| `Coverage`            | Cobertura de aseguradoras   |
| `Appointment`         | Citas médicas               |
| `AppointmentResponse` | Confirmaciones              |

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
- PHP >= 8.2
- Composer
- PostgreSQL >= 15
- Redis >= 7
- Node.js >= 18 (para frontend)
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/acme-salud/agenda-fhir.git
cd agenda-fhir

# Instalar dependencias de Laravel
composer install

# Configurar variables de entorno
cp .env.example .env
php artisan key:generate

# Configurar base de datos en .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=agenda_fhir
DB_USERNAME=postgres
DB_PASSWORD=tu_password

# Ejecutar migraciones
php artisan migrate

# Ejecutar seeders (datos de demostración)
php artisan db:seed

# Instalar Redis
# Windows: https://github.com/microsoftarchive/redis/releases
# Linux: sudo apt-get install redis-server

# Iniciar servidor de desarrollo
php artisan serve
```

### Endpoints API

**Base URL:** `http://localhost:8000/api/fhir/`

```bash
# Listar organizaciones
GET /Organization

# Obtener agenda disponible
GET /Slot?schedule=Schedule/123&status=free

# Crear cita
POST /Appointment

# Cancelar cita
PUT /Appointment/{id}
```

## 📊 Estructura del Proyecto

```
agenda-fhir/
├── app/
│   ├── Http/
│   │   ├── Controllers/FHIR/
│   │   └── Resources/FHIR/
│   ├── Models/
│   ├── Services/
│   └── Events/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
├── config/
│   └── fhir.php
├── tests/
├── frontend-html/           ← ✅ NUEVO: Prototipo UI
│   ├── index.html
│   ├── agendar-cita.html
│   ├── confirmacion.html
│   ├── css/
│   │   ├── styles.css       # Material Design 3
│   │   └── agendar.css
│   ├── js/
│   │   ├── main.js
│   │   └── agendar.js
│   └── README.md
└── docs/
    ├── ARQUITECTURA.md
    ├── WIREFRAMES.md
    ├── PRESENTACION.md
    ├── REFERENCIAS.md
    └── ejemplos-fhir/
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
php artisan test

# Tests específicos
php artisan test --filter AppointmentTest

# Con cobertura
php artisan test --coverage
```

## 📖 Documentación

- [Documento de Arquitectura](ARQUITECTURA.md) - Diseño completo del sistema
- [Ejemplos FHIR](docs/ejemplos-fhir/) - Recursos FHIR de ejemplo
- [API Documentation](docs/api.md) - Endpoints y uso de la API
- [FHIR R4 Specification](https://www.hl7.org/fhir/R4/)

## 🏥 Puntos de Atención

| Clínica | Identificador | Servicios                                       |
| ------- | ------------- | ----------------------------------------------- |
| Norte   | 1100155555-1  | Medicina general, pediatría, obstetricia        |
| Centro  | 1100155555-2  | Medicina general, nefrología, gastroenterología |
| Sur     | 1100155555-3  | Medicina general, oncología, cardiología        |

## 👥 Especialistas

| Nombre             | Tarjeta Prof. | Especialidad       |
| ------------------ | ------------- | ------------------ |
| Gregorio Casas     | 111222333     | Pediatría          |
| Elmer Luna         | 222333444     | Gineco Obstetricia |
| Luis Manuel Chávez | 333444555     | Nefrología         |
| Alvaro Silva       | 444777333     | Gastroenterología  |
| Diego Narvaez      | 555222999     | Oncología          |
| Alonso Fonseca     | 777666555     | Cardiología        |

## 🔐 Seguridad

- **Autenticación:** OAuth 2.0 + SMART on FHIR
- **Transporte:** HTTPS/TLS 1.3
- **Datos:** Encriptación AES-256
- **Auditoría:** Logs completos de operaciones

## 🎯 Roadmap

### Fase 1: Diseño y Planificación ✅

- [x] Diseño de arquitectura
- [x] Documentación técnica (60+ páginas)
- [x] Wireframes (5 canales)
- [x] Presentación ejecutiva
- [x] **Prototipo frontend HTML/CSS/JS**

### Fase 2: Backend (En planificación)

- [ ] Setup inicial Laravel
- [ ] Implementación recursos base FHIR
- [ ] Sistema de agendas
- [ ] Gestión de citas
- [ ] API RESTful

### Fase 3: Frontend Producción (Pendiente)

- [ ] React web app
- [ ] Flutter app móvil
- [ ] Integración con backend
- [ ] Autenticación OAuth 2.0

### Fase 4: Integración y Testing (Pendiente)

- [ ] Integración Call Center
- [ ] Testing E2E
- [ ] QA y correcciones
- [ ] Deployment

### Estado Actual:

✅ **Prototipo UI completo** (frontend-html/) - Listo para demo
⏳ **Backend** - Pendiente de implementación
⏳ **Frontend producción** - Pendiente de implementación

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de ACME Salud.

## 📞 Contacto

**Equipo de Desarrollo ACME Salud**

- Email: desarrollo@acmesalud.com
- Web: https://www.acmesalud.com

## 🙏 Agradecimientos

- HL7 International por el estándar FHIR
- Comunidad Laravel
- SMART Health IT

---

**Versión:** 1.0  
**Última actualización:** 20 de abril de 2026
